/** 企業の型定義 */
export type Company = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

/** 従業員の型定義 */
export type Employee = {
  id: string;
  companyId: string;
  name: string;
  hourlyWage: number;
  isAdmin: boolean;
  isActive: boolean;
  passcode: string;
  createdAt: Date;
  updatedAt: Date;
};

/** 勤怠記録の型定義 */
export type TimeRecord = {
  id: string;
  employeeId: string;
  date: Date;
  clockIn: Date | null;
  breakStart: Date | null;
  breakEnd: Date | null;
  clockOut: Date | null;
  totalWorkMinutes: number | null;
  totalBreakMinutes: number | null;
  createdAt: Date;
  updatedAt: Date;
};
