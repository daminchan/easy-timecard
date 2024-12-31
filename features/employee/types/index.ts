/** 従業員情報 */
export type Employee = {
  /** 従業員ID */
  id: string;
  /** 所属企業ID */
  companyId: string;
  /** 従業員名 */
  name: string;
  /** 時給 */
  hourlyWage: number;
  /** 管理者権限 */
  isAdmin: boolean;
  /** 在籍状態 */
  isActive: boolean;
  /** 作成日時 */
  createdAt: Date;
  /** 更新日時 */
  updatedAt: Date;
};
