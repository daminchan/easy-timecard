'use server';

import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { type TimeRecordFormData, type ActionResponse } from './types';
import { createDateWithTime } from '../_utils/date';
import { type TimeRecord } from '@/types';
import { revalidatePath } from 'next/cache';

export async function updateTimeRecord(
  id: string,
  data: TimeRecordFormData
): Promise<ActionResponse<TimeRecord>> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    // 勤怠記録の所有者確認
    const timeRecord = await prisma.timeRecord.findUnique({
      where: { id },
      include: { employee: true },
    });

    if (!timeRecord || timeRecord.employee.companyId !== userId) {
      return { success: false, error: 'Not found' };
    }

    const { clockIn, clockOut, breakStart, breakEnd, date } = data;
    const recordDate = new Date(date);

    // 勤怠記録の更新
    const updatedTimeRecord = await prisma.timeRecord.update({
      where: { id },
      data: {
        clockIn: createDateWithTime(recordDate, clockIn),
        clockOut: createDateWithTime(recordDate, clockOut),
        breakStart: createDateWithTime(recordDate, breakStart),
        breakEnd: createDateWithTime(recordDate, breakEnd),
      },
    });

    revalidatePath('/admin/[id]/timecard', 'layout');
    return { success: true, data: updatedTimeRecord };
  } catch (error) {
    console.error('Failed to update time record:', error);
    return { success: false, error: 'Failed to update time record' };
  }
}
