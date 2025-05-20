import { LoadingLogo } from "@/components/loading-logo"

export default function ProductDetailLoading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <LoadingLogo size="lg" message="Preparing product details..." />
    </div>
  )
}
