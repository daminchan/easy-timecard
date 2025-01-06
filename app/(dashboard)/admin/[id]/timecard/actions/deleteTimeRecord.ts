'use server';

import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { type ActionResponse } from './types';
import { revalidatePath } from 'next/cache';

export async function deleteTimeRecord(id: string): Promise<ActionResponse> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    // 勤怠記録の所有者確認
    const timeRecord = await prisma.timeRecord.findUnique({
      where: { id },
      include: { employee: true },
    });

    if (!timeRecord || timeRecord.employee.companyId !== userId) {
      return { success: false, error: 'Not found' };
    }

    // 勤怠記録の削除
    await prisma.timeRecord.delete({
      where: { id },
    });

    revalidatePath('/admin/[id]/timecard', 'layout');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete time record:', error);
    return { success: false, error: 'Failed to delete time record' };
  }
}
