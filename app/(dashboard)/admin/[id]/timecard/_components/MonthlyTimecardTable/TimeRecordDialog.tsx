'use client';

import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const formSchema = z
  .object({
    date: z.string().min(1, '日付を入力してください'),
    clockIn: z.string().min(1, '出勤時刻を入力してください'),
    clockOut: z.string().min(1, '退勤時刻を入力してください'),
    breakStart: z.string(),
    breakEnd: z.string(),
  })
  .refine(
    (data) => {
      // 休憩開始と休憩終了は両方入力するか、両方空にする
      const hasBreakStart = data.breakStart !== '';
      const hasBreakEnd = data.breakEnd !== '';
      return (hasBreakStart && hasBreakEnd) || (!hasBreakStart && !hasBreakEnd);
    },
    {
      message: '休憩開始と休憩終了は両方入力してください',
      path: ['breakEnd'],
    }
  );

type FormData = z.infer<typeof formSchema>;

type Props = {
  /** ダイアログの表示状態 */
  open: boolean;
  /** ダイアログを閉じる時のコールバック */
  onClose: () => void;
  /** フォーム送信時のコールバック */
  onSubmit: (data: FormData) => void;
  /** 初期値 */
  defaultValues?: Partial<FormData>;
};

export const TimeRecordDialog: FC<Props> = ({ open, onClose, onSubmit, defaultValues }) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      clockIn: '',
      clockOut: '',
      breakStart: '',
      breakEnd: '',
      ...defaultValues,
    },
  });

  const handleSubmit = (data: FormData) => {
    onSubmit(data);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>勤怠記録の登録</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>日付</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="clockIn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>出勤時刻</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="clockOut"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>退勤時刻</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="breakStart"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>休憩開始</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="breakEnd"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>休憩終了</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                キャンセル
              </Button>
              <Button type="submit">保存</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
