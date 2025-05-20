import { DbSetupProducts } from "@/components/db-setup-products"

export default function AdminSetupPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Database Setup</h1>
      <div className="space-y-8">
        <DbSetupProducts />
        {/* Add other database setup components here */}
      </div>
    </div>
  )
}
