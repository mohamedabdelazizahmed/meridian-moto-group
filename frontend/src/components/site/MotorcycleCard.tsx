/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import type { Motorcycle } from "@/types/api";
import { STITCH_IMAGES } from "@/content/site-content";

export function getAccentClasses(slug?: string) {
  switch (slug) {
    case 'apex':
      return {
        strip: 'bg-moto-apex',
        text: 'text-moto-apex',
        border: 'hover:border-moto-apex',
        badge: 'bg-moto-apex/20 text-moto-apex border-moto-apex/40',
        btn: 'bg-moto-apex text-white hover:bg-moto-apex/90',
        image: STITCH_IMAGES.apexProfile,
      };
    case 'volt':
      return {
        strip: 'bg-moto-volt',
        text: 'text-moto-volt',
        border: 'hover:border-moto-volt',
        badge: 'bg-moto-volt/20 text-moto-volt border-moto-volt/40',
        btn: 'bg-moto-surface border border-moto-volt text-moto-volt hover:bg-moto-volt hover:text-moto-bg',
        image: STITCH_IMAGES.tftCockpit,
      };
    case 'nomad':
      return {
        strip: 'bg-moto-nomad',
        text: 'text-moto-nomad',
        border: 'hover:border-moto-nomad',
        badge: 'bg-moto-nomad/20 text-moto-nomad border-moto-nomad/40',
        btn: 'bg-moto-surface border border-moto-nomad text-moto-nomad hover:bg-moto-nomad hover:text-moto-bg',
        image: STITCH_IMAGES.suspension,
      };
    case 'sovereign':
      return {
        strip: 'bg-moto-sovereign',
        text: 'text-moto-sovereign',
        border: 'hover:border-moto-sovereign',
        badge: 'bg-moto-sovereign/20 text-moto-sovereign border-moto-sovereign/40',
        btn: 'bg-moto-surface border border-moto-sovereign text-moto-sovereign hover:bg-moto-sovereign hover:text-moto-bg',
        image: STITCH_IMAGES.exhaust,
      };
    default:
      return {
        strip: 'bg-moto-copper',
        text: 'text-moto-copper',
        border: 'hover:border-moto-copper',
        badge: 'bg-moto-copper/20 text-moto-copper border-moto-copper/40',
        btn: 'bg-moto-copper text-moto-bg hover:bg-moto-copper/90',
        image: STITCH_IMAGES.apexProfile,
      };
  }
}

export function MotorcycleCard({ moto }: { moto: Motorcycle }) {
  const accent = getAccentClasses(moto.brand?.slug);
  return (
    <div className={`group bg-moto-surface border border-moto-border rounded-lg overflow-hidden flex flex-col justify-between h-full ${accent.border} transition-all duration-300 hover:shadow-2xl hover:-translate-y-1`}>
      <div className="p-6 relative">
        <div className={`w-full h-1 ${accent.strip} absolute top-0 left-0`}></div>
        <div className="flex items-center justify-between mb-4">
          <span className={`text-xs font-mono font-semibold uppercase ${accent.text} tracking-widest`}>
            {moto.brand?.name || "MARQUE"} • FEATURED
          </span>
          <span className={`text-xs ${accent.badge} border px-2 py-0.5 rounded font-mono font-bold`}>
            {moto.power_hp ? `${moto.power_hp} HP` : 'PERFORMANCE'}
          </span>
        </div>

        <h3 className="text-2xl font-bold tracking-wider text-moto-text group-hover:text-moto-apex transition-colors">
          {moto.name}
        </h3>
        <p className="text-xs text-moto-muted mt-1 mb-4">
          {moto.summary || `${moto.engine_cc || 900}cc Engine • High Performance`}
        </p>

        <div className="my-4 aspect-[16/10] bg-moto-bg rounded overflow-hidden relative border border-moto-border">
          <img
            src={accent.image}
            alt={moto.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-moto-border/60">
          <div>
            <span className="text-moto-muted block">Power</span>
            <span className="text-moto-text font-bold">{moto.power_hp ? `${moto.power_hp} HP` : 'N/A'}</span>
          </div>
          <div>
            <span className="text-moto-muted block">Torque</span>
            <span className="text-moto-text font-bold">{moto.torque_nm ? `${moto.torque_nm} Nm` : 'N/A'}</span>
          </div>
        </div>
      </div>

      <div className="p-6 pt-0 mt-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[10px] font-mono text-moto-muted uppercase block">Starting MSRP</span>
            <span className="text-lg font-bold font-mono text-moto-text">
              ${moto.price_from ? moto.price_from.toLocaleString() : '115,000'} AED
            </span>
          </div>
        </div>
        <Link
          href="#test-ride"
          className={`w-full block text-center py-3 rounded text-xs font-barlow font-bold uppercase tracking-wider transition-all shadow-md ${accent.btn}`}
        >
          Enquire / Book Test Ride
        </Link>
      </div>
    </div>
  );
}
