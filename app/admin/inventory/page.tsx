import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InventoryList } from "@/components/admin/inventory/inventory-list"
import { Download, Upload, AlertTriangle } from "lucide-react"

export default async function InventoryPage() {
  const supabase = createClient()

  // Get inventory counts
  const getTotalProductCount = async () => {
    try {
      const { count, error } = await supabase.from("products").select("*", { count: "exact" })

      if (error) throw error
      return count || 0
    } catch (error) {
      console.error("Error getting total product count:", error)
      return 0
    }
  }

  const getLowStockCount = async () => {
    try {
      const { count, error } = await supabase.from("products").select("*", { count: "exact" }).lt("stock_quantity", 10)

      if (error) throw error
      return count || 0
    } catch (error) {
      console.error("Error getting low stock count:", error)
      return 0
    }
  }

  const getOutOfStockCount = async () => {
    try {
      const { count, error } = await supabase.from("products").select("*", { count: "exact" }).eq("stock_quantity", 0)

      if (error) throw error
      return count || 0
    } catch (error) {
      console.error("Error getting out of stock count:", error)
      return 0
    }
  }

  const totalProductCount = await getTotalProductCount()
  const lowStockCount = await getLowStockCount()
  const outOfStockCount = await getOutOfStockCount()

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Inventory Management</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProductCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStockCount}</div>
            <p className="text-xs text-muted-foreground">Products with less than 10 items in stock</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{outOfStockCount}</div>
            <p className="text-xs text-muted-foreground">Products with 0 items in stock</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Products</TabsTrigger>
          <TabsTrigger value="low-stock">Low Stock</TabsTrigger>
          <TabsTrigger value="out-of-stock">Out of Stock</TabsTrigger>
          <TabsTrigger value="in-stock">In Stock</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <InventoryList filter="all" />
        </TabsContent>

        <TabsContent value="low-stock" className="space-y-4">
          <InventoryList filter="low-stock" />
        </TabsContent>

        <TabsContent value="out-of-stock" className="space-y-4">
          <InventoryList filter="out-of-stock" />
        </TabsContent>

        <TabsContent value="in-stock" className="space-y-4">
          <InventoryList filter="in-stock" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
