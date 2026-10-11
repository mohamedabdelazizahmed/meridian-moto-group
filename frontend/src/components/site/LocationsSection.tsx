"use client";

import { useState } from "react";
import Link from "next/link";
import type { LocationItem } from "@/types/api";
import { Result } from "@/lib/result";
import { SectionError } from "./SectionError";
import { EmptyState } from "./EmptyState";

interface LocationsSectionProps {
  locationsResult: Result<LocationItem[]>;
}

interface HubInfo {
  id: string;
  city: string;
  country: string;
  name: string;
  location: string;
  phone: string;
  hours: string;
  vipContact: string;
}

export function LocationsSection({ locationsResult }: LocationsSectionProps) {
  const [activeHub, setActiveHub] = useState<string>("dubai");

  if (!locationsResult.ok) {
    return (
      <section id="regional-hubs" aria-labelledby="hubs-heading" className="py-20 bg-moto-surface/40 border-b border-moto-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionError message="Unable to load regional hubs network." />
        </div>
      </section>
    );
  }

  const locations = locationsResult.data;
  const regionalHubs: HubInfo[] = locations.map((loc) => ({
    id: loc.city.toLowerCase().replace(/\s+/g, '-'),
    city: loc.city,
    country: loc.type === 'service' ? 'United Arab Emirates' : 'Regional Hub',
    name: loc.name,
    location: loc.address,
    phone: loc.phone || "+971 4 800 6686",
    hours: loc.hours || "Sat – Thu: 09:00 – 21:00",
    vipContact: `${loc.city.toLowerCase().replace(/\s+/g, '')}.vip@meridianmoto.ae`,
  }));

  const currentHub = regionalHubs.find((h) => h.id === activeHub) || regionalHubs[0];

  return (
    <section id="regional-hubs" aria-labelledby="hubs-heading" className="py-20 bg-moto-surface/40 border-b border-moto-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono tracking-widest text-moto-copper uppercase mb-2 block">GCC Presence & Ateliers</span>
          <h2 id="hubs-heading" className="text-3xl sm:text-5xl font-bold tracking-wider text-moto-text uppercase">
            REGIONAL FLAGSHIP HUBS
          </h2>
          <p className="text-moto-muted text-sm mt-3">
            Experience bespoke test-ride commissioning and certified factory service across our premier GCC locations.
          </p>
        </div>

        {regionalHubs.length === 0 ? (
          <EmptyState message="Regional hubs currently synchronizing with inventory network." />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="space-y-4">
              {regionalHubs.map((hub) => (
                <button
                  key={hub.id}
                  type="button"
                  onClick={() => setActiveHub(hub.id)}
                  className={`w-full text-left p-6 rounded-lg border transition-all ${
                    activeHub === hub.id
                      ? "bg-moto-surface border-moto-copper shadow-xl shadow-moto-copper/5"
                      : "bg-moto-surface/40 border-moto-border hover:border-moto-muted"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-moto-copper uppercase tracking-widest">{hub.country}</span>
                    {activeHub === hub.id && <span className="w-2 h-2 rounded-full bg-moto-copper animate-ping"></span>}
                  </div>
                  <h3 className="font-barlow text-xl font-bold tracking-wider uppercase text-moto-text">{hub.city} Atelier</h3>
                  <p className="text-xs text-moto-muted mt-1">{hub.name}</p>
                </button>
              ))}
            </div>

            <div className="lg:col-span-2 bg-moto-surface border border-moto-border rounded-lg p-8 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-moto-border pb-4">
                  <div>
                    <span className="text-xs font-mono text-moto-copper uppercase tracking-wider">{currentHub.country}</span>
                    <h3 className="font-barlow text-2xl font-bold uppercase tracking-wider text-moto-text mt-1">{currentHub.name}</h3>
                  </div>
                  <span className="px-3 py-1 bg-moto-copper/10 border border-moto-copper/30 text-moto-copper text-xs font-mono rounded">
                    Active Atelier
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                  <div className="space-y-1">
                    <span className="text-xs font-mono text-moto-muted block uppercase">Location Address</span>
                    <p className="text-moto-text font-medium">{currentHub.location}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-mono text-moto-muted block uppercase">Operating Hours</span>
                    <p className="text-moto-text font-medium">{currentHub.hours}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-mono text-moto-muted block uppercase">Direct Hotline</span>
                    <p className="text-moto-text font-mono font-bold text-moto-copper">{currentHub.phone}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-mono text-moto-muted block uppercase">VIP Concierge Email</span>
                    <p className="text-moto-text font-mono text-xs">{currentHub.vipContact}</p>
                  </div>
                </div>
              </div>

              <div className="pt-8 mt-8 border-t border-moto-border flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs font-mono text-moto-muted">GPS: 25.1972° N, 55.2744° E (GCC Hub Grid)</span>
                <Link
                  href="#test-ride"
                  className="bg-moto-copper text-moto-bg font-barlow font-bold text-xs tracking-wider uppercase px-6 py-3 rounded hover:bg-moto-copper/90 transition-all"
                >
                  Book Appointment at {currentHub.city}
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
