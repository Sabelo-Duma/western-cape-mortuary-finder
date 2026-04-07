"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ArrowUpDown } from "lucide-react";

const SORT_OPTIONS = [
  { value: "name", label: "Name (A-Z)" },
  { value: "availability", label: "Availability" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
] as const;

export function SortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") || "name";

  const handleSort = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "name") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex items-center gap-2">
      <ArrowUpDown className="h-3.5 w-3.5 text-gray-400" />
      <select
        value={currentSort}
        onChange={(e) => handleSort(e.target.value)}
        className="text-sm text-gray-600 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-[#1B4965] rounded cursor-pointer pr-6 appearance-none"
        aria-label="Sort mortuaries"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
