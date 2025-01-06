import { type FC } from 'react';
import { EmployeesPage } from './EmployeesPage';
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { createClerkClient } from '@clerk/backend';
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  updateCompanyName,
} from './actions';

const Page: FC = async () => {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const clerkClient = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
  });

  const user = await clerkClient.users.getUser(userId);
  const currentEmployee = user.privateMetadata.currentEmployee as
    | { employeeId: string; isAdmin: boolean }
    | undefined;

  // 管理者権限がない場合はタイムカードページにリダイレクト
  if (!currentEmployee?.isAdmin) {
    redirect('/timecard');
  }

  // 従業員データを取得
  const { success, data } = await getEmployees();
  const employees = success && data ? data.employees : [];

  return (
    <EmployeesPage
      initialEmployees={employees}
      actions={{
        createEmployee,
        updateEmployee,
        deleteEmployee,
        updateCompanyName,
      }}
    />
  );
};

export default Page;
