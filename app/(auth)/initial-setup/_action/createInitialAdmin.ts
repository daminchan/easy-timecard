'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { type CreateInitialAdminResponse } from './types';

type CreateInitialAdminData = {
  name: string;
  passcode: string;
  hourlyWage: number;
  isAdmin: boolean;
};

/**
 * 初期管理者を作成するServer Action
 * @param data - 初期管理者作成に必要なパラメータ
 * @returns 作成結果
 */
export async function createInitialAdmin(
  data: CreateInitialAdminData
): Promise<CreateInitialAdminResponse> {
  try {
    const { company } = await getCurrentUser();

    // 既存の管理者チェック
    const existingAdmin = await prisma.employee.findFirst({
      where: { companyId: company.id, isAdmin: true },
    });

    if (existingAdmin) {
      return {
        success: false,
        error: '管理者が既に存在します',
      };
    }

    // 管理者の作成
    const admin = await prisma.employee.create({
      data: {
        companyId: company.id,
        name: data.name,
        passcode: data.passcode,
        hourlyWage: data.hourlyWage,
        isAdmin: true,
        isActive: true,
      },
    });

    return {
      success: true,
      data: admin,
    };
  } catch (error) {
    console.error('管理者の作成に失敗しました:', error);
    return {
      success: false,
      error: '管理者の作成に失敗しました',
    };
  }
}
