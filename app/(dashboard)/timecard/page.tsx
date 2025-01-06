import { clockIn, startBreak, endBreak, clockOut } from './actions';
import { TimeCardPage } from './TimeCardPage';
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export default async function Page() {
  const { userId } = await auth();
  if (!userId) {
    redirect('/sign-in');
  }

  // 今日の日付の開始と終了を取得
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // 従業員データとタイムレコードを一緒に取得
  const employees = await prisma.employee.findMany({
    where: {
      companyId: userId,
      isActive: true,
    },
    orderBy: {
      name: 'asc',
    },
    include: {
      timeRecords: {
        where: {
          date: {
            gte: today,
            lt: tomorrow,
          },
        },
      },
    },
  });

  return (
    <TimeCardPage
      initialEmployees={employees}
      initialTimeRecords={employees.flatMap((employee) => employee.timeRecords)}
      clockIn={clockIn}
      startBreak={startBreak}
      endBreak={endBreak}
      clockOut={clockOut}
    />
  );
}
