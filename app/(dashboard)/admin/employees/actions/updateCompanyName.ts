'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

import { type UpdateCompanyResponse } from './types';

/**
 * 企業名を更新する
 * @param name - 新しい企業名
 * @returns 更新した企業のレスポンス
 * @throws 企業名の更新に失敗した場合
 */
export async function updateCompanyName(name: string): Promise<UpdateCompanyResponse> {
  try {
    const { company } = await getCurrentUser();
    const updatedCompany = await prisma.company.update({
      where: { id: company.id },
      data: { name },
    });
    return { success: true, data: updatedCompany };
  } catch (error) {
    console.error('会社名の更新に失敗しました:', error);
    return { success: false, error: '会社名の更新に失敗しました' };
  }
}
