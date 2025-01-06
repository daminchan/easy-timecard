'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { type Employee } from '@/types';
import { type ActionResponse, type CreateEmployeeData } from './types';

/**
 * 新しい従業員を作成する
 * @param data - 従業員の作成データ
 * @returns 作成した従業員のレスポンス
 */
export async function createEmployee(data: CreateEmployeeData): Promise<ActionResponse<Employee>> {
  try {
    const { company } = await getCurrentUser();
    const employee = await prisma.employee.create({
      data: {
        ...data,
        companyId: company.id,
      },
    });
    return { success: true, data: employee };
  } catch (error) {
    console.error('従業員の登録に失敗しました:', error);
    return { success: false, error: '従業員の登録に失敗しました' };
  }
}
