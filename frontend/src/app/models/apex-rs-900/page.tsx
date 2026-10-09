/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// High resolution motorcycle photography assets
const GALLERY = [
  {
    id: "profile",
    label: "Side Profile Spec",
    url: "/images/motorcycles/apex-rs-900.svg",
  },
  {
    id: "attack",
    label: "3/4 Track Attack View",
    url: "/images/motorcycles/apex-track-600.svg",
  },
  {
    id: "tft",
    label: "Digital TFT Cockpit",
    url: "/images/motorcycles/volt-pulse-rs.svg",
  },
  {
    id: "exhaust",
    label: "Titanium Exhaust",
    url: "/images/motorcycles/sovereign-wraith-1800.svg",
  },
];

export default function ApexRs900Page() {
  const [selectedImg, setSelectedImg] = useState<string>(GALLERY[0].url);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    deliveryDate: "2026-11-15",
    venue: "Dubai Autodrome Circuit",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-moto-bg text-moto-text selection:bg-moto-apex selection:text-white">
      <Navbar />

      <main className="flex-1">
        {/* TOP BAR / BREADCRUMB */}
        <div className="bg-moto-surface border-b border-moto-border py-4 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link
              href="/"
              className="text-xs font-mono text-moto-muted hover:text-moto-text flex items-center gap-2 uppercase tracking-wider"
            >
              ← Back to Marque Showcase
            </Link>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-moto-apex"></span>
              <span className="text-xs font-mono font-bold uppercase text-moto-apex tracking-widest">
                APEX MARQUE • FLAGSHIP MODEL
              </span>
            </div>
          </div>
        </div>

        {/* HERO SHOWCASE SECTION */}
        <section className="py-12 bg-moto-bg border-b border-moto-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* LEFT: GALLERY & MAIN STAGE (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                {/* Main Large Stage Image */}
                <div className="aspect-[16/10] bg-moto-surface border border-moto-border rounded-xl overflow-hidden relative shadow-2xl">
                  <img
                    src={selectedImg}
                    alt="Apex RS 900 Detail View"
                    className="w-full h-full object-cover transition-opacity duration-300"
                  />
                  <div className="absolute top-4 left-4 bg-moto-bg/90 backdrop-blur-md border border-moto-apex/40 px-3 py-1 rounded text-xs font-mono text-moto-apex font-bold uppercase tracking-widest">
                    214 HP • 164 KG DRY WEIGHT
                  </div>
                </div>

                {/* Gallery Thumbnails */}
                <div className="grid grid-cols-4 gap-3">
                  {GALLERY.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedImg(item.url)}
                      className={`aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all relative ${
                        selectedImg === item.url
                          ? "border-moto-apex ring-2 ring-moto-apex/30"
                          : "border-moto-border hover:border-moto-muted"
                      }`}
                    >
                      <img src={item.url} alt={item.label} className="w-full h-full object-cover" />
                      <span className="absolute bottom-1 left-1 right-1 text-[9px] font-mono bg-moto-bg/90 text-moto-text truncate px-1 rounded text-center">
                        {item.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* RIGHT: OVERVIEW & SPEC HIGHLIGHTS (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <div className="inline-block px-3 py-1 bg-moto-apex/10 border border-moto-apex/30 rounded text-xs font-mono text-moto-apex font-bold uppercase tracking-widest mb-3">
                    FLAGSHIP TRACK WEAPON
                  </div>
                  <h1 className="text-4xl sm:text-5xl font-bold tracking-wider text-moto-text uppercase">
                    APEX RS 900
                  </h1>
                  <p className="text-moto-muted text-sm mt-2 leading-relaxed">
                    Designed strictly for the circuit. Powered by a 900cc inline-four engine generating 214 HP wrapped in lightweight carbon aerodynamic winglets and race-spec chassis.
                  </p>
                </div>

                {/* MSRP Box */}
                <div className="bg-moto-surface border border-moto-border p-6 rounded-xl space-y-2">
                  <span className="text-xs font-mono uppercase tracking-widest text-moto-muted block">
                    Starting Pilot MSRP (GCC Allocation)
                  </span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-4xl font-bold font-barlow text-moto-apex tracking-wider">
                      148,000 AED
                    </span>
                    <span className="text-xs font-mono text-moto-muted">Excl. VAT & Track Registration</span>
                  </div>
                  <div className="text-xs font-mono text-moto-volt flex items-center gap-1 pt-1">
                    <span className="w-2 h-2 rounded-full bg-moto-volt animate-ping"></span>
                    <span>Q4 Circuit Delivery Available</span>
                  </div>
                </div>

                {/* Spec Highlights Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="bg-moto-surface border border-moto-border p-3.5 rounded-lg">
                    <span className="text-moto-muted block text-[11px]">Engine Type</span>
                    <span className="text-moto-text font-bold text-sm">900cc Inline-4</span>
                  </div>
                  <div className="bg-moto-surface border border-moto-border p-3.5 rounded-lg">
                    <span className="text-moto-muted block text-[11px]">Max Output</span>
                    <span className="text-moto-apex font-bold text-sm">214 HP @ 13.5k RPM</span>
                  </div>
                  <div className="bg-moto-surface border border-moto-border p-3.5 rounded-lg">
                    <span className="text-moto-muted block text-[11px]">Dry Weight</span>
                    <span className="text-moto-text font-bold text-sm">164 kg</span>
                  </div>
                  <div className="bg-moto-surface border border-moto-border p-3.5 rounded-lg">
                    <span className="text-moto-muted block text-[11px]">Acceleration</span>
                    <span className="text-moto-text font-bold text-sm">0–100 in 2.9s</span>
                  </div>
                </div>

                {/* Jump to Form CTA */}
                <a
                  href="#reserve"
                  className="block w-full text-center bg-moto-apex text-white font-barlow font-bold text-sm uppercase tracking-wider py-4 rounded-lg shadow-xl shadow-moto-apex/20 hover:bg-moto-apex/90 transition-all"
                >
                  Reserve Pilot Allocation →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* PERFORMANCE DOSSIER & SPEC MATRIX */}
        <section className="py-16 bg-moto-surface border-b border-moto-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-10">
              <span className="text-xs font-mono text-moto-apex uppercase tracking-widest block mb-2">
                TECHNICAL DOSSIER
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-wider text-moto-text uppercase">
                ENGINEERED FOR THE TRACK
              </h2>
              <p className="text-moto-muted text-sm mt-2">
                Uncompromising engineering precision. Every component is optimized for downforce, corner entry stability, and rapid deceleration.
              </p>
            </div>

            {/* Matrix Table */}
            <div className="bg-moto-bg border border-moto-border rounded-xl overflow-hidden shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-moto-border">
                <div className="p-6 space-y-4">
                  <h3 className="font-barlow font-bold text-lg text-moto-apex uppercase tracking-wider">
                    Powertrain & Aerodynamics
                  </h3>
                  <dl className="space-y-3 text-sm font-mono">
                    <div className="flex justify-between border-b border-moto-border/40 pb-2">
                      <dt className="text-moto-muted">Engine Displacement</dt>
                      <dd className="text-moto-text font-semibold">900cc DOHC Inline-4</dd>
                    </div>
                    <div className="flex justify-between border-b border-moto-border/40 pb-2">
                      <dt className="text-moto-muted">Power Output</dt>
                      <dd className="text-moto-apex font-semibold">214 HP @ 13,500 RPM</dd>
                    </div>
                    <div className="flex justify-between border-b border-moto-border/40 pb-2">
                      <dt className="text-moto-muted">Max Torque</dt>
                      <dd className="text-moto-text font-semibold">124 Nm @ 11,200 RPM</dd>
                    </div>
                    <div className="flex justify-between border-b border-moto-border/40 pb-2">
                      <dt className="text-moto-muted">Aerodynamic Downforce</dt>
                      <dd className="text-moto-text font-semibold">Carbon Aero-Winglets (18 kg @ 220 km/h)</dd>
                    </div>
                  </dl>
                </div>

                <div className="p-6 space-y-4">
                  <h3 className="font-barlow font-bold text-lg text-moto-apex uppercase tracking-wider">
                    Chassis, Brakes & Suspension
                  </h3>
                  <dl className="space-y-3 text-sm font-mono">
                    <div className="flex justify-between border-b border-moto-border/40 pb-2">
                      <dt className="text-moto-muted">Dry Weight</dt>
                      <dd className="text-moto-text font-semibold">164 kg (Carbon Monocoque subframe)</dd>
                    </div>
                    <div className="flex justify-between border-b border-moto-border/40 pb-2">
                      <dt className="text-moto-muted">Front Braking</dt>
                      <dd className="text-moto-text font-semibold">Dual 330mm Racing Brakes</dd>
                    </div>
                    <div className="flex justify-between border-b border-moto-border/40 pb-2">
                      <dt className="text-moto-muted">Suspension</dt>
                      <dd className="text-moto-text font-semibold">Fully-Adjustable Premium Racing Suspension</dd>
                    </div>
                    <div className="flex justify-between border-b border-moto-border/40 pb-2">
                      <dt className="text-moto-muted">Exhaust System</dt>
                      <dd className="text-moto-text font-semibold">Handcrafted Titanium 4-into-1 System</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* RESERVATION & ALLOCATION FORM */}
        <section id="reserve" className="py-20 bg-moto-bg">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-moto-surface border border-moto-border rounded-xl p-8 sm:p-12 shadow-2xl">
              <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
                <span className="text-xs font-mono uppercase tracking-widest text-moto-apex">
                  PILOT ALLOCATION REQUEST
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-wider text-moto-text uppercase">
                  RESERVE YOUR APEX RS 900
                </h2>
                <p className="text-moto-muted text-sm">
                  Complete the allocation request form below for priority circuit delivery in the GCC region.
                </p>
              </div>

              {formSubmitted ? (
                <div className="bg-moto-bg border border-moto-apex/40 p-8 rounded-lg text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-moto-apex/20 text-moto-apex mx-auto flex items-center justify-center text-xl font-bold">
                    ✓
                  </div>
                  <h3 className="text-2xl font-bold text-moto-text uppercase font-barlow tracking-wider">
                    Allocation Request Received
                  </h3>
                  <p className="text-sm text-moto-muted max-w-md mx-auto">
                    Thank you, <strong className="text-moto-text">{formData.fullName || "Valued Pilot"}</strong>. Our Meridian Concierge team will contact you at <strong className="text-moto-apex">{formData.email || "your email"}</strong> to confirm your circuit venue appointment at {formData.venue}.
                  </p>
                  <div className="text-xs font-mono text-moto-copper pt-2">
                    UI Simulation Mode • Request Record Generated
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormSubmitted(false)}
                    className="text-xs text-moto-muted underline hover:text-moto-text pt-2"
                  >
                    Submit another reservation
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-mono text-moto-muted uppercase mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="e.g. Tariq Al-Mansoor"
                        className="w-full bg-moto-bg border border-moto-border px-4 py-3 rounded text-sm text-moto-text focus:outline-none focus:border-moto-apex transition-colors"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-mono text-moto-muted uppercase mb-2">
                        Corporate / Personal Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="tariq@example.ae"
                        className="w-full bg-moto-bg border border-moto-border px-4 py-3 rounded text-sm text-moto-text focus:outline-none focus:border-moto-apex transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Phone */}
                    <div>
                      <label className="block text-xs font-mono text-moto-muted uppercase mb-2">
                        GCC Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+971 50 123 4567"
                        className="w-full bg-moto-bg border border-moto-border px-4 py-3 rounded text-sm text-moto-text focus:outline-none focus:border-moto-apex transition-colors"
                      />
                    </div>

                    {/* Delivery Date */}
                    <div>
                      <label className="block text-xs font-mono text-moto-muted uppercase mb-2">
                        Preferred Delivery Date
                      </label>
                      <input
                        type="date"
                        value={formData.deliveryDate}
                        onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                        className="w-full bg-moto-bg border border-moto-border px-4 py-3 rounded text-sm text-moto-text focus:outline-none focus:border-moto-apex transition-colors"
                      />
                    </div>
                  </div>

                  {/* Circuit Venue */}
                  <div>
                    <label className="block text-xs font-mono text-moto-muted uppercase mb-2">
                      Preferred Test Ride & Handover Venue
                    </label>
                    <select
                      value={formData.venue}
                      onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                      className="w-full bg-moto-bg border border-moto-border px-4 py-3 rounded text-sm text-moto-text focus:outline-none focus:border-moto-apex transition-colors"
                    >
                      <option value="Dubai Autodrome Circuit">Dubai Autodrome Circuit (Dubai, UAE)</option>
                      <option value="Yas Marina Circuit">Yas Marina Circuit (Abu Dhabi, UAE)</option>
                      <option value="Dubai Flagship Atelier SZR">Dubai Flagship Atelier (Sheikh Zayed Rd)</option>
                      <option value="Riyadh Pit-Bay Lounge">Riyadh Pit-Bay Lounge (Riyadh, KSA)</option>
                      <option value="Doha Circuit Atelier">Doha Circuit Atelier (Lusail, Qatar)</option>
                    </select>
                  </div>

                  {/* Submit CTA */}
                  <button
                    type="submit"
                    className="w-full bg-moto-apex text-white font-barlow font-bold text-base uppercase tracking-wider py-4 rounded-lg shadow-xl shadow-moto-apex/20 hover:bg-moto-apex/90 transition-all cursor-pointer"
                  >
                    Submit Pilot Allocation Request (148,000 AED) →
                  </button>

                  <div className="text-[11px] text-center font-mono text-moto-muted">
                    Submitting this form creates a simulated reservation inquiry. No financial charge is made.
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
