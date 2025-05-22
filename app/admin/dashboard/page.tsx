import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DollarSign, ShoppingBag, Users, Package, AlertTriangle } from "lucide-react"
import { SalesSummary } from "@/components/admin/dashboard/sales-summary"
import { RecentOrders } from "@/components/admin/dashboard/recent-orders"
import { InventoryAlerts } from "@/components/admin/dashboard/inventory-alerts"
import { TopProducts } from "@/components/admin/dashboard/top-products"
import { CustomerActivity } from "@/components/admin/dashboard/customer-activity"
import { AdminActivityLog } from "@/components/admin/dashboard/admin-activity-log"

export default async function AdminDashboard() {
  const supabase = createClient()

  // Fetch summary data
  const { data: orderCount } = await supabase.from("orders").select("id", { count: "exact" })

  const { data: pendingOrderCount } = await supabase
    .from("orders")
    .select("id", { count: "exact" })
    .eq("status", "pending")

  const { data: userCount } = await supabase.from("users").select("id", { count: "exact" })

  const { data: productCount } = await supabase.from("products").select("id", { count: "exact" })

  const { data: lowStockCount } = await supabase
    .from("products")
    .select("id", { count: "exact" })
    .lt("stock_quantity", 10)

  // Calculate total revenue
  const { data: orderItems } = await supabase.from("order_items").select("price, quantity")

  const totalRevenue = orderItems?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₱{totalRevenue.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">+20.1% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Orders</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{orderCount?.count || 0}</div>
                <p className="text-xs text-muted-foreground">{pendingOrderCount?.count || 0} pending orders</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Customers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userCount?.count || 0}</div>
                <p className="text-xs text-muted-foreground">+180 new customers this month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Inventory</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{productCount?.count || 0}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <AlertTriangle className="mr-1 h-3 w-3 text-amber-500" />
                  {lowStockCount?.count || 0} low stock items
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Sales Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <SalesSummary />
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Latest 5 orders across the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentOrders />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Inventory Alerts</CardTitle>
                <CardDescription>Products with low stock levels</CardDescription>
              </CardHeader>
              <CardContent>
                <InventoryAlerts />
              </CardContent>
            </Card>

            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Top Products</CardTitle>
                <CardDescription>Best selling products this month</CardDescription>
              </CardHeader>
              <CardContent>
                <TopProducts />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Customer Activity</CardTitle>
                <CardDescription>New vs returning customers</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <CustomerActivity />
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Admin Activity Log</CardTitle>
                <CardDescription>Recent administrative actions</CardDescription>
              </CardHeader>
              <CardContent>
                <AdminActivityLog />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
