'use server';

import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import type { TimeRecordActionResponse } from './types';
import { getExistingRecord } from './utils';
import { createJSTDate } from '@/lib/utils/date';

export async function endBreak(employeeId: string): Promise<TimeRecordActionResponse> {
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
    if (!existingRecord?.breakStart) {
      return { success: false, error: 'Break not started yet' };
    }

    if (existingRecord.breakEnd) {
      return { success: false, error: 'Break already ended' };
    }

    if (existingRecord.clockOut) {
      return { success: false, error: 'Already clocked out' };
    }

    // 現在時刻をJSTで取得
    const now = createJSTDate();

    // 休憩終了を記録
    const timeRecord = await prisma.timeRecord.update({
      where: { id: existingRecord.id },
      data: { breakEnd: now },
    });

    return { success: true, data: timeRecord };
  } catch (error) {
    console.error('Failed to end break:', error);
    return { success: false, error: 'Failed to end break' };
  }
}
