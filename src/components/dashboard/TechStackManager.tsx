"use client";

import { useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Cpu,
  Search,
  Loader2,
  X,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import type {
  TechStack,
  TechStackCategory,
  TechStackInsert,
} from "@/types/techstack";
import {
  createTechStackAction,
  updateTechStackAction,
  deleteTechStackAction,
} from "@/lib/actions/techstack";
import TechIcon from "@/components/TechIcon";

const CATEGORIES: { value: TechStackCategory; label: string }[] = [
  { value: "frontend", label: "Frontend" },
  { value: "backend", label: "Backend" },
  { value: "ai", label: "AI & Agents" },
  { value: "desktop", label: "Desktop" },
  { value: "infrastructure", label: "Infrastructure" },
  { value: "other", label: "Other" },
];

const POPULAR_ICON_PRESETS = [
  // Simple Icons
  "SiReact",
  "SiNextdotjs",
  "SiTailwindcss",
  "SiTypescript",
  "SiJavascript",
  "SiHtml5",
  "SiCss3",
  "SiNodedotjs",
  "SiPython",
  "SiPytorch",
  "SiOpenai",
  "SiAnthropic",
  "SiPostgresql",
  "SiSupabase",
  "SiCloudflare",
  "SiElectron",
  "SiDocker",
  "SiGithub",
  // Tabler / FontAwesome / Lucide / Remix / BoxIcons
  "TbBrandNextjs",
  "FaReact",
  "FaPython",
  "RiTailwindCssFill",
  "BiLogoTypescript",
  "DiPostgresql",
  "VscCode",
  "LuCpu",
];

export default function TechStackManager({
  initialTechStacks,
}: {
  initialTechStacks: TechStack[];
}) {
  const [techStacks, setTechStacks] = useState<TechStack[]>(initialTechStacks);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TechStack | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form states
  const [formName, setFormName] = useState("");
  const [formIcon, setFormIcon] = useState("");
  const [formCategory, setFormCategory] =
    useState<TechStackCategory>("frontend");
  const [formColor, setFormColor] = useState("#F97316");
  const [formIconUrl, setFormIconUrl] = useState("");
  const [formOrder, setFormOrder] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  function openCreateModal() {
    setEditingItem(null);
    setFormName("");
    setFormIcon("");
    setFormCategory("frontend");
    setFormColor("#F97316");
    setFormIconUrl("");
    setFormOrder(techStacks.length + 1);
    setFormError(null);
    setModalOpen(true);
  }

  function openEditModal(item: TechStack) {
    setEditingItem(item);
    setFormName(item.name);
    setFormIcon(item.icon || "");
    setFormCategory(item.category);
    setFormColor(item.color || "#F97316");
    setFormIconUrl(item.icon_url || "");
    setFormOrder(item.order_index);
    setFormError(null);
    setModalOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!formName.trim()) {
      setFormError("Technology name is required");
      return;
    }

    setSubmitting(true);
    setFormError(null);

    const payload: TechStackInsert = {
      name: formName.trim(),
      icon: formIcon.trim() || null,
      category: formCategory,
      color: formColor || null,
      icon_url: formIconUrl.trim() || null,
      order_index: Number(formOrder) || 0,
    };

    if (editingItem) {
      const res = await updateTechStackAction(editingItem.id, payload);
      if (res.success && res.data) {
        setTechStacks((prev) =>
          prev.map((item) => (item.id === editingItem.id ? res.data! : item)),
        );
        setModalOpen(false);
      } else {
        setFormError(res.error || "Failed to update tech stack");
      }
    } else {
      const res = await createTechStackAction(payload);
      if (res.success && res.data) {
        setTechStacks((prev) => [...prev, res.data!]);
        setModalOpen(false);
      } else {
        setFormError(res.error || "Failed to create tech stack");
      }
    }

    setSubmitting(false);
  }

  async function handleDelete(id: string) {
    setSubmitting(true);
    const res = await deleteTechStackAction(id);
    if (res.success) {
      setTechStacks((prev) => prev.filter((item) => item.id !== id));
      setDeleteConfirmId(null);
    } else {
      alert(res.error || "Failed to delete tech stack");
    }
    setSubmitting(false);
  }

  const filtered = techStacks.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCat =
      selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-textPrimary">Tech Stack</h2>
          <p className="text-xs text-textSecondary mt-1">
            Manage technologies with 31+ React Icons packages supported (Si*,
            Fa*, Tb*, Di*, Ri*, Bi*, Lu*, etc.)
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-primary hover:bg-primary-dark text-white text-sm font-medium rounded-xl transition-all shadow-lg shadow-primary/20 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Technology</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-textSecondary absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search technologies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-surface border border-border rounded-xl text-sm text-textPrimary placeholder:text-textSecondary/50 focus:outline-none focus:border-primary transition-all"
          />
        </div>

        <div className="flex overflow-x-auto pb-1 sm:pb-0 gap-1.5 scrollbar-none">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
              selectedCategory === "all"
                ? "bg-primary text-white"
                : "bg-surface hover:bg-border text-textSecondary border border-border"
            }`}
          >
            All ({techStacks.length})
          </button>
          {CATEGORIES.map((cat) => {
            const count = techStacks.filter(
              (t) => t.category === cat.value,
            ).length;
            return (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat.value
                    ? "bg-primary text-white"
                    : "bg-surface hover:bg-border text-textSecondary border border-border"
                }`}
              >
                {cat.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-surface border border-dashed border-border rounded-2xl">
          <Cpu className="w-10 h-10 text-textSecondary mx-auto mb-3 opacity-40" />
          <p className="text-sm text-textSecondary">
            No technologies found matching your criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-surface border border-border hover:border-primary/40 transition-all flex flex-col justify-between group"
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center space-x-3 min-w-0">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-white/10"
                    style={{
                      backgroundColor: item.color
                        ? `${item.color}20`
                        : "rgba(249, 115, 22, 0.1)",
                      color: item.color || "#F97316",
                    }}
                  >
                    <TechIcon
                      name={item.name}
                      icon={item.icon}
                      iconUrl={item.icon_url}
                      color={item.color}
                      className="w-5 h-5"
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-textPrimary truncate">
                      {item.name}
                    </h4>
                    <span className="text-[11px] text-textSecondary uppercase tracking-wider block">
                      {item.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-1.5 rounded-lg text-textSecondary hover:text-textPrimary hover:bg-background transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(item.id)}
                    className="p-1.5 rounded-lg text-textSecondary hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border/50 text-[11px] text-textSecondary">
                <span className="font-mono text-[10px] text-textSecondary/70 truncate max-w-[130px]">
                  {item.icon ? item.icon : `order: ${item.order_index}`}
                </span>
                {item.color && (
                  <div className="flex items-center space-x-1.5 shrink-0">
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-border"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-mono text-[10px]">{item.color}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Create / Edit */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-surface border border-border rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-textPrimary">
                  {editingItem ? "Edit Technology" : "Add New Technology"}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-textSecondary hover:text-textPrimary p-1 rounded-lg hover:bg-background"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              {/* Real-Time Preview Box */}
              <div className="p-3 rounded-xl bg-background/80 border border-border flex items-center space-x-3">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border border-white/10"
                  style={{
                    backgroundColor: formColor
                      ? `${formColor}20`
                      : "rgba(249, 115, 22, 0.1)",
                    color: formColor || "#F97316",
                  }}
                >
                  <TechIcon
                    name={formName || "Preview"}
                    icon={formIcon}
                    iconUrl={formIconUrl}
                    color={formColor}
                    className="w-6 h-6"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-semibold text-textPrimary block truncate">
                    {formName || "Technology Name"}
                  </span>
                  <span className="text-[10px] text-textSecondary uppercase tracking-wider block">
                    {formCategory} ·{" "}
                    {formIcon ? `${formIcon}` : "letter fallback"}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-textSecondary mb-1.5 uppercase tracking-wider">
                  Technology Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. React, Next.js, PyTorch, Supabase"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-background border border-border rounded-xl text-sm text-textPrimary placeholder:text-textSecondary/50 focus:outline-none focus:border-primary transition-all"
                />
              </div>

              {/* React Icon Component Name */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-medium text-textSecondary uppercase tracking-wider">
                    React Icon Name
                  </label>
                  <a
                    href="https://react-icons.github.io/react-icons/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-primary hover:underline flex items-center space-x-0.5"
                  >
                    <span>Browse React Icons</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
                <input
                  type="text"
                  placeholder="e.g. SiReact, FaPython, TbBrandNextjs, DiPostgresql, RiTailwindCssFill"
                  value={formIcon}
                  onChange={(e) => setFormIcon(e.target.value)}
                  className="w-full px-3.5 py-2 bg-background border border-border rounded-xl text-xs font-mono text-textPrimary placeholder:text-textSecondary/50 focus:outline-none focus:border-primary transition-all mb-2"
                />

                {/* Preset Chips */}
                <div className="space-y-1">
                  <span className="text-[10px] text-textSecondary block">
                    Quick Presets:
                  </span>
                  <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto p-1 bg-background/40 rounded-lg border border-border/50">
                    {POPULAR_ICON_PRESETS.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setFormIcon(preset)}
                        className={`text-[10px] px-2 py-0.5 rounded border transition-all ${
                          formIcon === preset
                            ? "bg-primary text-white border-primary"
                            : "bg-surface hover:bg-border text-textSecondary border-border"
                        }`}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-textSecondary mb-1.5 uppercase tracking-wider">
                    Category *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) =>
                      setFormCategory(e.target.value as TechStackCategory)
                    }
                    className="w-full px-3 py-2 bg-background border border-border rounded-xl text-sm text-textPrimary focus:outline-none focus:border-primary transition-all"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-textSecondary mb-1.5 uppercase tracking-wider">
                    Badge Color
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={formColor}
                      onChange={(e) => setFormColor(e.target.value)}
                      className="w-9 h-9 p-0.5 rounded-lg bg-background border border-border cursor-pointer shrink-0"
                    />
                    <input
                      type="text"
                      value={formColor}
                      onChange={(e) => setFormColor(e.target.value)}
                      placeholder="#F97316"
                      className="w-full px-2.5 py-2 bg-background border border-border rounded-xl text-xs font-mono text-textPrimary focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-textSecondary mb-1.5 uppercase tracking-wider">
                  Custom Icon URL (Optional fallback)
                </label>
                <input
                  type="url"
                  placeholder="https://.../icon.svg"
                  value={formIconUrl}
                  onChange={(e) => setFormIconUrl(e.target.value)}
                  className="w-full px-3.5 py-2 bg-background border border-border rounded-xl text-xs text-textPrimary placeholder:text-textSecondary/50 focus:outline-none focus:border-primary transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-textSecondary mb-1.5 uppercase tracking-wider">
                  Display Order
                </label>
                <input
                  type="number"
                  value={formOrder}
                  onChange={(e) => setFormOrder(Number(e.target.value))}
                  className="w-full px-3.5 py-2 bg-background border border-border rounded-xl text-sm text-textPrimary focus:outline-none focus:border-primary transition-all"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm text-textSecondary hover:bg-background border border-transparent transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-medium transition-all flex items-center space-x-2 disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{editingItem ? "Save Changes" : "Create"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-surface border border-border rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-textPrimary">
              Delete Technology?
            </h3>
            <p className="text-xs text-textSecondary leading-relaxed">
              This will remove the technology from your tech stack list and from
              any linked projects.
            </p>
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl text-xs text-textSecondary hover:bg-background transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                disabled={submitting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-medium transition-all flex items-center space-x-2"
              >
                {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
