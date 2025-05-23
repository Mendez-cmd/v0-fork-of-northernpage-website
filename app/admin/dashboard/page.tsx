"use client"

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { SalesSummary } from "@/components/admin/dashboard/sales-summary"
import { RecentOrders } from "@/components/admin/dashboard/recent-orders"
import { InventoryAlerts } from "@/components/admin/dashboard/inventory-alerts"
import { TopProducts } from "@/components/admin/dashboard/top-products"
import { useMobile } from "@/hooks/use-mobile"
import { TrendingUp, TrendingDown, ShoppingCart, Users, Package, DollarSign, ArrowUpRight } from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
  const isMobile = useMobile()

  const stats = [
    {
      title: "Revenue",
      value: "₱124,500",
      change: "+12.5%",
      changeType: "positive" as const,
      icon: DollarSign,
      link: "/admin/analytics",
    },
    {
      title: "Orders",
      value: "1,234",
      change: "+8.2%",
      changeType: "positive" as const,
      icon: ShoppingCart,
      link: "/admin/orders",
    },
    {
      title: "Customers",
      value: "856",
      change: "+15.3%",
      changeType: "positive" as const,
      icon: Users,
      link: "/admin/customers",
    },
    {
      title: "Products",
      value: "42",
      change: "-2.1%",
      changeType: "negative" as const,
      icon: Package,
      link: "/admin/products",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-2">Welcome to your admin dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          const TrendIcon = stat.changeType === "positive" ? TrendingUp : TrendingDown

          return (
            <Card key={stat.title} className="overflow-hidden border-0 shadow-sm hover:shadow transition-shadow">
              <Link href={stat.link} className="block h-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 pt-6 px-6">
                  <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                  <div
                    className={`p-2 rounded-lg ${
                      stat.changeType === "positive" ? "bg-green-100" : "bg-red-100"
                    } shadow-sm`}
                  >
                    <Icon className={`h-5 w-5 ${stat.changeType === "positive" ? "text-green-600" : "text-red-600"}`} />
                  </div>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="flex items-center gap-1 mt-2">
                    <div
                      className={`flex items-center gap-1 text-sm font-medium ${
                        stat.changeType === "positive" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      <TrendIcon className="h-3 w-3" />
                      {stat.change}
                    </div>
                    <span className="text-sm text-gray-500 ml-1">vs last month</span>
                  </div>
                </CardContent>
              </Link>
            </Card>
          )
        })}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-8">
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <TabsList className="bg-gray-100 p-1 rounded-lg">
            <TabsTrigger value="overview" className="rounded-md py-2 px-4">
              Overview
            </TabsTrigger>
            <TabsTrigger value="orders" className="rounded-md py-2 px-4">
              Orders
            </TabsTrigger>
            <TabsTrigger value="inventory" className="rounded-md py-2 px-4">
              Inventory
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-8 mt-0">
          {/* Sales Chart */}
          <Card className="border-0 shadow-sm overflow-hidden">
            <CardHeader className="bg-gray-50 border-b border-gray-100 px-6 py-5">
              <CardTitle className="text-lg flex items-center justify-between">
                <span className="flex items-center">
                  <DollarSign className="h-5 w-5 text-amber-600 mr-2" />
                  Sales Overview
                </span>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
                  <Link href="/admin/analytics">
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <SalesSummary />
            </CardContent>
          </Card>

          {/* Two Column Layout for Desktop, Single Column for Mobile */}
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Recent Orders */}
            <Card className="border-0 shadow-sm overflow-hidden">
              <CardHeader className="bg-gray-50 border-b border-gray-100 px-6 py-5">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span className="flex items-center">
                    <ShoppingCart className="h-5 w-5 text-blue-600 mr-2" />
                    Recent Orders
                  </span>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
                    <Link href="/admin/orders">
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <RecentOrders />
              </CardContent>
            </Card>

            {/* Inventory Alerts */}
            <Card className="border-0 shadow-sm overflow-hidden">
              <CardHeader className="bg-gray-50 border-b border-gray-100 px-6 py-5">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span className="flex items-center">
                    <Package className="h-5 w-5 text-amber-600 mr-2" />
                    Inventory Alerts
                  </span>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
                    <Link href="/admin/inventory">
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <InventoryAlerts />
              </CardContent>
            </Card>
          </div>

          {/* Top Products */}
          <Card className="border-0 shadow-sm overflow-hidden">
            <CardHeader className="bg-gray-50 border-b border-gray-100 px-6 py-5">
              <CardTitle className="text-lg flex items-center justify-between">
                <span className="flex items-center">
                  <Users className="h-5 w-5 text-purple-600 mr-2" />
                  Top Products
                </span>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
                  <Link href="/admin/products">
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <TopProducts />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-8 mt-0">
          <Card className="border-0 shadow-sm overflow-hidden">
            <CardHeader className="bg-gray-50 border-b border-gray-100 px-6 py-5">
              <CardTitle className="text-lg flex items-center">
                <ShoppingCart className="h-5 w-5 text-blue-600 mr-2" />
                Recent Orders
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <RecentOrders />
            </CardContent>
            <CardFooter className="bg-gray-50 border-t border-gray-100 px-6 py-4">
              <Button asChild>
                <Link href="/admin/orders">View All Orders</Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-8 mt-0">
          <Card className="border-0 shadow-sm overflow-hidden">
            <CardHeader className="bg-gray-50 border-b border-gray-100 px-6 py-5">
              <CardTitle className="text-lg flex items-center">
                <Package className="h-5 w-5 text-amber-600 mr-2" />
                Inventory Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <InventoryAlerts />
            </CardContent>
            <CardFooter className="bg-gray-50 border-t border-gray-100 px-6 py-4">
              <Button asChild>
                <Link href="/admin/inventory">Manage Inventory</Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
