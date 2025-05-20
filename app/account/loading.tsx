import { LoadingLogo } from "@/components/loading-logo"

export default function AccountLoading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <LoadingLogo size="lg" message="Loading your account..." />
    </div>
  )
}
