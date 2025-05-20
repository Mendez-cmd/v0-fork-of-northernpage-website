import { Skeleton } from "@/components/ui/skeleton"

export function ProductCardSkeleton() {
  return (
    <div className="bg-custom-card rounded-lg p-4 md:p-6 flex flex-col h-full">
      <div className="relative aspect-square w-full mb-4 bg-gray-800 rounded-md overflow-hidden">
        <Skeleton className="h-full w-full" />
      </div>
      <div className="flex-grow space-y-3">
        <Skeleton className="h-6 w-3/4 bg-gray-700" />
        <Skeleton className="h-4 w-1/2 bg-gray-700" />
        <Skeleton className="h-5 w-1/3 bg-gray-700" />
      </div>
      <div className="mt-4">
        <Skeleton className="h-10 w-full bg-gray-700 rounded-md" />
      </div>
    </div>
  )
}
