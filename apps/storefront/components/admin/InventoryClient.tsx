"use client";

import React, { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Edit2, Check, X, PackageOpen, ExternalLink, RefreshCw } from "lucide-react";
import { updateProductStock } from "@/lib/actions/admin-products";

interface ProductRow {
  id: string;
  name: string;
  slug: string;
  lowStockThreshold: number;
  category: {
    id: string;
    name: string;
  };
  images: {
    url: string;
  }[];
  variants: {
    id: string;
    stock: number;
  }[];
}

interface InventoryClientProps {
  initialProducts: ProductRow[];
}

type StockStatus = "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";

export default function InventoryClient({ initialProducts }: InventoryClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | StockStatus>("ALL");
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [newStock, setNewStock] = useState("");

  // Determine inventory details dynamically
  const getProductInventoryInfo = (product: ProductRow) => {
    const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);
    let status: StockStatus = "IN_STOCK";

    if (totalStock === 0) {
      status = "OUT_OF_STOCK";
    } else if (totalStock < product.lowStockThreshold) {
      status = "LOW_STOCK";
    }

    return { totalStock, status };
  };

  // Filter products locally
  const filteredProducts = initialProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.slug.toLowerCase().includes(search.toLowerCase());

    const { status } = getProductInventoryInfo(product);
    const matchesStatus = statusFilter === "ALL" || status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleStartEdit = (productId: string, currentStock: number) => {
    setEditingProductId(productId);
    setNewStock(currentStock.toString());
  };

  const handleCancelEdit = () => {
    setEditingProductId(null);
    setNewStock("");
  };

  const handleSaveStock = async (productId: string) => {
    const stockVal = parseInt(newStock, 10);
    if (isNaN(stockVal) || stockVal < 0) {
      alert("Please enter a valid stock count (minimum 0).");
      return;
    }

    startTransition(async () => {
      const res = await updateProductStock(productId, stockVal);
      if (res.success) {
        setEditingProductId(null);
        setNewStock("");
        router.refresh();
      } else {
        alert(res.error || "Failed to update stock");
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Filters & Header controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-1 flex-wrap gap-3 w-full">
          {/* Search bar */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search products by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 w-full"
            />
          </div>

          {/* Level Filter Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "ALL" | StockStatus)}
            className="px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 min-w-[160px]"
          >
            <option value="ALL">All Levels</option>
            <option value="IN_STOCK">In Stock</option>
            <option value="LOW_STOCK">Low Stock</option>
            <option value="OUT_OF_STOCK">Out Of Stock</option>
          </select>
        </div>
      </div>

      {/* Table view */}
      <div className="bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                <th className="px-6 py-4">Product Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Stock Level (Current / Min)</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-sm">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-zinc-400">
                    No products found matching the criteria.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const { totalStock, status } = getProductInventoryInfo(product);
                  const isEditing = editingProductId === product.id;
                  const primaryImg = product.images[0]?.url || "";

                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20 transition-colors"
                    >
                      {/* Product details */}
                      <td className="px-6 py-4 flex items-center gap-3">
                        <div className="size-10 bg-zinc-100 dark:bg-zinc-800 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 flex items-center justify-center shrink-0 relative">
                          {primaryImg ? (
                            <Image
                              src={primaryImg}
                              alt={product.name}
                              fill
                              sizes="40px"
                              className="object-cover"
                            />
                          ) : (
                            <PackageOpen className="size-5 text-zinc-400" />
                          )}
                        </div>
                        <div className="overflow-hidden">
                          <p className="font-semibold text-zinc-900 dark:text-zinc-100 truncate max-w-[200px] md:max-w-[300px]">
                            {product.name}
                          </p>
                          <p className="text-xs text-zinc-500 truncate max-w-[200px]">
                            {product.slug}
                          </p>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4 text-zinc-650 dark:text-zinc-450 font-medium">
                        {product.category.name}
                      </td>

                      {/* Stock Level (With Inline Update option) */}
                      <td className="px-6 py-4">
                        {isEditing ? (
                          <div className="flex items-center gap-2 max-w-[150px]">
                            <input
                              type="number"
                              min="0"
                              value={newStock}
                              onChange={(e) => setNewStock(e.target.value)}
                              className="w-16 px-2 py-1 text-sm border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 text-zinc-900 dark:text-zinc-50"
                              disabled={isPending}
                              autoFocus
                            />
                            <button
                              onClick={() => handleSaveStock(product.id)}
                              disabled={isPending}
                              className="p-1 text-emerald-600 hover:bg-emerald-50 rounded-md border border-emerald-250 bg-emerald-50/30 transition-colors"
                              title="Save Stock"
                            >
                              {isPending ? (
                                <RefreshCw className="size-3.5 animate-spin" />
                              ) : (
                                <Check className="size-3.5" />
                              )}
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              disabled={isPending}
                              className="p-1 text-zinc-500 hover:bg-zinc-100 rounded-md border border-zinc-250 transition-colors"
                              title="Cancel"
                            >
                              <X className="size-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                              {totalStock}
                            </span>
                            <span className="text-zinc-400 font-mono text-xs">
                              / {product.lowStockThreshold}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Dynamic Status Badges */}
                      <td className="px-6 py-4">
                        {status === "OUT_OF_STOCK" && (
                          <span className="inline-flex items-center text-[10px] font-black uppercase tracking-wider bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400 border border-rose-200 dark:border-rose-900/30 px-2 py-0.5 rounded-full">
                            Out of Stock
                          </span>
                        )}
                        {status === "LOW_STOCK" && (
                          <span className="inline-flex items-center text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-450 border border-amber-200 dark:border-amber-900/30 px-2 py-0.5 rounded-full">
                            Low Stock
                          </span>
                        )}
                        {status === "IN_STOCK" && (
                          <span className="inline-flex items-center text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-450 border border-emerald-200 dark:border-emerald-900/30 px-2 py-0.5 rounded-full">
                            In Stock
                          </span>
                        )}
                      </td>

                      {/* Action buttons */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2.5">
                          {/* View Product Storefront */}
                          <Link
                            href={`/products/${product.slug}`}
                            target="_blank"
                            className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-md transition-colors"
                            title="View on Storefront"
                          >
                            <ExternalLink className="size-3.5" />
                          </Link>
                          {/* Edit Details */}
                          <Link
                            href={`/admin/products/${product.id}`}
                            className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-md transition-colors"
                            title="Edit Product Details"
                          >
                            <Edit2 className="size-3.5" />
                          </Link>
                          {/* Quick Edit Stock */}
                          {!isEditing && (
                            <button
                              onClick={() => handleStartEdit(product.id, totalStock)}
                              className="text-xs font-semibold px-2 py-1 border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 hover:bg-zinc-100 rounded-md text-zinc-700 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                            >
                              Update Stock
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
