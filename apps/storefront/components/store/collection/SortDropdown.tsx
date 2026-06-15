// apps/storefront/components/store/collection/SortDropdown.tsx
"use client";

interface SortDropdownProps {
  value: string;
  onChange: (val: string) => void;
}

const sortOptions = [
  "Most Popular",
  "Price: Low to High",
  "Price: High to Low",
  "Newest First",
];

export default function SortDropdown({ value, onChange }: SortDropdownProps) {
  return (
    <div className="relative inline-block shrink-0 select-none">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-4 py-2.5 rounded-[var(--radius-sm)] border border-[var(--ag-gray-200)] text-xs font-bold bg-white dark:bg-[#1E1E1E] outline-none cursor-pointer pr-8 focus:border-[var(--ag-red)] appearance-none transition-colors"
        style={{
          background: `white url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%231A1A1A' stroke-width='2.5'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E") no-repeat right 10px center`,
          backgroundSize: "10px",
        }}
      >
        {sortOptions.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
