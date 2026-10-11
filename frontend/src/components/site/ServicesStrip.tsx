import { SERVICES_LIST } from "@/content/site-content";

export function ServicesStrip() {
  return (
    <section aria-labelledby="services-heading" className="py-20 bg-moto-surface/30 border-b border-moto-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono tracking-widest text-moto-copper uppercase mb-2 block">Enterprise Excellence</span>
          <h2 id="services-heading" className="text-3xl sm:text-5xl font-bold tracking-wider text-moto-text uppercase">
            CONGLOMERATE SERVICES
          </h2>
          <p className="text-moto-muted text-sm mt-3">
            Delivering uncompromised white-glove support and global logistics across all Meridian operating entities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SERVICES_LIST.map((srv) => (
            <div key={srv.title} className="bg-moto-surface border border-moto-border p-8 rounded-lg flex flex-col justify-between hover:border-moto-copper transition-colors">
              <div>
                <span className="text-xs font-mono text-moto-copper uppercase tracking-wider mb-2 block">{srv.tag}</span>
                <h3 className="text-xl font-bold font-barlow tracking-wider text-moto-text uppercase mb-3">{srv.title}</h3>
                <p className="text-sm text-moto-muted leading-relaxed">{srv.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
