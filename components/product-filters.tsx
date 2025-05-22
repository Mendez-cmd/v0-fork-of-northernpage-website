"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { cn, formatCurrency } from "@/lib/utils"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { X, Filter, ChevronDown, ChevronUp } from "lucide-react"

interface ProductFiltersProps {
  activeCategory?: string
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  sort?: string
}

export function ProductFilters({ activeCategory, minPrice, maxPrice, inStock, sort }: ProductFiltersProps) {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [priceRange, setPriceRange] = useState<[number, number]>([minPrice || 0, maxPrice || 500])
  const [showFilters, setShowFilters] = useState(false)
  const [showCategories, setShowCategories] = useState(true)
  const [showPrice, setShowPrice] = useState(true)
  const [showAvailability, setShowAvailability] = useState(true)
  const [showSort, setShowSort] = useState(true)

  const categories = [
    { id: "all", name: "All Products", href: "/products" },
    { id: "chicken-pastel", name: "Chicken Pastil", href: "/products?category=chicken-pastel" },
    { id: "laing", name: "Laing", href: "/products?category=laing" },
    { id: "bangus", name: "Spanish Bangus", href: "/products?category=bangus" },
    { id: "chili", name: "Chili Garlic", href: "/products?category=chili" },
  ]

  const sortOptions = [
    { id: "name-asc", name: "Name (A-Z)" },
    { id: "name-desc", name: "Name (Z-A)" },
    { id: "price-asc", name: "Price (Low to High)" },
    { id: "price-desc", name: "Price (High to Low)" },
    { id: "newest", name: "Newest First" },
  ]

  const createQueryString = (params: Record<string, string | number | boolean | null>) => {
    const newParams = new URLSearchParams(searchParams.toString())

    Object.entries(params).forEach(([key, value]) => {
      if (value === null) {
        newParams.delete(key)
      } else {
        newParams.set(key, String(value))
      }
    })

    return newParams.toString()
  }

  const handlePriceChange = (values: number[]) => {
    setPriceRange([values[0], values[1]])
  }

  const applyPriceFilter = () => {
    router.push(
      `${pathname}?${createQueryString({
        category: activeCategory || null,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        inStock: inStock || null,
        sort: sort || null,
      })}`,
    )
  }

  const handleSortChange = (sortValue: string) => {
    router.push(
      `${pathname}?${createQueryString({
        category: activeCategory || null,
        minPrice: minPrice || null,
        maxPrice: maxPrice || null,
        inStock: inStock || null,
        sort: sortValue,
      })}`,
    )
  }

  const handleInStockChange = (checked: boolean) => {
    router.push(
      `${pathname}?${createQueryString({
        category: activeCategory || null,
        minPrice: minPrice || null,
        maxPrice: maxPrice || null,
        inStock: checked,
        sort: sort || null,
      })}`,
    )
  }

  const clearAllFilters = () => {
    router.push("/products")
  }

  const hasActiveFilters = activeCategory || minPrice || maxPrice || inStock || sort

  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Filters</h2>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={clearAllFilters} className="text-xs h-8">
              <X className="h-3 w-3 mr-1" /> Clear All
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden text-xs h-8"
          >
            <Filter className="h-3 w-3 mr-1" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
        </div>
      </div>

      <div className={cn("space-y-6", showFilters ? "block" : "hidden md:block")}>
        {/* Categories */}
        <div className="border-b pb-4">
          <button
            className="flex items-center justify-between w-full font-medium mb-2"
            onClick={() => setShowCategories(!showCategories)}
          >
            Categories
            {showCategories ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>

          {showCategories && (
            <ul className="space-y-2 mt-2">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={category.href}
                    className={cn(
                      "block px-3 py-2 rounded-md transition-colors text-sm",
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
          )}
        </div>

        {/* Price Range */}
        <div className="border-b pb-4">
          <button
            className="flex items-center justify-between w-full font-medium mb-2"
            onClick={() => setShowPrice(!showPrice)}
          >
            Price Range
            {showPrice ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>

          {showPrice && (
            <div className="mt-4 px-2">
              <Slider
                defaultValue={[priceRange[0], priceRange[1]]}
                max={500}
                step={10}
                onValueChange={handlePriceChange}
                className="mb-6"
              />

              <div className="flex items-center justify-between mb-4 text-sm">
                <span>{formatCurrency(priceRange[0])}</span>
                <span>{formatCurrency(priceRange[1])}</span>
              </div>

              <Button onClick={applyPriceFilter} size="sm" className="w-full">
                Apply
              </Button>
            </div>
          )}
        </div>

        {/* Availability */}
        <div className="border-b pb-4">
          <button
            className="flex items-center justify-between w-full font-medium mb-2"
            onClick={() => setShowAvailability(!showAvailability)}
          >
            Availability
            {showAvailability ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>

          {showAvailability && (
            <div className="mt-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="in-stock" checked={inStock} onCheckedChange={handleInStockChange} />
                <label
                  htmlFor="in-stock"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  In Stock Only
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Sort By */}
        <div>
          <button
            className="flex items-center justify-between w-full font-medium mb-2"
            onClick={() => setShowSort(!showSort)}
          >
            Sort By
            {showSort ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>

          {showSort && (
            <div className="mt-2 space-y-1">
              {sortOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleSortChange(option.id)}
                  className={cn(
                    "block w-full text-left px-3 py-2 rounded-md transition-colors text-sm",
                    sort === option.id ? "bg-gold text-black font-medium" : "hover:bg-gray-100",
                  )}
                >
                  {option.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
