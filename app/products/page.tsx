import { Suspense } from "react"
import { getAllProducts, getProductsByCategory } from "@/lib/products"
import { ProductGrid } from "@/components/product-grid"
import { ProductFilters } from "@/components/product-filters"
import { ProductGridSkeleton } from "@/components/product-grid-skeleton"

interface ProductsPageProps {
  searchParams: {
    category?: string
  }
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { category } = searchParams

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Our Products</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-1/4">
          <ProductFilters activeCategory={category} />
        </div>

        <div className="w-full lg:w-3/4">
          <Suspense fallback={<ProductGridSkeleton />}>
            <ProductList category={category} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

async function ProductList({ category }: { category?: string }) {
  const products = category ? await getProductsByCategory(category) : await getAllProducts()
  return <ProductGrid products={products} />
}
