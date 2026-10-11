"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface CmsSidebarProps {
  currentRole?: "data_entry" | "admin";
  role?: "data_entry" | "admin";
  onToggleRole?: (role: "data_entry" | "admin") => void;
  onRoleChange?: (role: "data_entry" | "admin") => void;
}

export default function CmsSidebar({ currentRole, role, onToggleRole, onRoleChange }: CmsSidebarProps) {
  const pathname = usePathname();
  const activeRole = currentRole || role || "admin";
  const handleToggle = onToggleRole || onRoleChange || (() => {});

  const isModelsActive = pathname === "/cms/models" || pathname === "/cms";
  const isBrandsActive = pathname === "/cms/brands";
  const isPromotionsActive = pathname === "/cms/promotions";

  return (
    <aside className="w-64 bg-moto-surface border-r border-moto-border flex flex-col justify-between shrink-0 min-h-screen">
      <div>
        {/* Header */}
        <div className="p-6 border-b border-moto-border">
          <Link href="/" className="block">
            <span className="font-barlow font-bold text-lg tracking-[0.12em] text-moto-text uppercase block">
              MERIDIAN <span className="text-moto-copper font-normal">CMS</span>
            </span>
            <span className="text-[10px] uppercase font-mono tracking-widest text-moto-muted block mt-0.5">
              Enterprise Fleet Platform
            </span>
          </Link>
        </div>

        {/* User Role Badge Indicator */}
        <div className="p-4 mx-3 my-4 bg-moto-bg rounded border border-moto-border text-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-mono text-[11px] text-moto-muted uppercase">Clearance Level</span>
            <span
              className={`px-2 py-0.5 rounded font-barlow text-[11px] font-bold tracking-wider uppercase ${
                activeRole === "admin"
                  ? "bg-moto-copper/20 text-moto-copper border border-moto-copper/40"
                  : "bg-moto-apex/20 text-moto-apex border border-moto-apex/40"
              }`}
            >
              {activeRole === "admin" ? "Admin" : "Data Entry"}
            </span>
          </div>

          <div className="text-[12px] text-moto-text font-medium truncate">
            {activeRole === "admin" ? "Karim Al-Hassan" : "Tariq Al-Mansoor"}
          </div>
          <div className="text-[11px] text-moto-muted truncate font-mono">
            {activeRole === "admin" ? "Scope: All 4 Marques" : "Assigned: Apex, Nomad"}
          </div>

          {/* Quick Role Switcher for Testing */}
          <div className="mt-3 pt-2 border-t border-moto-border/60 flex items-center justify-between">
            <span className="text-[10px] text-moto-muted uppercase font-mono">Switch Role:</span>
            <button
              type="button"
              onClick={() => handleToggle(activeRole === "admin" ? "data_entry" : "admin")}
              className="text-[10px] text-moto-copper underline hover:text-white transition-colors"
            >
              {activeRole === "admin" ? "Test Data Entry View" : "Test Admin View"}
            </button>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="px-3 space-y-1 text-sm font-medium">
          <div className="px-3 py-2 text-[11px] font-mono tracking-widest text-moto-muted uppercase">
            Catalog Management
          </div>

          <Link
            href="/cms/models"
            className={`flex items-center justify-between px-3 py-2.5 rounded transition-colors ${
              isModelsActive
                ? "bg-moto-copper/15 text-moto-copper border border-moto-copper/30 font-semibold"
                : "text-moto-muted hover:text-moto-text hover:bg-moto-bg/50"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span>Models Catalog</span>
            </div>
          </Link>

          <Link
            href="/cms/brands"
            className={`flex items-center justify-between px-3 py-2.5 rounded transition-colors ${
              isBrandsActive
                ? "bg-moto-copper/15 text-moto-copper border border-moto-copper/30 font-semibold"
                : "text-moto-muted hover:text-moto-text hover:bg-moto-bg/50"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span>Marque Brands</span>
            </div>
          </Link>

          <Link
            href="/cms/promotions"
            className={`flex items-center justify-between px-3 py-2.5 rounded transition-colors ${
              isPromotionsActive
                ? "bg-moto-copper/15 text-moto-copper border border-moto-copper/30 font-semibold"
                : "text-moto-muted hover:text-moto-text hover:bg-moto-bg/50"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
              <span>Promotions</span>
            </div>
          </Link>
        </nav>
      </div>

      <div className="p-4 border-t border-moto-border text-xs font-mono text-moto-muted">
        Meridian CMS v1.0
      </div>
    </aside>
  );
}
