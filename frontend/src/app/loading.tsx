export default function Loading() {
  return (
    <div className="min-h-screen bg-moto-bg flex flex-col items-center justify-center text-moto-text" role="status" aria-label="Loading page">
      <div className="w-12 h-12 border-4 border-moto-copper/30 border-t-moto-copper rounded-full animate-spin mb-4"></div>
      <p className="font-mono text-xs uppercase tracking-widest text-moto-muted">Loading Meridian Moto Group...</p>
    </div>
  );
}
