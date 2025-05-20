import { Skeleton } from "@/components/ui/skeleton"

export function ProductDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="bg-gray-800 rounded-lg overflow-hidden aspect-square">
          <Skeleton className="h-full w-full" />
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div className="space-y-3">
            <Skeleton className="h-8 w-3/4 bg-gray-700" />
            <Skeleton className="h-6 w-1/2 bg-gray-700" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-5 w-full bg-gray-700" />
            <Skeleton className="h-5 w-full bg-gray-700" />
            <Skeleton className="h-5 w-3/4 bg-gray-700" />
          </div>

          <Skeleton className="h-7 w-1/3 bg-gray-700" />

          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-10 w-32 bg-gray-700 rounded-md" />
              <Skeleton className="h-10 w-10 bg-gray-700 rounded-md" />
              <Skeleton className="h-10 w-10 bg-gray-700 rounded-md" />
            </div>
            <Skeleton className="h-12 w-full bg-gray-700 rounded-md" />
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-12 space-y-8">
        <div>
          <Skeleton className="h-7 w-48 bg-gray-700 mb-4" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-full bg-gray-700" />
            <Skeleton className="h-5 w-full bg-gray-700" />
            <Skeleton className="h-5 w-3/4 bg-gray-700" />
          </div>
        </div>

        <div>
          <Skeleton className="h-7 w-48 bg-gray-700 mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array(4)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="bg-gray-800 rounded-lg p-4">
                  <Skeleton className="h-5 w-3/4 bg-gray-700 mb-2" />
                  <Skeleton className="h-4 w-full bg-gray-700" />
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
