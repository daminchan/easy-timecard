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

## アーキテクチャ設計の基本方針

### 採用技術の理由

1. **Server Actions採用**

   - Next.js 13以降の推奨アーキテクチャに準拠
   - APIエンドポイントの作成・管理が不要
   - 型安全性の向上とクライアント・サーバー間の一貫性確保
   - 各機能のactionsディレクトリに集約し、責務を明確化

2. **featuresディレクトリ採用**

   - ドメイン駆動設計（DDD）の考え方を取り入れ
   - 機能ごとの独立性と再利用性の向上
   - ビジネスロジックの集約と管理の容易さ
   - 機能単位でのテストを容易に実現

3. **Atomic Design不採用**
   - 小規模アプリケーションのため、過度な抽象化を避ける
   - コンポーネントの責務を明確にし、管理を容易にする
   - 機能単位でのコンポーネント管理を優先
   - 再利用性よりもメンテナンス性を重視

### 主な特徴

1. **動的ルーティング**

   - `[id]`のような動的セグメントを使用した柔軟なルーティング
   - 各ページに対応するClient Component（`〇〇〇Page.tsx`）を配置
   - SEO対策としての適切なメタデータ管理
   - エラーハンドリングとフォールバックの統一的な実装

2. **コンポーネントの分離**

   - ページ固有のコンポーネントは`_components`に配置
   - 再利用可能なコンポーネントは`features`に配置
   - UIコンポーネントは`components/ui`に配置
   - 共通コンポーネントは`components/common`に配置

3. **型安全性の確保**

   - 厳密な型定義と型チェック
   - 型定義ファイルの集中管理
   - Server ActionsとClient Componentsの型の一貫性
   - zodによるランタイムバリデーション

4. **パフォーマンス最適化**
   - Server ComponentsとClient Componentsの適切な使い分け
   - 動的インポートによる必要なコードの遅延読み込み
   - キャッシュ戦略の最適化
   - バンドルサイズの最適化

### 最適化されたディレクトリ構造

```typescript
src/
├── app/
│   ├── (auth)/
│   │   ├── sign-in/
│   │   │   ├── [[...sign-in]]/
│   │   │   │   ├── page.tsx
│   │   │   │   └── SignInPage.tsx
│   │   │   └── layout.tsx
│   │   └── employee-auth/
│   │       ├── _components/
│   │       │   ├── EmployeeSelector/
│   │       │   └── PasscodeForm/
│   │       ├── actions/
│   │       │   └── updateEmployeeSession.ts
│   │       ├── page.tsx
│   │       └── EmployeeAuthPage.tsx
│   ├── (dashboard)/
│   │   ├── admin/
│   │   │   ├── [id]/  // 従業員個別ページ
│   │   │   │   ├── timecard/
│   │   │   │   │   ├── _components/
│   │   │   │   │   ├── actions/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── TimeCardPage.tsx
│   │   │   │   ├── page.tsx
│   │   │   │   └── EmployeeDetailPage.tsx
│   │   │   ├── employees/
│   │   │   │   ├── _components/
│   │   │   │   ├── actions/
│   │   │   │   ├── page.tsx
│   │   │   │   └── EmployeesPage.tsx
│   │   │   ├── page.tsx
│   │   │   └── AdminPage.tsx
│   │   └── timecard/
│   │       ├── _components/
│   │       ├── actions/
│   │       ├── page.tsx
│   │       └── TimeCardPage.tsx
│   ├── (marketing)/
│   │   ├── _components/
│   │   ├── page.tsx
│   │   └── MarketingPage.tsx
│   ├── layout.tsx
│   ├── not-found.tsx
│   └── error.tsx
├── features/
│   ├── employee/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── types/
│   ├── timecard/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── types/
│   └── admin/
│       ├── components/
│       ├── hooks/
│       └── types/
├── components/
│   ├── ui/
│   └── common/
├── lib/
│   ├── auth/
│   ├── db/
│   └── utils/
├── types/
├── styles/
└── middleware.ts
```

### ディレクトリ構造の意図

1. **app/ディレクトリ**

   - Next.js App Routerの規約に従ったルーティング構造
   - 各ページごとにServer ComponentとClient Componentを明確に分離
   - ページ固有のコンポーネントは\_componentsディレクトリに配置
   - Server Actionsはactionsディレクトリに集約
   - エラーハンドリングとメタデータの一元管理

