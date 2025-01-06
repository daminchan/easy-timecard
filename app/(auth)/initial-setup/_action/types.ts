import { type Employee } from '@/types';

/** 初期管理者作成のレスポンス型 */
export type CreateInitialAdminResponse = {
  success: boolean;
  error?: string;
  data?: Employee;
};
