'use client';

import { FC, useState } from 'react';
import { useRouter } from 'next/navigation';
import { type Employee } from '@prisma/client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { PasscodeForm } from '../PasscodeForm/PasscodeForm';
import { useToast } from '@/hooks/use-toast';
import { updateEmployeeSession } from '../../actions/updateEmployeeSession';
import { User, ShieldCheck } from 'lucide-react';

type Props = {
  /** 従業員一覧 */
  employees: Employee[];
};

export const EmployeeSelector: FC<Props> = ({ employees }) => {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSelectEmployee = (employeeId: string) => {
    const employee = employees.find((emp) => emp.id === employeeId);
    if (employee) {
      setSelectedEmployee(employee);
    }
  };

  const handleSubmitPasscode = async (passcode: string) => {
    if (!selectedEmployee) return;

    setIsLoading(true);
    try {
      // パスコードの検証
      if (selectedEmployee.passcode !== passcode) {
        toast({
          title: 'エラー',
          description: 'パスコードが正しくありません',
          variant: 'destructive',
        });
        return;
      }

      // セッションの更新
      const result = await updateEmployeeSession(selectedEmployee.id, selectedEmployee.isAdmin);
      if (!result.success) {
        throw new Error(result.error);
      }

      toast({
        title: '認証成功',
        description: `${selectedEmployee.name}さんとしてログインしました`,
      });

      // リダイレクト
      if (selectedEmployee.isAdmin) {
        router.push('/admin/employees');
      } else {
        router.push('/timecard');
      }
    } catch (error) {
      toast({
        title: 'エラー',
        description: error instanceof Error ? error.message : '認証に失敗しました',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <User className="h-4 w-4 text-gray-500" />
          従業員を選択
        </label>
        <Select onValueChange={handleSelectEmployee}>
          <SelectTrigger className="w-full h-12 text-left border-gray-300 bg-white hover:bg-gray-50 transition-colors">
            <SelectValue placeholder="選択してください" />
          </SelectTrigger>
          <SelectContent>
            {employees.map((employee) => (
              <SelectItem
                key={employee.id}
                value={employee.id}
                className="flex items-center justify-between py-3 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="font-medium">{employee.name}</span>
                  {employee.isAdmin && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                      <ShieldCheck className="h-3 w-3" />
                      管理者
                    </span>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedEmployee && (
        <div className="pt-6 border-t">
          <PasscodeForm onSubmit={handleSubmitPasscode} isLoading={isLoading} />
        </div>
      )}
    </div>
  );
};
