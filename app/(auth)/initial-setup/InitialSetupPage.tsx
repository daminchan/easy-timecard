'use client';

import { FC } from 'react';
import { useRouter } from 'next/navigation';
import { InitialEmployeeForm } from './_components/InitialEmployeeForm';
import { createInitialAdmin } from './_action/createInitialAdmin';
import { useToast } from '@/hooks/use-toast';
import { Building2, ShieldCheck } from 'lucide-react';

export const InitialSetupPage: FC = () => {
  const router = useRouter();
  const { toast } = useToast();

  const handleCreateAdmin = async (data: {
    name: string;
    passcode: string;
    hourlyWage: number;
  }) => {
    try {
      const result = await createInitialAdmin({
        ...data,
        isAdmin: true,
      });

      if (result.success) {
        router.push('/employee-auth');
      } else {
        toast({
          title: 'エラー',
          description: result.error,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'エラー',
        description: '管理者の作成に失敗しました',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="rounded-full bg-blue-100 p-3">
            <Building2 className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <h1 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          初期セットアップ
        </h1>
        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-600">
          <ShieldCheck className="h-4 w-4" />
          <span>管理者アカウントの作成</span>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-white px-6 py-8 shadow-xl ring-1 ring-gray-900/5 sm:rounded-xl sm:px-12">
          <div className="mb-6">
            <h2 className="text-center text-lg font-semibold text-gray-900">管理者情報を入力</h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              従業員の管理や勤怠記録の確認ができる管理者アカウントを作成します
            </p>
          </div>
          <InitialEmployeeForm onSubmit={handleCreateAdmin} />
        </div>
      </div>
    </div>
  );
};
