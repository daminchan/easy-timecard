import { FC } from "react";
import { type Employee, type TimeRecord, type WorkStatus } from "@/types";
import { Clock, Coffee, LogOut } from "lucide-react";

type Props = {
  /** 従業員情報 */
  employee: Employee;
  /** 本日の勤怠記録 */
  timeRecord?: TimeRecord;
  /** クリック時のコールバック */
  onClick: () => void;
};

/** 従業員の勤務状態を判定する */
const getWorkStatus = (timeRecord?: TimeRecord): WorkStatus => {
  if (!timeRecord?.clockIn) return "not_started";
  if (timeRecord.clockOut) return "finished";
  if (timeRecord.breakStart && !timeRecord.breakEnd) return "break";
  return "working";
};

/** 勤務状態に応じた背景色を返す */
const getStatusColor = (status: WorkStatus): string => {
  switch (status) {
    case "not_started":
      return "border-gray-200 hover:border-gray-300 hover:bg-gray-50";
    case "working":
      return "border-green-200 bg-green-50 hover:bg-green-100";
    case "break":
      return "border-yellow-200 bg-yellow-50 hover:bg-yellow-100";
    case "finished":
      return "border-blue-200 bg-blue-50 hover:bg-blue-100";
    default:
      return "border-gray-200 hover:border-gray-300 hover:bg-gray-50";
  }
};

/** 勤務状態に応じたアイコンを返す */
const getStatusIcon = (status: WorkStatus) => {
  switch (status) {
    case "not_started":
      return Clock;
    case "working":
      return Clock;
    case "break":
      return Coffee;
    case "finished":
      return LogOut;
    default:
      return Clock;
  }
};

/** 勤務状態に応じたテキストを返す */
const getStatusText = (status: WorkStatus): string => {
  switch (status) {
    case "not_started":
      return "未出勤";
    case "working":
      return "勤務中";
    case "break":
      return "休憩中";
    case "finished":
      return "退勤済";
    default:
      return "未出勤";
  }
};

/** 勤務状態に応じたアイコン色を返す */
const getIconColor = (status: WorkStatus): string => {
  switch (status) {
    case "not_started":
      return "text-gray-400";
    case "working":
      return "text-green-500";
    case "break":
      return "text-yellow-500";
    case "finished":
      return "text-blue-500";
    default:
      return "text-gray-400";
  }
};

export const EmployeeCard: FC<Props> = ({ employee, timeRecord, onClick }) => {
  const status = getWorkStatus(timeRecord);
  const statusColor = getStatusColor(status);
  const statusText = getStatusText(status);
  const iconColor = getIconColor(status);
  const Icon = getStatusIcon(status);

  return (
    <button
      onClick={onClick}
      className={`group flex w-full items-center gap-4 rounded-lg border p-4 transition-all ${statusColor}`}
    >
      <div className={`rounded-full p-2 transition-colors ${iconColor}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div className="flex flex-1 flex-col items-start">
        <span className="text-lg font-medium text-gray-900">
          {employee.name}
        </span>
        <span className="text-sm text-gray-600">{statusText}</span>
      </div>
      {timeRecord?.clockIn && (
        <div className="text-right">
          <div className="text-sm font-medium text-gray-900">
            {timeRecord.clockIn.toLocaleTimeString("ja-JP", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
          <div className="text-xs text-gray-500">出勤時刻</div>
        </div>
      )}
    </button>
  );
};
