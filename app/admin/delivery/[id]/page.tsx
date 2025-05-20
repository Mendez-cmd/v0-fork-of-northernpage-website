import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, TruckIcon } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  // Fetch order with address
  const { data: order, error } = await supabase
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
    .eq("id", params.id)
    .single()

  if (error || !order) {
    notFound()
  }

  // Fetch order items with product details
  const { data: orderItems } = await supabase
    .from("order_items")
    .select(`
      *,
      products:product_id (
        name,
        image_url
      )
    `)
    .eq("order_id", order.id)

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
      <div className="flex items-center mb-6">
        <Link href="/admin/delivery">
          <Button variant="outline" size="icon" className="mr-4">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Order Details</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Order Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Order ID</dt>
                <dd>{order.id}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Date</dt>
                <dd>{new Date(order.created_at).toLocaleString()}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Total Amount</dt>
                <dd className="font-bold">{formatCurrency(order.total_amount)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Payment Method</dt>
                <dd>{order.payment_method || "Not specified"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd>
                  <Badge className={statusColors[order.status] || "bg-gray-100 text-gray-800"}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </dd>
              </div>
            </dl>
          </CardContent>
          <CardFooter>
            <Link href={`/admin/delivery/${order.id}/update`} className="w-full">
              <Button className="w-full flex items-center gap-2">
                <TruckIcon className="h-4 w-4" />
                Update Status
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent>
            {order.users ? (
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Name</dt>
                  <dd>
                    {order.users.first_name} {order.users.last_name}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd>{order.users.email}</dd>
                </div>
                {order.users.phone && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Phone</dt>
                    <dd>{order.users.phone}</dd>
                  </div>
                )}
              </dl>
            ) : (
              <p className="text-gray-500">Guest order (no account)</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Shipping Address</CardTitle>
          </CardHeader>
          <CardContent>
            {order.addresses ? (
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Recipient</dt>
                  <dd>{order.addresses.recipient_name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Address</dt>
                  <dd>
                    {order.addresses.street_address}
                    {order.addresses.apartment && <span>, {order.addresses.apartment}</span>}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">City/Province</dt>
                  <dd>
                    {order.addresses.city}, {order.addresses.province}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Postal Code</dt>
                  <dd>{order.addresses.postal_code}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Country</dt>
                  <dd>{order.addresses.country}</dd>
                </div>
                {order.addresses.phone && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Phone</dt>
                    <dd>{order.addresses.phone}</dd>
                  </div>
                )}
              </dl>
            ) : (
              <p className="text-gray-500">No shipping address provided</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          {orderItems && orderItems.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 relative rounded overflow-hidden bg-gray-100">
                          {item.products?.image_url ? (
                            <img
                              src={item.products.image_url || "/placeholder.svg"}
                              alt={item.products?.name || "Product"}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="flex items-center justify-center w-full h-full text-gray-400">No image</div>
                          )}
                        </div>
                        <div>{item.products?.name || "Unknown Product"}</div>
                      </div>
                    </TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{formatCurrency(item.price)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.price * item.quantity)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-gray-500">No items found for this order.</p>
          )}
        </CardContent>
        <CardFooter className="flex justify-end">
          <div className="text-right">
            <div className="text-sm text-gray-500">Total</div>
            <div className="text-xl font-bold">{formatCurrency(order.total_amount)}</div>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
