'use server';

import { auth } from '@clerk/nextjs/server';

type UpdateSessionResponse = {
  success: boolean;
  error?: string;
};

/**
 * 従業員のセッション情報を更新する
 */
export async function updateEmployeeSession(
  employeeId: string | null,
  isAdmin: boolean
): Promise<UpdateSessionResponse> {
  try {
    console.log('Updating employee session with:', { employeeId, isAdmin });

    const { userId } = await auth();
    console.log('Current user ID:', userId);

    if (!userId) {
      console.log('No user ID found');
      return { success: false, error: '認証エラーが発生しました' };
    }

    const metadata = {
      private_metadata: {
        currentEmployee: {
          employeeId,
          isAdmin,
        },
      },
    };
    console.log('Setting metadata:', metadata);

    const response = await fetch(`https://api.clerk.com/v1/users/${userId}/metadata`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(metadata),
    });

    console.log('Clerk API response status:', response.status);
    const responseData = await response.json();
    console.log('Clerk API response data:', responseData);

    if (!response.ok) {
      console.log('Failed to update metadata:', response.statusText);
      throw new Error('Failed to update metadata');
    }

    console.log('Successfully updated employee session');
    return { success: true };
  } catch (error) {
    console.error('Error in updateEmployeeSession:', error);
    return { success: false, error: 'セッションの更新に失敗しました' };
  }
}
