import { Suspense } from "react"
import { getFilteredProducts } from "@/lib/products"
import { ProductGrid } from "@/components/product-grid"
import { ProductFilters } from "@/components/product-filters"
import { ProductGridSkeleton } from "@/components/product-grid-skeleton"
import { ActiveFilters } from "@/components/active-filters"

interface ProductsPageProps {
  searchParams: {
    category?: string
    minPrice?: string
    maxPrice?: string
    inStock?: string
    sort?: string
  }
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { category, minPrice: minPriceStr, maxPrice: maxPriceStr, inStock: inStockStr, sort } = searchParams

  const minPrice = minPriceStr ? Number.parseInt(minPriceStr) : undefined
  const maxPrice = maxPriceStr ? Number.parseInt(maxPriceStr) : undefined
  const inStock = inStockStr === "true"

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-4">Our Products</h1>

      <ActiveFilters category={category} minPrice={minPrice} maxPrice={maxPrice} inStock={inStock} sort={sort} />

      <div className="flex flex-col lg:flex-row gap-8 mt-6">
        <div className="w-full lg:w-1/4">
          <ProductFilters
            activeCategory={category}
            minPrice={minPrice}
            maxPrice={maxPrice}
            inStock={inStock}
            sort={sort}
          />
        </div>

        <div className="w-full lg:w-3/4">
          <Suspense fallback={<ProductGridSkeleton />}>
            <ProductList category={category} minPrice={minPrice} maxPrice={maxPrice} inStock={inStock} sort={sort} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

async function ProductList({
  category,
  minPrice,
  maxPrice,
  inStock,
  sort,
}: {
  category?: string
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  sort?: string
}) {
  const products = await getFilteredProducts({
    category,
    minPrice,
    maxPrice,
    inStock,
    sort,
  })

  return <ProductGrid products={products} />
}
