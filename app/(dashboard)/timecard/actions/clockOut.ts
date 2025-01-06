'use server';

import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import type { TimeRecordActionResponse } from './types';
import { getExistingRecord } from './utils';

export async function clockOut(employeeId: string): Promise<TimeRecordActionResponse> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    const result = await getExistingRecord(employeeId, userId);
    if (!result.success) {
      return result;
    }

    const { existingRecord } = result.data;
    if (!existingRecord?.clockIn) {
      return { success: false, error: 'Not clocked in yet' };
    }

    if (existingRecord.clockOut) {
      return { success: false, error: 'Already clocked out' };
    }

    if (existingRecord.breakStart && !existingRecord.breakEnd) {
      return { success: false, error: 'Break not ended yet' };
    }

    // 退勤を記録
    const timeRecord = await prisma.timeRecord.update({
      where: { id: existingRecord.id },
      data: { clockOut: new Date() },
    });

    return { success: true, data: timeRecord };
  } catch (error) {
    console.error('Failed to clock out:', error);
    return { success: false, error: 'Failed to clock out' };
  }
}
