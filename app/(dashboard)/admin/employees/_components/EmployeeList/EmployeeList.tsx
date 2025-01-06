'use client';

import { FC, useState } from 'react';
import { type Employee } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, CircleDollarSign, ShieldCheck } from 'lucide-react';
import { EmployeeForm } from '../EmployeeForm';
import { DeleteEmployeeDialog } from '../DeleteEmployeeDialog';
import Link from 'next/link';

type Props = {
  /** 従業員リスト */
  employees: Employee[];
  /** 従業員更新時のコールバック */
  onUpdate?: (updatedEmployee: Employee) => void;
  /** 従業員削除時のコールバック */
  onDelete?: (deletedEmployeeId: string) => void;
};

export const EmployeeList: FC<Props> = ({ employees, onUpdate, onDelete }) => {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);

  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowEditForm(true);
  };

  const handleUpdate = async (data: { name: string; hourlyWage: number; isAdmin: boolean }) => {
    if (!selectedEmployee) return;
    onUpdate?.({
      ...selectedEmployee,
      ...data,
    });
    setShowEditForm(false);
  };

  const handleDelete = async () => {
    if (!employeeToDelete) return;
    onDelete?.(employeeToDelete.id);
    setEmployeeToDelete(null);
  };

  if (employees.length === 0) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        <div className="text-gray-500">従業員が登録されていません</div>
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>名前</TableHead>
            <TableHead>
              <div className="flex items-center gap-2">
                <CircleDollarSign className="h-4 w-4" />
                時給
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                権限
              </div>
            </TableHead>
            <TableHead>ステータス</TableHead>
            <TableHead className="w-[100px]">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee.id}>
              <TableCell className="font-medium">
                <Link
                  href={`/admin/${employee.id}/timecard`}
                  className="text-blue-600 hover:underline"
                >
                  {employee.name}
                </Link>
              </TableCell>
              <TableCell>¥{employee.hourlyWage.toLocaleString()}</TableCell>
              <TableCell>
                {employee.isAdmin ? (
                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">管理者</Badge>
                ) : (
                  <Badge variant="secondary" className="hover:bg-gray-200">
                    一般
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                {employee.isActive ? (
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">在籍中</Badge>
                ) : (
                  <Badge variant="destructive" className="hover:bg-red-600">
                    退職
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEdit(employee)}
                    className="h-8 w-8"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setEmployeeToDelete(employee)}
                    className="h-8 w-8 text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* 編集フォーム */}
      <EmployeeForm
        open={showEditForm}
        onClose={() => setShowEditForm(false)}
        onSubmit={handleUpdate}
        defaultValues={selectedEmployee ?? undefined}
      />

      {/* 削除確認ダイアログ */}
      <DeleteEmployeeDialog
        employee={employeeToDelete}
        onClose={() => setEmployeeToDelete(null)}
        onConfirm={handleDelete}
      />
    </>
  );
};
