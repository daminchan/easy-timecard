'use client';

import { FC, useState } from 'react';
import { type Employee, type TimeRecord } from '@/types';
import { EmployeeList } from './_components/EmployeeList';
import { TimeCardModal } from './_components/TimeCardModal';
import { Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { type TimeRecordActionResponse } from './actions/types';

type Props = {
  initialEmployees: Employee[];
  initialTimeRecords: TimeRecord[];
  clockIn: (employeeId: string) => Promise<TimeRecordActionResponse>;
  startBreak: (employeeId: string) => Promise<TimeRecordActionResponse>;
  endBreak: (employeeId: string) => Promise<TimeRecordActionResponse>;
  clockOut: (employeeId: string) => Promise<TimeRecordActionResponse>;
};

export const TimeCardPage: FC<Props> = ({
  initialEmployees,
  initialTimeRecords,
  clockIn,
  startBreak,
  endBreak,
  clockOut,
}) => {
  const { toast } = useToast();
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showTimeCheck, setShowTimeCheck] = useState(false);
  const [timeRecords, setTimeRecords] = useState<TimeRecord[]>(initialTimeRecords);

  const getCurrentTime = () => {
    const now = new Date();
    return {
      time: now.toLocaleTimeString('ja-JP', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      date: now.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
      }),
    };
  };

  const handleClockIn = async (employee: Employee) => {
    const result = await clockIn(employee.id);
    if (result.success && result.data) {
      setTimeRecords((prev) => [...prev, result.data!]);
      toast({
        title: '出勤を記録しました',
        description: `${employee.name}さんの出勤を記録しました。`,
      });
    } else {
      toast({
        title: 'エラー',
        description: result.error ?? '出勤の記録に失敗しました。',
        variant: 'destructive',
      });
    }
  };

  const handleStartBreak = async (employee: Employee) => {
    const result = await startBreak(employee.id);
    if (result.success && result.data) {
      setTimeRecords((prev) =>
        prev.map((record) => (record.id === result.data!.id ? result.data! : record))
      );
      toast({
        title: '休憩開始を記録しました',
        description: `${employee.name}さんの休憩開始を記録しました。`,
      });
    } else {
      toast({
        title: 'エラー',
        description: result.error ?? '休憩開始の記録に失敗しました。',
        variant: 'destructive',
      });
    }
  };

  const handleEndBreak = async (employee: Employee) => {
    const result = await endBreak(employee.id);
    if (result.success && result.data) {
      setTimeRecords((prev) =>
        prev.map((record) => (record.id === result.data!.id ? result.data! : record))
      );
      toast({
        title: '休憩終了を記録しました',
        description: `${employee.name}さんの休憩終了を記録しました。`,
      });
    } else {
      toast({
        title: 'エラー',
        description: result.error ?? '休憩終了の記録に失敗しました。',
        variant: 'destructive',
      });
    }
  };

  const handleClockOut = async (employee: Employee) => {
    const result = await clockOut(employee.id);
    if (result.success && result.data) {
      setTimeRecords((prev) =>
        prev.map((record) => (record.id === result.data!.id ? result.data! : record))
      );
      toast({
        title: '退勤を記録しました',
        description: `${employee.name}さんの退勤を記録しました。`,
      });
    } else {
      toast({
        title: 'エラー',
        description: result.error ?? '退勤の記録に失敗しました。',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        {/* ヘッダーセクション */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">タイムカード</h1>
              <p className="mt-1 text-sm text-gray-500">{getCurrentTime().date}</p>
            </div>
            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowTimeCheck(true)}
              className="flex items-center gap-2 rounded-lg bg-primary-50 px-6 py-3 hover:bg-primary-100"
            >
              <Clock className="h-5 w-5 text-primary-600" />
              <span className="text-lg font-bold text-primary-600">現在時刻を確認</span>
            </Button>
          </div>
        </div>

        {/* 従業員一覧セクション */}
        <div className="rounded-lg bg-white p-6 shadow-md">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">従業員一覧</h2>
            <div className="flex gap-2">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-100" />
                <span className="text-sm text-gray-600">勤務中</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-yellow-100" />
                <span className="text-sm text-gray-600">休憩中</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-blue-100" />
                <span className="text-sm text-gray-600">退勤済</span>
              </div>
            </div>
          </div>
          <EmployeeList
            employees={initialEmployees}
            timeRecords={timeRecords}
            onSelectEmployee={setSelectedEmployee}
          />
        </div>
      </div>

      {/* 時刻確認モーダル */}
      <Dialog open={showTimeCheck} onOpenChange={setShowTimeCheck}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">現在時刻の確認</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-6">
            <div className="mb-8 flex flex-col items-center">
              <div className="mb-6 rounded-full bg-primary-50 p-6">
                <Clock className="h-12 w-12 text-primary-600" />
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-gray-900">{getCurrentTime().time}</p>
                <p className="mt-2 text-sm text-gray-500">{getCurrentTime().date}</p>
              </div>
            </div>
            <Button
              size="lg"
              onClick={() => setShowTimeCheck(false)}
              className="h-14 text-lg font-medium w-full max-w-xs"
            >
              閉じる
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 打刻モーダル */}
      {selectedEmployee && (
        <TimeCardModal
          isOpen={!!selectedEmployee}
          employee={selectedEmployee}
          timeRecord={timeRecords.find((record) => record.employeeId === selectedEmployee.id)}
          onClose={() => setSelectedEmployee(null)}
          onClockIn={async () => {
            await handleClockIn(selectedEmployee);
            setSelectedEmployee(null);
          }}
          onBreakStart={async () => {
            await handleStartBreak(selectedEmployee);
            setSelectedEmployee(null);
          }}
          onBreakEnd={async () => {
            await handleEndBreak(selectedEmployee);
            setSelectedEmployee(null);
          }}
          onClockOut={async () => {
            await handleClockOut(selectedEmployee);
            setSelectedEmployee(null);
          }}
        />
      )}
    </>
  );
};
