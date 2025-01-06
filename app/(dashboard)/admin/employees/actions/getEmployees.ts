'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

import { type GetEmployeesResponse } from './types';

/**
 * 企業に所属する従業員一覧を取得する
 * @returns 従業員一覧のレスポンス
 */
export async function getEmployees(): Promise<GetEmployeesResponse> {
  try {
    const { company } = await getCurrentUser();
    const employees = await prisma.employee.findMany({
      where: {
        companyId: company.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return { success: true, data: { employees } };
  } catch (error) {
    console.error('Failed to fetch employees:', error);
    return { success: false, error: '従業員情報の取得に失敗しました' };
  }
}
