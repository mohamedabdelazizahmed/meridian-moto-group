export function EmptyState({ message }: { message: string }) {
  return (
    <div role="status" className="p-8 bg-moto-surface border border-moto-border rounded-lg text-center text-moto-muted font-mono text-sm">
      {message}
    </div>
  );
}
