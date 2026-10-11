/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { STITCH_IMAGES, HERO_STATS } from "@/content/site-content";

export function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="relative min-h-[85vh] flex items-center justify-center overflow-hidden border-b border-moto-border">
      <div className="absolute inset-0 z-0">
        <img
          src={STITCH_IMAGES.heroAttack}
          alt="Apex Track Motorcycle"
          className="w-full h-full object-cover object-center opacity-40 filter brightness-90 scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-moto-bg via-moto-bg/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-moto-bg via-transparent to-moto-bg/80"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center md:text-left">
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-moto-copper/10 border border-moto-copper/30 rounded-full text-xs font-mono font-semibold tracking-widest text-moto-copper uppercase">
            <span className="w-2 h-2 rounded-full bg-moto-copper animate-pulse"></span>
            Dubai HQ • Middle East Flagship
          </div>

          <h1 id="hero-heading" className="font-barlow text-4xl sm:text-6xl md:text-7xl font-bold tracking-wider leading-none text-moto-text uppercase">
            PURE DISPLACEMENT. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-moto-copper via-amber-200 to-moto-text">
              UNCOMPROMISING ENGINEERING.
            </span>
          </h1>

          <p className="text-moto-muted text-base sm:text-lg md:text-xl font-normal leading-relaxed">
            Luxury multi-brand motorcycle conglomerate representing four distinct marques across the GCC. Apex track weapons, Volt electric avionics, Nomad expedition touring, and Sovereign heritage cruisers.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono">
            {HERO_STATS.map((stat) => (
              <div key={stat.label} className="bg-moto-surface/80 border border-moto-border px-4 py-2 rounded flex items-center gap-2">
                <span className={`${stat.accent} font-bold`}>{stat.value}</span>
                <span className="text-moto-muted">{stat.label}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
            <Link
              href="#test-ride"
              className="w-full sm:w-auto bg-moto-copper text-moto-bg font-barlow font-bold text-base tracking-wider uppercase px-8 py-4 rounded hover:bg-moto-copper/90 transition-all text-center shadow-xl shadow-moto-copper/20"
            >
              Book Private Test Drive →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
