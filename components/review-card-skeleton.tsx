import { Skeleton } from "@/components/ui/skeleton"

export function ReviewCardSkeleton() {
  return (
    <div className="bg-white rounded-lg p-4 md:p-6 shadow-md">
      <div className="flex items-center mb-4">
        <Skeleton className="h-12 w-12 rounded-full bg-gray-300" />
        <div className="ml-3 space-y-2">
          <Skeleton className="h-4 w-32 bg-gray-300" />
          <Skeleton className="h-3 w-24 bg-gray-300" />
        </div>
      </div>
      <div className="mb-3">
        <Skeleton className="h-4 w-24 bg-gray-300" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full bg-gray-300" />
        <Skeleton className="h-4 w-full bg-gray-300" />
        <Skeleton className="h-4 w-3/4 bg-gray-300" />
      </div>
    </div>
  )
}
