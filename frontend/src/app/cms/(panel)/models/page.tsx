/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import CmsSidebar from "@/components/CmsSidebar";
import CmsHeader from "@/components/CmsHeader";
import CmsFooter from "@/components/CmsFooter";

interface ModelItem {
  id: string;
  name: string;
  specs: string;
  brand: "Apex" | "Volt" | "Nomad" | "Sovereign";
  price: number;
  status: "Published" | "Draft";
  imgUrl: string;
}

const INITIAL_MODELS: ModelItem[] = [
  {
    id: "apex-rs-900",
    name: "Apex RS 900",
    specs: "900cc Inline-4 • 214 HP • 164 kg",
    brand: "Apex",
    price: 148000,
    status: "Published",
    imgUrl: "/images/motorcycles/apex-rs-900.svg",
  },
  {
    id: "apex-track-600",
    name: "Apex Track 600",
    specs: "599cc Inline-4 • 138 HP • 156 kg",
    brand: "Apex",
    price: 98000,
    status: "Published",
    imgUrl: "/images/motorcycles/apex-track-600.svg",
  },
  {
    id: "nomad-horizon-1250",
    name: "Nomad Horizon 1250",
    specs: "1250cc Boxer Twin • 145 HP • 237 kg",
    brand: "Nomad",
    price: 112500,
    status: "Draft",
    imgUrl: "/images/motorcycles/nomad-horizon-1250.svg",
  },
  {
    id: "nomad-desert-800",
    name: "Nomad Desert 800",
    specs: "799cc Twin • 95 HP • 198 kg",
    brand: "Nomad",
    price: 76000,
    status: "Draft",
    imgUrl: "/images/motorcycles/nomad-desert-800.svg",
  },
];

