# EazyTimeCard - 企業向け簡易タイムカードアプリケーション

## プロジェクト概要

シンプルで使いやすい企業向けタイムカードアプリケーション。iPad などのタブレットでの利用を想定し、従業員が簡単に打刻できる機能と、管理者が勤怠を管理できる機能を提供します。

## 技術スタック

- **フレームワーク**: Next.js 15 (App Router)
- **認証**: Clerk
- **データベース**: Supabase
- **ORM**: Prisma
- **UI ライブラリ**: shadcn/ui
- **スタイリング**: Tailwind CSS

## 機能要件

### 1. 認証機能

- 企業アカウントによるログイン（Clerk）
  - username/password 認証
  - 企業ごとの独立した環境

### 2. 打刻機能（従業員向け）

- 従業員一覧表示
  - 名前選択による簡易打刻
  - 勤務状態の視覚的表示（色による区別）
- 打刻操作
  - 出勤
  - 休憩開始
  - 休憩終了
  - 退勤
- 1 日 1 セットの打刻制限
  - 出勤 → 休憩開始 → 休憩終了 → 退勤の順序制御

### 3. 管理機能（管理者向け）

- 従業員管理
  - 従業員の登録/編集/削除
  - 時給設定
  - 管理者権限の付与
- 勤怠記録管理
  - 月次一覧表示
  - 従業員別表示
  - 記録の編集/削除
- 給与計算
  - 勤務時間 × 時給の自動計算
  - 休憩時間の自動除外

### 4. ランディングページ（ホーム）

- アプリケーションの概要説明
  - 主な機能の紹介
  - 使用方法の簡単な説明
  - メリットの提示
- 企業向け CTA ボタン
  - 「登録企業様ログイン」ボタン
  - Clerk の認証ページへ遷移

## データモデル

### Company（企業）

```typescript
type Company = {
  id: string; // Clerkで生成される企業ID
  name: string; // 企業名
  createdAt: Date;
  updatedAt: Date;
};
```

### Employee（従業員）

```typescript
type Employee = {
  id: string;
  companyId: string; // 所属企業ID
  name: string; // 従業員名
  hourlyWage: number; // 時給
  isAdmin: boolean; // 管理者権限
  isActive: boolean; // 在籍状態
  createdAt: Date;
  updatedAt: Date;
};
```

### TimeRecord（勤怠記録）

```typescript
type TimeRecord = {
  id: string;
  employeeId: string; // 従業員ID
  date: Date; // 勤務日
  clockIn: Date; // 出勤時刻
  breakStart: Date; // 休憩開始
  breakEnd: Date; // 休憩終了
  clockOut: Date; // 退勤時刻
  totalWorkMinutes: number; // 総勤務時間（分）
  totalBreakMinutes: number; // 総休憩時間（分）
  createdAt: Date;
  updatedAt: Date;
};
```

## ディレクトリ構造

