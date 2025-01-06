import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { Employee, TimeRecord } from '@/types';

type GetEmployeesResponse = {
  success: boolean;
  data?: {
    employees: Employee[];
    timeRecords: TimeRecord[];
  };
  error?: string;
};

export const getEmployees = async (): Promise<GetEmployeesResponse> => {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    // 今日の日付の開始と終了を取得
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // 従業員データと今日のタイムレコードを取得
    const [employees, timeRecords] = await Promise.all([
      prisma.employee.findMany({
        where: {
          companyId: userId,
          isActive: true,
        },
        orderBy: {
          name: 'asc',
        },
      }),
      prisma.timeRecord.findMany({
        where: {
          employee: {
            companyId: userId,
          },
          date: {
            gte: today,
            lt: tomorrow,
          },
        },
      }),
    ]);

    return {
      success: true,
      data: {
        employees,
        timeRecords,
      },
    };
  } catch (error) {
    console.error('Failed to fetch employees with time records:', error);
    return { success: false, error: 'Failed to fetch data' };
  }
};
