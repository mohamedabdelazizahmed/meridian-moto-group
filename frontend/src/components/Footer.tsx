import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-moto-surface border-t border-moto-border pt-12 pb-8 text-moto-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-barlow font-bold text-xl tracking-[0.15em] text-moto-text uppercase">
                MERIDIAN <span className="text-moto-copper font-normal">MOTO GROUP</span>
              </span>
            </Link>
            <p className="text-sm text-moto-muted leading-relaxed">
              Luxury multi-brand motorcycle conglomerate headquartered in Dubai, UAE. Engineering track precision, electric mobility, touring expeditions, and bespoke cruisers.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="w-2.5 h-2.5 rounded-full bg-moto-apex" title="Apex marque"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-moto-volt" title="Volt marque"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-moto-nomad" title="Nomad marque"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-moto-sovereign" title="Sovereign marque"></span>
            </div>
          </div>

          {/* Marques Col */}
          <div>
            <h4 className="font-barlow font-semibold text-sm tracking-wider uppercase text-moto-text mb-4">
              Marques & Flagships
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <span className="text-moto-apex flex items-center gap-2">
                  <span>✦</span> Apex RS 900 (Track)
                </span>
              </li>
              <li>
                <span className="text-moto-muted flex items-center gap-2">
                  <span className="text-moto-volt">✦</span> Volt Pulse RS (Electric)
                </span>
              </li>
              <li>
                <span className="text-moto-muted flex items-center gap-2">
                  <span className="text-moto-nomad">✦</span> Nomad Horizon 1250 (Adventure)
                </span>
              </li>
              <li>
                <span className="text-moto-muted flex items-center gap-2">
                  <span className="text-moto-sovereign">✦</span> Sovereign Wraith 1800 (Heritage)
                </span>
              </li>
            </ul>
          </div>

          {/* GCC Hubs Col */}
          <div>
            <h4 className="font-barlow font-semibold text-sm tracking-wider uppercase text-moto-text mb-4">
              GCC Regional Hubs
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="text-moto-text">Dubai Flagship — Sheikh Zayed Rd</li>
              <li className="text-moto-muted">Riyadh Pit-Bay Atelier</li>
              <li className="text-moto-muted">Doha VIP Circuit Hub</li>
              <li className="text-moto-muted">Kuwait & Muscat Showrooms</li>
            </ul>
          </div>

          {/* CMS & Enterprise */}
          <div>
            <h4 className="font-barlow font-semibold text-sm tracking-wider uppercase text-moto-text mb-4">
              Internal Enterprise
            </h4>
            <p className="text-xs text-moto-muted mb-4">
              Fleet inventory catalog, marque role clearances, and administrator RBAC console.
            </p>
            <Link
              href="/cms/login"
              className="inline-flex items-center gap-2 text-xs font-barlow font-bold uppercase tracking-wider text-moto-copper border border-moto-copper/30 bg-moto-copper/10 px-4 py-2 rounded hover:bg-moto-copper hover:text-moto-bg transition-all"
            >
              Access CMS Portal →
            </Link>
          </div>
        </div>

        {/* Bottom Bar with mandatory disclaimers */}
        <div className="pt-8 border-t border-moto-border flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-moto-muted">
          <div>
            © 2026 Meridian Moto Group. All rights reserved.
          </div>
          <div className="bg-moto-bg px-4 py-2 rounded border border-moto-border text-moto-copper/90 tracking-wider text-center">
            Fictional company created for recruitment assessment purposes only.
          </div>
        </div>
      </div>
    </footer>
  );
}
