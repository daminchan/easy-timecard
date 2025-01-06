'use client';

import { FC, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { KeyRound, Loader2 } from 'lucide-react';

type Props = {
  /** パスコード送信時のコールバック */
  onSubmit: (passcode: string) => void;
  /** ローディング状態 */
  isLoading: boolean;
};

export const PasscodeForm: FC<Props> = ({ onSubmit, isLoading }) => {
  const [passcode, setPasscode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode) {
      onSubmit(passcode);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-4">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <KeyRound className="h-4 w-4 text-gray-500" />
          パスコードを入力
        </label>
        <Input
          type="password"
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
          placeholder="パスコードを入力"
          className="h-12 text-lg tracking-[0.5em] text-center font-mono border-gray-300"
          minLength={4}
          maxLength={8}
          pattern="[0-9]*"
          inputMode="numeric"
          required
          disabled={isLoading}
        />
      </div>

      <Button
        type="submit"
        className="w-full h-12 text-base font-medium bg-blue-600 hover:bg-blue-700 transition-colors"
        disabled={!passcode || isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            認証中...
          </>
        ) : (
          '認証'
        )}
      </Button>
    </form>
  );
};
