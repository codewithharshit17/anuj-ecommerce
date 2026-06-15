// apps/storefront/components/store/product/VariantSelector.tsx
"use client";

interface Option {
  id: string;
  title: string;
  values: string[];
}

interface VariantSelectorProps {
  options: Option[];
  selectedOptions: Record<string, string>;
  onSelectOption: (optionId: string, value: string) => void;
}

// Map color strings to Hex/CSS values
const colorMap: Record<string, string> = {
  blue: "#2563EB",
  black: "#1A1A1A",
  red: "#DC2626",
  "matte black": "#2D2D2D",
  "shiny yellow": "#FBBF24",
};

export default function VariantSelector({
  options,
  selectedOptions,
  onSelectOption,
}: VariantSelectorProps) {
  return (
    <div className="flex flex-col gap-4 select-none">
      {options.map((opt) => {
        const isColor = opt.title.toLowerCase() === "color" || opt.title.toLowerCase() === "colour";
        
        return (
          <div key={opt.id} className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--ag-gray-500)]">
              Select {opt.title}: <span className="text-[var(--ag-dark)]">{selectedOptions[opt.id]}</span>
            </span>

            <div className="flex items-center gap-2 flex-wrap">
              {opt.values.map((val) => {
                const isSelected = selectedOptions[opt.id] === val;
                
                if (isColor) {
                  const hex = colorMap[val.toLowerCase()] || "#9E9E9E";
                  
                  return (
                    <button
                      key={val}
                      onClick={() => onSelectOption(opt.id, val)}
                      className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
                        isSelected
                          ? "border-[var(--ag-red)] ring-2 ring-[var(--ag-red)]/20 scale-105 shadow-sm"
                          : "border-[var(--ag-gray-200)] hover:scale-102"
                      }`}
                      title={val}
                      aria-label={`Select color ${val}`}
                    >
                      <span
                        className="w-6 h-6 rounded-full border border-black/5"
                        style={{ backgroundColor: hex }}
                      />
                    </button>
                  );
                } else {
                  return (
                    <button
                      key={val}
                      onClick={() => onSelectOption(opt.id, val)}
                      className={`px-4 py-2 text-xs font-bold border rounded-[var(--radius-sm)] transition-all ${
                        isSelected
                          ? "bg-[var(--ag-red)] text-white border-[var(--ag-red)]"
                          : "bg-white dark:bg-[#1E1E1E] text-[var(--ag-gray-800)] border-[var(--ag-gray-200)] hover:bg-[var(--ag-gray-100)]"
                      }`}
                    >
                      {val}
                    </button>
                  );
                }
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
