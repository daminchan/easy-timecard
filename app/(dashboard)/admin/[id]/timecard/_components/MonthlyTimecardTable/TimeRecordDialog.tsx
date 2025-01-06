'use client';

import { FC } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';

type Props = {
  /** ダイアログの表示状態 */
  open: boolean;
  /** ダイアログを閉じる時のコールバック */
  onClose: () => void;
  /** フォーム送信時のコールバック */
  onSubmit: (data: FormData) => void;
  /** 初期値 */
  defaultValues?: FormData;
};

type FormData = {
  /** 出勤時刻（HH:mm形式） */
  clockIn: string;
  /** 退勤時刻（HH:mm形式） */
  clockOut: string;
  /** 休憩開始時刻（HH:mm形式） */
  breakStart: string;
  /** 休憩終了時刻（HH:mm形式） */
  breakEnd: string;
};

export const TimeRecordDialog: FC<Props> = ({ open, onClose, onSubmit, defaultValues }) => {
  const { register, handleSubmit, reset } = useForm<FormData>({
    defaultValues: defaultValues || {
      clockIn: '',
      clockOut: '',
      breakStart: '',
      breakEnd: '',
    },
  });

  const onSubmitHandler = (data: FormData) => {
    onSubmit(data);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{defaultValues ? '勤怠記録の編集' : '勤怠記録の追加'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="clockIn">出勤時刻</Label>
            <Input
              id="clockIn"
              type="time"
              {...register('clockIn', { required: '出勤時刻は必須です' })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="clockOut">退勤時刻</Label>
            <Input
              id="clockOut"
              type="time"
              {...register('clockOut', { required: '退勤時刻は必須です' })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="breakStart">休憩開始時刻</Label>
            <Input id="breakStart" type="time" {...register('breakStart')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="breakEnd">休憩終了時刻</Label>
            <Input id="breakEnd" type="time" {...register('breakEnd')} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              キャンセル
            </Button>
            <Button type="submit">{defaultValues ? '更新' : '追加'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