export default function CmsModelsPage() {
  const [role, setRole] = useState<"data_entry" | "admin">("data_entry");
  const [models, setModels] = useState<ModelItem[]>(INITIAL_MODELS);
  const [searchQuery, setSearchQuery] = useState("");
  const [brandFilter, setBrandFilter] = useState<string>("All");
  const [statusTab, setStatusTab] = useState<"All" | "Published" | "Draft">("All");

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<ModelItem | null>(null);
  const [deletingModelId, setDeletingModelId] = useState<string | null>(null);

  // Form inputs for Add/Edit Modal
  const [formName, setFormName] = useState("");
  const [formSpecs, setFormSpecs] = useState("");
  const [formBrand, setFormBrand] = useState<"Apex" | "Volt" | "Nomad" | "Sovereign">("Apex");
  const [formPrice, setFormPrice] = useState<number>(125000);
  const [formStatus, setFormStatus] = useState<"Published" | "Draft">("Published");

  const openAddModal = () => {
    setFormName("");
    setFormSpecs("900cc • 180 HP • 170 kg");
    setFormBrand(role === "data_entry" ? "Apex" : "Apex");
    setFormPrice(135000);
    setFormStatus("Published");
    setEditingModel(null);
    setIsAddModalOpen(true);
  };

  const openEditModal = (item: ModelItem) => {
    setEditingModel(item);
    setFormName(item.name);
    setFormSpecs(item.specs);
    setFormBrand(item.brand);
    setFormPrice(item.price);
    setFormStatus(item.status);
    setIsAddModalOpen(true);
  };

  const handleSaveModel = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingModel) {
      setModels(
        models.map((m) =>
          m.id === editingModel.id
            ? { ...m, name: formName, specs: formSpecs, brand: formBrand, price: Number(formPrice), status: formStatus }
            : m
        )
      );
    } else {
      const newModel: ModelItem = {
        id: `model-${Date.now()}`,
        name: formName,
        specs: formSpecs,
        brand: formBrand,
        price: Number(formPrice),
        status: formStatus,
        imgUrl: INITIAL_MODELS[0].imgUrl,
      };
      setModels([newModel, ...models]);
    }
    setIsAddModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setModels(models.filter((m) => m.id !== id));
    setDeletingModelId(null);
  };

  // Filtered models
  const filteredModels = models.filter((m) => {
    // Brand scoping for Data Entry role: can only view assigned brands (Apex, Nomad)
    if (role === "data_entry" && m.brand !== "Apex" && m.brand !== "Nomad") {
      return false;
    }
    if (brandFilter !== "All" && m.brand !== brandFilter) {
      return false;
    }
    if (statusTab !== "All" && m.status !== statusTab) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return m.name.toLowerCase().includes(q) || m.specs.toLowerCase().includes(q);
    }
    return true;
  });

  const publishedCount = models.filter((m) => m.status === "Published").length;
  const draftCount = models.filter((m) => m.status === "Draft").length;
  const totalValue = models.reduce((acc, m) => acc + m.price, 0);

  const getBrandColorBadge = (brand: string) => {
    switch (brand) {
      case "Apex":
        return "bg-moto-apex/20 text-moto-apex border-moto-apex/40";
      case "Volt":
        return "bg-moto-volt/20 text-moto-volt border-moto-volt/40";
      case "Nomad":
        return "bg-moto-nomad/20 text-moto-nomad border-moto-nomad/40";
      case "Sovereign":
        return "bg-moto-sovereign/20 text-moto-sovereign border-moto-sovereign/40";
      default:
        return "bg-moto-border text-moto-text";
    }
  };

  return (
    <div className="min-h-screen flex bg-moto-bg text-moto-text selection:bg-moto-copper selection:text-white">
      {/* Sidebar */}
      <CmsSidebar currentRole={role} onToggleRole={(r) => setRole(r)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <CmsHeader
          title="Models Catalog Management"
          subtitle={
            role === "data_entry"
              ? "Fleet inventory administration scope isolated to assigned marques: Apex & Nomad."
              : "Lead administrator fleet management across all 4 marques."
          }
          role={role}
          userName={role === "admin" ? "Karim Al-Hassan" : "Tariq Al-Mansoor"}
          assignedBrands={role === "admin" ? ["Apex", "Volt", "Nomad", "Sovereign"] : ["Apex", "Nomad"]}
          actionButton={
            <button
              type="button"
              onClick={openAddModal}
              className="bg-moto-copper text-moto-bg font-barlow font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded shadow hover:bg-moto-copper/90 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>+ ADD MODEL</span>
            </button>
          }
        />

        <main className="p-6 space-y-6 flex-1">
          {/* FLEET ANALYTICS DASHBOARD OVERVIEW CARDS (Screen 9555e02d4a4b4e76b2c38e29bfa60433 integration) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-moto-surface border border-moto-border p-5 rounded-xl space-y-1">
              <span className="text-xs font-mono text-moto-muted uppercase">Total Models</span>
              <div className="text-3xl font-bold font-barlow text-moto-text">{models.length}</div>
              <div className="text-[11px] font-mono text-moto-muted">Assigned Fleet Units</div>
            </div>

            <div className="bg-moto-surface border border-moto-border p-5 rounded-xl space-y-1">
              <span className="text-xs font-mono text-moto-muted uppercase">Published Models</span>
              <div className="text-3xl font-bold font-barlow text-moto-copper">{publishedCount}</div>
              <div className="text-[11px] font-mono text-moto-copper">Active in Consumer Storefront</div>
            </div>

            <div className="bg-moto-surface border border-moto-border p-5 rounded-xl space-y-1">
              <span className="text-xs font-mono text-moto-muted uppercase">Draft Models</span>
              <div className="text-3xl font-bold font-barlow text-moto-apex">{draftCount}</div>
              <div className="text-[11px] font-mono text-moto-muted">Pending Clearance Review</div>
            </div>

            <div className="bg-moto-surface border border-moto-border p-5 rounded-xl space-y-1">
              <span className="text-xs font-mono text-moto-muted uppercase">Catalog Total Value</span>
              <div className="text-3xl font-bold font-barlow text-moto-text">
                {totalValue.toLocaleString()} <span className="text-xs text-moto-muted font-normal">AED</span>
              </div>
              <div className="text-[11px] font-mono text-moto-muted">Cumulative MSRP Value</div>
            </div>
          </div>

          {/* CONTROLS & FILTER BAR */}
          <div className="bg-moto-surface border border-moto-border p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="w-full md:w-80 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search models..."
                className="w-full bg-moto-bg border border-moto-border px-4 py-2 pl-9 rounded text-xs text-moto-text focus:outline-none focus:border-moto-copper transition-colors"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-moto-muted">🔍</span>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              {/* Brand Filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-moto-muted">Brand:</span>
                <select
                  value={brandFilter}
                  onChange={(e) => setBrandFilter(e.target.value)}
                  className="bg-moto-bg border border-moto-border px-3 py-1.5 rounded text-xs text-moto-text focus:outline-none focus:border-moto-copper"
                >
                  <option value="All">All Assigned Brands</option>
                  <option value="Apex">Apex</option>
                  <option value="Nomad">Nomad</option>
                  {role === "admin" && (
                    <>
                      <option value="Volt">Volt</option>
                      <option value="Sovereign">Sovereign</option>
                    </>
                  )}
                </select>
              </div>

              {/* Status Tabs */}
              <div className="bg-moto-bg border border-moto-border p-1 rounded flex items-center space-x-1 text-xs">
                <button
                  type="button"
                  onClick={() => setStatusTab("All")}
                  className={`px-3 py-1 rounded font-barlow font-bold uppercase ${
                    statusTab === "All" ? "bg-moto-copper text-moto-bg" : "text-moto-muted"
                  }`}
                >
                  All ({models.length})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusTab("Published")}
                  className={`px-3 py-1 rounded font-barlow font-bold uppercase ${
                    statusTab === "Published" ? "bg-moto-copper text-moto-bg" : "text-moto-muted"
                  }`}
                >
                  Published ({publishedCount})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusTab("Draft")}
                  className={`px-3 py-1 rounded font-barlow font-bold uppercase ${
                    statusTab === "Draft" ? "bg-moto-copper text-moto-bg" : "text-moto-muted"
                  }`}
                >
                  Draft ({draftCount})
                </button>
              </div>
            </div>
          </div>

          {/* DATA TABLE ARCHITECTURE */}
          <div className="bg-moto-surface border border-moto-border rounded-xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-moto-bg border-b border-moto-border text-xs font-mono text-moto-muted uppercase tracking-wider">
                    <th className="py-4 px-6 w-20">Image</th>
                    <th className="py-4 px-6">Model Name & Specs</th>
                    <th className="py-4 px-6 w-36">Brand</th>
                    <th className="py-4 px-6 w-36">Price (AED)</th>
                    <th className="py-4 px-6 w-32">Status</th>
                    <th className="py-4 px-6 w-28 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-moto-border/60">
                  {filteredModels.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-moto-muted text-sm">
                        No model records match the selected search or brand scoping filter.
                      </td>
                    </tr>
                  ) : (
                    filteredModels.map((item) => (
                      <tr key={item.id} className="hover:bg-moto-bg/50 transition-colors">
                        {/* Image */}
                        <td className="py-4 px-6">
                          <div className="w-14 h-10 bg-moto-bg border border-moto-border rounded overflow-hidden relative">
                            <img src={item.imgUrl} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                        </td>

                        {/* Name & Specs */}
                        <td className="py-4 px-6">
                          <div className="font-bold text-moto-text font-barlow text-base tracking-wider uppercase">
                            {item.name}
                          </div>
                          <div className="text-xs font-mono text-moto-muted mt-0.5">{item.specs}</div>
                        </td>

                        {/* Brand */}
                        <td className="py-4 px-6">
                          <span
                            className={`inline-block px-3 py-1 rounded text-xs font-mono font-bold uppercase border ${getBrandColorBadge(
                              item.brand
                            )}`}
                          >
                            {item.brand}
                          </span>
                        </td>

                        {/* Price */}
                        <td className="py-4 px-6 font-mono font-bold text-moto-text">
                          {item.price.toLocaleString()} <span className="text-xs font-normal text-moto-muted">AED</span>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono font-bold uppercase ${
                              item.status === "Published"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                                : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                item.status === "Published" ? "bg-emerald-400" : "bg-amber-400"
                              }`}
                            ></span>
                            {item.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => openEditModal(item)}
                              className="p-1.5 text-moto-muted hover:text-moto-copper border border-moto-border rounded hover:border-moto-copper transition-colors"
                              title="Edit Model"
                            >
                              ✏️
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeletingModelId(item.id)}
                              className="p-1.5 text-moto-muted hover:text-moto-apex border border-moto-border rounded hover:border-moto-apex transition-colors"
                              title="Delete Model"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="bg-moto-bg px-6 py-3 border-t border-moto-border text-xs font-mono text-moto-muted flex items-center justify-between">
              <div>
                Showing <strong className="text-moto-text">{filteredModels.length}</strong> of{" "}
                <strong className="text-moto-text">{models.length}</strong> models
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled
                  className="px-2.5 py-1 rounded border border-moto-border opacity-40 cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="px-2.5 py-1 rounded bg-moto-copper text-moto-bg font-bold">1</span>
                <button
                  type="button"
                  disabled
                  className="px-2.5 py-1 rounded border border-moto-border opacity-40 cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </main>

        <CmsFooter />
      </div>

      {/* ADD / EDIT MODEL MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-moto-surface border border-moto-border rounded-xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-moto-border pb-3">
              <h3 className="font-barlow font-bold text-xl uppercase tracking-wider text-moto-text">
                {editingModel ? "Edit Model Record" : "+ Add New Model"}
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-moto-muted hover:text-moto-text text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveModel} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-moto-muted uppercase mb-1">
                  Model Designation Name
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Apex Track 750"
                  className="w-full bg-moto-bg border border-moto-border px-3 py-2 rounded text-xs text-moto-text focus:outline-none focus:border-moto-copper"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-moto-muted uppercase mb-1">
                  Technical Specifications Summary
                </label>
                <input
                  type="text"
                  required
                  value={formSpecs}
                  onChange={(e) => setFormSpecs(e.target.value)}
                  placeholder="750cc Inline-4 • 175 HP • 160 kg"
                  className="w-full bg-moto-bg border border-moto-border px-3 py-2 rounded text-xs text-moto-text focus:outline-none focus:border-moto-copper"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-moto-muted uppercase mb-1">
                    Assigned Marque
                  </label>
                  <select
                    value={formBrand}
                    onChange={(e) => setFormBrand(e.target.value as "Apex" | "Volt" | "Nomad" | "Sovereign")}
                    className="w-full bg-moto-bg border border-moto-border px-3 py-2 rounded text-xs text-moto-text focus:outline-none focus:border-moto-copper"
                  >
                    <option value="Apex">Apex</option>
                    <option value="Nomad">Nomad</option>
                    {role === "admin" && (
                      <>
                        <option value="Volt">Volt</option>
                        <option value="Sovereign">Sovereign</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-moto-muted uppercase mb-1">
                    MSRP Price (AED)
                  </label>
                  <input
                    type="number"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full bg-moto-bg border border-moto-border px-3 py-2 rounded text-xs text-moto-text focus:outline-none focus:border-moto-copper"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-moto-muted uppercase mb-1">
                  Publishing Status
                </label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as "Published" | "Draft")}
                  className="w-full bg-moto-bg border border-moto-border px-3 py-2 rounded text-xs text-moto-text focus:outline-none focus:border-moto-copper"
                >
                  <option value="Published">Published (Public Storefront)</option>
                  <option value="Draft">Draft (Internal Review)</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-moto-border">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-mono text-moto-muted hover:text-moto-text"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-moto-copper text-moto-bg font-barlow font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded shadow hover:bg-moto-copper/90"
                >
                  Save Model Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingModelId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-moto-surface border border-moto-apex/40 rounded-xl max-w-sm w-full p-6 space-y-4 shadow-2xl text-center">
            <div className="w-10 h-10 rounded-full bg-moto-apex/20 text-moto-apex mx-auto flex items-center justify-center text-lg font-bold">
              🗑️
            </div>
            <h3 className="font-barlow font-bold text-lg uppercase tracking-wider text-moto-text">
              Confirm Model Deletion
            </h3>
            <p className="text-xs text-moto-muted">
              Are you sure you want to remove this model from the fleet catalog database? This action will update your client-side inventory state.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingModelId(null)}
                className="px-4 py-2 text-xs font-mono text-moto-muted hover:text-moto-text border border-moto-border rounded"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deletingModelId)}
                className="bg-moto-apex text-white font-barlow font-bold text-xs uppercase tracking-wider px-5 py-2 rounded hover:bg-moto-apex/90"
              >
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
