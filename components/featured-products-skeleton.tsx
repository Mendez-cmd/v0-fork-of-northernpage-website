import { ProductCardSkeleton } from "./product-card-skeleton"

interface FeaturedProductsSkeletonProps {
  count?: number
}

export function FeaturedProductsSkeleton({ count = 3 }: FeaturedProductsSkeletonProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  )
}
