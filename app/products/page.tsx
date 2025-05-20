import { Suspense } from "react"
import { getAllProducts, getProductsByCategory } from "@/lib/products"
import { ProductGrid } from "@/components/product-grid"
import { ProductFilters } from "@/components/product-filters"

interface ProductsPageProps {
  searchParams: {
    category?: string
  }
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { category } = searchParams
  const products = category ? await getProductsByCategory(category) : await getAllProducts()

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Our Products</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-1/4">
          <ProductFilters activeCategory={category} />
        </div>

        <div className="w-full lg:w-3/4">
          <Suspense fallback={<div>Loading products...</div>}>
            <ProductGrid products={products} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
