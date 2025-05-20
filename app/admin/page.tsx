import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Database, Table2, Play, Settings, TruckIcon } from "lucide-react"

export default function AdminPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Database Setup
            </CardTitle>
            <CardDescription>Initialize your database with required tables</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              Create all necessary tables and seed them with sample data for your Northern Chefs website.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/admin/setup" className="w-full">
              <Button className="w-full">Go to Setup</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              SQL Execution
            </CardTitle>
            <CardDescription>Run custom SQL queries</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              Execute SQL queries directly against your Supabase database for advanced operations.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/admin/sql" className="w-full">
              <Button className="w-full">Go to SQL</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Table2 className="h-5 w-5" />
              Products
            </CardTitle>
            <CardDescription>Manage your product catalog</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              Add, edit, or remove products from your catalog. Update prices, descriptions, and images.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/admin/products" className="w-full">
              <Button className="w-full">Manage Products</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TruckIcon className="h-5 w-5" />
              Delivery Management
            </CardTitle>
            <CardDescription>Track and manage orders</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              View all orders, update delivery status, and access customer shipping information.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/admin/delivery" className="w-full">
              <Button className="w-full">Manage Deliveries</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Settings
            </CardTitle>
            <CardDescription>Configure website settings</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              Adjust global settings for your Northern Chefs website, including shipping options and payment methods.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/admin/settings" className="w-full">
              <Button className="w-full">Go to Settings</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
