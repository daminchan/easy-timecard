'use client';

import { FC } from 'react';
import { type Employee } from '@/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

type Props = {
  /** 削除対象の従業員 */
  employee: Employee | null;
  /** ダイアログを閉じる時のコールバック */
  onClose: () => void;
  /** 削除実行時のコールバック */
  onConfirm: () => void;
};

export const DeleteEmployeeDialog: FC<Props> = ({ employee, onClose, onConfirm }) => {
  if (!employee) return null;

  return (
    <AlertDialog open={!!employee} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>従業員を削除</AlertDialogTitle>
          <AlertDialogDescription>
            {employee.name}
            を削除します。この操作は取り消せません。本当に削除しますか？
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>キャンセル</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-red-500 hover:bg-red-600">
            削除
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
