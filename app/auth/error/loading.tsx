import { LoadingLogo } from "@/components/loading-logo"

export default function AuthErrorLoading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <LoadingLogo size="lg" message="Processing..." />
    </div>
  )
}