2. **features/ディレクトリ**

   - ドメインロジックとビジネスロジックの集約
   - 再利用可能なコンポーネントとカスタムフックの管理
   - 機能ごとの型定義を独立して管理
   - コンポーネントの責務を明確に分離
   - テスト容易性の確保

3. **components/ディレクトリ**

   - UIライブラリのコンポーネント（ui/）
   - アプリケーション共通のコンポーネント（common/）
   - ドメインに依存しない汎用的なコンポーネント
   - 再利用性の高いコンポーネントの集約

4. **lib/ディレクトリ**
   - ユーティリティ関数の集約
   - データベース接続やAPI呼び出しの共通処理
   - 認証関連の共通処理
   - 日付処理やバリデーションなどの共通ロジック

### コンポーネント設計の原則

1. **ページコンポーネントの分離**

```typescript
// app/(dashboard)/admin/employees/page.tsx
export default async function Page() {
  // データフェッチなど
  return <EmployeesPage data={data} />;
}

// app/(dashboard)/admin/employees/EmployeesPage.tsx
export const EmployeesPage: FC<Props> = ({ data }) => {
  // クライアントサイドのロジック
  return (/* UI実装 */);
};
```

2. **Server Actionsの配置**

```typescript
// app/(dashboard)/admin/employees/actions/createEmployee.ts
'use server';

export async function createEmployee(data: CreateEmployeeData) {
  // バリデーションとデータ作成ロジック
}
```

3. **型定義の管理**

```typescript
// features/employee/types/index.ts
export type Employee = {
  id: string;
  name: string;
  hourlyWage: number;
  isAdmin: boolean;
};

// types/index.ts
export type { Employee } from '@/features/employee/types';
```

### メタデータとSEO対策

1. **動的メタデータ生成**

```typescript
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const employee = await getEmployee(params.id);

  return {
    title: `${employee.name} - 従業員情報`,
    description: `${employee.name}さんの勤怠情報`,
    openGraph: {
      title: `${employee.name} - 従業員情報`,
      description: `${employee.name}さんの勤怠情報`,
      type: 'profile',
      modifiedTime: employee.updatedAt,
    },
  };
}
```

### 禁止事項

1. **型定義の重複**

   - 各機能の型定義は必ずfeatures/{domain}/types/に配置
   - 型の再定義は禁止
   - 必要な場合は既存の型を拡張

2. **Server ActionsとClient Componentsの混在**

   - Server Actionsは必ずactionsディレクトリに配置
   - Client Componentsは'use client'ディレクティブを明示的に使用
   - 適切なエラーハンドリングの実装

3. **不適切なディレクトリ構造**

   - featuresディレクトリ外でのビジネスロジックの実装
   - ページコンポーネント内でのServer Actions定義
   - 共通コンポーネントのfeatures内での定義
   - 型定義の重複や散在

4. **パフォーマンスに影響を与える実装**
   - 不必要なClient Components化
   - 過度な状態管理の使用
   - 適切なキャッシュ戦略の欠如
   - 最適化されていないデータフェッチ

### 型定義の構造と参照

1. **ドメインモデルの型定義**

   ```typescript
   // features/timecard/types/index.ts
   export type TimeRecord = {
     id: string;
     employeeId: string;
     date: Date;
     clockIn: Date | null;
     clockOut: Date | null;
     breakStart: Date | null;
     breakEnd: Date | null;
     totalWorkMinutes: number;
     totalBreakMinutes: number;
     createdAt: Date;
     updatedAt: Date;
   };
   ```

   - 基本的なエンティティの型定義は`features/{domain}/types/`に配置
   - アプリケーション全体で再利用される型を定義
   - データモデルに関連する型はここで定義

2. **型の再エクスポート**

   ```typescript
   // types/index.ts
   export type { Company } from '@/features/company/types';
   export type { Employee } from '@/features/employee/types';
   export type { TimeRecord, WorkStatus } from '@/features/timecard/types';
   ```

   - ルートの`types/index.ts`で全ての基本型を再エクスポート
   - アプリケーション全体からの参照は`@/types`を通して行う
   - 型定義の一元管理と参照の簡素化

