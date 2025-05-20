import { ProductGridSkeleton } from "@/components/product-grid-skeleton"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProductsLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Skeleton className="h-8 w-48 bg-gray-700 mb-4" />
        <div className="flex flex-wrap gap-2 mb-6">
          {Array(5)
            .fill(0)
            .map((_, index) => (
              <Skeleton key={index} className="h-10 w-24 bg-gray-700 rounded-full" />
            ))}
        </div>
      </div>
      <ProductGridSkeleton count={12} />
    </div>
  )
}
