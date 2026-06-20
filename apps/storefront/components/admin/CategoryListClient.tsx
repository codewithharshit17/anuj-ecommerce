"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Plus, Edit2, Trash2, FolderOpen } from "lucide-react";
import { deleteCategory } from "@/lib/actions/admin-categories";

interface CategoryRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  _count: {
    products: number;
  };
}

interface CategoryListClientProps {
  initialCategories: CategoryRow[];
}

export default function CategoryListClient({ initialCategories }: CategoryListClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState("");

  const filteredCategories = initialCategories.filter((cat) => {
    return (
      cat.name.toLowerCase().includes(search.toLowerCase()) ||
      cat.slug.toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete the category "${name}"?`)) {
      startTransition(async () => {
        const res = await deleteCategory(id);
        if (res.success) {
          router.refresh();
        } else {
          alert(res.error || "Failed to delete category");
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Add Category */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 min-w-[240px] w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 w-full"
          />
        </div>

        <Link
          href="/admin/categories/new"
          className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm w-full md:w-auto justify-center"
        >
          <Plus className="size-4" />
          <span>Add Category</span>
        </Link>
      </div>

      {/* Table view */}
      <div className="bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Slug</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4 text-center">Products</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-sm">
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-zinc-400">
                    No categories found matching the criteria.
                  </td>
                </tr>
              ) : (
                filteredCategories.map((cat) => {
                  return (
                    <tr
                      key={cat.id}
                      className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20 transition-colors"
                    >
                      <td className="px-6 py-4 flex items-center gap-3">
                        <div className="size-10 bg-zinc-100 dark:bg-zinc-800 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 flex items-center justify-center shrink-0 relative">
                          {cat.imageUrl ? (
                            <img
                              src={cat.imageUrl}
                              alt={cat.name}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <FolderOpen className="size-5 text-zinc-450" />
                          )}
                        </div>
                        <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                          {cat.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-zinc-500 font-mono text-xs">{cat.slug}</td>
                      <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400 max-w-xs truncate">
                        {cat.description || <span className="text-zinc-400 italic">No description</span>}
                      </td>
                      <td className="px-6 py-4 text-center font-medium">
                        <span className="bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-355 text-xs px-2.5 py-1 rounded-full border border-zinc-200 dark:border-zinc-800">
                          {cat._count.products}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/categories/${cat.id}`}
                            className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-md transition-colors"
                          >
                            <Edit2 className="size-3.5" />
                          </Link>
                          <button
                            onClick={() => handleDelete(cat.id, cat.name)}
                            disabled={isPending}
                            className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/30 text-zinc-500 hover:text-red-600 dark:hover:text-red-400 rounded-md transition-colors"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
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
