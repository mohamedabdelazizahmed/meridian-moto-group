"use client";

import { useState } from "react";
import CmsSidebar from "@/components/CmsSidebar";
import CmsHeader from "@/components/CmsHeader";
import CmsFooter from "@/components/CmsFooter";

interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: "Administrator" | "Data Entry" | "Viewer";
  assignedBrands: ("Apex" | "Nomad" | "Volt" | "Sovereign")[];
  avatarColor: string;
}

const INITIAL_USERS: UserRecord[] = [
  {
    id: "usr-1",
    name: "Karim Al-Hassan",
    email: "karim.hassan@meridianmoto.ae",
    role: "Administrator",
    assignedBrands: ["Apex", "Nomad", "Volt", "Sovereign"],
    avatarColor: "bg-moto-copper/20 text-moto-copper border-moto-copper/40",
  },
  {
    id: "usr-2",
    name: "Tariq Al-Mansoor",
    email: "tariq.mansoor@meridianmoto.ae",
    role: "Data Entry",
    assignedBrands: ["Apex", "Nomad"],
    avatarColor: "bg-moto-apex/20 text-moto-apex border-moto-apex/40",
  },
  {
    id: "usr-3",
    name: "Zaid Al-Qasim",
    email: "zaid.qasim@meridianmoto.ae",
    role: "Data Entry",
    assignedBrands: ["Volt", "Sovereign"],
    avatarColor: "bg-moto-volt/20 text-moto-volt border-moto-volt/40",
  },
  {
    id: "usr-4",
    name: "Layla Mahmoud",
    email: "layla.mahmoud@meridianmoto.ae",
    role: "Viewer",
    assignedBrands: ["Apex", "Nomad", "Volt", "Sovereign"],
    avatarColor: "bg-moto-sovereign/20 text-moto-sovereign border-moto-sovereign/40",
  },
];

