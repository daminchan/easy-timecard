import { getEmployees, clockIn, startBreak, endBreak, clockOut } from './actions';
import { TimeCardPage } from './TimeCardPage';
import { redirect } from 'next/navigation';

export default async function Page() {
  const result = await getEmployees();

  if (!result.success) {
    redirect('/sign-in');
  }

  return (
    <TimeCardPage
      initialEmployees={result.data!.employees}
      initialTimeRecords={result.data!.timeRecords}
      clockIn={clockIn}
      startBreak={startBreak}
      endBreak={endBreak}
      clockOut={clockOut}
    />
  );
}
