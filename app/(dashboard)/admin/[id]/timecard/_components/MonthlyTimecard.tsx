// 'use client';

// import { FC, useState } from 'react';
// import { type Employee, type TimeRecord } from '@/types';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table';
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import {
//   ChevronLeft,
//   ChevronRight,
//   Pencil,
//   Trash2,
//   Plus,
//   Clock,
//   Coffee,
//   Calendar,
//   DollarSign,
// } from 'lucide-react';
// import { format, addMonths, subMonths, startOfMonth, endOfMonth } from 'date-fns';
// import { ja } from 'date-fns/locale';
// import { useRouter } from 'next/navigation';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from '@/components/ui/dialog';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';

// import { useToast } from '@/hooks/use-toast';
// import { ScrollArea } from '@/components/ui/scroll-area';
// import { updateTimeRecord } from '../actions';
// import { deleteTimeRecord } from '../actions';
// import { createTimeRecord } from '../actions';

// type Props = {
//   /** 従業員情報 */
//   employee: Employee;
//   /** 勤怠記録 */
//   timeRecords: TimeRecord[];
//   /** 表示する月 */
//   currentMonth: Date;
// };

// type TimeRecordFormData = {
//   clockIn: string;
//   clockOut: string;
//   breakStart: string;
//   breakEnd: string;
// };

// export const MonthlyTimecard: FC<Props> = ({ employee, timeRecords, currentMonth }) => {
//   const router = useRouter();
//   const { toast } = useToast();
//   const [selectedRecord, setSelectedRecord] = useState<TimeRecord | null>(null);
//   const [showEditDialog, setShowEditDialog] = useState(false);
//   const [showDeleteDialog, setShowDeleteDialog] = useState(false);
//   const [showCreateDialog, setShowCreateDialog] = useState(false);
//   const [selectedDate, setSelectedDate] = useState<Date | null>(null);

//   // 勤務時間の計算
//   const calculateWorkHours = (timeRecord: TimeRecord) => {
//     if (!timeRecord.clockIn || !timeRecord.clockOut) return null;

//     let totalMinutes = 0;
//     const clockInTime = new Date(timeRecord.clockIn);
//     const clockOutTime = new Date(timeRecord.clockOut);

//     // 休憩時間を計算
//     const breakMinutes =
//       timeRecord.breakStart && timeRecord.breakEnd
//         ? (new Date(timeRecord.breakEnd).getTime() - new Date(timeRecord.breakStart).getTime()) /
//           (1000 * 60)
//         : 0;

//     // 総勤務時間（分）を計算
//     totalMinutes = (clockOutTime.getTime() - clockInTime.getTime()) / (1000 * 60) - breakMinutes;

//     // 時間と分に変換
//     const hours = Math.floor(totalMinutes / 60);
//     const minutes = Math.floor(totalMinutes % 60);

//     return `${hours}時間${minutes}分`;
//   };

//   // 月を切り替える
//   const handleMonthChange = (newMonth: Date) => {
//     router.push(`/admin/${employee.id}/timecard?month=${format(newMonth, 'yyyy-MM')}`);
//   };

//   // 編集ダイアログを開く
//   const handleEdit = (record: TimeRecord) => {
//     setSelectedRecord(record);
//     setShowEditDialog(true);
//   };

//   // 削除ダイアログを開く
//   const handleDelete = (record: TimeRecord) => {
//     setSelectedRecord(record);
//     setShowDeleteDialog(true);
//   };

//   // 勤怠記録を更新
//   const handleUpdate = async (data: TimeRecordFormData) => {
//     if (!selectedRecord) return;

//     try {
//       await updateTimeRecord(selectedRecord.id, {
//         ...data,
//         date: selectedRecord.date,
//       });
//       toast({
//         title: '更新完了',
//         description: '勤怠記録を更新しました。',
//       });
//       setShowEditDialog(false);
//     } catch (error) {
//       console.error('Failed to update time record:', error);
//       toast({
//         title: 'エラー',
//         description: '勤怠記録の更新に失敗しました。',
//         variant: 'destructive',
//       });
//     }
//   };

//   // 勤怠記録を削除
//   const handleConfirmDelete = async () => {
//     if (!selectedRecord) return;

//     try {
//       await deleteTimeRecord(selectedRecord.id);
//       toast({
//         title: '削除完了',
//         description: '勤怠記録を削除しました。',
//       });
//       setShowDeleteDialog(false);
//     } catch (error) {
//       console.error('Failed to delete time record:', error);
//       toast({
//         title: 'エラー',
//         description: '勤怠記録の削除に失敗しました。',
//         variant: 'destructive',
//       });
//     }
//   };

//   // 勤怠記録を追加
//   const handleCreate = async (data: TimeRecordFormData) => {
//     if (!selectedDate) return;

//     try {
//       await createTimeRecord(employee.id, {
//         ...data,
//         date: selectedDate,
//       });
//       toast({
//         title: '追加完了',
//         description: '勤怠記録を追加しました。',
//       });
//       setShowCreateDialog(false);
//     } catch (error) {
//       console.error('Failed to create time record:', error);
//       toast({
//         title: 'エラー',
//         description: '勤怠記録の追加に失敗しました。',
//         variant: 'destructive',
//       });
//     }
//   };

//   // 月間の集計を計算
//   const calculateMonthlyStats = () => {
//     let totalWorkMinutes = 0;
//     let totalBreakMinutes = 0;
//     let workDays = 0;

//     timeRecords.forEach((record) => {
//       if (record.clockIn && record.clockOut) {
//         const workMinutes =
//           (new Date(record.clockOut).getTime() - new Date(record.clockIn).getTime()) / (1000 * 60);

//         const breakMinutes =
//           record.breakStart && record.breakEnd
//             ? (new Date(record.breakEnd).getTime() - new Date(record.breakStart).getTime()) /
//               (1000 * 60)
//             : 0;

//         totalWorkMinutes += workMinutes - breakMinutes;
//         totalBreakMinutes += breakMinutes;
//         workDays += 1;
//       }
//     });

//     const totalWage = Math.floor((totalWorkMinutes / 60) * employee.hourlyWage);

//     return {
//       totalWorkHours: Math.floor(totalWorkMinutes / 60),
//       totalWorkMinutes: Math.floor(totalWorkMinutes % 60),
//       totalBreakHours: Math.floor(totalBreakMinutes / 60),
//       totalBreakMinutes: Math.floor(totalBreakMinutes % 60),
//       workDays,
//       totalWage,
//     };
//   };

//   const monthlyStats = calculateMonthlyStats();

//   return (
//     <div className="container mx-auto py-8">
//       <div className="space-y-8">
//         {/* ヘッダー */}
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-2xl font-bold">{employee.name}の勤怠記録</h1>
//             <p className="text-muted-foreground">
//               {format(currentMonth, 'yyyy年M月', { locale: ja })}の勤怠管理
//             </p>
//           </div>
//           <div className="flex items-center gap-2">
//             <Button
//               variant="outline"
//               size="icon"
//               onClick={() => handleMonthChange(subMonths(currentMonth, 1))}
//             >
//               <ChevronLeft className="h-4 w-4" />
//             </Button>
//             <Button
//               variant="outline"
//               size="icon"
//               onClick={() => handleMonthChange(addMonths(currentMonth, 1))}
//             >
//               <ChevronRight className="h-4 w-4" />
//             </Button>
//           </div>
//         </div>

//         {/* 月間サマリー */}
//         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">総勤務時間</CardTitle>
//               <Clock className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">
//                 {monthlyStats.totalWorkHours}時間{monthlyStats.totalWorkMinutes}分
//               </div>
//               <p className="text-xs text-muted-foreground">
//                 休憩時間: {monthlyStats.totalBreakHours}時間{monthlyStats.totalBreakMinutes}分
//               </p>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">出勤日数</CardTitle>
//               <Calendar className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">{monthlyStats.workDays}日</div>
//               <p className="text-xs text-muted-foreground">
//                 {format(startOfMonth(currentMonth), 'M/d')} -{' '}
//                 {format(endOfMonth(currentMonth), 'M/d')}
//               </p>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">時給</CardTitle>
//               <DollarSign className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">¥{employee.hourlyWage.toLocaleString()}</div>
//               <p className="text-xs text-muted-foreground">基本時給</p>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">今月の給与</CardTitle>
//               <DollarSign className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">¥{monthlyStats.totalWage.toLocaleString()}</div>
//               <p className="text-xs text-muted-foreground">総勤務時間 × 時給</p>
//             </CardContent>
//           </Card>
//         </div>

//         {/* 勤怠記録テーブル */}
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0">
//             <div>
//               <CardTitle>勤怠記録一覧</CardTitle>
//               <CardDescription>日々の勤怠記録を管理できます</CardDescription>
//             </div>
//             <Button
//               onClick={() => {
//                 setSelectedDate(new Date(currentMonth));
//                 setShowCreateDialog(true);
//               }}
//               className="flex items-center gap-2"
//             >
//               <Plus className="h-4 w-4" />
//               勤怠記録を追加
//             </Button>
//           </CardHeader>
//           <CardContent>
//             <ScrollArea className="h-[600px]">
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>日付</TableHead>
//                     <TableHead>出勤時刻</TableHead>
//                     <TableHead>退勤時刻</TableHead>
//                     <TableHead>休憩時間</TableHead>
//                     <TableHead>合計勤務時間</TableHead>
//                     <TableHead className="w-[100px]">操作</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {timeRecords.map((record) => (
//                     <TableRow key={record.id}>
//                       <TableCell className="font-medium">
//                         {format(record.date, 'M/d (E)', { locale: ja })}
//                       </TableCell>
//                       <TableCell>
//                         {record.clockIn ? format(new Date(record.clockIn), 'HH:mm') : '-'}
//                       </TableCell>
//                       <TableCell>
//                         {record.clockOut ? format(new Date(record.clockOut), 'HH:mm') : '-'}
//                       </TableCell>
//                       <TableCell>
//                         {record.breakStart && record.breakEnd
//                           ? `${format(new Date(record.breakStart), 'HH:mm')}～${format(
//                               new Date(record.breakEnd),
//                               'HH:mm'
//                             )}`
//                           : '-'}
//                       </TableCell>
//                       <TableCell>{calculateWorkHours(record) ?? '-'}</TableCell>
//                       <TableCell>
//                         <div className="flex space-x-2">
//                           <Button
//                             variant="outline"
//                             size="icon"
//                             onClick={() => handleEdit(record)}
//                             className="h-8 w-8"
//                           >
//                             <Pencil className="h-4 w-4" />
//                           </Button>
//                           <Button
//                             variant="outline"
//                             size="icon"
//                             onClick={() => handleDelete(record)}
//                             className="h-8 w-8 text-red-500 hover:text-red-600"
//                           >
//                             <Trash2 className="h-4 w-4" />
//                           </Button>
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </ScrollArea>
//           </CardContent>
//         </Card>

//         {/* 追加ダイアログ */}
//         <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>勤怠記録の追加</DialogTitle>
//             </DialogHeader>
//             <form
//               onSubmit={(e) => {
//                 e.preventDefault();
//                 const formData = new FormData(e.currentTarget);
//                 handleCreate({
//                   clockIn: formData.get('clockIn') as string,
//                   clockOut: formData.get('clockOut') as string,
//                   breakStart: formData.get('breakStart') as string,
//                   breakEnd: formData.get('breakEnd') as string,
//                 });
//               }}
//               className="space-y-4"
//             >
//               <div className="space-y-2">
//                 <Label htmlFor="date">日付</Label>
//                 <Input
//                   id="date"
//                   name="date"
//                   type="date"
//                   defaultValue={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : undefined}
//                   onChange={(e) => setSelectedDate(new Date(e.target.value))}
//                   required
//                 />
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="clockIn">出勤時刻</Label>
//                   <Input id="clockIn" name="clockIn" type="time" />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="clockOut">退勤時刻</Label>
//                   <Input id="clockOut" name="clockOut" type="time" />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="breakStart">休憩開始</Label>
//                   <Input id="breakStart" name="breakStart" type="time" />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="breakEnd">休憩終了</Label>
//                   <Input id="breakEnd" name="breakEnd" type="time" />
//                 </div>
//               </div>
//               <DialogFooter>
//                 <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
//                   キャンセル
//                 </Button>
//                 <Button type="submit">追加</Button>
//               </DialogFooter>
//             </form>
//           </DialogContent>
//         </Dialog>

//         {/* 編集ダイアログ */}
//         <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>勤怠記録の編集</DialogTitle>
//             </DialogHeader>
//             <form
//               onSubmit={(e) => {
//                 e.preventDefault();
//                 const formData = new FormData(e.currentTarget);
//                 handleUpdate({
//                   clockIn: formData.get('clockIn') as string,
//                   clockOut: formData.get('clockOut') as string,
//                   breakStart: formData.get('breakStart') as string,
//                   breakEnd: formData.get('breakEnd') as string,
//                 });
//               }}
//               className="space-y-4"
//             >
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="clockIn">出勤時刻</Label>
//                   <Input
//                     id="clockIn"
//                     name="clockIn"
//                     type="time"
//                     defaultValue={
//                       selectedRecord?.clockIn
//                         ? format(new Date(selectedRecord.clockIn), 'HH:mm')
//                         : undefined
//                     }
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="clockOut">退勤時刻</Label>
//                   <Input
//                     id="clockOut"
//                     name="clockOut"
//                     type="time"
//                     defaultValue={
//                       selectedRecord?.clockOut
//                         ? format(new Date(selectedRecord.clockOut), 'HH:mm')
//                         : undefined
//                     }
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="breakStart">休憩開始</Label>
//                   <Input
//                     id="breakStart"
//                     name="breakStart"
//                     type="time"
//                     defaultValue={
//                       selectedRecord?.breakStart
//                         ? format(new Date(selectedRecord.breakStart), 'HH:mm')
//                         : undefined
//                     }
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="breakEnd">休憩終了</Label>
//                   <Input
//                     id="breakEnd"
//                     name="breakEnd"
//                     type="time"
//                     defaultValue={
//                       selectedRecord?.breakEnd
//                         ? format(new Date(selectedRecord.breakEnd), 'HH:mm')
//                         : undefined
//                     }
//                   />
//                 </div>
//               </div>
//               <DialogFooter>
//                 <Button type="button" variant="outline" onClick={() => setShowEditDialog(false)}>
//                   キャンセル
//                 </Button>
//                 <Button type="submit">保存</Button>
//               </DialogFooter>
//             </form>
//           </DialogContent>
//         </Dialog>

//         {/* 削除確認ダイアログ */}
//         <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>勤怠記録の削除</DialogTitle>
//             </DialogHeader>
//             <p>
//               {selectedRecord &&
//                 `${format(selectedRecord.date, 'yyyy年M月d日')}の勤怠記録を削除してもよろしいですか？`}
//             </p>
//             <DialogFooter>
//               <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
//                 キャンセル
//               </Button>
//               <Button variant="destructive" onClick={handleConfirmDelete}>
//                 削除
//               </Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>
//       </div>
//     </div>
//   );
// };
