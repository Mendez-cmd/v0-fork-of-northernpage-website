import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OrdersList } from "@/components/admin/orders/orders-list"
import { Download, Printer } from "lucide-react"

export default async function OrdersPage() {
  const supabase = createClient()

  // Get order counts by status
  const getOrderCountByStatus = async (status: string) => {
    try {
      const { count, error } = await supabase.from("orders").select("*", { count: "exact" }).eq("status", status)

      if (error) throw error
      return count || 0
    } catch (error) {
      console.error(`Error getting ${status} order count:`, error)
      return 0
    }
  }

  const pendingCount = await getOrderCountByStatus("pending")
  const processingCount = await getOrderCountByStatus("processing")
  const shippedCount = await getOrderCountByStatus("shipped")
  const deliveredCount = await getOrderCountByStatus("delivered")
  const cancelledCount = await getOrderCountByStatus("cancelled")

  // Get total order count
  let totalOrderCount = 0
  try {
    const { count, error } = await supabase.from("orders").select("*", { count: "exact" })

    if (!error) {
      totalOrderCount = count || 0
    }
  } catch (error) {
    console.error("Error getting total order count:", error)
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Print Orders
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrderCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{processingCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Shipped</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{shippedCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deliveredCount}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="shipped">Shipped</TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <OrdersList filter="all" />
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <OrdersList filter="pending" />
        </TabsContent>

        <TabsContent value="processing" className="space-y-4">
          <OrdersList filter="processing" />
        </TabsContent>

        <TabsContent value="shipped" className="space-y-4">
          <OrdersList filter="shipped" />
        </TabsContent>

        <TabsContent value="delivered" className="space-y-4">
          <OrdersList filter="delivered" />
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-4">
          <OrdersList filter="cancelled" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
