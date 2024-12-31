import { FC, useState } from "react";
import { type Employee, type TimeRecord } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Clock, Coffee, LogOut, AlertCircle } from "lucide-react";

type Props = {
  /** モーダルの表示状態 */
  isOpen: boolean;
  /** 選択された従業員 */
  employee: Employee;
  /** 本日の勤怠記録 */
  timeRecord?: TimeRecord;
  /** モーダルを閉じる時のコールバック */
  onClose: () => void;
  /** 出勤ボタンクリック時のコールバック */
  onClockIn: () => void;
  /** 休憩開始ボタンクリック時のコールバック */
  onBreakStart: () => void;
  /** 休憩終了ボタンクリック時のコールバック */
  onBreakEnd: () => void;
  /** 退勤ボタンクリック時のコールバック */
  onClockOut: () => void;
};

type ActionType = "出勤" | "休憩開始" | "休憩終了" | "退勤";

const getActionColor = (action: ActionType) => {
  switch (action) {
    case "出勤":
      return "bg-primary-50 text-primary-600";
    case "休憩開始":
    case "休憩終了":
      return "bg-yellow-50 text-yellow-600";
    case "退勤":
      return "bg-blue-50 text-blue-600";
    default:
      return "bg-gray-50 text-gray-600";
  }
};

const getActionIcon = (action: ActionType) => {
  switch (action) {
    case "出勤":
      return Clock;
    case "休憩開始":
    case "休憩終了":
      return Coffee;
    case "退勤":
      return LogOut;
    default:
      return AlertCircle;
  }
};

export const TimeCardModal: FC<Props> = ({
  isOpen,
  employee,
  timeRecord,
  onClose,
  onClockIn,
  onBreakStart,
  onBreakEnd,
  onClockOut,
}) => {
  const [confirmAction, setConfirmAction] = useState<ActionType | null>(null);

  // 現在時刻を取得
  const now = new Date();
  const currentTime = now.toLocaleTimeString("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleAction = (action: ActionType) => {
    setConfirmAction(action);
  };

  const handleConfirm = () => {
    if (!confirmAction) return;

    switch (confirmAction) {
      case "出勤":
        onClockIn();
        break;
      case "休憩開始":
        onBreakStart();
        break;
      case "休憩終了":
        onBreakEnd();
        break;
      case "退勤":
        onClockOut();
        break;
    }
    setConfirmAction(null);
  };

  const handleCancel = () => {
    setConfirmAction(null);
  };

  if (confirmAction) {
    const ActionIcon = getActionIcon(confirmAction);
    const actionColor = getActionColor(confirmAction);

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md min-h-[550px] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">
              {employee.name}さんの{confirmAction}
            </DialogTitle>
            <div className="mt-2 text-center text-sm text-gray-500">
              現在時刻: {currentTime}
            </div>
          </DialogHeader>
          <div className="flex-1 flex flex-col justify-center p-6">
            <div className="mb-8 flex flex-col items-center">
              <div className={`mb-6 rounded-full p-6 ${actionColor}`}>
                <ActionIcon className="h-12 w-12" />
              </div>
              <div className="text-center">
                <p className="mb-2 text-2xl font-bold text-gray-900">
                  {confirmAction}を記録しますか？
                </p>
                <p className="text-sm text-gray-500">
                  この操作は取り消せません
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                size="lg"
                onClick={handleCancel}
                className="h-14 text-lg font-medium"
              >
                キャンセル
              </Button>
              <Button
                size="lg"
                onClick={handleConfirm}
                className="h-14 text-lg font-medium"
              >
                確認
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md min-h-[550px]">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            {employee.name}さんの打刻
          </DialogTitle>
          <div className="mt-2 text-center text-sm text-gray-500">
            現在時刻: {currentTime}
          </div>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 p-4">
          <Button
            variant="outline"
            size="lg"
            className="h-32 flex-col gap-2 bg-white"
            onClick={() => handleAction("出勤")}
            disabled={!!timeRecord?.clockIn}
          >
            <div className="rounded-full bg-primary-50 p-3">
              <Clock className="h-6 w-6 text-primary-600" />
            </div>
            <span>出勤</span>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="h-32 flex-col gap-2 bg-white"
            onClick={() => handleAction("休憩開始")}
            disabled={
              !timeRecord?.clockIn ||
              !!timeRecord.clockOut ||
              !!timeRecord.breakStart
            }
          >
            <div className="rounded-full bg-yellow-50 p-3">
              <Coffee className="h-6 w-6 text-yellow-600" />
            </div>
            <span>休憩開始</span>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="h-32 flex-col gap-2 bg-white"
            onClick={() => handleAction("休憩終了")}
            disabled={
              !timeRecord?.breakStart ||
              !!timeRecord.breakEnd ||
              !!timeRecord.clockOut
            }
          >
            <div className="rounded-full bg-yellow-50 p-3">
              <Coffee className="h-6 w-6 text-yellow-600" />
            </div>
            <span>休憩終了</span>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="h-32 flex-col gap-2 bg-white"
            onClick={() => handleAction("退勤")}
            disabled={
              !timeRecord?.clockIn ||
              !!timeRecord.clockOut ||
              (!!timeRecord.breakStart && !timeRecord.breakEnd)
            }
          >
            <div className="rounded-full bg-blue-50 p-3">
              <LogOut className="h-6 w-6 text-blue-600" />
            </div>
            <span>退勤</span>
          </Button>
        </div>
        {timeRecord?.clockIn && (
          <div className="border-t px-4 py-3">
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">出勤時刻</span>
                <span className="font-medium">
                  {timeRecord.clockIn.toLocaleTimeString("ja-JP", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              {timeRecord.breakStart && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">休憩開始</span>
                  <span className="font-medium">
                    {timeRecord.breakStart.toLocaleTimeString("ja-JP", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              )}
              {timeRecord.breakEnd && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">休憩終了</span>
                  <span className="font-medium">
                    {timeRecord.breakEnd.toLocaleTimeString("ja-JP", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
