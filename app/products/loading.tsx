import { ProductGridSkeleton } from "@/components/product-grid-skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="h-8 w-48 bg-gray-300 rounded-md mb-8 animate-pulse"></div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-1/4 animate-pulse">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="h-6 w-32 bg-gray-300 rounded-md mb-4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center">
                  <div className="h-5 w-5 bg-gray-300 rounded-md mr-2"></div>
                  <div className="h-4 w-24 bg-gray-300 rounded-md"></div>
                </div>
              ))}
            </div>

            <div className="h-6 w-32 bg-gray-300 rounded-md mt-6 mb-4"></div>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center">
                  <div className="h-5 w-5 bg-gray-300 rounded-md mr-2"></div>
                  <div className="h-4 w-20 bg-gray-300 rounded-md"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full lg:w-3/4">
          <ProductGridSkeleton count={6} />
        </div>
      </div>
    </div>
  )
}
