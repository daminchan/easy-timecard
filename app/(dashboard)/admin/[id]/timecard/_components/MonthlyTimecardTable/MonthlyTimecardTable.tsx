'use client';

import { FC, useState } from 'react';
import { type Employee, type TimeRecord } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { format, eachDayOfInterval, startOfMonth, endOfMonth } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { TimeRecordDialog } from './TimeRecordDialog';
import { DeleteDialog } from './DeleteDialog';
import { useToast } from '@/hooks/use-toast';
import { createTimeRecord, updateTimeRecord, deleteTimeRecord } from '../../actions/index';

type Props = {
  /** 従業員情報 */
  employee: Employee;
  /** 勤怠記録 */
  timeRecords: TimeRecord[];
  /** 表示する月 */
  currentMonth: Date;
};

export const MonthlyTimecardTable: FC<Props> = ({ employee, timeRecords, currentMonth }) => {
  const { toast } = useToast();
  const [selectedRecord, setSelectedRecord] = useState<TimeRecord | null>(null);
  const [recordToDelete, setRecordToDelete] = useState<TimeRecord | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // 月の日付一覧を生成
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  // 勤務時間の計算
  const calculateWorkHours = (timeRecord: TimeRecord) => {
    if (!timeRecord.clockIn || !timeRecord.clockOut) return null;

    let totalMinutes = 0;
    const clockInTime = new Date(timeRecord.clockIn);
    const clockOutTime = new Date(timeRecord.clockOut);

    // 休憩時間を計算
    const breakMinutes =
      timeRecord.breakStart && timeRecord.breakEnd
        ? (new Date(timeRecord.breakEnd).getTime() - new Date(timeRecord.breakStart).getTime()) /
          (1000 * 60)
        : 0;

    // 総勤務時間（分）を計算
    totalMinutes = (clockOutTime.getTime() - clockInTime.getTime()) / (1000 * 60) - breakMinutes;

    // 時間と分に変換
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);

    return `${hours}時間${minutes}分`;
  };

  // 勤怠記録を追加
  const handleCreate = async (data: {
    clockIn: string;
    clockOut: string;
    breakStart: string;
    breakEnd: string;
  }) => {
    if (!selectedDate) return;

    const result = await createTimeRecord(employee.id, {
      ...data,
      date: selectedDate,
    });

    if (result.success) {
      toast({
        title: '追加完了',
        description: '勤怠記録を追加しました。',
      });
      setShowCreateDialog(false);
    } else {
      toast({
        title: 'エラー',
        description: result.error || '勤怠記録の追加に失敗しました。',
        variant: 'destructive',
      });
    }
  };

  // 勤怠記録を更新
  const handleUpdate = async (data: {
    clockIn: string;
    clockOut: string;
    breakStart: string;
    breakEnd: string;
  }) => {
    if (!selectedRecord) return;

    const result = await updateTimeRecord(selectedRecord.id, {
      ...data,
      date: selectedRecord.date,
    });

    if (result.success) {
      toast({
        title: '更新完了',
        description: '勤怠記録を更新しました。',
      });
      setSelectedRecord(null);
    } else {
      toast({
        title: 'エラー',
        description: result.error || '勤怠記録の更新に失敗しました。',
        variant: 'destructive',
      });
    }
  };

  // 勤怠記録を削除
  const handleDelete = async () => {
    if (!recordToDelete) return;

    const result = await deleteTimeRecord(recordToDelete.id);

    if (result.success) {
      toast({
        title: '削除完了',
        description: '勤怠記録を削除しました。',
      });
      setRecordToDelete(null);
    } else {
      toast({
        title: 'エラー',
        description: result.error || '勤怠記録の削除に失敗しました。',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button onClick={() => setShowCreateDialog(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            勤怠を記録
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>日付</TableHead>
              <TableHead>出勤</TableHead>
              <TableHead>退勤</TableHead>
              <TableHead>休憩</TableHead>
              <TableHead>勤務時間</TableHead>
              <TableHead className="w-[100px]">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {daysInMonth.map((date) => {
              const timeRecord = timeRecords.find(
                (record) =>
                  format(new Date(record.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
              );

              return (
                <TableRow key={date.toISOString()}>
                  <TableCell>{format(date, 'M/d (E)', { locale: ja })}</TableCell>
                  <TableCell>
                    {timeRecord?.clockIn ? format(new Date(timeRecord.clockIn), 'HH:mm') : '-'}
                  </TableCell>
                  <TableCell>
                    {timeRecord?.clockOut ? format(new Date(timeRecord.clockOut), 'HH:mm') : '-'}
                  </TableCell>
                  <TableCell>
                    {timeRecord?.breakStart && timeRecord?.breakEnd
                      ? `${format(new Date(timeRecord.breakStart), 'HH:mm')} - ${format(
                          new Date(timeRecord.breakEnd),
                          'HH:mm'
                        )}`
                      : '-'}
                  </TableCell>
                  <TableCell>{timeRecord ? calculateWorkHours(timeRecord) : '-'}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {timeRecord ? (
                        <>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setSelectedRecord(timeRecord)}
                            className="h-8 w-8"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setRecordToDelete(timeRecord)}
                            className="h-8 w-8 text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedDate(date);
                            setShowCreateDialog(true);
                          }}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          記録
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* 勤怠記録作成/編集ダイアログ */}
      <TimeRecordDialog
        open={showCreateDialog || !!selectedRecord}
        onClose={() => {
          setShowCreateDialog(false);
          setSelectedRecord(null);
          setSelectedDate(null);
        }}
        onSubmit={selectedRecord ? handleUpdate : handleCreate}
        defaultValues={
          selectedRecord && selectedRecord.clockIn && selectedRecord.clockOut
            ? {
                clockIn: format(new Date(selectedRecord.clockIn), 'HH:mm'),
                clockOut: format(new Date(selectedRecord.clockOut), 'HH:mm'),
                breakStart: selectedRecord.breakStart
                  ? format(new Date(selectedRecord.breakStart), 'HH:mm')
                  : '',
                breakEnd: selectedRecord.breakEnd
                  ? format(new Date(selectedRecord.breakEnd), 'HH:mm')
                  : '',
              }
            : undefined
        }
      />

      {/* 削除確認ダイアログ */}
      <DeleteDialog
        open={!!recordToDelete}
        onClose={() => setRecordToDelete(null)}
        onConfirm={handleDelete}
        date={recordToDelete ? new Date(recordToDelete.date) : null}
      />
    </>
  );
};
