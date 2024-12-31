'use client';

import { FC, useState } from 'react';
import { type Employee } from '@/types';
import { EmployeeList } from './_components/EmployeeList';
import { TimeCardModal } from './_components/TimeCardModal';
import { mockEmployees, mockTodayTimeRecords } from '@/mocks/data';
import { Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export const TimeCardPage: FC = () => {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showTimeCheck, setShowTimeCheck] = useState(false);

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
            employees={mockEmployees}
            timeRecords={mockTodayTimeRecords}
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
          timeRecord={mockTodayTimeRecords.find(
            (record) => record.employeeId === selectedEmployee.id
          )}
          onClose={() => setSelectedEmployee(null)}
          onClockIn={() => {
            console.log('Clock in:', selectedEmployee);
            setSelectedEmployee(null);
          }}
          onBreakStart={() => {
            console.log('Break start:', selectedEmployee);
            setSelectedEmployee(null);
          }}
          onBreakEnd={() => {
            console.log('Break end:', selectedEmployee);
            setSelectedEmployee(null);
          }}
          onClockOut={() => {
            console.log('Clock out:', selectedEmployee);
            setSelectedEmployee(null);
          }}
        />
      )}
    </>
  );
};
