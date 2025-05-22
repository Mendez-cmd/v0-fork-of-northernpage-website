import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CategoriesList } from "@/components/admin/categories/categories-list"
import { Plus } from "lucide-react"
import Link from "next/link"

export default async function CategoriesPage() {
  const supabase = createClient()

  // Check if product_categories table exists
  let tableExists = false
  try {
    const { data, error } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_schema", "public")
      .eq("table_name", "product_categories")
      .single()

    if (!error && data) {
      tableExists = true
    }
  } catch (error) {
    console.error("Error checking if product_categories table exists:", error)
  }

  // Get categories count
  let categoriesCount = 0
  if (tableExists) {
    try {
      const { count, error } = await supabase.from("product_categories").select("*", { count: "exact" })

      if (!error) {
        categoriesCount = count || 0
      }
    } catch (error) {
      console.error("Error getting categories count:", error)
    }
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Product Categories</h2>
        <Link href="/admin/categories/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add New Category
          </Button>
        </Link>
      </div>

      {!tableExists ? (
        <Card>
          <CardHeader>
            <CardTitle>Categories Table Not Found</CardTitle>
            <CardDescription>
              The product_categories table does not exist in your database. Please run the database setup first.
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
                <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{categoriesCount}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Categories</CardTitle>
              <CardDescription>Manage your product categories and subcategories</CardDescription>
            </CardHeader>
            <CardContent>
              <CategoriesList />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
