'use server';

import { prisma } from '@/lib/prisma';

/** 既存の勤怠記録の取得結果型 */
type ExistingRecordResult =
  | {
      /** 処理が失敗した場合 */
      success: false;
      /** エラーメッセージ */
      error: string;
    }
  | {
      /** 処理が成功した場合 */
      success: true;
      /** 取得したデータ */
      data: {
        /** 従業員情報 */
        employee: {
          id: string;
          companyId: string;
          isActive: boolean;
        };
        /** 勤怠記録情報（存在しない場合はnull） */
        existingRecord: {
          id: string;
          clockIn: Date | null;
          clockOut: Date | null;
          breakStart: Date | null;
          breakEnd: Date | null;
        } | null;
        /** 対象日（今日の0時0分0秒） */
        today: Date;
      };
    };

/**
 * 従業員の既存の勤怠記録を取得する
 * @param employeeId - 従業員ID
 * @param userId - 企業ID
 * @returns 勤怠記録の取得結果
 */
export async function getExistingRecord(
  employeeId: string,
  userId: string
): Promise<ExistingRecordResult> {
  // 従業員が該当企業に所属しているか確認
  const employee = await prisma.employee.findFirst({
    where: {
      id: employeeId,
      companyId: userId,
      isActive: true,
    },
  });

  if (!employee) {
    return { success: false, error: 'Employee not found' } as const;
  }

  // 今日の日付を取得
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 既存の勤怠記録を確認
  const existingRecord = await prisma.timeRecord.findFirst({
    where: {
      employeeId,
      date: today,
    },
  });

  return { success: true, data: { employee, existingRecord, today } } as const;
}
