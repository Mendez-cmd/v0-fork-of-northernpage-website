import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { formatDate } from "@/lib/utils"
import { Eye, Search, UserCircle } from "lucide-react"

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: { search?: string }
}) {
  const supabase = createClient()
  const { search } = searchParams

  // Build query
  let query = supabase.from("users").select(`
    *,
    orders:orders(count)
  `)

  // Apply search filter
  if (search) {
    query = query.or(`email.ilike.%${search}%,first_name.ilike.%${search}%,last_name.ilike.%${search}%`)
  }

  // Execute query
  const { data: customers, error } = await query.order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching customers:", error)
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Customer Management</h1>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <form className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input name="search" placeholder="Search by name or email..." defaultValue={search} className="pl-10" />
            </div>
            <Button type="submit">Search</Button>
          </form>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Customers</CardTitle>
        </CardHeader>
        <CardContent>
          {customers && customers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Customer</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Email</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Joined</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Orders</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                            {customer.profile_picture ? (
                              <img
                                src={customer.profile_picture || "/placeholder.svg"}
                                alt={`${customer.first_name || ""} ${customer.last_name || ""}`}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            ) : (
                              <UserCircle className="w-5 h-5 text-gray-500" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium">
                              {customer.first_name || customer.last_name
                                ? `${customer.first_name || ""} ${customer.last_name || ""}`
                                : "Anonymous User"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">{customer.email}</td>
                      <td className="py-3 px-4">{formatDate(customer.created_at)}</td>
                      <td className="py-3 px-4">{customer.orders?.[0]?.count || 0}</td>
                      <td className="py-3 px-4 text-right">
                        <Link href={`/admin/customers/${customer.id}`}>
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
              <p className="text-gray-500">
                {search ? "No customers found matching your search." : "No customers found."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
