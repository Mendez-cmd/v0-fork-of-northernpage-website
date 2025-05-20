"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface ProductFiltersProps {
  activeCategory?: string
}

export function ProductFilters({ activeCategory }: ProductFiltersProps) {
  const pathname = usePathname()

  const categories = [
    { id: "all", name: "All Products", href: "/products" },
    { id: "chicken-pastel", name: "Chicken Pastil", href: "/products?category=chicken-pastel" },
    { id: "laing", name: "Laing", href: "/products?category=laing" },
    { id: "bangus", name: "Spanish Bangus", href: "/products?category=bangus" },
    { id: "chili", name: "Chili Garlic", href: "/products?category=chili" },
  ]

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Categories</h2>

      <ul className="space-y-2">
        {categories.map((category) => (
          <li key={category.id}>
            <Link
              href={category.href}
              className={cn(
                "block px-3 py-2 rounded-md transition-colors",
                activeCategory === category.id || (!activeCategory && category.id === "all")
                  ? "bg-gold text-black font-medium"
                  : "hover:bg-gray-100",
              )}
            >
              {category.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
