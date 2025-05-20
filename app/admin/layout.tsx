import type React from "react"
import Link from "next/link"
import { Database, Table2, Play, Settings, TruckIcon, Package } from "lucide-react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <div className="w-64 bg-gray-900 text-white p-4">
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-1">Admin Panel</h2>
          <p className="text-gray-400 text-sm">Northern Chefs</p>
        </div>

        <nav className="space-y-1">
          <Link href="/admin" className="flex items-center gap-2 p-2 rounded hover:bg-gray-800">
            <Package className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
          <Link href="/admin/setup" className="flex items-center gap-2 p-2 rounded hover:bg-gray-800">
            <Database className="h-5 w-5" />
            <span>Database Setup</span>
          </Link>
          <Link href="/admin/sql" className="flex items-center gap-2 p-2 rounded hover:bg-gray-800">
            <Play className="h-5 w-5" />
            <span>SQL Execution</span>
          </Link>
          <Link href="/admin/products" className="flex items-center gap-2 p-2 rounded hover:bg-gray-800">
            <Table2 className="h-5 w-5" />
            <span>Products</span>
          </Link>
          <Link href="/admin/delivery" className="flex items-center gap-2 p-2 rounded hover:bg-gray-800">
            <TruckIcon className="h-5 w-5" />
            <span>Delivery Management</span>
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-2 p-2 rounded hover:bg-gray-800">
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </Link>
        </nav>

        <div className="mt-auto pt-8">
          <Link href="/" className="text-gray-400 hover:text-white text-sm">
            ← Back to Website
          </Link>
        </div>
      </div>

      <div className="flex-1 bg-gray-50">{children}</div>
    </div>
  )
}
