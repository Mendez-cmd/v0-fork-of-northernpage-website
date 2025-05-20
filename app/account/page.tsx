import type { Metadata } from "next"
import { AccountDashboard } from "@/components/account/account-dashboard"

export const metadata: Metadata = {
  title: "My Account - Northern Chefs",
  description: "Manage your Northern Chefs account, orders, addresses, and more.",
}

export default function AccountPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // Get the active tab from the URL query parameters
  const tab = searchParams.tab as string | undefined

  return (
    <main className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <AccountDashboard initialTab={tab} />
      </div>
    </main>
  )
}
