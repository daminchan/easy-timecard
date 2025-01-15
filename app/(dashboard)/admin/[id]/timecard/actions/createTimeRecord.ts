'use server';

import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { type TimeRecordFormData, type ActionResponse } from './types';
import { type TimeRecord } from '@/types';
import { revalidatePath } from 'next/cache';
import { format } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { startOfJSTDay } from '@/lib/utils/date';

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

    // 選択された日付をJSTの開始時刻（00:00:00）に設定
    const jstDate = startOfJSTDay(new Date(date));

    // デバッグ用ログ出力
    console.log('=== Debug Log ===');
    console.log('Input date:', date);
    console.log('JST date:', format(jstDate, 'yyyy-MM-dd HH:mm:ss'));
    console.log('JST timezone:', formatInTimeZone(jstDate, 'Asia/Tokyo', 'yyyy-MM-dd HH:mm:ss'));

    // 既存の記録がないか確認
    const existingRecord = await prisma.timeRecord.findFirst({
      where: {
        employeeId,
        date: jstDate,
      },
    });

    if (existingRecord) {
      return { success: false, error: 'Time record already exists for this date' };
    }

    // 時刻をUTCに変換して保存
    const createTimeInUTC = (timeStr: string | null) => {
      if (!timeStr) return null;
      const [hours, minutes] = timeStr.split(':').map(Number);
      return new Date(
        Date.UTC(
          jstDate.getUTCFullYear(),
          jstDate.getUTCMonth(),
          jstDate.getUTCDate(),
          hours,
          minutes
        )
      );
    };

    // 勤怠記録を作成
    const timeRecord = await prisma.timeRecord.create({
      data: {
        employeeId,
        date: jstDate,
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
