import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/server';
import AuthHydrator from '@/components/AuthHydrator';
import { Routes } from '@/lib/routes';

export default async function CmsPanelLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect(`${Routes.CmsLogin}?reason=session_expired`);
  }

  return (
    <AuthHydrator user={user}>
      {children}
    </AuthHydrator>
  );
}