3. **機能固有の型定義**

   ```typescript
   // app/(dashboard)/timecard/actions/types.ts
   import type { Employee, TimeRecord } from '@/types';

   export type TimeRecordActionResponse = {
     success: boolean;
     error?: string;
   };

   export type GetEmployeesResponse = {
     success: boolean;
     data?: {
       employees: Employee[];
       timeRecords: TimeRecord[];
     };
     error?: string;
   };
   ```

   - 特定の機能やアクションに固有の型は、その機能のディレクトリ内に定義
   - レスポンス型、UI状態の型、バリデーション型など
   - 基本型は`@/types`から参照

4. **型定義の参照規則**

   - ドメインモデルの型は`@/types`から参照

   ```typescript
   import type { Employee, TimeRecord } from '@/types';
   ```

   - 機能固有の型は相対パスで参照

   ```typescript
   import type { TimeRecordActionResponse } from './types';
   ```

   - 他の機能の型を直接参照することは禁止

   ```typescript
   // ❌ 禁止
   import type { Employee } from '@/features/employee/types';
   // ⭕️ 正しい
   import type { Employee } from '@/types';
   ```

5. **命名規則**
   - レスポンス型は`〇〇Response`
   - リクエスト型は`〇〇Request`
   - アクション型は`〇〇Action`
   - 表示用データ型は`〇〇DisplayData`
   - バリデーション型は`〇〇Validation`

この型定義の構造により：

- 型の一貫性を保持
- 重複を防止
- 変更管理を容易に
- コード補完とエラーチェックの向上
  が実現できます。

### コードレビューチェックリスト

1. **型定義の確認**

   - [ ] 全ての型とプロパティにJSDocコメントが付与されているか
   - [ ] ユーティリティ関数と型にJSDocコメントが付与されているか
   - [ ] 基本型は`@/types`から適切にインポートされているか
   - [ ] 型の命名が規約に従っているか（Response, Request, Action, DisplayData, Validationなど）

2. **ファイル構成の確認**

   - [ ] 機能ごとに適切にファイルが分割されているか
   - [ ] 共通ロジックが適切に分離されているか
   - [ ] `index.ts`で適切に再エクスポートされているか
   - [ ] 不要なファイルが残っていないか

3. **インポートの確認**

   - [ ] ページコンポーネントでのインポートが適切か
   - [ ] 型のインポートが適切か（`type`修飾子の使用）
   - [ ] 相対パスでのインポートが適切か
   - [ ] バレルインポートが適切に使用されているか

4. **機能の網羅性**

   - [ ] 要件で定義された全ての機能が実装されているか
   - [ ] 各機能が適切に分離されているか
   - [ ] 機能間の依存関係が適切か
   - [ ] テストが必要な機能に対してテストが実装されているか

5. **エラーハンドリング**

   - [ ] 各アクションで適切なエラーハンドリングが実装されているか
   - [ ] エラーメッセージが統一されているか
   - [ ] 型安全なレスポンスが返却されているか
   - [ ] エラー発生時のユーザー体験が考慮されているか

6. **認証とバリデーション**

   - [ ] 各アクションで認証チェックが実装されているか
   - [ ] データの関連性チェックが実装されているか
   - [ ] 状態遷移の妥当性チェックが実装されているか
   - [ ] バリデーションエラーが適切にハンドリングされているか

7. **コードスタイル**

   - [ ] 'use server'ディレクティブが適切に配置されているか
   - [ ] 命名規則が一貫しているか
   - [ ] コメントが適切に記述されているか
   - [ ] コードフォーマットが統一されているか

8. **パフォーマンス**

   - [ ] 不要な再レンダリングが発生していないか
   - [ ] データフェッチが最適化されているか
   - [ ] キャッシュが適切に使用されているか
   - [ ] バンドルサイズへの影響が考慮されているか

9. **セキュリティ**

   - [ ] 認証・認可が適切に実装されているか
   - [ ] データの検証が適切に行われているか
   - [ ] 機密情報の扱いが適切か
   - [ ] XSS対策が実装されているか

10. **アクセシビリティ**
    - [ ] セマンティックなHTML構造になっているか
    - [ ] キーボード操作に対応しているか
    - [ ] WAI-ARIAが適切に使用されているか
    - [ ] カラーコントラストが適切か

このチェックリストは、コードレビュー時に以下の目的で使用します：

- コードの品質保証
- 一貫性の確保
- セキュリティの担保
- パフォーマンスの最適化
- アクセシビリティの確保

各項目は、プロジェクトの要件や状況に応じて適宜カスタマイズしてください。
