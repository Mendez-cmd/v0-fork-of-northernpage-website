import { FeaturedProductsSkeleton } from "@/components/featured-products-skeleton"
import { Skeleton } from "@/components/ui/skeleton"
import { ReviewCardSkeleton } from "@/components/review-card-skeleton"

export default function HomeLoading() {
  return (
    <div>
      {/* Hero Section Skeleton */}
      <div className="hero-section">
        <div className="bg-gray-800 w-full h-full flex items-center justify-center">
          <div className="text-center px-4 space-y-4">
            <Skeleton className="h-12 w-64 mx-auto bg-gray-700" />
            <Skeleton className="h-6 w-80 mx-auto bg-gray-700" />
            <Skeleton className="h-10 w-40 mx-auto bg-gray-700 rounded-md mt-4" />
          </div>
        </div>
      </div>

      {/* Featured Products Skeleton */}
      <FeaturedProductsSkeleton />

      {/* Reviews Section Skeleton */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <Skeleton className="h-8 w-48 mx-auto bg-gray-300" />
            <Skeleton className="h-4 w-64 mx-auto mt-3 bg-gray-300" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(3)
              .fill(0)
              .map((_, index) => (
                <ReviewCardSkeleton key={index} />
              ))}
          </div>
        </div>
      </section>

      {/* Coming Soon Section Skeleton */}
      <section className="py-12 bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <Skeleton className="h-10 w-64 mx-auto bg-gray-700" />
            <Skeleton className="h-6 w-80 mx-auto mt-3 bg-gray-700" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array(4)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="bg-gray-700 rounded-lg p-6 flex flex-col items-center">
                  <Skeleton className="h-16 w-16 rounded-full bg-gray-600 mb-4" />
                  <Skeleton className="h-5 w-32 bg-gray-600" />
                </div>
              ))}
          </div>
        </div>
      </section>
    </div>
  )
}
