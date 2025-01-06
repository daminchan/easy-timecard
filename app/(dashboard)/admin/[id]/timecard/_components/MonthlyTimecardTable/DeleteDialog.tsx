'use client';

import { FC } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

type Props = {
  /** ダイアログの表示状態 */
  open: boolean;
  /** ダイアログを閉じる時のコールバック */
  onClose: () => void;
  /** 削除確認時のコールバック */
  onConfirm: () => void;
  /** 削除対象の日付 */
  date: Date | null;
};

export const DeleteDialog: FC<Props> = ({ open, onClose, onConfirm, date }) => {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>勤怠記録の削除</DialogTitle>
          <DialogDescription>
            {date && format(date, 'yyyy年M月d日（E）', { locale: ja })}
            の勤怠記録を削除します。この操作は取り消せません。
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            キャンセル
          </Button>
          <Button type="button" variant="destructive" onClick={onConfirm}>
            削除
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
