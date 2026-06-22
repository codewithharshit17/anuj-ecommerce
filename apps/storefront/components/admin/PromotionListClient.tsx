"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { Plus, Edit2, Trash2, Calendar, Link2, Sparkles, Check, X, AlertTriangle } from "lucide-react";
import { togglePromotionActive, deletePromotion } from "@/lib/actions/admin-promotions";
import { PromotionTargetType } from "@prisma/client";

interface PromotionData {
  id: string;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  imageUrl: string;
  buttonText: string;
  redirectType: PromotionTargetType;
  redirectId: string;
  isActive: boolean;
  startDate: Date;
  endDate: Date;
  displayOrder: number;
}

interface PromotionListClientProps {
  initialPromotions: PromotionData[];
}

export default function PromotionListClient({ initialPromotions }: PromotionListClientProps) {
  const [promotions, setPromotions] = useState<PromotionData[]>(initialPromotions);
  const [isPending, startTransition] = useTransition();
  const [actionError, setActionError] = useState<string | null>(null);

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    setActionError(null);
    const newActive = !currentActive;
    
    // Optimistic UI update
    setPromotions((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: newActive } : p))
    );

    startTransition(async () => {
      const res = await togglePromotionActive(id, newActive);
      if (!res.success) {
        setActionError(res.error || "Failed to update status.");
        // Revert
        setPromotions((prev) =>
          prev.map((p) => (p.id === id ? { ...p, isActive: currentActive } : p))
        );
      }
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this promotion?")) return;
    
    setActionError(null);
    const originalPromotions = [...promotions];
    
    // Optimistic UI update
    setPromotions((prev) => prev.filter((p) => p.id !== id));

    startTransition(async () => {
      const res = await deletePromotion(id);
      if (!res.success) {
        setActionError(res.error || "Failed to delete promotion.");
        setPromotions(originalPromotions);
      }
    });
  };

  const getStatusText = (p: PromotionData) => {
    if (!p.isActive) return { text: "Deactivated", color: "text-zinc-550 bg-zinc-100" };
    const now = new Date();
    const start = new Date(p.startDate);
    const end = new Date(p.endDate);

    if (now < start) {
      return { text: "Scheduled", color: "text-amber-600 bg-amber-50" };
    }
    if (now > end) {
      return { text: "Expired", color: "text-red-500 bg-red-50" };
    }
    return { text: "Live Now", color: "text-emerald-600 bg-emerald-50" };
  };

  return (
    <div className="space-y-4">
      {/* Top action row */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-zinc-200 shadow-sm">
        <span className="text-sm font-semibold text-zinc-500">
          Total active promotions: {promotions.length}
        </span>
        <Link
          href="/admin/promotions/new"
          className="inline-flex items-center gap-1.5 py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-lg transition-colors shadow-sm"
        >
          <Plus size={16} /> Add Promotion
        </Link>
      </div>

      {actionError && (
        <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-xs font-semibold flex items-center gap-2">
          <AlertTriangle size={14} /> {actionError}
        </div>
      )}

      {/* Main Table / Empty State */}
      {promotions.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-zinc-200 text-center">
          <div className="size-12 rounded-full bg-zinc-50 border border-zinc-150 flex items-center justify-center mb-3">
            <Sparkles className="size-5 text-zinc-400" />
          </div>
          <h3 className="font-bold text-sm text-zinc-900">No promotions set up yet</h3>
          <p className="text-xs text-zinc-500 max-w-sm mt-1">
            Create promotional banners to display custom campaign slides on your homepage hero section.
          </p>
          <Link
            href="/admin/promotions/new"
            className="mt-4 inline-flex items-center gap-1 py-1.5 px-3 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold rounded-lg transition-colors"
          >
            <Plus size={13} /> Create First Promotion
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50/50 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  <th className="px-6 py-3.5">Image & Info</th>
                  <th className="px-6 py-3.5">Destination</th>
                  <th className="px-6 py-3.5">Schedule</th>
                  <th className="px-6 py-3.5 text-center">Display Order</th>
                  <th className="px-6 py-3.5 text-center">Live Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 text-sm">
                {promotions.map((p) => {
                  const status = getStatusText(p);
                  return (
                    <tr key={p.id} className="hover:bg-zinc-50/30 transition-colors">
                      {/* Image & Info */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.imageUrl}
                            alt=""
                            className="w-16 aspect-[21/8] object-cover rounded-md border border-zinc-200 shadow-xs shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-bold text-zinc-900 truncate max-w-xs">{p.title}</p>
                            {p.subtitle && (
                              <p className="text-xs text-zinc-500 truncate max-w-xs">{p.subtitle}</p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Destination */}
                      <td className="px-6 py-4 text-xs font-semibold text-zinc-650">
                        <div className="flex items-center gap-1.5">
                          <Link2 size={13} className="text-zinc-400 shrink-0" />
                          <span className="capitalize">{p.redirectType.toLowerCase()}</span>
                          <span className="text-[10px] bg-zinc-100 text-zinc-500 px-1.5 py-0.5 rounded font-mono shrink-0">
                            ID: {p.redirectId.slice(-6)}
                          </span>
                        </div>
                      </td>

                      {/* Schedule */}
                      <td className="px-6 py-4 text-xs text-zinc-650">
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-1">
                            <Calendar size={12} className="text-zinc-400" />
                            <span>Start: {new Date(p.startDate).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar size={12} className="text-zinc-400" />
                            <span>End: {new Date(p.endDate).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })}</span>
                          </div>
                        </div>
                      </td>

                      {/* Display Order */}
                      <td className="px-6 py-4 text-center font-semibold text-zinc-700">
                        {p.displayOrder}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col items-center gap-1.5">
                          <span className={`inline-block text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${status.color}`}>
                            {status.text}
                          </span>
                          
                          {/* Toggle Active Switch */}
                          <button
                            onClick={() => handleToggleActive(p.id, p.isActive)}
                            disabled={isPending}
                            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                              p.isActive ? "bg-red-600" : "bg-zinc-200"
                            }`}
                          >
                            <span
                              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                                p.isActive ? "translate-x-4" : "translate-x-0"
                              }`}
                            />
                          </button>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1.5">
                          <Link
                            href={`/admin/promotions/${p.id}`}
                            title="Edit Promotion"
                            className="p-2 border border-zinc-200 hover:bg-zinc-50 hover:text-zinc-950 text-zinc-450 rounded-lg transition-all"
                          >
                            <Edit2 size={13} />
                          </Link>
                          <button
                            onClick={() => handleDelete(p.id)}
                            disabled={isPending}
                            title="Delete Promotion"
                            className="p-2 border border-zinc-200 hover:bg-red-50 hover:text-red-600 text-zinc-450 rounded-lg transition-all cursor-pointer"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
