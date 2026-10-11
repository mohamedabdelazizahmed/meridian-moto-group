/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RevealOnScroll from "@/components/RevealOnScroll";
import TestRideForm from "@/features/test-ride/TestRideForm";
import { 
  getFeaturedMotorcycles, 
  getLocations, 
  getBrands, 
  LocationItem,
  Brand,
  Motorcycle 
} from "@/services/api";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const STITCH_IMAGES = {
  heroAttack: "/images/motorcycles/volt-pulse-rs.svg",
  apexProfile: "/images/motorcycles/apex-rs-900.svg",
  tftCockpit: "/images/motorcycles/nomad-horizon-1250.svg",
  suspension: "/images/motorcycles/sovereign-wraith-1800.svg",
  exhaust: "/images/motorcycles/apex-track-600.svg",
};

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

const getAccentClasses = (slug?: string) => {
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
};

export default function ConsumerHomepage() {
  const [activeHub, setActiveHub] = useState<string>("dubai");
  const [selectedMarque, setSelectedMarque] = useState<string>("all");

  // API State
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [apiError, setApiError] = useState<boolean>(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [motosData, locsData, brandsData] = await Promise.all([
          getFeaturedMotorcycles(),
          getLocations(),
          getBrands(),
        ]);
        setMotorcycles(motosData);
        setLocations(locsData);
        setBrands(brandsData);
      } catch {
        setApiError(true);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

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

  const filteredMotorcycles = selectedMarque === "all"
    ? motorcycles
    : motorcycles.filter((m) => m.brand?.slug === selectedMarque);

  return (
    <div className="min-h-screen flex flex-col bg-moto-bg text-moto-text selection:bg-moto-copper selection:text-white">
      {/* Navigation Bar */}
      <Navbar />

      <main id="main-content" className="flex-1">
        {/* HERO SECTION */}
        <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden border-b border-moto-border">
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

              <h1 className="font-barlow text-4xl sm:text-6xl md:text-7xl font-bold tracking-wider leading-none text-moto-text uppercase">
                PURE DISPLACEMENT. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-moto-copper via-amber-200 to-moto-text">
                  UNCOMPROMISING ENGINEERING.
                </span>
              </h1>

              <p className="text-moto-muted text-base sm:text-lg md:text-xl font-normal leading-relaxed">
                Luxury multi-brand motorcycle conglomerate representing four distinct marques across the GCC. Apex track weapons, Volt electric avionics, Nomad expedition touring, and Sovereign heritage cruisers.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono">
                <div className="bg-moto-surface/80 border border-moto-border px-4 py-2 rounded flex items-center gap-2">
                  <span className="text-moto-apex font-bold">214 HP</span>
                  <span className="text-moto-muted">Apex Flagship</span>
                </div>
                <div className="bg-moto-surface/80 border border-moto-border px-4 py-2 rounded flex items-center gap-2">
                  <span className="text-moto-volt font-bold">0 Emission</span>
                  <span className="text-moto-muted">Volt EV</span>
                </div>
                <div className="bg-moto-surface/80 border border-moto-border px-4 py-2 rounded flex items-center gap-2">
                  <span className="text-moto-nomad font-bold">1250cc</span>
                  <span className="text-moto-muted">Nomad Boxer</span>
                </div>
                <div className="bg-moto-surface/80 border border-moto-border px-4 py-2 rounded flex items-center gap-2">
                  <span className="text-moto-sovereign font-bold">1800cc</span>
                  <span className="text-moto-muted">Sovereign Cruiser</span>
                </div>
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

        {/* MARQUES & MOTORCYCLES SECTION */}
        <section id="marques" className="py-20 bg-moto-bg border-b border-moto-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <RevealOnScroll>
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                <div>
                  <div className="text-xs font-mono tracking-widest text-moto-copper uppercase mb-2">
                    Operational Marque Portfolio
                  </div>
                  <h2 className="text-3xl sm:text-5xl font-bold tracking-wider text-moto-text uppercase">
                    THE FOUR DISTINCT MARQUES
                  </h2>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                  <button
                    type="button"
                    onClick={() => setSelectedMarque("all")}
                    className={`px-4 py-2 rounded text-xs font-barlow font-bold uppercase tracking-wider transition-colors ${
                      selectedMarque === "all"
                        ? "bg-moto-copper text-moto-bg"
                        : "bg-moto-surface border border-moto-border text-moto-muted hover:text-moto-text"
                    }`}
                  >
                    All Marques
                  </button>
                  {brands.map((b) => (
                    <button
                      key={b.slug}
                      type="button"
                      onClick={() => setSelectedMarque(b.slug)}
                      className={`px-4 py-2 rounded text-xs font-barlow font-bold uppercase tracking-wider transition-colors ${
                        selectedMarque === b.slug
                          ? "bg-moto-copper text-moto-bg"
                          : "bg-moto-surface border border-moto-border text-moto-muted hover:text-moto-text"
                      }`}
                    >
                      {b.name} {b.segment ? `(${b.segment})` : ''}
                    </button>
                  ))}
                </div>
              </div>
            </RevealOnScroll>

            {/* Error or Empty State vs Swiper */}
            {apiError ? (
              <div role="alert" className="p-8 bg-moto-surface border border-moto-apex/30 rounded-lg text-center text-moto-apex font-mono text-sm">
                Unable to load motorcycle catalog from API at this moment. Please verify backend service connectivity.
              </div>
            ) : isLoading ? (
              <div role="status" className="p-12 text-center text-moto-muted font-mono text-xs uppercase tracking-wider">
                Loading motorcycle fleet catalog...
              </div>
            ) : filteredMotorcycles.length === 0 ? (
              <div role="status" className="p-8 bg-moto-surface border border-moto-border rounded-lg text-center text-moto-muted font-mono text-sm">
                No motorcycle models currently available for this selection.
              </div>
            ) : (
              <RevealOnScroll delay={200}>
                <Swiper
                  modules={[Navigation, Pagination]}
                  spaceBetween={24}
                  slidesPerView={1}
                  navigation
                  pagination={{ clickable: true }}
                  breakpoints={{
                    640: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 },
                    1280: { slidesPerView: 4 },
                  }}
                  className="pb-14 pt-2"
                >
                  {filteredMotorcycles.map((moto) => {
                    const accent = getAccentClasses(moto.brand?.slug);
                    return (
                      <SwiperSlide key={moto.slug} className="h-auto">
                        <div 
                          className={`group bg-moto-surface border border-moto-border rounded-lg overflow-hidden flex flex-col justify-between h-full ${accent.border} transition-all duration-300 hover:shadow-2xl hover:-translate-y-1`}
                        >
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
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
              </RevealOnScroll>
            )}
          </div>
        </section>

        {/* REGIONAL HUBS SECTION */}
        <section id="regional-hubs" className="py-20 bg-moto-surface/40 border-b border-moto-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-mono tracking-widest text-moto-copper uppercase mb-2 block">
                GCC Presence & Ateliers
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold tracking-wider text-moto-text uppercase">
                REGIONAL FLAGSHIP HUBS
              </h2>
              <p className="text-moto-muted text-sm mt-3">
                Experience bespoke test-ride commissioning and certified factory service across our premier GCC locations.
              </p>
            </div>

            {regionalHubs.length === 0 ? (
              <div role="status" className="p-8 bg-moto-surface border border-moto-border rounded-lg text-center text-moto-muted font-mono text-sm">
                Regional hubs currently synchronizing with inventory network.
              </div>
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

        {/* TEST RIDE SECTION */}
        <section id="test-ride" className="py-24 bg-moto-bg relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <TestRideForm motorcycles={motorcycles} />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
