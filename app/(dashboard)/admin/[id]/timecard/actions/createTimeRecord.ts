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

    // デバッグ用ログ出力 - 入力データ
    console.log('\n=== CreateTimeRecord Input ===');
    console.log('Selected date:', {
      raw: date,
      formatted: format(new Date(date), 'yyyy-MM-dd HH:mm:ss xxx'),
    });
    console.log('Time inputs:', {
      clockIn,
      clockOut,
      breakStart,
      breakEnd,
    });

    // JSTの日付をUTCに変換（JST 00:00 = UTC 15:00 previous day）
    const recordDate = new Date(date);
    const utcDate = new Date(
      Date.UTC(recordDate.getFullYear(), recordDate.getMonth(), recordDate.getDate() - 1, 15, 0, 0)
    );

    // デバッグ用ログ出力 - UTC変換
    console.log('\n=== UTC Conversion ===');
    console.log('UTC date:', {
      raw: utcDate,
      formatted: format(utcDate, 'yyyy-MM-dd HH:mm:ss xxx'),
      jstFormatted: formatInTimeZone(utcDate, 'Asia/Tokyo', 'yyyy-MM-dd HH:mm:ss xxx'),
    });

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
    const createTimeInUTC = (timeStr: string | null) => {
      if (!timeStr) return null;
      const [hours, minutes] = timeStr.split(':').map(Number);
      // JSTの時刻をUTCに変換（-9時間）
      const utcHours = hours - 9;
      // 日付が変わる場合の調整
      const finalDate = new Date(utcDate);
      if (utcHours < 0) {
        finalDate.setDate(finalDate.getDate() + 1);
      }

      const result = new Date(
        Date.UTC(
          finalDate.getFullYear(),
          finalDate.getMonth(),
          finalDate.getDate(),
          utcHours < 0 ? utcHours + 24 : utcHours,
          minutes
        )
      );

      return result;
    };

    // 勤怠記録を作成
    const timeRecord = await prisma.timeRecord.create({
      data: {
        employeeId,
        date: utcDate,
        clockIn: createTimeInUTC(clockIn),
        clockOut: createTimeInUTC(clockOut),
        breakStart: createTimeInUTC(breakStart),
        breakEnd: createTimeInUTC(breakEnd),
      },
    });

    // 作成されたレコードのログ
    console.log('\n=== Created Record ===');
    console.log('Record in UTC:', {
      date: format(timeRecord.date, 'yyyy-MM-dd HH:mm:ss xxx'),
      clockIn: timeRecord.clockIn ? format(timeRecord.clockIn, 'yyyy-MM-dd HH:mm:ss xxx') : null,
      clockOut: timeRecord.clockOut ? format(timeRecord.clockOut, 'yyyy-MM-dd HH:mm:ss xxx') : null,
      breakStart: timeRecord.breakStart
        ? format(timeRecord.breakStart, 'yyyy-MM-dd HH:mm:ss xxx')
        : null,
      breakEnd: timeRecord.breakEnd ? format(timeRecord.breakEnd, 'yyyy-MM-dd HH:mm:ss xxx') : null,
    });
    console.log('Record in JST:', {
      date: formatInTimeZone(timeRecord.date, 'Asia/Tokyo', 'yyyy-MM-dd HH:mm:ss xxx'),
      clockIn: timeRecord.clockIn
        ? formatInTimeZone(timeRecord.clockIn, 'Asia/Tokyo', 'yyyy-MM-dd HH:mm:ss xxx')
        : null,
      clockOut: timeRecord.clockOut
        ? formatInTimeZone(timeRecord.clockOut, 'Asia/Tokyo', 'yyyy-MM-dd HH:mm:ss xxx')
        : null,
      breakStart: timeRecord.breakStart
        ? formatInTimeZone(timeRecord.breakStart, 'Asia/Tokyo', 'yyyy-MM-dd HH:mm:ss xxx')
        : null,
      breakEnd: timeRecord.breakEnd
        ? formatInTimeZone(timeRecord.breakEnd, 'Asia/Tokyo', 'yyyy-MM-dd HH:mm:ss xxx')
        : null,
    });

    revalidatePath('/admin/[id]/timecard', 'layout');
    return { success: true, data: timeRecord };
  } catch (error) {
    console.error('Failed to create time record:', error);
    return { success: false, error: 'Failed to create time record' };
  }
}
