import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { MonthlyTimecardPage } from './MonthlyTimecardPage';
import { format } from 'date-fns';
import { createJSTDate, startOfJSTDay } from '@/lib/utils/date';

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ month?: string }>;
}

export default async function Page({ params, searchParams }: PageProps) {
  // パラメータを非同期で取得
  const { id } = await params;
  const { month } = await searchParams;

  if (!id) {
    redirect('/admin/employees');
  }

  const { userId } = await auth();
  if (!userId) {
    redirect('/sign-in');
  }

  // 従業員情報を取得
  const employee = await prisma.employee.findFirst({
    where: {
      id: id,
      companyId: userId,
      isActive: true,
    },
  });

  if (!employee) {
    redirect('/admin/employees');
  }

  // 表示する月を決定（デフォルトは現在の月）
  const today = createJSTDate();
  const defaultMonth = format(today, 'yyyy-MM');
  const monthParam = month ?? defaultMonth;
  const targetMonth = createJSTDate(new Date(`${monthParam}-01`));

  // 月の開始日と終了日を計算（JST）
  const startDate = startOfJSTDay(new Date(targetMonth.getFullYear(), targetMonth.getMonth(), 1));
  const endDate = startOfJSTDay(new Date(targetMonth.getFullYear(), targetMonth.getMonth() + 1, 0));

  // 勤怠記録の取得
  const timeRecords = await prisma.timeRecord.findMany({
    where: {
      employeeId: id,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: {
      date: 'asc',
    },
  });

  return (
    <MonthlyTimecardPage employee={employee} timeRecords={timeRecords} currentMonth={targetMonth} />
  );
}