```
├── app/
│   ├── (auth)/
│   │   └── sign-in/
│   │       └── [[...sign-in]]/
│   │           └── page.tsx
│   ├── (dashboard)/
│   │   ├── admin/
│   │   │   ├── _components/
│   │   │   │   ├── EmployeeManagement/
│   │   │   │   │   ├── EmployeeForm/
│   │   │   │   │   │   ├── EmployeeForm.tsx
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   ├── EmployeeList/
│   │   │   │   │   │   ├── EmployeeList.tsx
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   └── index.ts
│   │   │   │   └── TimeRecordManagement/
│   │   │   │       ├── TimeRecordList/
│   │   │   │       │   ├── TimeRecordList.tsx
│   │   │   │       │   └── index.ts
│   │   │   │       ├── TimeRecordFilter/
│   │   │   │       │   ├── TimeRecordFilter.tsx
│   │   │   │       │   └── index.ts
│   │   │   │       └── index.ts
│   │   │   ├── employees/
│   │   │   │   ├── _components/
│   │   │   │   ├── page.tsx
│   │   │   │   └── EmployeesPage.tsx
│   │   │   ├── time-records/
│   │   │   │   ├── _components/
│   │   │   │   ├── page.tsx
│   │   │   │   └── TimeRecordsPage.tsx
│   │   │   ├── page.tsx
│   │   │   └── AdminPage.tsx
│   │   └── timecard/
│   │       ├── _components/
│   │       │   ├── EmployeeList/
│   │       │   └── TimeCardModal/
│   │       └── page.tsx
│   ├── (marketing)/
│   │   └── page.tsx
│   ├── api/
│   │   └── trpc/
│   │       └── [trpc]/
│   │           └── route.ts
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   │   └── shadcn-uiコンポーネント
│   ├── common/
│   │   ├── DataTable/
│   │   │   ├── DataTable.tsx
│   │   │   └── index.ts
│   │   ├── FilterForm/
│   │   │   ├── FilterForm.tsx
│   │   │   └── index.ts
│   │   ├── Pagination/
│   │   │   ├── Pagination.tsx
│   │   │   └── index.ts
│   │   ├── ErrorBoundary/
│   │   ├── LoadingSpinner/
│   │   └── Layout/
│   └── marketing/
│       ├── Hero/
│       ├── Features/
│       └── CTAButton/
├── features/
│   ├── admin/
│   │   ├── api/
│   │   │   ├── employee.ts
│   │   │   └── timeRecord.ts
│   │   ├── hooks/
│   │   │   ├── useEmployeeManagement.ts
│   │   │   └── useTimeRecordManagement.ts
│   │   └── types/
│   │       └── index.ts
│   ├── company/
│   │   ├── api/
│   │   │   └── company.ts
│   │   └── types/
│   │       └── index.ts
│   ├── employee/
│   │   ├── api/
│   │   │   └── employee.ts
│   │   └── types/
│   │       └── index.ts
│   └── timecard/
│       ├── api/
│       │   └── timecard.ts
│       └── types/
│           └── index.ts
├── hooks/
│   └── index.ts
├── lib/
│   └── utils/
│       └── index.ts
├── types/
│   └── index.ts (型定義のre-export)
└── ... // 他のディレクトリ

```

## セキュリティ要件

- Clerk 認証による企業アカウントの保護
- 管理者権限の適切な制御
- クロスサイトスクリプティング（XSS）対策
- クロスサイトリクエストフォージェリ（CSRF）対策

## パフォーマンス要件

- ページロード時間: 3 秒以内
- 打刻操作のレスポンス: 1 秒以内
- モバイル/タブレット対応（レスポンシブデザイン）

## 将来の拡張性

- CSV 出力機能
- 印刷機能
- シフト管理機能
- 部署管理機能
- 給与計算の詳細機能

## コーディング規約

- TypeScript の厳密な型付け
- ESLint と Prettier によるコード品質管理
- コンポーネントの単一責任の原則
- テスト可能なコード設計

## テスト要件

- ユニットテスト
- 統合テスト
- E2E テスト（主要フロー）

## アーキテクチャ設計の意図

### ディレクトリ構造の意図

1. **ルーティングとビジネスロジックの分離**

   - `app/`ディレクトリはルーティングのみに使用
   - ビジネスロジックは`features/`に配置
   - 理由：Next.js の App Router の仕様に準拠し、意図しないルーティング生成を防止

2. **機能モジュールの独立性**

   - 各機能は`features/`配下で完結
   - 例：`features/employee/`には従業員関連の全てのロジックが含まれる
   - 理由：機能の追加・削除が容易で、影響範囲が明確

3. **型定義の一元管理**

   - 各機能の型定義は`features/{domain}/types/`に配置
     - `company/types/` - 企業関連の型定義
     - `employee/types/` - 従業員関連の型定義
     - `timecard/types/` - タイムカード関連の型定義
   - ルートの`types/index.ts`は型の re-export のみを行う
     - 他のコンポーネントからは`@/types`を通じて型を参照
     - 実際の型定義は各機能ディレクトリに配置
   - 理由：型定義の重複を防ぎ、一貫性を保持

