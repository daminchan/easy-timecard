'use client';

import { FC, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Building2 } from 'lucide-react';

type Props = {
  /** モーダルの開閉状態 */
  open: boolean;
  /** モーダルを閉じる時のコールバック */
  onClose: () => void;
  /** フォーム送信時のコールバック */
  onSubmit: (name: string) => void;
};

export const CompanyNameForm: FC<Props> = ({ open, onClose, onSubmit }) => {
  const [companyName, setCompanyName] = useState('');

  const handleSubmit = () => {
    if (!companyName.trim()) return;
    onSubmit(companyName);
    setCompanyName('');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] border-t-4 border-primary">
        <DialogHeader className="pb-4 border-b border-primary/20">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Building2 className="h-5 w-5 text-primary" />
            会社名の登録
          </DialogTitle>
          <DialogDescription className="text-muted-foreground/80">
            会社名を入力してください
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <Input
            placeholder="会社名"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="h-12 transition-all duration-200 focus:scale-[1.01] focus:border-primary"
          />
          <div className="flex justify-end gap-2 pt-4 border-t border-primary/20">
            <Button variant="outline" onClick={onClose} className="min-w-[100px]">
              キャンセル
            </Button>
            <Button onClick={handleSubmit} disabled={!companyName.trim()} className="min-w-[100px]">
              登録
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
