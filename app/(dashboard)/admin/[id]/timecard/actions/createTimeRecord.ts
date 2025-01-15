'use server';

import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { type TimeRecordFormData, type ActionResponse } from './types';
import { type TimeRecord } from '@/types';
import { revalidatePath } from 'next/cache';
import { format } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

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

    // 日付をUTCで処理
    const recordDate = new Date(date);
    const utcDate = new Date(
      Date.UTC(recordDate.getFullYear(), recordDate.getMonth(), recordDate.getDate())
    );

    // デバッグ用ログ出力
    console.log('=== Debug Log ===');
    console.log('Input date:', date);
    console.log('UTC date:', utcDate);
    console.log('UTC formatted:', format(utcDate, 'yyyy-MM-dd HH:mm:ss'));
    console.log('JST formatted:', formatInTimeZone(utcDate, 'Asia/Tokyo', 'yyyy-MM-dd HH:mm:ss'));

    // 既存の記録がないか確認
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
    const timeRecord = await prisma.timeRecord.create({
      data: {
        employeeId,
        date: utcDate,
        clockIn: clockIn
          ? new Date(
              utcDate.getFullYear(),
              utcDate.getMonth(),
              utcDate.getDate(),
              ...clockIn.split(':').map(Number)
            )
          : null,
        clockOut: clockOut
          ? new Date(
              utcDate.getFullYear(),
              utcDate.getMonth(),
              utcDate.getDate(),
              ...clockOut.split(':').map(Number)
            )
          : null,
        breakStart: breakStart
          ? new Date(
              utcDate.getFullYear(),
              utcDate.getMonth(),
              utcDate.getDate(),
              ...breakStart.split(':').map(Number)
            )
          : null,
        breakEnd: breakEnd
          ? new Date(
              utcDate.getFullYear(),
              utcDate.getMonth(),
              utcDate.getDate(),
              ...breakEnd.split(':').map(Number)
            )
          : null,
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
