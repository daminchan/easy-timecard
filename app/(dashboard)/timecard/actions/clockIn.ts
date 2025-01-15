'use server';

import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import type { TimeRecordActionResponse } from './types';
import { getExistingRecord } from './utils';
import { createJSTDate } from '@/lib/utils/date';
import { format } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

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

    // 現在時刻をJSTで取得
    const now = createJSTDate();

    // デバッグ用ログ出力
    console.log('=== Debug Log ===');
    console.log('Raw current time:', new Date());
    console.log('JST current time:', now);
    console.log('JST formatted:', format(now, 'yyyy-MM-dd HH:mm:ss'));
    console.log(
      'JST timezone formatted:',
      formatInTimeZone(now, 'Asia/Tokyo', 'yyyy-MM-dd HH:mm:ss')
    );
    console.log('Today date:', today);
    console.log('===============');

    // 勤怠記録を作成または更新
    const timeRecord = await prisma.timeRecord.upsert({
      where: {
        id: existingRecord?.id ?? '',
      },
      create: {
        employeeId,
        date: today,
        clockIn: now,
      },
      update: {
        clockIn: now,
      },
    });

    // 作成されたレコードのログ
    console.log('=== Created Record ===');
    console.log('Record:', timeRecord);
    console.log('ClockIn time:', format(new Date(timeRecord.clockIn!), 'yyyy-MM-dd HH:mm:ss'));
    console.log(
      'ClockIn JST:',
      formatInTimeZone(new Date(timeRecord.clockIn!), 'Asia/Tokyo', 'yyyy-MM-dd HH:mm:ss')
    );
    console.log('===================');

    return { success: true, data: timeRecord };
  } catch (error) {
    console.error('Failed to clock in:', error);
    return { success: false, error: 'Failed to clock in' };
  }
}
