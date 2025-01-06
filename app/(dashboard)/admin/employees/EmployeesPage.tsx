'use client';

import { FC, useState, useEffect } from 'react';
import { type Employee } from '@/types';
import { Button } from '@/components/ui/button';
import { UserPlus, Users, Building2 } from 'lucide-react';
import { EmployeeForm } from './_components/EmployeeForm';
import { EmployeeList } from './_components/EmployeeList';
import { useToast } from '@/hooks/use-toast';
import {
  createEmployee,
  getEmployees,
  updateEmployee,
  deleteEmployee,
  updateCompanyName,
} from './actions/index';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { CompanyNameForm } from './_components/CompanyNameForm';

/** 従業員フォームの入力値の型 */
type EmployeeFormInput = {
  /** 従業員名 */
  name: string;
  /** 時給 */
  hourlyWage: number;
  /** 管理者権限の有無 */
  isAdmin: boolean;
  /** パスコード（4桁） */
  passcode: string;
};

type Props = {
  /** 初期従業員データ */
  initialEmployees: Employee[];
  /** アクション */
  actions: {
    /** 従業員作成アクション */
    createEmployee: typeof createEmployee;
    /** 従業員更新アクション */
    updateEmployee: typeof updateEmployee;
    /** 従業員削除アクション */
    deleteEmployee: typeof deleteEmployee;
    /** 会社名更新アクション */
    updateCompanyName: typeof updateCompanyName;
  };
};

export const EmployeesPage: FC<Props> = ({ initialEmployees, actions }) => {
  const { toast } = useToast();
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showCompanyNameForm, setShowCompanyNameForm] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateEmployee = async (data: EmployeeFormInput) => {
    const { success, data: employee } = await actions.createEmployee(data);
    if (success && employee) {
      setEmployees((prev) => [employee, ...prev]);
      setShowCreateForm(false);
      toast({
        title: '成功',
        description: '従業員を登録しました',
      });
    } else {
      toast({
        title: 'エラー',
        description: '従業員の登録に失敗しました',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateEmployee = async (employee: Employee) => {
    const { id, ...updateData } = employee;
    const { success, data: updatedEmployee } = await actions.updateEmployee({
      id,
      ...updateData,
    });
    if (success && updatedEmployee) {
      setEmployees((prev) =>
        prev.map((emp) => (emp.id === updatedEmployee.id ? updatedEmployee : emp))
      );
      toast({
        title: '成功',
        description: '従業員情報を更新しました',
      });
    } else {
      toast({
        title: 'エラー',
        description: '従業員情報の更新に失敗しました',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteEmployee = async (employeeId: string) => {
    const { success } = await actions.deleteEmployee(employeeId);
    if (success) {
      setEmployees((prev) => prev.filter((emp) => emp.id !== employeeId));
      toast({
        title: '成功',
        description: '従業員を削除しました',
      });
    } else {
      toast({
        title: 'エラー',
        description: '従業員の削除に失敗しました',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateCompanyName = async () => {
    if (!companyName.trim()) return;

    const { success } = await actions.updateCompanyName(companyName);
    if (success) {
      setShowCompanyNameForm(false);
      toast({
        title: '成功',
        description: '会社名を更新しました',
      });
      // ページをリロードして新しい会社名を反映
      window.location.reload();
    } else {
      toast({
        title: 'エラー',
        description: '会社名の更新に失敗しました',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        <div className="text-gray-500">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-8 px-4 py-8">
      {/* ヘッダーセクション */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-blue-100 p-3">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">従業員管理</h1>
              <p className="mt-1 text-sm text-gray-500">従業員の登録・編集・削除ができます</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setShowCompanyNameForm(true)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Building2 className="h-4 w-4" />
              会社名を登録
            </Button>
            <Button onClick={() => setShowCreateForm(true)} className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              従業員を登録
            </Button>
          </div>
        </div>

        {/* 統計情報 */}
        <div className="mt-6 grid grid-cols-1 gap-4 border-t border-gray-100 pt-6 sm:grid-cols-3">
          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-sm font-medium text-gray-500">総従業員数</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{employees.length}</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-sm font-medium text-gray-500">在籍中</p>
            <p className="mt-2 text-3xl font-bold text-green-600">
              {employees.filter((e) => e.isActive).length}
            </p>
          </div>
          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-sm font-medium text-gray-500">管理者数</p>
            <p className="mt-2 text-3xl font-bold text-blue-600">
              {employees.filter((e) => e.isAdmin).length}
            </p>
          </div>
        </div>
      </div>

      {/* 従業員一覧 */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <EmployeeList
          employees={employees}
          onUpdate={handleUpdateEmployee}
          onDelete={handleDeleteEmployee}
        />
      </div>

      {/* 従業員作成フォーム */}
      <EmployeeForm
        open={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        onSubmit={handleCreateEmployee}
      />

      {/* 会社名編集フォーム */}
      <CompanyNameForm
        open={showCompanyNameForm}
        onClose={() => setShowCompanyNameForm(false)}
        onSubmit={handleUpdateCompanyName}
      />
    </div>
  );
};
