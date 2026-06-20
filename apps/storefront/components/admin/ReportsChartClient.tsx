"use client";

import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ChartDataPoint {
  date: string;
  revenue: number;
}

interface ReportsChartClientProps {
  data: ChartDataPoint[];
  title: string;
  subtitle: string;
}

const formatYAxis = (value: number) => {
  if (value >= 100000) {
    return `₹${(value / 1000).toFixed(0)}k`;
  }
  if (value >= 1000) {
    return `₹${(value / 1000).toFixed(1)}k`;
  }
  return `₹${value}`;
};



export default function ReportsChartClient({ data, title, subtitle }: ReportsChartClientProps) {
  const brandPrimary = "#E53C3C";

  return (
    <div className="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col gap-4 h-[400px] animate-fadeIn">
      <div>
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50 font-display">
          {title}
        </h3>
        <p className="text-xs text-zinc-500 mt-0.5">{subtitle}</p>
      </div>

      <div className="flex-1 w-full min-h-0">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-zinc-400 text-xs">
            No sales data available for this date range.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorReportsRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={brandPrimary} stopOpacity={0.15} />
                  <stop offset="95%" stopColor={brandPrimary} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.04)" className="dark:stroke-zinc-800/60" />
              <XAxis dataKey="date" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} dy={10} />
              <YAxis stroke="#888888" fontSize={10} tickLine={false} axisLine={false} tickFormatter={formatYAxis} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "1px solid rgba(0,0,0,0.08)",
                  borderRadius: "8px",
                  fontSize: "11px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                }}
                labelStyle={{ fontWeight: 600, color: "#1A1A1A" }}
                formatter={(value) => [value ? `₹${Number(value).toLocaleString("en-IN")}` : "₹0", "Revenue"]}
              />
              <Area type="monotone" dataKey="revenue" stroke={brandPrimary} strokeWidth={2.5} fillOpacity={1} fill="url(#colorReportsRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
