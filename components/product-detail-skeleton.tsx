import { Skeleton } from "@/components/ui/skeleton"
import { ReviewCardSkeleton } from "./review-card-skeleton"

export function ProductDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-6 md:py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6 order-1 md:order-1">
          <Skeleton className="h-64 sm:h-80 md:h-96 w-full" />
        </div>

        <div className="order-2 md:order-2 space-y-4">
          <Skeleton className="h-8 w-3/4" />

          <div className="flex items-center mb-4">
            <div className="flex mr-2 space-x-1">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-5 w-5 rounded-full" />
              ))}
            </div>
            <Skeleton className="h-4 w-24" />
          </div>

          <Skeleton className="h-8 w-32" />

          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          <Skeleton className="h-12 w-full md:w-40" />

          <div className="border-t border-gray-200 pt-4 md:pt-6 space-y-3">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-8 md:mt-16 space-y-6">
        <Skeleton className="h-8 w-48" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6 space-y-4">
            <Skeleton className="h-6 w-40" />
            <div className="space-y-4">
              <div>
                <Skeleton className="h-4 w-20 mb-2" />
                <div className="flex space-x-1">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Skeleton key={index} className="h-6 w-6 rounded-full" />
                  ))}
                </div>
              </div>

              <div>
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>

              <div>
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-24 w-full" />
              </div>

              <Skeleton className="h-10 w-32" />
            </div>
          </div>

          <div>
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-4 md:mb-6 space-y-4">
              <Skeleton className="h-6 w-40" />
              <div className="flex items-center mb-2">
                <div className="flex space-x-1 mr-2">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Skeleton key={index} className="h-5 w-5 rounded-full" />
                  ))}
                </div>
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {Array.from({ length: 2 }).map((_, index) => (
            <ReviewCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  )
}
