import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Eye, Filter, ArrowUpDown } from "lucide-react"

export default async function OrdersManagementPage({
  searchParams,
}: {
  searchParams: { status?: string; sort?: string; order?: string }
}) {
  const supabase = createClient()
  const { status, sort = "created_at", order = "desc" } = searchParams

  // Build query
  let query = supabase.from("orders").select(`
    *,
    order_items (
      id,
      quantity,
      price
    )
  `)

  // Apply status filter
  if (status && status !== "all") {
    query = query.eq("status", status)
  }

  // Apply sorting
  query = query.order(sort, { ascending: order === "asc" })

  // Execute query
  const { data: orders, error } = await query

  if (error) {
    console.error("Error fetching orders:", error)
  }

  // Calculate order totals
  const orderStats = {
    total: orders?.length || 0,
    processing: orders?.filter((order) => order.status === "processing").length || 0,
    shipped: orders?.filter((order) => order.status === "shipped").length || 0,
    delivered: orders?.filter((order) => order.status === "delivered").length || 0,
    cancelled: orders?.filter((order) => order.status === "cancelled").length || 0,
  }

  // Calculate total revenue
  const totalRevenue = orders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Order Management</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orderStats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Processing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orderStats.processing}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Shipped</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orderStats.shipped}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Delivered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orderStats.delivered}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex items-center">
              <Filter className="mr-2 h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Filter by Status:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/admin/orders">
                <Badge variant={!status || status === "all" ? "default" : "outline"} className="cursor-pointer">
                  All
                </Badge>
              </Link>
              <Link href="/admin/orders?status=processing">
                <Badge variant={status === "processing" ? "default" : "outline"} className="cursor-pointer">
                  Processing
                </Badge>
              </Link>
              <Link href="/admin/orders?status=shipped">
                <Badge variant={status === "shipped" ? "default" : "outline"} className="cursor-pointer">
                  Shipped
                </Badge>
              </Link>
              <Link href="/admin/orders?status=delivered">
                <Badge variant={status === "delivered" ? "default" : "outline"} className="cursor-pointer">
                  Delivered
                </Badge>
              </Link>
              <Link href="/admin/orders?status=cancelled">
                <Badge variant={status === "cancelled" ? "default" : "outline"} className="cursor-pointer">
                  Cancelled
                </Badge>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {orders && orders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-500">
                      <Link
                        href={`/admin/orders?sort=id&order=${sort === "id" && order === "desc" ? "asc" : "desc"}`}
                        className="flex items-center"
                      >
                        Order ID
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </Link>
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">
                      <Link
                        href={`/admin/orders?sort=created_at&order=${sort === "created_at" && order === "desc" ? "asc" : "desc"}`}
                        className="flex items-center"
                      >
                        Date
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </Link>
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">
                      <Link
                        href={`/admin/orders?sort=status&order=${sort === "status" && order === "desc" ? "asc" : "desc"}`}
                        className="flex items-center"
                      >
                        Status
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </Link>
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">
                      <Link
                        href={`/admin/orders?sort=total_amount&order=${sort === "total_amount" && order === "desc" ? "asc" : "desc"}`}
                        className="flex items-center"
                      >
                        Total
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </Link>
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Items</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">#{order.id.slice(0, 8)}</td>
                      <td className="py-3 px-4">{formatDate(order.created_at)}</td>
                      <td className="py-3 px-4">
                        <Badge
                          className={
                            order.status === "processing"
                              ? "bg-amber-100 text-amber-800"
                              : order.status === "shipped"
                                ? "bg-blue-100 text-blue-800"
                                : order.status === "delivered"
                                  ? "bg-green-100 text-green-800"
                                  : order.status === "cancelled"
                                    ? "bg-red-100 text-red-800"
                                    : ""
                          }
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">{formatCurrency(order.total_amount)}</td>
                      <td className="py-3 px-4">{order.order_items?.length || 0}</td>
                      <td className="py-3 px-4 text-right">
                        <Link href={`/admin/orders/${order.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No orders found.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
