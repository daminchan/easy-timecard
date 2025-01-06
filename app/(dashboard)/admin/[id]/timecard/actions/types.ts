/** アクションのレスポンス型 */
export type ActionResponse<T = void> = {
  /** 処理の成功可否 */
  success: boolean;
  /** 成功時のデータ */
  data?: T;
  /** エラー発生時のメッセージ */
  error?: string;
};

/** 勤怠記録フォームのデータ型 */
export type TimeRecordFormData = {
  /** 出勤時刻（HH:mm形式） */
  clockIn: string;
  /** 退勤時刻（HH:mm形式） */
  clockOut: string;
  /** 休憩開始時刻（HH:mm形式） */
  breakStart: string;
  /** 休憩終了時刻（HH:mm形式） */
  breakEnd: string;
  /** 勤務日 */
  date: Date;
};
