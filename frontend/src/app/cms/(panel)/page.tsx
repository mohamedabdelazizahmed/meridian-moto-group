import { redirect } from 'next/navigation';
import { Routes } from '@/lib/routes';

export default function CmsPanelRootPage() {
  redirect(Routes.CmsModels);
}