4. **API ロジックの集中管理**

   - API 関連のロジックは`features/{domain}/api/`に配置
   - 理由：データフローの追跡が容易で、API の一貫性を保持

### コード規約の意図

1. **型の一貫性**

   ```typescript
   // 正しい例：型の再利用
   import { type Employee } from '@/features/employee/types';

   // 誤った例：型の再定義
   type Employee = {
     // ... 同じ内容の再定義
   };
   ```

   理由：型の一貫性を保ち、メンテナンス性を向上

2. **コンポーネントの責任分離**

   ```typescript
   // 正しい例：プレゼンテーショナルコンポーネント
   export const EmployeeList: FC<Props> = ({ employees, onSelect }) => {
     return (/* UIのみの実装 */);
   };

   // 正しい例：コンテナコンポーネント
   export const EmployeeListContainer: FC = () => {
     const employees = useEmployees();
     return <EmployeeList employees={employees} onSelect={handleSelect} />;
   };

   // 誤った例：責任の混在
   export const EmployeeList: FC = () => {
     const employees = useEmployees(); // ビジネスロジックとUIの混在
     return (/* ... */);
   };
   ```

   理由：テスト容易性とコードの再利用性の向上

3. **状態管理の一貫性**

   ```typescript
   // 正しい例：Jotaiを使用した状態管理
   import { atom, useAtom } from 'jotai';

   // 誤った例：異なる状態管理の混在
   import { useState } from 'react';
   import { atom } from 'jotai';
   ```

   理由：状態管理の一貫性を保ち、予測可能性を向上

### 拡張時の注意点

1. **新機能の追加**

   - 新しい機能は必ず`features/`に新しいディレクトリとして追加
   - 既存の型定義の拡張は既存ファイルで行う
   - 理由：一貫性のある構造を維持

2. **共通コンポーネントの追加**

   - UI コンポーネントは`components/ui/`
   - 機能コンポーネントは`components/common/`
   - 理由：再利用可能なコンポーネントの管理を容易に

3. **API の追加**
   - 新しい API は対応する`features/{domain}/api/`に追加
   - 理由：API の一貫性と追跡可能性の維持

### 禁止事項

1. **型定義の重複**

   - 既存の型定義の再定義は禁止
   - 必要な場合は既存の型を拡張

   ```typescript
   // 正しい例：型の拡張
   type EmployeeWithDetails = Employee & {
     additionalField: string;
   };

   // 誤った例：型の再定義
   type Employee = {
     /* ... */
   };
   ```

2. **ディレクトリ構造の変更**

   - 定義された構造からの逸脱は禁止
   - 新しいパターンの導入は要議論

3. **状態管理の混在**
   - Jotai 以外の状態管理ライブラリの使用は禁止
   - グローバル状態とローカル状態の適切な使い分け

### レビュー基準

1. **型の使用**

   - `any`の使用は却下
   - 型キャストは原則却下
   - 明示的な型定義の必要性

2. **コンポーネント設計**

   - 単一責任の原則の遵守
   - プレゼンテーショナル/コンテナの分離
   - 適切なディレクトリ配置

3. **状態管理**
   - Jotai の適切な使用
   - 状態の最小限の保持
   - 適切なスコープでの状態管理

### コンポーネント設計の追加例

```typescript
// 正しい例：マーケティングコンポーネント
// components/marketing/Hero/Hero.tsx
export const Hero: FC = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h1>簡単な勤怠管理を、すべての企業に</h1>
        <p>タブレット1台で始められるタイムカードアプリ</p>
      </div>
    </section>
  );
};

// components/marketing/CTAButton/CTAButton.tsx
export const CTAButton: FC = () => {
  return (
    <Link
      href="/sign-in"
      className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90"
    >
      登録企業様ログイン
    </Link>
  );
};

// app/(marketing)/page.tsx
export default function HomePage() {
  return (
    <main>
      <Hero />
      <Features />
      <CTAButton />
    </main>
  );
}
```
