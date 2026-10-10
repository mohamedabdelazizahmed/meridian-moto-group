"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { Routes } from "@/lib/routes";

interface CmsSidebarProps {
  currentRole?: "data_entry" | "admin";
  onToggleRole?: (role: "data_entry" | "admin") => void;
}

export default function CmsSidebar({ currentRole = "data_entry", onToggleRole }: CmsSidebarProps) {
  const pathname = usePathname();

  const isModelsActive = pathname === "/cms/models" || pathname === "/cms";
  const isBrandsActive = pathname === "/cms/brands";
  const isPromotionsActive = pathname === "/cms/promotions";
  const isUsersActive = pathname === "/cms/admin/users";

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
                currentRole === "admin"
                  ? "bg-moto-copper/20 text-moto-copper border border-moto-copper/40"
                  : "bg-moto-apex/20 text-moto-apex border border-moto-apex/40"
              }`}
            >
              {currentRole === "admin" ? "Admin" : "Data Entry"}
            </span>
          </div>

          <div className="text-[12px] text-moto-text font-medium truncate">
            {currentRole === "admin" ? "Karim Al-Hassan" : "Tariq Al-Mansoor"}
          </div>
          <div className="text-[11px] text-moto-muted truncate font-mono">
            {currentRole === "admin" ? "Scope: All 4 Marques" : "Assigned: Apex, Nomad"}
          </div>

          {/* Quick Role Switcher for Testing */}
          {onToggleRole && (
            <div className="mt-3 pt-2 border-t border-moto-border/60 flex items-center justify-between">
              <span className="text-[10px] text-moto-muted uppercase font-mono">Switch Role:</span>
              <button
                type="button"
                onClick={() => onToggleRole(currentRole === "admin" ? "data_entry" : "admin")}
                className="text-[10px] text-moto-copper underline hover:text-white transition-colors"
              >
                {currentRole === "admin" ? "Test Data Entry View" : "Test Admin View"}
              </button>
            </div>
          )}
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
            <span className="text-xs bg-moto-bg px-2 py-0.5 rounded border border-moto-border font-mono text-moto-muted">
              4
            </span>
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h10M7 12h10m-7 5h7" />
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 16h14" />
              </svg>
              <span>Promotions</span>
            </div>
          </Link>

          {/* RBAC Section for Admin */}
          <div className="pt-4 px-3 py-2 text-[11px] font-mono tracking-widest text-moto-muted uppercase flex items-center justify-between">
            <span>Administration</span>
            {currentRole === "data_entry" && (
              <span className="text-[10px] text-moto-apex uppercase font-normal">(Restricted)</span>
            )}
          </div>

          {currentRole === "admin" ? (
            <Link
              href="/cms/admin/users"
              className={`flex items-center justify-between px-3 py-2.5 rounded transition-colors ${
                isUsersActive
                  ? "bg-moto-copper/15 text-moto-copper border border-moto-copper/30 font-semibold"
                  : "text-moto-muted hover:text-moto-text hover:bg-moto-bg/50"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span>Users Clearance</span>
              </div>
              <span className="text-[10px] font-bold bg-moto-copper text-moto-bg px-1.5 py-0.5 rounded uppercase">
                ADMIN
              </span>
            </Link>
          ) : (
            /* Explicitly Hidden or Disabled in Data Entry mode per RBAC rule */
            <div className="px-3 py-2 text-moto-muted/30 text-xs italic bg-moto-bg/30 rounded border border-moto-border/30">
              🔒 Users Clearance menu hidden for Data Entry users
            </div>
          )}
        </nav>
      </div>

      {/* Footer Section */}
      <div className="p-4 border-t border-moto-border space-y-3">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs text-moto-muted hover:text-moto-text transition-colors px-2 py-1"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Return to Consumer Website</span>
        </Link>
        <button
          type="button"
          onClick={async () => {
            try {
              await fetch("/api/auth/logout", { method: "POST" });
            } catch {
              // ignore
            }
            useAuthStore.getState().clear();
            window.location.href = Routes.CmsLogin;
          }}
          className="block w-full text-center text-xs font-barlow font-bold uppercase tracking-wider text-moto-muted hover:text-moto-apex border border-moto-border py-2 rounded bg-moto-bg hover:border-moto-apex/40 transition-colors cursor-pointer"
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
}
