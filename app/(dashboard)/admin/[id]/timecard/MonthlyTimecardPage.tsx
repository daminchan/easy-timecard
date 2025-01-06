'use client';

import { FC } from 'react';
import { type Employee, type TimeRecord } from '@/types';
import { MonthlyTimecard } from './_components/MonthlyTimecard/MonthlyTimecard';

type Props = {
  /** 従業員情報 */
  employee: Employee;
  /** 勤怠記録 */
  timeRecords: TimeRecord[];
  /** 表示する月 */
  currentMonth: Date;
};

export const MonthlyTimecardPage: FC<Props> = ({ employee, timeRecords, currentMonth }) => {
  return (
    <MonthlyTimecard employee={employee} timeRecords={timeRecords} currentMonth={currentMonth} />
  );
};
