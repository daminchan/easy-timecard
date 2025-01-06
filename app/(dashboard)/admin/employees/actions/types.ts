import type { Employee, Company } from '@/types';

/** アクションのレスポンス型 */
export type ActionResponse<T> = {
  /** 処理の成功可否 */
  success: boolean;
  /** 成功時のデータ */
  data?: T;
  /** エラー発生時のメッセージ */
  error?: string;
};

/** 従業員作成時のデータ型 */
export type CreateEmployeeData = {
  /** 従業員名 */
  name: string;
  /** 時給 */
  hourlyWage: number;
  /** 管理者権限の有無 */
  isAdmin: boolean;
  /** パスコード（4桁） */
  passcode: string;
};

/** 従業員更新時のデータ型 */
export type UpdateEmployeeData = {
  /** 従業員ID */
  id: string;
  /** 従業員名 */
  name: string;
  /** 時給 */
  hourlyWage: number;
  /** 管理者権限の有無 */
  isAdmin: boolean;
};

/** 従業員一覧取得のレスポンス型 */
export type GetEmployeesResponse = ActionResponse<{
  /** 従業員一覧 */
  employees: Employee[];
}>;

/** 従業員削除のレスポンス型 */
export type DeleteEmployeeResponse = ActionResponse<void>;

/** 企業名更新のレスポンス型 */
export type UpdateCompanyResponse = ActionResponse<Company>;
