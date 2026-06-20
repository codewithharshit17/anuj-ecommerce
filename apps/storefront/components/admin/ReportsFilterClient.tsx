"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Calendar, Check } from "lucide-react";

export default function ReportsFilterClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentPreset = searchParams.get("preset") || "last-30";
  const currentFrom = searchParams.get("from") || "";
  const currentTo = searchParams.get("to") || "";

  const [preset, setPreset] = useState(currentPreset);
  const [from, setFrom] = useState(currentFrom);
  const [to, setTo] = useState(currentTo);

  const presets = [
    { label: "Today", value: "today" },
    { label: "Last 7 Days", value: "last-7" },
    { label: "Last 30 Days", value: "last-30" },
    { label: "This Month", value: "this-month" },
    { label: "Custom Range", value: "custom" },
  ];

  const handlePresetChange = (value: string) => {
    setPreset(value);
    if (value !== "custom") {
      router.push(`/admin/reports?preset=${value}`);
    }
  };

  const handleApplyCustomRange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!from || !to) return;
    router.push(`/admin/reports?preset=custom&from=${from}&to=${to}`);
  };

  return (
    <div className="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-150 flex items-center gap-2">
            <Calendar className="size-4 text-zinc-500" /> Filter Report Timeframe
          </h3>
          <p className="text-xs text-zinc-500 mt-0.5">Select a preset or customize a specific calendar date range</p>
        </div>

        {/* Preset Selector */}
        <div className="flex flex-wrap gap-2">
          {presets.map((p) => {
            const isActive = preset === p.value;
            return (
              <button
                key={p.value}
                type="button"
                onClick={() => handlePresetChange(p.value)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                  isActive
                    ? "bg-red-600 border-red-600 text-white shadow-sm"
                    : "bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-650 dark:text-zinc-350 hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom range input form */}
      {preset === "custom" && (
        <form onSubmit={handleApplyCustomRange} className="flex flex-col sm:flex-row sm:items-end gap-4 p-4 bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-150 dark:border-zinc-850 rounded-lg animate-fadeIn">
          <div className="flex-1 space-y-1">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Start Date</label>
            <input
              type="date"
              required
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="px-3 py-2 w-full text-xs border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-950 text-zinc-800 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-red-500/20"
            />
          </div>
          <div className="flex-1 space-y-1">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">End Date</label>
            <input
              type="date"
              required
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="px-3 py-2 w-full text-xs border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-950 text-zinc-800 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-red-500/20"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-zinc-900 hover:bg-zinc-850 dark:bg-zinc-50 dark:hover:bg-zinc-150 text-white dark:text-zinc-950 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Check className="size-3.5" /> Apply
          </button>
        </form>
      )}
    </div>
  );
}
