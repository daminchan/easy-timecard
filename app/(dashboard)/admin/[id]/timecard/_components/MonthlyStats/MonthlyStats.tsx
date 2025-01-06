'use client';

import { FC } from 'react';
import { type Employee, type TimeRecord } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Coffee, Calendar, DollarSign } from 'lucide-react';

type Props = {
  /** 従業員情報 */
  employee: Employee;
  /** 勤怠記録 */
  timeRecords: TimeRecord[];
};

export const MonthlyStats: FC<Props> = ({ employee, timeRecords }) => {
  // 月間の集計を計算
  const calculateMonthlyStats = () => {
    let totalWorkMinutes = 0;
    let totalBreakMinutes = 0;
    let workDays = 0;

    timeRecords.forEach((record) => {
      if (record.clockIn && record.clockOut) {
        const workMinutes =
          (new Date(record.clockOut).getTime() - new Date(record.clockIn).getTime()) / (1000 * 60);

        const breakMinutes =
          record.breakStart && record.breakEnd
            ? (new Date(record.breakEnd).getTime() - new Date(record.breakStart).getTime()) /
              (1000 * 60)
            : 0;

        totalWorkMinutes += workMinutes - breakMinutes;
        totalBreakMinutes += breakMinutes;
        workDays += 1;
      }
    });

    const totalWage = Math.floor((totalWorkMinutes / 60) * employee.hourlyWage);

    return {
      totalWorkHours: Math.floor(totalWorkMinutes / 60),
      totalWorkMinutes: Math.floor(totalWorkMinutes % 60),
      totalBreakHours: Math.floor(totalBreakMinutes / 60),
      totalBreakMinutes: Math.floor(totalBreakMinutes % 60),
      workDays,
      totalWage,
    };
  };

  const stats = calculateMonthlyStats();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">総勤務時間</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.totalWorkHours}時間{stats.totalWorkMinutes}分
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">総休憩時間</CardTitle>
          <Coffee className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.totalBreakHours}時間{stats.totalBreakMinutes}分
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">出勤日数</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.workDays}日</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">給与目安</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">¥{stats.totalWage.toLocaleString()}</div>
        </CardContent>
      </Card>
    </div>
  );
};
