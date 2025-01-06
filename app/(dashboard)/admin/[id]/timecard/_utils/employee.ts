'use server';

import { prisma } from '@/lib/prisma';

/**
 * 従業員が指定された会社に所属しているか確認する
 * @param employeeId - 従業員ID
 * @param companyId - 会社ID
 * @throws {Error} 従業員が見つからない、または会社に所属していない場合
 * @returns 従業員情報
 */
export async function verifyEmployee(employeeId: string, companyId: string) {
  const employee = await prisma.employee.findFirst({
    where: {
      id: employeeId,
      companyId: companyId,
    },
  });

  if (!employee) {
    throw new Error('Employee not found');
  }

  return employee;
}
