const fs = require('fs');
const path = require('path');

const replacements = [
  {
    file: "components/store/ui/SkeletonCard.tsx",
    target: "bg-white select-none",
    replacement: "bg-white dark:bg-[#1E1E1E] select-none"
  },
  {
    file: "components/store/products/ProductCard.tsx",
    target: "className=\"group relative bg-white",
    replacement: "className=\"group relative bg-white dark:bg-[#1E1E1E]"
  },
  {
    file: "components/store/products/ProductCard.tsx",
    target: "rounded-full bg-white border",
    replacement: "rounded-full bg-white dark:bg-[#1E1E1E] border"
  },
  {
    file: "components/store/product/VariantSelector.tsx",
    target: ": \"bg-white text-[var(--ag-gray-800)]",
    replacement: ": \"bg-white dark:bg-[#1E1E1E] text-[var(--ag-gray-800)]"
  },
  {
    file: "components/store/product/QuantitySelector.tsx",
    target: "hover:bg-white text-[var(--ag-gray-800)]",
    replacement: "hover:bg-white dark:hover:bg-[#2D2D2D] text-[var(--ag-gray-800)]"
  },
  {
    file: "components/store/product/ProductTabs.tsx",
    target: "select-none bg-white border",
    replacement: "select-none bg-white dark:bg-[#1E1E1E] border"
  },
  {
    file: "components/store/layout/Footer.tsx",
    target: "className=\"bg-white border-t",
    replacement: "className=\"bg-white dark:bg-neutral-900 border-t"
  },
  {
    file: "components/store/home/ReviewsCarousel.tsx",
    target: "className=\"py-12 bg-white select-none\"",
    replacement: "className=\"py-12 bg-white dark:bg-neutral-900 select-none\""
  },
  {
    file: "components/store/home/ReviewsCarousel.tsx",
    target: "className=\"bg-white border",
    replacement: "className=\"bg-white dark:bg-[#1E1E1E] border"
  },
  {
    file: "components/store/home/PromoCards.tsx",
    target: "className=\"py-12 bg-white select-none\"",
    replacement: "className=\"py-12 bg-white dark:bg-neutral-900 select-none\""
  },
  {
    file: "components/store/home/BudgetSection.tsx",
    target: ": \"bg-white text-[var(--ag-gray-800)]",
    replacement: ": \"bg-white dark:bg-[#1E1E1E] text-[var(--ag-gray-800)]"
  },
  {
    file: "components/store/home/BudgetSection.tsx",
    target: "bg-white skeleton",
    replacement: "bg-white dark:bg-[#1E1E1E] skeleton"
  },
  {
    file: "components/store/home/BudgetSection.tsx",
    target: "bg-white rounded-[var(--radius-lg)]",
    replacement: "bg-white dark:bg-[#1E1E1E] rounded-[var(--radius-lg)]"
  },
  {
    file: "components/store/home/BlogSection.tsx",
    target: "group bg-white border",
    replacement: "group bg-white dark:bg-[#1E1E1E] border"
  },
  {
    file: "components/store/collection/SortDropdown.tsx",
    target: "font-bold bg-white outline-none",
    replacement: "font-bold bg-white dark:bg-[#1E1E1E] outline-none"
  },
  {
    file: "components/store/collection/ProductGrid.tsx",
    target: "select-none bg-white border",
    replacement: "select-none bg-white dark:bg-[#1E1E1E] border"
  },
  {
    file: "components/store/collection/FilterSidebar.tsx",
    target: "select-none bg-white p-4",
    replacement: "select-none bg-white dark:bg-[#1E1E1E] p-4"
  },
  {
    file: "components/store/cart/CartItem.tsx",
    target: "hover:bg-white text-[var(--ag-gray-800)]",
    replacement: "hover:bg-white dark:hover:bg-[#2D2D2D] text-[var(--ag-gray-800)]"
  },
  {
    file: "components/store/cart/CartDrawer.tsx",
    target: "max-w-[420px] bg-white flex",
    replacement: "max-w-[420px] bg-white dark:bg-[#1E1E1E] flex"
  },
  {
    file: "components/store/cart/CartDrawer.tsx",
    target: "p-6 bg-white shrink-0",
    replacement: "p-6 bg-white dark:bg-[#1E1E1E] shrink-0"
  }
];

replacements.forEach(({ file, target, replacement }) => {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    if (content.includes(target)) {
      content = content.replace(new RegExp(target.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), replacement);
      fs.writeFileSync(fullPath, content);
      console.log(`Updated ${file}`);
    } else {
      console.log(`Target not found in ${file}`);
    }
  } else {
    console.log(`File not found: ${fullPath}`);
  }
});
