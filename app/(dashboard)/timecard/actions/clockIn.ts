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

    // 現在時刻をUTCで取得
    const now = new Date();
    // 表示用にJSTに変換
    const jstNow = createJSTDate();

    // デバッグ用ログ出力
    console.log('=== Debug Log ===');
    console.log('UTC current time:', now);
    console.log('JST current time:', jstNow);
    console.log('JST formatted:', format(jstNow, 'yyyy-MM-dd HH:mm:ss'));
    console.log(
      'JST timezone formatted:',
      formatInTimeZone(jstNow, 'Asia/Tokyo', 'yyyy-MM-dd HH:mm:ss')
    );
    console.log('Today date:', today);
    console.log('===============');

    // 勤怠記録を作成（UTCで保存）
    const timeRecord = await prisma.timeRecord.create({
      data: {
        employeeId,
        date: today,
        clockIn: now,
      },
    });

    // 作成されたレコードのログ
    console.log('=== Created Record ===');
    console.log('Record:', timeRecord);
    console.log(
      'ClockIn time (UTC):',
      format(new Date(timeRecord.clockIn!), 'yyyy-MM-dd HH:mm:ss')
    );
    console.log(
      'ClockIn time (JST):',
      formatInTimeZone(new Date(timeRecord.clockIn!), 'Asia/Tokyo', 'yyyy-MM-dd HH:mm:ss')
    );
    console.log('===================');

    return { success: true, data: timeRecord };
  } catch (error) {
    console.error('Failed to clock in:', error);
    return { success: false, error: 'Failed to clock in' };
  }
}
