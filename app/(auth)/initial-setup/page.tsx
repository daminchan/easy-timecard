import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { InitialSetupPage } from './InitialSetupPage';

export default async function Page() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  return <InitialSetupPage />;
}
