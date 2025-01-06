import type { Employee, TimeRecord, WorkStatus } from '@/types';

/** タイムカードアクションのレスポンス型 */
export type TimeRecordActionResponse = {
  /** 処理の成功可否 */
  success: boolean;
  /** 成功時の勤怠記録データ */
  data?: TimeRecord;
  /** エラー発生時のメッセージ */
  error?: string;
};

/** 従業員一覧取得のレスポンス型 */
export type GetEmployeesResponse = {
  /** 処理の成功可否 */
  success: boolean;
  /** 成功時のデータ */
  data?: {
    /** 従業員一覧 */
    employees: Employee[];
    /** 勤怠記録一覧 */
    timeRecords: TimeRecord[];
  };
  /** エラー発生時のメッセージ */
  error?: string;
};

/** タイムカードで実行可能なアクション */
export type TimeCardAction =
  | 'CLOCK_IN' // 出勤
  | 'START_BREAK' // 休憩開始
  | 'END_BREAK' // 休憩終了
  | 'CLOCK_OUT'; // 退勤

/** タイムカード表示用のデータ型 */
export type TimeCardDisplayData = {
  /** 従業員ID */
  employeeId: string;
  /** 現在の勤務状態 */
  status: WorkStatus;
  /** 関連する勤怠記録 */
  timeRecord?: TimeRecord;
};

/** 時刻のバリデーション結果 */
export type TimeValidation = {
  /** バリデーションの成功可否 */
  isValid: boolean;
  /** エラー発生時のメッセージ */
  error?: string;
};
