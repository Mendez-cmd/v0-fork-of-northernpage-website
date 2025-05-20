import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Eye, TruckIcon } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

// Make the page dynamic to avoid static rendering issues
export const dynamic = "force-dynamic"

export default async function DeliveryManagementPage() {
  const supabase = createClient()

  // Initialize variables
  let tableExists = false
  let orders = []

  // Check if orders table exists
  try {
    const { data, error } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_schema", "public")
      .eq("table_name", "orders")
      .single()

    if (!error && data) {
      tableExists = true
    }
  } catch (error) {
    console.error("Error checking if orders table exists:", error)
  }

  // Fetch orders with addresses if tables exist
  if (tableExists) {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          addresses:shipping_address_id (
            recipient_name, 
            street_address, 
            apartment, 
            city, 
            province, 
            postal_code, 
            country, 
            phone
          ),
          users:user_id (
            email,
            first_name,
            last_name,
            phone
          )
        `)
        .order("created_at", { ascending: false })

      if (!error && data) {
        orders = data
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
    }
  }

  // Status badge color mapping
  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Delivery Management</h1>
      </div>

      {!tableExists ? (
        <Card>
          <CardHeader>
            <CardTitle>Database Setup Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">The orders table doesn't exist yet. Please set up your database first.</p>
            <Link href="/admin/setup">
              <Button>Go to Database Setup</Button>
            </Link>
          </CardContent>
        </Card>
      ) : orders.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Delivery Address</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id.substring(0, 8)}...</TableCell>
                    <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {order.users ? (
                        <div>
                          <div>
                            {order.users.first_name} {order.users.last_name}
                          </div>
                          <div className="text-sm text-gray-500">{order.users.email}</div>
                          {order.users.phone && <div className="text-sm text-gray-500">{order.users.phone}</div>}
                        </div>
                      ) : (
                        <span className="text-gray-500">Guest</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {order.addresses ? (
                        <div className="max-w-xs truncate">
                          <div>{order.addresses.recipient_name}</div>
                          <div className="text-sm text-gray-500">
                            {order.addresses.street_address}
                            {order.addresses.apartment && `, ${order.addresses.apartment}`}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.addresses.city}, {order.addresses.province}, {order.addresses.postal_code}
                          </div>
                          {order.addresses.phone && (
                            <div className="text-sm text-gray-500">{order.addresses.phone}</div>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-500">No address</span>
                      )}
                    </TableCell>
                    <TableCell>{formatCurrency(order.total_amount)}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[order.status] || "bg-gray-100 text-gray-800"}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/delivery/${order.id}`}>
                          <Button variant="outline" size="icon">
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>
                        </Link>
                        <Link href={`/admin/delivery/${order.id}/update`}>
                          <Button variant="outline" size="icon">
                            <TruckIcon className="h-4 w-4" />
                            <span className="sr-only">Update Status</span>
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <p>No orders found.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
