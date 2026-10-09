/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RevealOnScroll from "@/components/RevealOnScroll";
import DynamicLocationsMap from "@/components/DynamicLocationsMap";
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

// High quality motorcycle photography assets
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

const DEFAULT_HUBS: HubInfo[] = [
  {
    id: "dubai",
    city: "Dubai",
    country: "United Arab Emirates",
    name: "Dubai Flagship Atelier",
    location: "Sheikh Zayed Road, Exit 41, Dubai, UAE",
    phone: "+971 4 800 6686",
    hours: "Sat – Thu: 09:00 – 21:00",
    vipContact: "dubai.vip@meridianmoto.ae",
  },
  {
    id: "riyadh",
    city: "Riyadh",
    country: "Kingdom of Saudi Arabia",
    name: "Riyadh Pit-Bay Lounge",
    location: "King Fahd Road, Al Olaya, Riyadh, KSA",
    phone: "+966 11 400 9000",
    hours: "Sat – Thu: 10:00 – 22:00",
    vipContact: "riyadh.vip@meridianmoto.ae",
  },
  {
    id: "doha",
    city: "Doha",
    country: "State of Qatar",
    name: "Doha Circuit Atelier",
    location: "Lusail Marina District, Doha, Qatar",
    phone: "+974 44 800 700",
    hours: "Sat – Thu: 09:30 – 20:30",
    vipContact: "doha.vip@meridianmoto.ae",
  },
];

const DEFAULT_BRANDS: Brand[] = [
  { name: "Apex", slug: "apex", segment: "Circuit" },
  { name: "Volt", slug: "volt", segment: "EV" },
  { name: "Nomad", slug: "nomad", segment: "Touring" },
  { name: "Sovereign", slug: "sovereign", segment: "Cruiser" },
];

