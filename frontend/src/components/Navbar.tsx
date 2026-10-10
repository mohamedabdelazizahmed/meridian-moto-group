"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useUiStore } from "@/store/ui.store";
import { Routes } from "@/lib/routes";

export default function Navbar() {
  const { mobileMenuOpen, toggleMobileMenu, setMobileMenuOpen } = useUiStore();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? "bg-moto-bg shadow-2xl border-b border-moto-border/80 py-0" 
        : "bg-moto-bg/90 backdrop-blur-md border-b border-moto-border py-2"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Wordmark */}
        <Link href={Routes.Home} className="flex items-center gap-3 group">
          <div className="w-3 h-3 bg-moto-copper rotate-45 transition-transform group-hover:rotate-90"></div>
          <span className="font-barlow font-bold text-xl sm:text-2xl tracking-[0.15em] text-moto-text uppercase">
            MERIDIAN <span className="text-moto-copper font-normal">MOTO GROUP</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-8 text-xs font-semibold tracking-[0.1em] uppercase">
          <Link href="/#marques" className="text-moto-muted hover:text-moto-text transition-colors flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-moto-apex"></span>
            Marques
          </Link>
          <Link href={Routes.ModelDetail("apex-rs-900")} className="text-moto-apex hover:text-white transition-colors">
            Apex RS 900
          </Link>
          <Link href="/#regional-hubs" className="text-moto-muted hover:text-moto-text transition-colors">
            GCC Regional Hubs
          </Link>
          <Link href="/#concierge" className="text-moto-muted hover:text-moto-text transition-colors">
            Experience Concierge
          </Link>
          <Link href={Routes.CmsLogin} className="text-moto-muted hover:text-moto-copper transition-colors border border-moto-border px-3 py-1 rounded bg-moto-surface/50">
            CMS Portal
          </Link>
        </nav>

        {/* Action CTAs */}
        <div className="hidden lg:flex items-center space-x-4">
          <Link
            href={`${Routes.ModelDetail("apex-rs-900")}#reserve`}
            className="bg-moto-copper text-moto-bg font-barlow font-bold text-sm tracking-[0.08em] uppercase px-5 py-2.5 rounded hover:bg-moto-copper/90 transition-all shadow-lg shadow-moto-copper/10 active:scale-95"
          >
            Book Test Ride
          </Link>
        </div>

        {/* Mobile Menu Trigger */}
        <button
          type="button"
          onClick={toggleMobileMenu}
          className="lg:hidden p-2 text-moto-muted hover:text-moto-text focus:outline-none"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-moto-surface border-b border-moto-border px-4 pt-4 pb-6 space-y-4">
          <div className="flex flex-col space-y-3 font-barlow text-sm font-semibold uppercase tracking-wider">
            <Link
              href="/#marques"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-moto-muted hover:text-moto-text hover:bg-moto-bg/50 rounded"
            >
              Marques (Apex • Volt • Nomad • Sovereign)
            </Link>
            <Link
              href={Routes.ModelDetail("apex-rs-900")}
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-moto-apex hover:bg-moto-bg/50 rounded flex items-center justify-between"
            >
              <span>Apex RS 900 Flagship</span>
              <span className="text-xs bg-moto-apex/20 text-moto-apex px-2 py-0.5 rounded">214 HP</span>
            </Link>
            <Link
              href="/#regional-hubs"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-moto-muted hover:text-moto-text hover:bg-moto-bg/50 rounded"
            >
              GCC Regional Network (Dubai • Riyadh • Doha)
            </Link>
            <Link
              href="/#concierge"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-moto-muted hover:text-moto-text hover:bg-moto-bg/50 rounded"
            >
              Experience Concierge
            </Link>
            <Link
              href={`${Routes.ModelDetail("apex-rs-900")}#reserve`}
              onClick={() => setMobileMenuOpen(false)}
              className="bg-moto-copper text-moto-bg text-center py-3 rounded font-barlow font-bold uppercase"
            >
              Book Test Ride
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
