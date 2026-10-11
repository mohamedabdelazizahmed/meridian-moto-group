export default function CmsLoading() {
  return (
    <div className="min-h-screen bg-moto-bg flex flex-col items-center justify-center text-moto-text" role="status" aria-label="Loading CMS dashboard">
      <div className="w-10 h-10 border-3 border-moto-copper/30 border-t-moto-copper rounded-full animate-spin mb-3"></div>
      <p className="font-mono text-xs uppercase tracking-wider text-moto-muted">Authenticating CMS Console...</p>
    </div>
  );
}
