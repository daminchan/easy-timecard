import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export const getCurrentUser = async () => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error('Unauthorized');
  }

  // Clerkのユーザー情報を元に、対応する企業情報を取得または作成
  const company = await prisma.company.upsert({
    where: { id: userId },
    update: {},
    create: {
      id: userId,
      name: 'Company Name',
    },
  });

  return {
    userId,
    company,
  };
};
