/** 勤怠記録 */
export type TimeRecord = {
  /** 記録ID */
  id: string;
  /** 従業員ID */
  employeeId: string;
  /** 勤務日 */
  date: Date;
  /** 出勤時刻 */
  clockIn: Date | null;
  /** 休憩開始時刻 */
  breakStart: Date | null;
  /** 休憩終了時刻 */
  breakEnd: Date | null;
  /** 退勤時刻 */
  clockOut: Date | null;
  /** 総勤務時間（分） */
  totalWorkMinutes: number;
  /** 総休憩時間（分） */
  totalBreakMinutes: number;
  /** 作成日時 */
  createdAt: Date;
  /** 更新日時 */
  updatedAt: Date;
};

/** 従業員の勤務状態 */
export type WorkStatus = 'not_started' | 'working' | 'break' | 'finished';
