'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { type Employee } from '@/types';
import { type ActionResponse, type UpdateEmployeeData } from './types';

/**
 * 従業員情報を更新する
 * @param data - 更新する従業員データ
 * @returns 更新した従業員のレスポンス
 * @throws 従業員が見つからない場合、または更新に失敗した場合
 */
export async function updateEmployee(data: UpdateEmployeeData): Promise<ActionResponse<Employee>> {
  try {
    const { company } = await getCurrentUser();
    // 企業IDの確認（セキュリティチェック）
    const existingEmployee = await prisma.employee.findFirst({
      where: {
        id: data.id,
        companyId: company.id,
      },
    });

    if (!existingEmployee) {
      return { success: false, error: '従業員が見つかりません' };
    }

    const employee = await prisma.employee.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        hourlyWage: data.hourlyWage,
        isAdmin: data.isAdmin,
      },
    });
    return { success: true, data: employee };
  } catch (error) {
    console.error('従業員情報の更新に失敗しました:', error);
    return { success: false, error: '従業員情報の更新に失敗しました' };
  }
}
