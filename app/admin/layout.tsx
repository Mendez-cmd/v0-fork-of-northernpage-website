import type React from "react"
import Link from "next/link"
import {
  Database,
  Table2,
  Play,
  Settings,
  TruckIcon,
  Package,
  LayoutDashboard,
  ShoppingCart,
  Tag,
  FolderTree,
  BarChart,
  Users,
} from "lucide-react"

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
          <Link href="/admin/dashboard" className="flex items-center gap-2 p-2 rounded hover:bg-gray-800">
            <LayoutDashboard className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>

          <div className="pt-4 pb-2">
            <p className="px-2 text-xs uppercase font-semibold text-gray-400">Products</p>
          </div>

          <Link href="/admin/products" className="flex items-center gap-2 p-2 rounded hover:bg-gray-800">
            <Package className="h-5 w-5" />
            <span>Products</span>
          </Link>

          <Link href="/admin/categories" className="flex items-center gap-2 p-2 rounded hover:bg-gray-800">
            <FolderTree className="h-5 w-5" />
            <span>Categories</span>
          </Link>

          <Link href="/admin/inventory" className="flex items-center gap-2 p-2 rounded hover:bg-gray-800">
            <Table2 className="h-5 w-5" />
            <span>Inventory</span>
          </Link>

          <div className="pt-4 pb-2">
            <p className="px-2 text-xs uppercase font-semibold text-gray-400">Orders</p>
          </div>

          <Link href="/admin/orders" className="flex items-center gap-2 p-2 rounded hover:bg-gray-800">
            <ShoppingCart className="h-5 w-5" />
            <span>Orders</span>
          </Link>

          <Link href="/admin/delivery" className="flex items-center gap-2 p-2 rounded hover:bg-gray-800">
            <TruckIcon className="h-5 w-5" />
            <span>Delivery</span>
          </Link>

          <div className="pt-4 pb-2">
            <p className="px-2 text-xs uppercase font-semibold text-gray-400">Marketing</p>
          </div>

          <Link href="/admin/promotions" className="flex items-center gap-2 p-2 rounded hover:bg-gray-800">
            <Tag className="h-5 w-5" />
            <span>Promotions</span>
          </Link>

          <div className="pt-4 pb-2">
            <p className="px-2 text-xs uppercase font-semibold text-gray-400">Users</p>
          </div>

          <Link href="/admin/customers" className="flex items-center gap-2 p-2 rounded hover:bg-gray-800">
            <Users className="h-5 w-5" />
            <span>Customers</span>
          </Link>

          <div className="pt-4 pb-2">
            <p className="px-2 text-xs uppercase font-semibold text-gray-400">Reports</p>
          </div>

          <Link href="/admin/analytics" className="flex items-center gap-2 p-2 rounded hover:bg-gray-800">
            <BarChart className="h-5 w-5" />
            <span>Analytics</span>
          </Link>

          <div className="pt-4 pb-2">
            <p className="px-2 text-xs uppercase font-semibold text-gray-400">System</p>
          </div>

          <Link href="/admin/setup" className="flex items-center gap-2 p-2 rounded hover:bg-gray-800">
            <Database className="h-5 w-5" />
            <span>Database Setup</span>
          </Link>

          <Link href="/admin/sql" className="flex items-center gap-2 p-2 rounded hover:bg-gray-800">
            <Play className="h-5 w-5" />
            <span>SQL Execution</span>
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
