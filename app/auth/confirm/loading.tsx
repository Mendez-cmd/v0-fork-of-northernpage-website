import { LoadingLogo } from "@/components/loading-logo"

export default function AuthConfirmLoading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <LoadingLogo size="lg" message="Confirming your account..." />
    </div>
  )
}
