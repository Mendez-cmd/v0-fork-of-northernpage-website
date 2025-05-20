import { DbSetupNotification } from "@/components/db-setup-notification"
import { DbSetupWishlist } from "@/components/db-setup-wishlist"

export default function SetupPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Setup</h1>
      <p className="mb-4">Configure your application settings here.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <DbSetupNotification />
        <DbSetupWishlist />
        {/* Other setup components */}
      </div>
    </div>
  )
}
