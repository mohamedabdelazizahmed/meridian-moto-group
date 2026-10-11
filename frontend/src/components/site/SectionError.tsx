export function SectionError({ message }: { message: string }) {
  return (
    <div role="alert" className="p-8 bg-moto-surface border border-moto-apex/30 rounded-lg text-center text-moto-apex font-mono text-sm">
      {message}
    </div>
  );
}
