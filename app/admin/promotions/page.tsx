import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Plus, Edit, Trash } from "lucide-react"

export default async function PromotionsPage() {
  const supabase = createClient()

  // Check if promotions table exists
  let tableExists = false
  try {
    const { data: tableData, error: tableError } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_schema", "public")
      .eq("table_name", "promotions")
      .single()

    if (!tableError && tableData) {
      tableExists = true
    }
  } catch (error) {
    console.error("Error checking if promotions table exists:", error)
  }

  // Fetch promotions if table exists
  let promotions: any[] = []
  if (tableExists) {
    try {
      const { data, error } = await supabase.from("promotions").select("*").order("created_at", { ascending: false })

      if (!error) {
        promotions = data || []
      }
    } catch (error) {
      console.error("Error fetching promotions:", error)
    }
  }

  // Get current date for checking active status
  const now = new Date().toISOString()

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Promotions Management</h1>
        <Link href="/admin/promotions/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add New Promotion
          </Button>
        </Link>
      </div>

      {!tableExists ? (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Promotions table does not exist. Please set up the database first.
              </p>
              <p className="mt-2">
                <Link href="/admin/setup" className="text-yellow-700 font-medium underline">
                  Go to Database Setup
                </Link>
              </p>
            </div>
          </div>
        </div>
      ) : promotions.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <h3 className="mt-2 text-lg font-medium text-gray-900">No promotions found</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new promotion.</p>
          <div className="mt-6">
            <Link href="/admin/promotions/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add New Promotion
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Active Promotions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Name</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Code</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Discount</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Valid Period</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Usage</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {promotions.map((promo) => {
                    const isActive =
                      promo.is_active &&
                      new Date(promo.starts_at) <= new Date(now) &&
                      new Date(promo.ends_at) >= new Date(now)

                    return (
                      <tr key={promo.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{promo.name}</td>
                        <td className="py-3 px-4">
                          <code className="bg-gray-100 px-2 py-1 rounded">{promo.code}</code>
                        </td>
                        <td className="py-3 px-4">
                          {promo.discount_type === "percentage"
                            ? `${promo.discount_value}%`
                            : formatCurrency(promo.discount_value)}
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm">
                            <div>{formatDate(promo.starts_at)}</div>
                            <div>to</div>
                            <div>{formatDate(promo.ends_at)}</div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge
                            className={
                              isActive
                                ? "bg-green-100 text-green-800"
                                : new Date(promo.starts_at) > new Date(now)
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-800"
                            }
                          >
                            {isActive ? "Active" : new Date(promo.starts_at) > new Date(now) ? "Upcoming" : "Expired"}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          {promo.usage_limit
                            ? `${promo.usage_count || 0} / ${promo.usage_limit}`
                            : `${promo.usage_count || 0} / Unlimited`}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex justify-end space-x-2">
                            <Link href={`/admin/promotions/${promo.id}`}>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <form action={`/api/admin/promotions/${promo.id}/delete`} method="POST">
                              <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                                <Trash className="h-4 w-4" />
                              </Button>
                            </form>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
