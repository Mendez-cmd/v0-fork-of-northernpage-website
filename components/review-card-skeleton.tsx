import { Skeleton } from "@/components/ui/skeleton"

export function ReviewCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
      <div className="flex items-center mb-4">
        <Skeleton className="h-12 w-12 rounded-full mr-3" />
        <div>
          <Skeleton className="h-5 w-32 mb-1" />
          <div className="flex space-x-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-4 w-4 rounded-full" />
            ))}
          </div>
        </div>
      </div>
      <Skeleton className="h-5 w-3/4 mb-3" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  )
}
