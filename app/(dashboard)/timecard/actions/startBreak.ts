'use server';

import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import type { TimeRecordActionResponse } from './types';
import { getExistingRecord } from './utils';
import { createJSTDate } from '@/lib/utils/date';

export async function startBreak(employeeId: string): Promise<TimeRecordActionResponse> {
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

    if (existingRecord.breakStart) {
      return { success: false, error: 'Already on break' };
    }

    if (existingRecord.clockOut) {
      return { success: false, error: 'Already clocked out' };
    }

    // 現在時刻をJSTで取得
    const now = createJSTDate();

    // 休憩開始を記録
    const timeRecord = await prisma.timeRecord.update({
      where: { id: existingRecord.id },
      data: { breakStart: now },
    });

    return { success: true, data: timeRecord };
  } catch (error) {
    console.error('Failed to start break:', error);
    return { success: false, error: 'Failed to start break' };
  }
}
