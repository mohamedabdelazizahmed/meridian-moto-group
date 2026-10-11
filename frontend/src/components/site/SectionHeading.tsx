export function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return (
    <div className="mb-12">
      <span className="text-xs font-mono tracking-widest text-moto-copper uppercase mb-2 block">{eyebrow}</span>
      <h2 className="text-3xl sm:text-5xl font-bold tracking-wider text-moto-text uppercase">{title}</h2>
      {description && <p className="text-moto-muted text-sm mt-3">{description}</p>}
    </div>
  );
}