export default function CmsAdminUsersPage() {
  const [role, setRole] = useState<"data_entry" | "admin">("admin");
  const [users, setUsers] = useState<UserRecord[]>(INITIAL_USERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("All");

  // Add User Modal State
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formRole, setFormRole] = useState<"Administrator" | "Data Entry" | "Viewer">("Data Entry");
  const [selectedBrands, setSelectedBrands] = useState<("Apex" | "Nomad" | "Volt" | "Sovereign")[]>([
    "Apex",
    "Nomad",
  ]);

  const toggleBrandSelection = (brand: "Apex" | "Nomad" | "Volt" | "Sovereign") => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter((b) => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: UserRecord = {
      id: `usr-${Date.now()}`,
      name: formName,
      email: formEmail.includes("@") ? formEmail : `${formEmail}@meridianmoto.ae`,
      role: formRole,
      assignedBrands: selectedBrands,
      avatarColor:
        formRole === "Administrator"
          ? "bg-moto-copper/20 text-moto-copper border-moto-copper/40"
          : "bg-moto-apex/20 text-moto-apex border-moto-apex/40",
    };
    setUsers([newUser, ...users]);
    setIsAddUserModalOpen(false);
    setFormName("");
    setFormEmail("");
  };

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter((u) => u.id !== id));
  };

  const filteredUsers = users.filter((u) => {
    if (roleFilter !== "All" && u.role !== roleFilter) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    }
    return true;
  });

  const getBrandPillClass = (brand: string) => {
    switch (brand) {
      case "Apex":
        return "bg-moto-apex/15 text-moto-apex border-moto-apex/30";
      case "Volt":
        return "bg-moto-volt/15 text-moto-volt border-moto-volt/30";
      case "Nomad":
        return "bg-moto-nomad/15 text-moto-nomad border-moto-nomad/30";
      case "Sovereign":
        return "bg-moto-sovereign/15 text-moto-sovereign border-moto-sovereign/30";
      default:
        return "bg-moto-border text-moto-muted";
    }
  };

  const getRoleBadgeClass = (r: string) => {
    switch (r) {
      case "Administrator":
        return "bg-moto-copper/20 text-moto-copper border-moto-copper/40";
      case "Data Entry":
        return "bg-moto-apex/20 text-moto-apex border-moto-apex/40";
      case "Viewer":
        return "bg-moto-sovereign/20 text-moto-sovereign border-moto-sovereign/40";
      default:
        return "bg-moto-border text-moto-muted";
    }
  };

  return (
    <div className="min-h-screen flex bg-moto-bg text-moto-text selection:bg-moto-copper selection:text-white">
      {/* Sidebar */}
      <CmsSidebar currentRole={role} onToggleRole={(r) => setRole(r)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <CmsHeader
          title="Admin Users & Clearance Management"
          subtitle="Enterprise Role-Based Access Control (RBAC) & Brand Clearance Scoping."
          role={role}
          userName="Karim Al-Hassan"
          assignedBrands={["Apex", "Volt", "Nomad", "Sovereign"]}
          actionButton={
            <button
              type="button"
              onClick={() => setIsAddUserModalOpen(true)}
              className="bg-moto-copper text-moto-bg font-barlow font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded shadow hover:bg-moto-copper/90 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>+ ADD USER</span>
            </button>
          }
        />

        <main className="p-6 space-y-6 flex-1">
          {/* TOP METRICS CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-moto-surface border border-moto-border p-5 rounded-xl space-y-1">
              <span className="text-xs font-mono text-moto-muted uppercase">System Users</span>
              <div className="text-3xl font-bold font-barlow text-moto-text">{users.length}</div>
              <div className="text-[11px] font-mono text-moto-muted font-normal">Active Operators</div>
            </div>

            <div className="bg-moto-surface border border-moto-border p-5 rounded-xl space-y-1">
              <span className="text-xs font-mono text-moto-muted uppercase">Administrators</span>
              <div className="text-3xl font-bold font-barlow text-moto-copper">
                {users.filter((u) => u.role === "Administrator").length}
              </div>
              <div className="text-[11px] font-mono text-moto-copper font-normal">Full System Access</div>
            </div>

            <div className="bg-moto-surface border border-moto-border p-5 rounded-xl space-y-1">
              <span className="text-xs font-mono text-moto-muted uppercase">Data Entry Operators</span>
              <div className="text-3xl font-bold font-barlow text-moto-apex">
                {users.filter((u) => u.role === "Data Entry").length}
              </div>
              <div className="text-[11px] font-mono text-moto-muted font-normal">Marque Scoped Access</div>
            </div>

            <div className="bg-moto-surface border border-moto-border p-5 rounded-xl space-y-1">
              <span className="text-xs font-mono text-moto-muted uppercase">Marque Coverage</span>
              <div className="text-3xl font-bold font-barlow text-moto-volt">4 / 4</div>
              <div className="text-[11px] font-mono text-moto-volt font-normal">100% Brand Security Scoped</div>
            </div>
          </div>

          {/* CONTROLS BAR */}
          <div className="bg-moto-surface border border-moto-border p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Search */}
            <div className="w-full sm:w-80 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search user name or email..."
                className="w-full bg-moto-bg border border-moto-border px-4 py-2 pl-9 rounded text-xs text-moto-text focus:outline-none focus:border-moto-copper transition-colors"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-moto-muted">🔍</span>
            </div>

            {/* Role Filter */}
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-moto-muted">Filter Role:</span>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-moto-bg border border-moto-border px-3 py-1.5 rounded text-xs text-moto-text focus:outline-none focus:border-moto-copper"
              >
                <option value="All">All Roles</option>
                <option value="Administrator">Administrator</option>
                <option value="Data Entry">Data Entry</option>
                <option value="Viewer">Viewer</option>
              </select>
            </div>
          </div>

          {/* USERS DATA TABLE */}
          <div className="bg-moto-surface border border-moto-border rounded-xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-moto-bg border-b border-moto-border text-xs font-mono text-moto-muted uppercase tracking-wider">
                    <th className="py-4 px-6">User Operator</th>
                    <th className="py-4 px-6">Corporate Email</th>
                    <th className="py-4 px-6 w-36">Clearance Role</th>
                    <th className="py-4 px-6">Assigned Marque Clearance</th>
                    <th className="py-4 px-6 w-24 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-moto-border/60">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-moto-muted text-sm">
                        No user records match the query.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-moto-bg/50 transition-colors">
                        {/* Name & Avatar */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-9 h-9 rounded-full border flex items-center justify-center font-bold text-xs uppercase ${u.avatarColor}`}
                            >
                              {u.name.substring(0, 2)}
                            </div>
                            <div>
                              <div className="font-bold text-moto-text font-barlow text-base tracking-wider uppercase">
                                {u.name}
                              </div>
                              <div className="text-[11px] font-mono text-moto-muted">ID: {u.id}</div>
                            </div>
                          </div>
                        </td>

                        {/* Corporate Email */}
                        <td className="py-4 px-6 font-mono text-xs text-moto-text">{u.email}</td>

                        {/* Role Pill */}
                        <td className="py-4 px-6">
                          <span
                            className={`inline-block px-3 py-1 rounded text-xs font-mono font-bold uppercase border ${getRoleBadgeClass(
                              u.role
                            )}`}
                          >
                            {u.role}
                          </span>
                        </td>

                        {/* Assigned Brands Grid */}
                        <td className="py-4 px-6">
                          <div className="flex flex-wrap gap-1.5">
                            {u.assignedBrands.map((b) => (
                              <span
                                key={b}
                                className={`px-2.5 py-0.5 rounded text-[11px] font-mono font-bold uppercase border ${getBrandPillClass(
                                  b
                                )}`}
                              >
                                {b}
                              </span>
                            ))}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-6 text-right">
                          <button
                            type="button"
                            onClick={() => handleDeleteUser(u.id)}
                            className="p-1.5 text-moto-muted hover:text-moto-apex border border-moto-border rounded hover:border-moto-apex transition-colors"
                            title="Remove User Access"
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="bg-moto-bg px-6 py-3 border-t border-moto-border text-xs font-mono text-moto-muted">
              Showing <strong className="text-moto-text">{filteredUsers.length}</strong> system users
            </div>
          </div>
        </main>

        <CmsFooter />
      </div>

      {/* ADD USER MODAL (PRD Specified 4-card brand grid) */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-moto-surface border border-moto-border rounded-xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-moto-border pb-3">
              <h3 className="font-barlow font-bold text-xl uppercase tracking-wider text-moto-text">
                + Add User & Assign Marque Clearances
              </h3>
              <button
                type="button"
                onClick={() => setIsAddUserModalOpen(false)}
                className="text-moto-muted hover:text-moto-text text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-moto-muted uppercase mb-1">
                  Full Operator Name *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Layla Mahmoud"
                  className="w-full bg-moto-bg border border-moto-border px-3 py-2 rounded text-xs text-moto-text focus:outline-none focus:border-moto-copper"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-moto-muted uppercase mb-1">
                  Corporate Email (@meridianmoto.ae) *
                </label>
                <input
                  type="email"
                  required
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="layla.mahmoud@meridianmoto.ae"
                  className="w-full bg-moto-bg border border-moto-border px-3 py-2 rounded text-xs text-moto-text focus:outline-none focus:border-moto-copper font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-moto-muted uppercase mb-1">
                  System Clearance Role
                </label>
                <select
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value as "Administrator" | "Data Entry" | "Viewer")}
                  className="w-full bg-moto-bg border border-moto-border px-3 py-2 rounded text-xs text-moto-text focus:outline-none focus:border-moto-copper"
                >
                  <option value="Data Entry">Data Entry (Marque Scoped)</option>
                  <option value="Administrator">Administrator (All Marques & RBAC)</option>
                  <option value="Viewer">Viewer (Read-only)</option>
                </select>
              </div>

              {/* PRD MULTI-SELECT 4-CARD BRAND SELECTION GRID */}
              <div>
                <label className="block text-xs font-mono text-moto-copper uppercase mb-2 font-semibold">
                  Assign Marques (4-Brand Security Scoping Grid):
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {/* Apex Card */}
                  <div
                    onClick={() => toggleBrandSelection("Apex")}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedBrands.includes("Apex")
                        ? "bg-moto-apex/15 border-moto-apex text-moto-text"
                        : "bg-moto-bg border-moto-border text-moto-muted hover:border-moto-muted"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold font-barlow uppercase flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-moto-apex"></span>
                        Apex Marque
                      </span>
                      <span className="text-xs">{selectedBrands.includes("Apex") ? "☑" : "☐"}</span>
                    </div>
                    <span className="text-[10px] font-mono text-moto-muted block mt-1">
                      Circuit & Performance
                    </span>
                  </div>

                  {/* Nomad Card */}
                  <div
                    onClick={() => toggleBrandSelection("Nomad")}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedBrands.includes("Nomad")
                        ? "bg-moto-nomad/15 border-moto-nomad text-moto-text"
                        : "bg-moto-bg border-moto-border text-moto-muted hover:border-moto-muted"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold font-barlow uppercase flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-moto-nomad"></span>
                        Nomad Marque
                      </span>
                      <span className="text-xs">{selectedBrands.includes("Nomad") ? "☑" : "☐"}</span>
                    </div>
                    <span className="text-[10px] font-mono text-moto-muted block mt-1">
                      Adventure & Touring
                    </span>
                  </div>

                  {/* Volt Card */}
                  <div
                    onClick={() => toggleBrandSelection("Volt")}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedBrands.includes("Volt")
                        ? "bg-moto-volt/15 border-moto-volt text-moto-text"
                        : "bg-moto-bg border-moto-border text-moto-muted hover:border-moto-muted"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold font-barlow uppercase flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-moto-volt"></span>
                        Volt Marque
                      </span>
                      <span className="text-xs">{selectedBrands.includes("Volt") ? "☑" : "☐"}</span>
                    </div>
                    <span className="text-[10px] font-mono text-moto-muted block mt-1">
                      Urban EV Mobility
                    </span>
                  </div>

                  {/* Sovereign Card */}
                  <div
                    onClick={() => toggleBrandSelection("Sovereign")}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedBrands.includes("Sovereign")
                        ? "bg-moto-sovereign/15 border-moto-sovereign text-moto-text"
                        : "bg-moto-bg border-moto-border text-moto-muted hover:border-moto-muted"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold font-barlow uppercase flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-moto-sovereign"></span>
                        Sovereign Marque
                      </span>
                      <span className="text-xs">{selectedBrands.includes("Sovereign") ? "☑" : "☐"}</span>
                    </div>
                    <span className="text-[10px] font-mono text-moto-muted block mt-1">
                      Heritage & Cruiser
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-moto-border">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="px-4 py-2 text-xs font-mono text-moto-muted hover:text-moto-text"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-moto-copper text-moto-bg font-barlow font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded shadow hover:bg-moto-copper/90"
                >
                  Save & Assign Brands
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
