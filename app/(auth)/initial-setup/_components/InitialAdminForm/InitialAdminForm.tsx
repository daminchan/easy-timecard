'use client';

import { FC, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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
} from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  name: z.string().min(1, '名前を入力してください'),
  passcode: z
    .string()
    .length(4, 'パスコードは4桁で入力してください')
    .regex(/^\d+$/, 'パスコードは数字のみ使用可能です'),
  hourlyWage: z.coerce.number().min(0, '0以上の数値を入力してください').default(1000),
});

type FormData = z.infer<typeof formSchema>;

type Props = {
  onSubmit: (data: FormData) => Promise<void>;
};

export const InitialAdminForm: FC<Props> = ({ onSubmit }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      passcode: '',
      hourlyWage: 1000,
    },
  });

  const handleSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
    } catch (error) {
      toast({
        title: 'エラー',
        description: error instanceof Error ? error.message : '管理者の作成に失敗しました',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>初期管理者の作成</CardTitle>
        <CardDescription>
          管理者アカウントを作成してください。このアカウントで従業員の管理や勤怠記録の確認ができます。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>名前</FormLabel>
                  <FormControl>
                    <Input placeholder="山田 太郎" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="passcode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>パスコード（4桁）</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="1234" maxLength={4} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="hourlyWage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>時給</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? '作成中...' : '作成する'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
