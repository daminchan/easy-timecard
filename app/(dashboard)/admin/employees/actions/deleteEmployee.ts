'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { type DeleteEmployeeResponse } from './types';

/**
 * 従業員を削除する
 * @param employeeId - 削除する従業員のID
 * @returns 削除処理の結果
 * @throws 従業員が見つからない場合、または削除に失敗した場合
 */
export async function deleteEmployee(employeeId: string): Promise<DeleteEmployeeResponse> {
  try {
    const { company } = await getCurrentUser();

    // 従業員が該当企業に所属しているか確認
    const employee = await prisma.employee.findFirst({
      where: {
        id: employeeId,
        companyId: company.id,
      },
    });

    if (!employee) {
      return { success: false, error: '従業員が見つかりません' };
    }

    // トランザクションを使用して、関連する勤怠記録と従業員を削除
    await prisma.$transaction(async (tx) => {
      // 関連する勤怠記録を削除
      await tx.timeRecord.deleteMany({
        where: {
          employeeId,
        },
      });

      // 従業員を削除
      await tx.employee.delete({
        where: {
          id: employeeId,
        },
      });
    });

    return { success: true };
  } catch (error) {
    console.error('従業員の削除に失敗しました:', error);
    return { success: false, error: '従業員の削除に失敗しました' };
  }
}
