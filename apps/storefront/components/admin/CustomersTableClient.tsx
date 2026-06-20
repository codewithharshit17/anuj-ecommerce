"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Search, User, ExternalLink, ArrowUpDown, ShoppingBag, CreditCard, Award, Calendar } from "lucide-react";

interface CustomerOrder {
  totalAmount: number;
}

interface CustomerData {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  createdAt: Date | string;
  orders: CustomerOrder[];
}

interface CustomersTableClientProps {
  initialCustomers: CustomerData[];
}

type SortField = "name" | "joinedDate" | "totalOrders" | "totalSpent" | "aov";
type SortOrder = "asc" | "desc";

export default function CustomersTableClient({ initialCustomers }: CustomersTableClientProps) {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("totalSpent");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  // Calculate metrics for each customer
  const customers = useMemo(() => {
    return initialCustomers.map((cust) => {
      const name = cust.firstName || cust.lastName
        ? `${cust.firstName ?? ""} ${cust.lastName ?? ""}`.trim()
        : cust.email.split("@")[0];
      const email = cust.email;
      const joinedDate = new Date(cust.createdAt);
      const totalOrders = cust.orders.length;
      const totalSpent = cust.orders.reduce((sum, o) => sum + o.totalAmount, 0);
      const aov = totalOrders > 0 ? totalSpent / totalOrders : 0;

      return {
        id: cust.id,
        name,
        email,
        joinedDate,
        totalOrders,
        totalSpent,
        aov,
      };
    });
  }, [initialCustomers]);

  // Aggregate summary cards
  const stats = useMemo(() => {
    const totalCount = customers.length;
    const cumulativeSpent = customers.reduce((sum, c) => sum + c.totalSpent, 0);
    const avgLifetimeValue = totalCount > 0 ? cumulativeSpent / totalCount : 0;
    const topCustomer = customers.length > 0 
      ? [...customers].sort((a, b) => b.totalSpent - a.totalSpent)[0] 
      : null;

    return {
      totalCount,
      cumulativeSpent,
      avgLifetimeValue,
      topCustomer,
    };
  }, [customers]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const filteredAndSortedCustomers = useMemo(() => {
    return customers
      .filter((c) => {
        const query = search.toLowerCase();
        return (
          c.name.toLowerCase().includes(query) ||
          c.email.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => {
        const valA = a[sortField];
        const valB = b[sortField];

        if (sortField === "name") {
          const strA = (valA as string).toLowerCase();
          const strB = (valB as string).toLowerCase();
          return sortOrder === "asc" ? strA.localeCompare(strB) : strB.localeCompare(strA);
        }

        if (sortField === "joinedDate") {
          const dateA = (valA as Date).getTime();
          const dateB = (valB as Date).getTime();
          return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
        }

        const numA = valA as number;
        const numB = valB as number;
        return sortOrder === "asc" ? numA - numB : numB - numA;
      });
  }, [customers, search, sortField, sortOrder]);

  return (
    <div className="space-y-8 animate-scaleIn">
      {/* Mini overview cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-xl text-red-650 dark:text-red-400">
            <User className="size-6" />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Total Customer Accounts</p>
            <p className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">{stats.totalCount}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 rounded-xl text-emerald-650 dark:text-emerald-450">
            <CreditCard className="size-6" />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Average Customer Lifetime Value</p>
            <p className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              ₹{stats.avgLifetimeValue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 rounded-xl text-amber-600 dark:text-amber-450">
            <Award className="size-6" />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Highest Valued Customer</p>
            <p className="text-sm font-bold truncate text-zinc-900 dark:text-zinc-50 max-w-[200px]" title={stats.topCustomer?.name}>
              {stats.topCustomer ? `${stats.topCustomer.name} (₹${stats.topCustomer.totalSpent.toLocaleString("en-IN", { maximumFractionDigits: 0 })})` : "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Main filter & table panel */}
      <div className="bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-zinc-150 dark:border-zinc-850 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 w-full text-sm border border-zinc-200 dark:border-zinc-850 rounded-lg bg-zinc-50 dark:bg-zinc-950 focus:bg-white dark:focus:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-red-500/20 dark:text-zinc-50 transition-all placeholder:text-zinc-400"
            />
          </div>
          <p className="text-xs text-zinc-500">
            Showing {filteredAndSortedCustomers.length} of {stats.totalCount} customers
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-150 dark:border-zinc-850 text-zinc-500 dark:text-zinc-400 text-xs font-semibold uppercase tracking-wider select-none">
                <th className="px-6 py-4">
                  <button
                    onClick={() => handleSort("name")}
                    className="flex items-center gap-1 hover:text-zinc-900 dark:hover:text-zinc-50 cursor-pointer"
                  >
                    Customer Profile
                    <ArrowUpDown className="size-3" />
                  </button>
                </th>
                <th className="px-6 py-4">
                  <button
                    onClick={() => handleSort("joinedDate")}
                    className="flex items-center gap-1 hover:text-zinc-900 dark:hover:text-zinc-50 cursor-pointer"
                  >
                    Joined Date
                    <ArrowUpDown className="size-3" />
                  </button>
                </th>
                <th className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleSort("totalOrders")}
                    className="flex items-center gap-1 ml-auto hover:text-zinc-900 dark:hover:text-zinc-50 cursor-pointer"
                  >
                    Orders
                    <ArrowUpDown className="size-3" />
                  </button>
                </th>
                <th className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleSort("totalSpent")}
                    className="flex items-center gap-1 ml-auto hover:text-zinc-900 dark:hover:text-zinc-50 cursor-pointer"
                  >
                    Total Spent
                    <ArrowUpDown className="size-3" />
                  </button>
                </th>
                <th className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleSort("aov")}
                    className="flex items-center gap-1 ml-auto hover:text-zinc-900 dark:hover:text-zinc-50 cursor-pointer"
                  >
                    Avg Order Value
                    <ArrowUpDown className="size-3" />
                  </button>
                </th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-150 dark:divide-zinc-850 text-zinc-700 dark:text-zinc-300">
              {filteredAndSortedCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-zinc-500">
                    <User className="size-8 mx-auto stroke-[1.5] mb-2 text-zinc-400" />
                    <p className="text-sm font-semibold">No customers matched your search query</p>
                    <p className="text-xs text-zinc-400">Try checking spelling or search for another client</p>
                  </td>
                </tr>
              ) : (
                filteredAndSortedCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20 transition-colors">
                    <td className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-100">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400 flex items-center justify-center font-bold text-xs uppercase shadow-inner">
                          {cust.name.substring(0, 2)}
                        </div>
                        <div className="overflow-hidden">
                          <p className="truncate max-w-[180px]">{cust.name}</p>
                          <p className="text-xs font-normal text-zinc-400 truncate max-w-[180px]" title={cust.email}>
                            {cust.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-zinc-500 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="size-3.5 text-zinc-450" />
                        <span>
                          {cust.joinedDate.toLocaleDateString("en-IN", {
                            dateStyle: "medium",
                          })}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-zinc-900 dark:text-zinc-150 whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <ShoppingBag className="size-3.5 text-zinc-400" />
                        <span>{cust.totalOrders}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-zinc-900 dark:text-zinc-100 whitespace-nowrap">
                      ₹{cust.totalSpent.toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
                      ₹{cust.aov.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <Link
                        href={`/admin/customers/${cust.id}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-red-650 hover:text-red-700 bg-red-50 dark:bg-red-950/20 px-2.5 py-1.5 rounded-lg border border-red-200/50 dark:border-red-900/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                      >
                        Profile <ExternalLink className="size-3" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
