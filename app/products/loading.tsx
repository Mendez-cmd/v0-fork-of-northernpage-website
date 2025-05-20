import { LoadingLogo } from "@/components/loading-logo"

export default function ProductsLoading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <LoadingLogo size="lg" message="Loading our delicious products..." />
    </div>
  )
}
