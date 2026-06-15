// apps/storefront/components/store/ui/SkeletonCard.tsx
"use client";

export default function SkeletonCard() {
  return (
    <div className="border border-[var(--ag-gray-200)] rounded-[var(--radius-lg)] overflow-hidden shadow-xs flex flex-col h-full bg-white select-none">
      {/* Thumbnail area */}
      <div className="aspect-square w-full skeleton border-b border-[var(--ag-gray-200)] shrink-0" />

      {/* Details area */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-4">
        <div className="flex flex-col gap-2.5">
          {/* Brand */}
          <div className="h-3 w-16 rounded-sm skeleton" />
          
          {/* Title */}
          <div className="space-y-1.5">
            <div className="h-4 w-full rounded-sm skeleton" />
            <div className="h-4 w-4/5 rounded-sm skeleton" />
          </div>

          {/* Rating */}
          <div className="h-3.5 w-24 rounded-sm skeleton mt-1" />
        </div>

        {/* Price tag */}
        <div className="flex items-center gap-2 pt-3 border-t border-[var(--ag-gray-100)] shrink-0">
          <div className="h-5 w-14 rounded-sm skeleton" />
          <div className="h-4 w-10 rounded-sm skeleton" />
        </div>
      </div>
    </div>
  );
}
