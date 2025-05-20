import LoadingLogo from "@/components/loading-logo"

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <LoadingLogo size="lg" message="Preparing delicious Filipino cuisine..." />
    </div>
  )
}
