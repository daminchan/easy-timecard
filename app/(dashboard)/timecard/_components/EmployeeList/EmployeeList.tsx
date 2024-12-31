import { FC } from "react";
import { type Employee, type TimeRecord } from "@/types";
import { EmployeeCard } from "./EmployeeCard";

type Props = {
  /** 従業員リスト */
  employees: Employee[];
  /** 本日の勤怠記録リスト */
  timeRecords: TimeRecord[];
  /** 従業員選択時のコールバック */
  onSelectEmployee: (employee: Employee) => void;
};

export const EmployeeList: FC<Props> = ({
  employees,
  timeRecords,
  onSelectEmployee,
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {employees.map((employee) => (
        <EmployeeCard
          key={employee.id}
          employee={employee}
          timeRecord={timeRecords.find(
            (record) => record.employeeId === employee.id
          )}
          onClick={() => onSelectEmployee(employee)}
        />
      ))}
    </div>
  );
};
