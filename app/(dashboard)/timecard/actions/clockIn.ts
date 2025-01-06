'use server';

import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import type { TimeRecordActionResponse } from './types';
import { getExistingRecord } from './utils';

export async function clockIn(employeeId: string): Promise<TimeRecordActionResponse> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    const result = await getExistingRecord(employeeId, userId);
    if (!result.success) {
      return result;
    }

    const { existingRecord, today } = result.data;
    if (existingRecord?.clockIn) {
      return { success: false, error: 'Already clocked in' };
    }

    // 勤怠記録を作成または更新
    const timeRecord = await prisma.timeRecord.upsert({
      where: {
        id: existingRecord?.id ?? '',
      },
      create: {
        employeeId,
        date: today,
        clockIn: new Date(),
      },
      update: {
        clockIn: new Date(),
      },
    });

    return { success: true, data: timeRecord };
  } catch (error) {
    console.error('Failed to clock in:', error);
    return { success: false, error: 'Failed to clock in' };
  }
}
