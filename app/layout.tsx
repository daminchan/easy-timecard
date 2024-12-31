import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import Header from '@/components/common/Header/Header';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'EazyTimeCard - 簡単な勤怠管理を、すべての企業に',
  description: 'タブレット1台で始められるタイムカードアプリ。従業員の勤怠管理を簡単に。',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="ja" className="h-full">
        <body className={`${inter.className} min-h-full bg-gray-50`}>
          <Header />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
