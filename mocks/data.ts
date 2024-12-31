import { type Company, type Employee, type TimeRecord } from '@/types';

/** モック：企業データ */
export const mockCompany: Company = {
  id: 'company_1',
  name: '株式会社サンプル',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

/** モック：従業員データ */
export const mockEmployees: Employee[] = [
  {
    id: 'employee_1',
    companyId: 'company_1',
    name: '山田 太郎',
    hourlyWage: 1200,
    isAdmin: true,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'employee_2',
    companyId: 'company_1',
    name: '鈴木 花子',
    hourlyWage: 1000,
    isAdmin: false,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'employee_3',
    companyId: 'company_1',
    name: '佐藤 次郎',
    hourlyWage: 1000,
    isAdmin: false,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

/** モック：本日の勤怠記録 */
export const mockTodayTimeRecords: TimeRecord[] = [
  {
    id: 'record_1',
    employeeId: 'employee_1',
    date: new Date(),
    clockIn: new Date(new Date().setHours(9, 0, 0, 0)),
    breakStart: new Date(new Date().setHours(12, 0, 0, 0)),
    breakEnd: new Date(new Date().setHours(13, 0, 0, 0)),
    clockOut: null,
    totalWorkMinutes: 180,
    totalBreakMinutes: 60,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'record_2',
    employeeId: 'employee_2',
    date: new Date(),
    clockIn: new Date(new Date().setHours(8, 30, 0, 0)),
    breakStart: null,
    breakEnd: null,
    clockOut: null,
    totalWorkMinutes: 210,
    totalBreakMinutes: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
