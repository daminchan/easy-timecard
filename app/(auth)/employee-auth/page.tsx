import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { EmployeeSelector } from './_components/EmployeeSelector/EmployeeSelector';
import { Building2, Users } from 'lucide-react';

export default async function EmployeeAuthPage() {
  const { userId } = await auth();

  // 未認証の場合はログインページへ
  if (!userId) {
    redirect('/sign-in');
  }

  // 企業に所属する従業員一覧を取得
  const employees = await prisma.employee.findMany({
    where: {
      companyId: userId,
      isActive: true,
    },
    orderBy: {
      name: 'asc',
    },
  });

  // 企業情報を取得
  const company = await prisma.company.findUnique({
    where: { id: userId },
  });

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="rounded-full bg-blue-100 p-3">
            <Building2 className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <h1 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          従業員認証
        </h1>
        {company && (
          <p className="mt-2 text-center text-lg font-medium text-gray-900">{company.name}</p>
        )}
        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-600">
          <Users className="h-4 w-4" />
          <span>従業員数: {employees.length}名</span>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-white px-6 py-8 shadow-xl ring-1 ring-gray-900/5 sm:rounded-xl sm:px-12">
          <div className="mb-6">
            <h2 className="text-center text-lg font-semibold text-gray-900">
              従業員を選択してパスコードを入力
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              タイムカードの記録や管理を行うには従業員認証が必要です
            </p>
          </div>
          <EmployeeSelector employees={employees} />
        </div>
      </div>
    </div>
  );
}
