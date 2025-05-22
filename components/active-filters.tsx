"use client"

import { useRouter } from "next/navigation"
import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"

interface ActiveFiltersProps {
  category?: string
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  sort?: string
}

export function ActiveFilters({ category, minPrice, maxPrice, inStock, sort }: ActiveFiltersProps) {
  const router = useRouter()

  if (!category && !minPrice && !maxPrice && !inStock && !sort) {
    return null
  }

  const getCategoryName = (categoryId: string) => {
    const categories = {
      "chicken-pastel": "Chicken Pastil",
      laing: "Laing",
      bangus: "Spanish Bangus",
      chili: "Chili Garlic",
    }

    return categories[categoryId as keyof typeof categories] || categoryId
  }

  const getSortName = (sortId: string) => {
    const sortOptions = {
      "name-asc": "Name (A-Z)",
      "name-desc": "Name (Z-A)",
      "price-asc": "Price (Low to High)",
      "price-desc": "Price (High to Low)",
      newest: "Newest First",
    }

    return sortOptions[sortId as keyof typeof sortOptions] || sortId
  }

  const removeFilter = (filter: string) => {
    const searchParams = new URLSearchParams(window.location.search)
    searchParams.delete(filter)
    router.push(`/products?${searchParams.toString()}`)
  }

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      <span className="text-sm text-gray-500 self-center mr-1">Active filters:</span>

      {category && (
        <Badge variant="secondary" className="flex items-center gap-1">
          Category: {getCategoryName(category)}
          <button onClick={() => removeFilter("category")} className="ml-1">
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}

      {(minPrice !== undefined || maxPrice !== undefined) && (
        <Badge variant="secondary" className="flex items-center gap-1">
          Price: {minPrice !== undefined ? formatCurrency(minPrice) : "₱0"} -{" "}
          {maxPrice !== undefined ? formatCurrency(maxPrice) : "₱500+"}
          <button
            onClick={() => {
              removeFilter("minPrice")
              removeFilter("maxPrice")
            }}
            className="ml-1"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}

      {inStock && (
        <Badge variant="secondary" className="flex items-center gap-1">
          In Stock Only
          <button onClick={() => removeFilter("inStock")} className="ml-1">
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}

      {sort && (
        <Badge variant="secondary" className="flex items-center gap-1">
          Sort: {getSortName(sort)}
          <button onClick={() => removeFilter("sort")} className="ml-1">
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}
    </div>
  )
}
