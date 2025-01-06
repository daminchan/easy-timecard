'use client';

import { FC } from 'react';
import { type Employee, type TimeRecord } from '@/types';
import { MonthlyTimecardTable } from '../MonthlyTimecardTable';
import { MonthlyStats } from '../MonthlyStats';
import { format, addMonths, subMonths } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Props = {
  /** 従業員情報 */
  employee: Employee;
  /** 勤怠記録 */
  timeRecords: TimeRecord[];
  /** 表示する月 */
  currentMonth: Date;
};

export const MonthlyTimecard: FC<Props> = ({ employee, timeRecords, currentMonth }) => {
  const router = useRouter();

  // 月を切り替える
  const handleMonthChange = (newMonth: Date) => {
    router.push(`/admin/${employee.id}/timecard?month=${format(newMonth, 'yyyy-MM')}`);
  };

  return (
    <div className="container mx-auto space-y-8 py-8">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{employee.name}の勤怠記録</h1>
          <p className="text-muted-foreground">
            {format(currentMonth, 'yyyy年M月', { locale: ja })}の勤怠管理
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleMonthChange(subMonths(currentMonth, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleMonthChange(addMonths(currentMonth, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* 月間サマリー */}
      <MonthlyStats employee={employee} timeRecords={timeRecords} />

      {/* 勤怠記録テーブル */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <MonthlyTimecardTable
          employee={employee}
          timeRecords={timeRecords}
          currentMonth={currentMonth}
        />
      </div>
    </div>
  );
};
