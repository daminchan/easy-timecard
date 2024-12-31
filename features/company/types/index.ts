/** 企業情報 */
export type Company = {
  /** Clerkで生成される企業ID */
  id: string;
  /** 企業名 */
  name: string;
  /** 作成日時 */
  createdAt: Date;
  /** 更新日時 */
  updatedAt: Date;
};
