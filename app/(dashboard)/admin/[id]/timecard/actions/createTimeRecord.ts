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
    console.log('=== Input Data Debug Log ===');
    console.log('Raw input date:', date);
    console.log('Raw clockIn time:', clockIn);
    console.log('Raw clockOut time:', clockOut);
    console.log('Raw breakStart time:', breakStart);
    console.log('Raw breakEnd time:', breakEnd);

    // 日付をUTCで処理
    const recordDate = new Date(date);
    const utcDate = new Date(
      Date.UTC(recordDate.getFullYear(), recordDate.getMonth(), recordDate.getDate(), 0, 0, 0)
    );

    // デバッグ用ログ出力 - 日付処理
    console.log('\n=== Date Processing Debug Log ===');
    console.log('recordDate:', {
      raw: recordDate,
      year: recordDate.getFullYear(),
      month: recordDate.getMonth(),
      date: recordDate.getDate(),
      formatted: format(recordDate, 'yyyy-MM-dd HH:mm:ss'),
    });
    console.log('utcDate:', {
      raw: utcDate,
      formatted: format(utcDate, 'yyyy-MM-dd HH:mm:ss'),
      jstFormatted: formatInTimeZone(utcDate, 'Asia/Tokyo', 'yyyy-MM-dd HH:mm:ss'),
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

      // デバッグ用ログ出力 - 時刻変換
      console.log(`\n=== Time Conversion Debug Log (${timeStr}) ===`);
      console.log('Input time:', timeStr);
      console.log('JST hours:', hours);
      console.log('UTC hours:', utcHours);
      console.log('Final date:', {
        raw: finalDate,
        formatted: format(finalDate, 'yyyy-MM-dd HH:mm:ss'),
      });
      console.log('Result:', {
        raw: result,
        utcFormatted: format(result, 'yyyy-MM-dd HH:mm:ss'),
        jstFormatted: formatInTimeZone(result, 'Asia/Tokyo', 'yyyy-MM-dd HH:mm:ss'),
      });

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
    console.log('\n=== Created Record Debug Log ===');
    console.log('Record:', {
      ...timeRecord,
      date: format(timeRecord.date, 'yyyy-MM-dd HH:mm:ss'),
      clockIn: timeRecord.clockIn ? format(timeRecord.clockIn, 'yyyy-MM-dd HH:mm:ss') : null,
      clockOut: timeRecord.clockOut ? format(timeRecord.clockOut, 'yyyy-MM-dd HH:mm:ss') : null,
      breakStart: timeRecord.breakStart
        ? format(timeRecord.breakStart, 'yyyy-MM-dd HH:mm:ss')
        : null,
      breakEnd: timeRecord.breakEnd ? format(timeRecord.breakEnd, 'yyyy-MM-dd HH:mm:ss') : null,
    });
    console.log('Record in JST:', {
      date: formatInTimeZone(timeRecord.date, 'Asia/Tokyo', 'yyyy-MM-dd HH:mm:ss'),
      clockIn: timeRecord.clockIn
        ? formatInTimeZone(timeRecord.clockIn, 'Asia/Tokyo', 'yyyy-MM-dd HH:mm:ss')
        : null,
      clockOut: timeRecord.clockOut
        ? formatInTimeZone(timeRecord.clockOut, 'Asia/Tokyo', 'yyyy-MM-dd HH:mm:ss')
        : null,
      breakStart: timeRecord.breakStart
        ? formatInTimeZone(timeRecord.breakStart, 'Asia/Tokyo', 'yyyy-MM-dd HH:mm:ss')
        : null,
      breakEnd: timeRecord.breakEnd
        ? formatInTimeZone(timeRecord.breakEnd, 'Asia/Tokyo', 'yyyy-MM-dd HH:mm:ss')
        : null,
    });

    revalidatePath('/admin/[id]/timecard', 'layout');
    return { success: true, data: timeRecord };
  } catch (error) {
    console.error('Failed to create time record:', error);
    return { success: false, error: 'Failed to create time record' };
  }
}
