'use server';

import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { type TimeRecordFormData, type ActionResponse } from './types';
import { createDateWithTime } from '../_utils/date';
import { verifyEmployee } from '../_utils/employee';
import { type TimeRecord } from '@/types';
import { revalidatePath } from 'next/cache';

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
    await verifyEmployee(employeeId, userId);

    const { clockIn, clockOut, breakStart, breakEnd, date } = data;
    // タイムゾーンを考慮した日付の作成
    const recordDate = new Date(date);
    const utcDate = new Date(
      Date.UTC(recordDate.getFullYear(), recordDate.getMonth(), recordDate.getDate(), 0, 0, 0)
    );

    // 既存の記録がないか確認
    const existingRecord = await prisma.timeRecord.findFirst({
      where: {
        employeeId,
        date: {
          equals: utcDate,
        },
      },
    });

    if (existingRecord) {
      return { success: false, error: 'Time record already exists for this date' };
    }

    // 勤怠記録の作成
    const timeRecord = await prisma.timeRecord.create({
      data: {
        employeeId,
        date: utcDate,
        clockIn: createDateWithTime(utcDate, clockIn),
        clockOut: createDateWithTime(utcDate, clockOut),
        breakStart: createDateWithTime(utcDate, breakStart),
        breakEnd: createDateWithTime(utcDate, breakEnd),
      },
    });

    revalidatePath('/admin/[id]/timecard', 'layout');
    return { success: true, data: timeRecord };
  } catch (error) {
    console.error('Failed to create time record:', error);
    return { success: false, error: 'Failed to create time record' };
  }
}
