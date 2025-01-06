'use client';

import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { CircleDollarSign, User, KeyRound, ShieldCheck } from 'lucide-react';

/** フォームの入力値の型 */
const formSchema = z.object({
  name: z.string().min(1, '名前を入力してください'),
  hourlyWage: z.number().min(0, '0以上の数値を入力してください'),
  isAdmin: z.boolean(),
  passcode: z
    .string()
    .min(4, '4-8桁の数字を入力してください')
    .max(8, '4-8桁の数字を入力してください')
    .regex(/^[0-9]+$/, '数字のみ入力可能です'),
});

/** フォームの入力値の型 */
type FormInput = z.infer<typeof formSchema>;

/** フォームのProps型 */
type Props = {
  /** モーダルの開閉状態 */
  open: boolean;
  /** モーダルを閉じる時のコールバック */
  onClose: () => void;
  /** フォーム送信時のコールバック */
  onSubmit: (data: FormInput) => void;
  /** 編集時の初期値（編集時のみ渡される） */
  defaultValues?: Partial<FormInput>;
};

export const EmployeeForm: FC<Props> = ({ open, onClose, onSubmit, defaultValues }) => {
  const form = useForm<FormInput>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues ?? {
      name: '',
      hourlyWage: 0,
      isAdmin: false,
      passcode: '',
    },
  });

  const handleSubmit = (data: FormInput) => {
    onSubmit(data);
    form.reset();
  };

  const isEditing = !!defaultValues;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] border-t-4 border-primary">
        <DialogHeader className="pb-4 border-b border-primary/20">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <User className="h-5 w-5 text-primary" />
            {isEditing ? '従業員情報の編集' : '新規従業員の登録'}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground/80">
            {isEditing
              ? '従業員情報を編集します。パスコードは変更する場合のみ入力してください。'
              : '新しい従業員を登録します。必要な情報を入力してください。'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 pt-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-primary">
                    <User className="h-4 w-4" />
                    名前
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="山田 太郎"
                      {...field}
                      className="transition-all duration-200 focus:scale-[1.01] focus:border-primary"
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-muted-foreground/70">
                    従業員の氏名を入力してください
                  </FormDescription>
                  <FormMessage className="text-destructive" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="hourlyWage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-primary">
                    <CircleDollarSign className="h-4 w-4" />
                    時給
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <CircleDollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground/70" />
                      <Input
                        type="number"
                        placeholder="1000"
                        className="pl-8 transition-all duration-200 focus:scale-[1.01] focus:border-primary"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </div>
                  </FormControl>
                  <FormDescription className="text-xs text-muted-foreground/70">
                    時給（円）を入力してください
                  </FormDescription>
                  <FormMessage className="text-destructive" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isAdmin"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4 shadow-sm transition-all duration-200 hover:border-primary bg-primary/5">
                  <div className="space-y-0.5">
                    <FormLabel className="flex items-center gap-2 text-primary">
                      <ShieldCheck className="h-4 w-4" />
                      管理者権限
                    </FormLabel>
                    <FormDescription className="text-xs text-muted-foreground/70">
                      管理者は従業員の登録・編集・削除、勤怠記録の管理が可能です
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="data-[state=checked]:bg-primary"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="passcode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-primary">
                    <KeyRound className="h-4 w-4" />
                    認証用パスコード
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="4-8桁の数字"
                      {...field}
                      className="font-mono tracking-widest transition-all duration-200 focus:scale-[1.01] focus:border-primary"
                      minLength={4}
                      maxLength={8}
                      pattern="[0-9]*"
                      inputMode="numeric"
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-muted-foreground/70">
                    従業員が認証時に使用する4-8桁の数字を設定してください
                  </FormDescription>
                  <FormMessage className="text-destructive" />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2 pt-4 border-t border-primary/20">
              <Button type="button" variant="outline" onClick={onClose} className="min-w-[100px]">
                キャンセル
              </Button>
              <Button type="submit" className="min-w-[100px]">
                {isEditing ? '更新' : '登録'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
