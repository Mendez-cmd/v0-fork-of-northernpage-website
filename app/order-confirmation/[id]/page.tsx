"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { formatCurrency, formatDate } from "@/lib/utils"
import { CheckCircle, Package, Truck, MapPin } from "lucide-react"

export default function OrderConfirmationPage() {
  const params = useParams()
  const [order, setOrder] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("orders")
          .select(`
            *,
            order_items (
              *,
              products (*)
            )
          `)
          .eq("id", params.id)
          .single()

        if (error) throw error
        setOrder(data)
      } catch (error) {
        console.error("Error fetching order:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchOrder()
    }
  }, [params.id])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[40vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gold"></div>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
          <p className="text-gray-600 mb-6">The order you're looking for doesn't exist.</p>
          <Link href="/">
            <Button className="bg-gold hover:bg-amber-500 text-black">Return to Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-gray-600">Thank you for your order. We'll send you a confirmation email shortly.</p>
        </div>

        {/* Order Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Order Details</span>
              <Badge variant="outline">#{order.id.slice(0, 8)}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Order Date</p>
                <p className="font-medium">{formatDate(order.created_at)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <Badge className="bg-amber-100 text-amber-800">
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-500">Payment Method</p>
                <p className="font-medium capitalize">{order.payment_method}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="font-medium text-lg">{formatCurrency(order.total_amount)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Items */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Order Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.order_items?.map((item: any) => (
                <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <img
                    src={item.products?.image_url || "/placeholder.svg"}
                    alt={item.products?.name}
                    className="w-16 h-16 object-contain rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.products?.name}</h3>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(item.price)}</p>
                    <p className="text-sm text-gray-500">Total: {formatCurrency(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Shipping Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Shipping Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="font-medium">Delivery Address:</p>
              <p className="text-gray-600">{order.shipping_address}</p>
              <div className="flex items-center gap-2 mt-4">
                <Truck className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-500">Estimated delivery: 5-7 business days</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>
                  {formatCurrency(
                    order.total_amount -
                      (order.shipping_fee || 0) -
                      (order.tax_amount || 0) +
                      (order.discount_amount || 0),
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{formatCurrency(order.shipping_fee || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>{formatCurrency(order.tax_amount || 0)}</span>
              </div>
              {order.discount_amount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-{formatCurrency(order.discount_amount)}</span>
                </div>
              )}
              <div className="border-t pt-2">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{formatCurrency(order.total_amount)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/account">
            <Button variant="outline" className="w-full sm:w-auto">
              View Order History
            </Button>
          </Link>
          <Link href="/products">
            <Button className="bg-gold hover:bg-amber-500 text-black w-full sm:w-auto">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
