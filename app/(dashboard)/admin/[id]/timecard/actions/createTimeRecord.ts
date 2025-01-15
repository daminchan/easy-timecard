'use server';

import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { type TimeRecordFormData, type ActionResponse } from './types';
import { type TimeRecord } from '@/types';
import { revalidatePath } from 'next/cache';
import { format } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { createJSTDate } from '@/lib/utils/date';

export async function createTimeRecord(
  employeeId: string,
  data: TimeRecordFormData
): Promise<ActionResponse<TimeRecord>> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    // 従業員の所属確認
    const employee = await prisma.employee.findFirst({
      where: {
        id: employeeId,
        companyId: userId,
        isActive: true,
      },
    });

    if (!employee) {
      return { success: false, error: 'Employee not found' };
    }

    const { clockIn, clockOut, breakStart, breakEnd, date } = data;

    // 日付をUTCで処理（clockIn.tsと同じ方法）
    const baseDate = new Date(date);
    const utcDate = new Date(
      Date.UTC(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), 0, 0, 0)
    );

    // デバッグ用ログ出力
    console.log('=== Debug Log ===');
    console.log('Input date:', date);
    console.log('Base date:', baseDate);
    console.log('UTC date:', utcDate);
    console.log('UTC formatted:', format(utcDate, 'yyyy-MM-dd HH:mm:ss'));
    console.log('JST formatted:', formatInTimeZone(utcDate, 'Asia/Tokyo', 'yyyy-MM-dd HH:mm:ss'));

    // 既存の記録がないか確認（UTCで比較）
    const existingRecord = await prisma.timeRecord.findFirst({
      where: {
        employeeId,
        date: utcDate,
      },
    });

    if (existingRecord) {
      return { success: false, error: 'Time record already exists for this date' };
    }

    // 時刻をUTCに変換して保存
    const createTimeInUTC = (timeStr: string | null) => {
      if (!timeStr) return null;
      const [hours, minutes] = timeStr.split(':').map(Number);
      // JSTの時刻をUTCに変換（-9時間）
      const utcHours = hours - 9;
      // 日付が変わる場合の調整
      const finalDate = new Date(utcDate);
      if (utcHours < 0) {
        finalDate.setDate(finalDate.getDate() + 1);
      }
      return new Date(
        Date.UTC(
          finalDate.getFullYear(),
          finalDate.getMonth(),
          finalDate.getDate(),
          utcHours < 0 ? utcHours + 24 : utcHours,
          minutes
        )
      );
    };

    // 勤怠記録を作成
    const timeRecord = await prisma.timeRecord.create({
      data: {
        employeeId,
        date: utcDate,
        clockIn: createTimeInUTC(clockIn),
        clockOut: createTimeInUTC(clockOut),
        breakStart: createTimeInUTC(breakStart),
        breakEnd: createTimeInUTC(breakEnd),
      },
    });

    // 作成されたレコードのログ
    console.log('=== Created Record ===');
    console.log('Record:', timeRecord);
    if (timeRecord.clockIn) {
      console.log('ClockIn time (UTC):', format(timeRecord.clockIn, 'yyyy-MM-dd HH:mm:ss'));
      console.log(
        'ClockIn time (JST):',
        formatInTimeZone(timeRecord.clockIn, 'Asia/Tokyo', 'yyyy-MM-dd HH:mm:ss')
      );
    }
    console.log('===================');

    revalidatePath('/admin/[id]/timecard', 'layout');
    return { success: true, data: timeRecord };
  } catch (error) {
    console.error('Failed to create time record:', error);
    return { success: false, error: 'Failed to create time record' };
  }
}
