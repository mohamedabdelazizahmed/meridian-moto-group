"use client";

import Link from "next/link";

interface CmsHeaderProps {
  title: string;
  subtitle?: string;
  role: "data_entry" | "admin";
  userName: string;
  assignedBrands?: string[];
  actionButton?: React.ReactNode;
}

export default function CmsHeader({
  title,
  subtitle,
  role,
  userName,
  assignedBrands = ["Apex", "Nomad"],
  actionButton,
}: CmsHeaderProps) {
  return (
    <header className="bg-moto-surface border-b border-moto-border px-6 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-wider text-moto-text uppercase">
            {title}
          </h1>
          <span
            className={`px-2.5 py-0.5 rounded text-xs font-barlow font-bold tracking-wider uppercase ${
              role === "admin"
                ? "bg-moto-copper/20 text-moto-copper border border-moto-copper/40"
                : "bg-moto-apex/20 text-moto-apex border border-moto-apex/40"
            }`}
          >
            {role === "admin" ? "Administrator Clearance" : "Data Entry Clearance"}
          </span>
        </div>
        {subtitle && <p className="text-sm text-moto-muted mt-1">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        {/* User Scope Info Pill */}
        <div className="bg-moto-bg border border-moto-border px-4 py-2 rounded flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-moto-copper/20 text-moto-copper border border-moto-copper/40 flex items-center justify-center font-bold text-xs">
            {userName.substring(0, 2).toUpperCase()}
          </div>
          <div className="text-xs">
            <div className="text-moto-text font-semibold">{userName}</div>
            <div className="text-moto-muted font-mono text-[11px] flex items-center gap-1">
              <span>Scope:</span>
              <span className="text-moto-copper font-medium">
                {role === "admin" ? "All marques (4)" : assignedBrands.join(", ")}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button (e.g. Add Model / Add User) */}
        {actionButton}

        {/* Sign out shortcut */}
        <Link
          href="/cms/login"
          className="text-xs text-moto-muted hover:text-moto-apex p-2 transition-colors border border-moto-border rounded bg-moto-bg"
          title="Sign Out"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </Link>
      </div>
    </header>
  );
}