const DEFAULT_MOTORCYCLES: Motorcycle[] = [
  {
    name: "APEX RS 900",
    slug: "apex-rs-900",
    price_from: 148000,
    power_hp: 214,
    dry_weight_kg: 164,
    summary: "900cc Inline-4 • Aerodynamic Carbon Aero-Winglets",
    brand: { name: "Apex", slug: "apex", segment: "Circuit" }
  },
  {
    name: "VOLT PULSE RS",
    slug: "volt-pulse-rs",
    price_from: 115000,
    power_hp: 161,
    summary: "High-Torque EV Motor • Connected Avionics TFT",
    brand: { name: "Volt", slug: "volt", segment: "EV" }
  },
  {
    name: "NOMAD HORIZON 1250",
    slug: "nomad-horizon-1250",
    price_from: 112500,
    power_hp: 145,
    summary: "1250cc Boxer Twin • Heavy-Duty Off-Road Chassis",
    brand: { name: "Nomad", slug: "nomad", segment: "Touring" }
  },
  {
    name: "SOVEREIGN WRAITH 1800",
    slug: "sovereign-wraith-1800",
    price_from: 165000,
    power_hp: 126,
    summary: "1800cc Big-Bore Cruiser • Handcrafted Titanium",
    brand: { name: "Sovereign", slug: "sovereign", segment: "Cruiser" }
  }
];

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

  useEffect(() => {
    async function loadData() {
      try {
        const [motosData, locsData, brandsData] = await Promise.all([
          getFeaturedMotorcycles(),
          getLocations(),
          getBrands(),
        ]);
        if (motosData.length > 0) setMotorcycles(motosData);
        if (locsData.length > 0) setLocations(locsData);
        if (brandsData.length > 0) setBrands(brandsData);
      } catch (err) {
        console.error("Failed to load homepage API data:", err);
      }
    }
    loadData();
  }, []);

  // Map locations to hubs if available, or fall back to defaults
  const regionalHubs: HubInfo[] = locations.length > 0 
    ? locations.map((loc) => ({
        id: loc.city.toLowerCase().replace(/\s+/g, '-'),
        city: loc.city,
        country: loc.type === 'service' ? 'United Arab Emirates' : 'Regional Hub',
        name: loc.name,
        location: loc.address,
        phone: loc.phone || "+971 4 800 6686",
        hours: loc.hours || "Sat – Thu: 09:00 – 21:00",
        vipContact: `${loc.city.toLowerCase().replace(/\s+/g, '')}.vip@meridianmoto.ae`,
      }))
    : DEFAULT_HUBS;

  const currentHub = regionalHubs.find((h) => h.id === activeHub) || regionalHubs[0];
  const displayBrands = brands.length > 0 ? brands : DEFAULT_BRANDS;
  const displayMotorcycles = motorcycles.length > 0 ? motorcycles : DEFAULT_MOTORCYCLES;

  const filteredMotorcycles = selectedMarque === "all"
    ? displayMotorcycles
    : displayMotorcycles.filter((m) => m.brand?.slug === selectedMarque);

  return (
    <div className="min-h-screen flex flex-col bg-moto-bg text-moto-text selection:bg-moto-copper selection:text-white">
      {/* Navigation Bar */}
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION — Cinematic Track Photography */}
        <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden border-b border-moto-border">
          {/* Hero Background Image Overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src={STITCH_IMAGES.heroAttack}
              alt="Apex Track Motorcycle"
              className="w-full h-full object-cover object-center opacity-40 filter brightness-90 scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-moto-bg via-moto-bg/60 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-moto-bg via-transparent to-moto-bg/80"></div>
          </div>

          {/* Hero Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center md:text-left">
            <div className="max-w-3xl space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-moto-copper/10 border border-moto-copper/30 rounded-full text-xs font-mono font-semibold tracking-widest text-moto-copper uppercase">
                <span className="w-2 h-2 rounded-full bg-moto-copper animate-pulse"></span>
                Dubai HQ • Middle East Flagship
              </div>

              {/* Title */}
              <h1 className="font-barlow text-4xl sm:text-6xl md:text-7xl font-bold tracking-wider leading-none text-moto-text uppercase">
                PURE DISPLACEMENT. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-moto-copper via-amber-200 to-moto-text">
                  UNCOMPROMISING ENGINEERING.
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-moto-muted text-base sm:text-lg md:text-xl font-normal leading-relaxed">
                Luxury multi-brand motorcycle conglomerate representing four distinct marques across the GCC. Apex track weapons, Volt electric avionics, Nomad expedition touring, and Sovereign heritage cruisers.
              </p>

              {/* Key Specs Pill Strip */}
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

              {/* CTAs */}
              <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
                <Link
                  href="/models/apex-rs-900"
                  className="w-full sm:w-auto bg-moto-copper text-moto-bg font-barlow font-bold text-base tracking-wider uppercase px-8 py-4 rounded hover:bg-moto-copper/90 transition-all text-center shadow-xl shadow-moto-copper/20"
                >
                  Explore Apex RS 900 Flagship →
                </Link>
                <Link
                  href="/models/apex-rs-900#reserve"
                  className="w-full sm:w-auto bg-moto-surface border border-moto-border text-moto-text font-barlow font-bold text-base tracking-wider uppercase px-8 py-4 rounded hover:border-moto-copper transition-all text-center"
                >
                  Book Private Test Drive
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* MARQUES SECTION — The Four Marques (Swiper Carousel) */}
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

                {/* Filter Pills */}
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
                  {displayBrands.map((b) => (
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

            {/* Models Carousel (Swiper) */}
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
                              <span className="text-moto-muted block">Weight</span>
                              <span className="text-moto-text font-bold">{moto.dry_weight_kg ? `${moto.dry_weight_kg} kg` : 'N/A'}</span>
                            </div>
                            <div>
                              <span className="text-moto-muted block">Price From</span>
                              <span className={`${accent.text} font-bold`}>{moto.price_from ? `${moto.price_from.toLocaleString()} AED` : 'Contact'}</span>
                            </div>
                            <div>
                              <span className="text-moto-muted block">Status</span>
                              <span className="text-moto-text font-bold">Featured</span>
                            </div>
                          </div>
                        </div>

                        <div className="p-6 pt-0">
                          <Link
                            href={`/models/${moto.slug}`}
                            className={`block w-full text-center ${accent.btn} font-barlow font-bold text-xs uppercase tracking-wider py-3 rounded transition-colors`}
                          >
                            View {moto.name} Details →
                          </Link>
                        </div>
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </RevealOnScroll>
          </div>
        </section>

        {/* REGIONAL HUBS SECTION — Interactive GCC Network with Leaflet Map */}
        <section id="regional-hubs" className="py-20 bg-moto-surface border-b border-moto-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <RevealOnScroll>
              <div className="text-center max-w-3xl mx-auto mb-12">
                <div className="text-xs font-mono tracking-widest text-moto-copper uppercase mb-2">
                  GCC Flagship Dealership Network
                </div>
                <h2 className="text-3xl sm:text-5xl font-bold tracking-wider text-moto-text uppercase">
                  MIDDLE EAST REGIONAL HUBS
                </h2>
                <p className="text-moto-muted text-sm sm:text-base mt-3">
                  Dedicated ateliers, track-side pit bays, and private concierge lounges across UAE, Saudi Arabia, and Qatar.
                </p>
              </div>
            </RevealOnScroll>

            {/* City Tabs */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex p-1 bg-moto-bg border border-moto-border rounded-lg space-x-1 overflow-x-auto">
                {regionalHubs.map((hub) => (
                  <button
                    key={hub.id}
                    type="button"
                    onClick={() => setActiveHub(hub.id)}
                    className={`px-5 py-2.5 rounded font-barlow font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap ${
                      activeHub === hub.id
                        ? "bg-moto-copper text-moto-bg shadow-md"
                        : "text-moto-muted hover:text-moto-text"
                    }`}
                  >
                    {hub.city} ({hub.country.split(" ")[0]})
                  </button>
                ))}
              </div>
            </div>

            {/* Active Hub Showcase & Interactive Leaflet Map */}
            <RevealOnScroll delay={150}>
              <div className="bg-moto-bg border border-moto-border rounded-xl p-8 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center shadow-2xl mb-12">
                <div className="space-y-6">
                  <div className="inline-block px-3 py-1 bg-moto-copper/10 border border-moto-copper/30 rounded text-xs font-mono text-moto-copper uppercase">
                    {currentHub.country}
                  </div>

                  <h3 className="text-3xl sm:text-4xl font-bold tracking-wider text-moto-text uppercase">
                    {currentHub.name}
                  </h3>

                  <div className="space-y-4 text-sm font-mono text-moto-muted">
                    <div className="flex items-start gap-3">
                      <span className="text-moto-copper text-base">📍</span>
                      <div>
                        <span className="text-moto-text font-semibold block">Address & Viewport</span>
                        <span>{currentHub.location}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="text-moto-copper text-base">📞</span>
                      <div>
                        <span className="text-moto-text font-semibold block">Direct Concierge Hotline</span>
                        <a href={`tel:${currentHub.phone}`} className="text-moto-copper underline hover:text-white">
                          {currentHub.phone}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="text-moto-copper text-base">🕒</span>
                      <div>
                        <span className="text-moto-text font-semibold block">Operating Hours</span>
                        <span>{currentHub.hours}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="text-moto-copper text-base">✉️</span>
                      <div>
                        <span className="text-moto-text font-semibold block">VIP Dispatch Email</span>
                        <a href={`mailto:${currentHub.vipContact}`} className="text-moto-copper underline hover:text-white">
                          {currentHub.vipContact}
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-wrap gap-4">
                    <Link
                      href="/models/apex-rs-900#reserve"
                      className="bg-moto-copper text-moto-bg font-barlow font-bold text-xs uppercase tracking-wider px-6 py-3 rounded hover:bg-moto-copper/90 transition-all"
                    >
                      Schedule Atelier Appointment →
                    </Link>
                  </div>
                </div>

                {/* Leaflet Interactive Map Component */}
                <div>
                  <DynamicLocationsMap locations={locations.length > 0 ? locations : []} />
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </section>

        {/* TEST-RIDE FORM SECTION (TanStack Query + Zod + RHF) */}
        <section id="reserve" className="py-20 bg-moto-bg border-b border-moto-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <RevealOnScroll>
              <TestRideForm motorcycles={displayMotorcycles} />
            </RevealOnScroll>
          </div>
        </section>

        {/* CONCIERGE EXPERIENCE & RECRUITMENT ASSESSMENT BANNER */}
        <section id="concierge" className="py-20 bg-moto-bg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <RevealOnScroll>
              <div className="bg-moto-surface border border-moto-border rounded-xl p-8 md:p-12 relative overflow-hidden">
                <div className="max-w-2xl mx-auto space-y-4 relative z-10">
                  <span className="text-xs font-mono uppercase tracking-widest text-moto-copper px-3 py-1 bg-moto-copper/10 rounded-full border border-moto-copper/30 inline-block">
                    EXPERIENCE CONCIERGE
                  </span>
                  <h3 className="text-3xl font-bold tracking-wider text-moto-text uppercase">
                    TRACK DAYS & BESPOKE DELIVERY
                  </h3>
                  <p className="text-moto-muted text-sm leading-relaxed">
                    Every Meridian vehicle includes private circuit telemetry access at Yas Marina Circuit and Dubai Autodrome, along with white-glove enclosed transporter delivery.
                  </p>
                  <div className="pt-4 flex justify-center gap-4">
                    <Link
                      href="/cms/login"
                      className="bg-moto-copper/20 text-moto-copper border border-moto-copper/40 hover:bg-moto-copper hover:text-moto-bg font-barlow font-bold text-xs uppercase tracking-wider px-6 py-3 rounded transition-all"
                    >
                      Enterprise CMS Management Console →
                    </Link>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
