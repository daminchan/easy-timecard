'use client';

import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { CircleDollarSign, User, KeyRound } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

/** フォームの入力値の型 */
const formSchema = z.object({
  name: z.string().min(1, '名前を入力してください'),
  hourlyWage: z.coerce.number().min(0, '0以上の数値を入力してください'),
  passcode: z
    .string()
    .length(4, 'パスコードは4桁で入力してください')
    .regex(/^\d+$/, 'パスコードは数字のみ使用可能です'),
});

type FormInput = z.infer<typeof formSchema>;

type Props = {
  /** フォーム送信時のコールバック */
  onSubmit: (data: FormInput) => Promise<void>;
};

export const InitialEmployeeForm: FC<Props> = ({ onSubmit }) => {
  const form = useForm<FormInput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      hourlyWage: 1000,
      passcode: '',
    },
  });

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    管理者の氏名を入力してください
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
                      placeholder="4桁の数字"
                      {...field}
                      className="font-mono tracking-widest transition-all duration-200 focus:scale-[1.01] focus:border-primary"
                      minLength={4}
                      maxLength={4}
                      pattern="[0-9]*"
                      inputMode="numeric"
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-muted-foreground/70">
                    認証時に使用する4桁の数字を設定してください
                  </FormDescription>
                  <FormMessage className="text-destructive" />
                </FormItem>
              )}
            />
            <div className="pt-4">
              <Button type="submit" className="w-full">
                管理者アカウントを作成
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
