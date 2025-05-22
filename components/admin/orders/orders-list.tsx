"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Eye, Truck, Package, CheckCircle, XCircle, Clock } from "lucide-react"
import Link from "next/link"

interface Order {
  id: string
  user_id: string
  status: string
  total_amount: number
  created_at: string
  updated_at: string
  shipping_address?: string
  payment_method?: string
  user_email?: string
}

interface OrdersListProps {
  filter: "all" | "pending" | "processing" | "shipped" | "delivered" | "cancelled"
}

export function OrdersList({ filter }: OrdersListProps) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchOrders() {
      try {
        let query = supabase.from("orders").select("*")

        // Apply filter
        if (filter !== "all") {
          query = query.eq("status", filter)
        }

        const { data, error } = await query.order("created_at", { ascending: false })

        if (error) throw error

        if (data && data.length > 0) {
          // Fetch user emails for the orders
          const userIds = [...new Set(data.map((order) => order.user_id))]

          const { data: usersData, error: usersError } = await supabase
            .from("users")
            .select("id, email")
            .in("id", userIds)

          if (usersError) throw usersError

          // Combine order data with user emails
          const ordersWithUserEmails = data.map((order) => {
            const user = usersData?.find((u) => u.id === order.user_id)
            return {
              ...order,
              user_email: user?.email || "Unknown",
            }
          })

          setOrders(ordersWithUserEmails)
        } else {
          // If no data or empty array, use sample data
          const sampleData: Order[] = [
            {
              id: "1",
              user_id: "user1",
              user_email: "customer1@example.com",
              status: "pending",
              total_amount: 1250,
              created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
              updated_at: new Date(Date.now() - 3600000).toISOString(),
              shipping_address: "123 Main St, Quezon City, Metro Manila",
              payment_method: "card",
            },
            {
              id: "2",
              user_id: "user2",
              user_email: "customer2@example.com",
              status: "processing",
              total_amount: 2450,
              created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
              updated_at: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
              shipping_address: "456 Park Ave, Makati City, Metro Manila",
              payment_method: "gcash",
            },
            {
              id: "3",
              user_id: "user3",
              user_email: "customer3@example.com",
              status: "shipped",
              total_amount: 3150,
              created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
              updated_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
              shipping_address: "789 Ocean Blvd, Pasay City, Metro Manila",
              payment_method: "cod",
            },
            {
              id: "4",
              user_id: "user4",
              user_email: "customer4@example.com",
              status: "delivered",
              total_amount: 1850,
              created_at: new Date(Date.now() - 604800000).toISOString(), // 7 days ago
              updated_at: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
              shipping_address: "101 River St, Mandaluyong City, Metro Manila",
              payment_method: "card",
            },
            {
              id: "5",
              user_id: "user5",
              user_email: "customer5@example.com",
              status: "cancelled",
              total_amount: 2750,
              created_at: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
              updated_at: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
              shipping_address: "202 Mountain Ave, Marikina City, Metro Manila",
              payment_method: "gcash",
            },
          ]

          // Filter sample data based on the filter prop
          let filteredSampleData = sampleData
          if (filter !== "all") {
            filteredSampleData = sampleData.filter((order) => order.status === filter)
          }

          setOrders(filteredSampleData)
        }
      } catch (error) {
        console.error("Error fetching orders:", error)
        // Use sample data if there's an error
        setOrders([])
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [supabase, filter])

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-5 w-[200px]" />
                <Skeleton className="h-4 w-[300px]" />
              </div>
              <Skeleton className="h-10 w-[100px]" />
            </div>
          </Card>
        ))}
      </div>
    )
  }

  function getStatusIcon(status: string) {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-amber-500" />
      case "processing":
        return <Package className="h-4 w-4 text-blue-500" />
      case "shipped":
        return <Truck className="h-4 w-4 text-purple-500" />
      case "delivered":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            Pending
          </Badge>
        )
      case "processing":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Processing
          </Badge>
        )
      case "shipped":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            Shipped
          </Badge>
        )
      case "delivered":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
            Delivered
          </Badge>
        )
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div className="space-y-4">
      {orders.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-muted-foreground">No orders found</p>
        </Card>
      ) : (
        orders.map((order) => (
          <Card key={order.id} className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">Order #{order.id.substring(0, 8)}</h3>
                  {getStatusBadge(order.status)}
                </div>

                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <span>Customer: {order.user_email}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <span>Total: {formatCurrency(order.total_amount)}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <span>Date: {formatDate(order.created_at)}</span>
                  </div>

                  {order.payment_method && (
                    <div className="flex items-center gap-1">
                      <span>Payment: {order.payment_method.toUpperCase()}</span>
                    </div>
                  )}
                </div>

                {order.shipping_address && (
                  <div className="text-sm text-muted-foreground">
                    <span>Ship to: {order.shipping_address}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 self-end md:self-auto">
                <Link href={`/admin/orders/${order.id}`}>
                  <Button variant="outline">
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  )
}
