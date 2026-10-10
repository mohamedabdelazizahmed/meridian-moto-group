import { Suspense } from 'react';
import CmsLoginContent from './login-content';

export default function CmsLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-moto-bg flex items-center justify-center text-moto-muted font-mono text-xs uppercase tracking-wider">Loading CMS Login...</div>}>
      <CmsLoginContent />
    </Suspense>
  );
}
