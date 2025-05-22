import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PromotionsList } from "@/components/admin/promotions/promotions-list"
import { Plus } from "lucide-react"
import Link from "next/link"

export default async function PromotionsPage() {
  const supabase = createClient()

  // Check if promotions table exists
  let tableExists = false
  try {
    const { data, error } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_schema", "public")
      .eq("table_name", "promotions")
      .single()

    if (!error && data) {
      tableExists = true
    }
  } catch (error) {
    console.error("Error checking if promotions table exists:", error)
  }

  // Get active promotions count
  let activePromotionsCount = 0
  if (tableExists) {
    try {
      const { count, error } = await supabase.from("promotions").select("*", { count: "exact" }).eq("is_active", true)

      if (!error) {
        activePromotionsCount = count || 0
      }
    } catch (error) {
      console.error("Error getting active promotions count:", error)
    }
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Promotions</h2>
        <Link href="/admin/promotions/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add New Promotion
          </Button>
        </Link>
      </div>

      {!tableExists ? (
        <Card>
          <CardHeader>
            <CardTitle>Promotions Table Not Found</CardTitle>
            <CardDescription>
              The promotions table does not exist in your database. Please run the database setup first.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/setup">
              <Button variant="outline">Go to Database Setup</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Promotions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activePromotionsCount}</div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">All Promotions</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
              <TabsTrigger value="expired">Expired</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <PromotionsList filter="all" />
            </TabsContent>

            <TabsContent value="active" className="space-y-4">
              <PromotionsList filter="active" />
            </TabsContent>

            <TabsContent value="scheduled" className="space-y-4">
              <PromotionsList filter="scheduled" />
            </TabsContent>

            <TabsContent value="expired" className="space-y-4">
              <PromotionsList filter="expired" />
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}
