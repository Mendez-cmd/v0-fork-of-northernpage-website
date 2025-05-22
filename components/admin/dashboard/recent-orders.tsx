"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { formatCurrency, formatDate } from "@/lib/utils"
import { ExternalLink } from "lucide-react"

interface Order {
  id: string
  created_at: string
  status: string
  total_amount: number
  user_id: string
  user_email?: string
}

export function RecentOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchRecentOrders() {
      try {
        // Fetch the 5 most recent orders
        const { data: ordersData, error: ordersError } = await supabase
          .from("orders")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(5)

        if (ordersError) throw ordersError

        // Fetch user emails for the orders
        if (ordersData && ordersData.length > 0) {
          const userIds = ordersData.map((order) => order.user_id)

          const { data: usersData, error: usersError } = await supabase
            .from("users")
            .select("id, email")
            .in("id", userIds)

          if (usersError) throw usersError

          // Combine order data with user emails
          const ordersWithUserEmails = ordersData.map((order) => {
            const user = usersData?.find((u) => u.id === order.user_id)
            return {
              ...order,
              user_email: user?.email || "Unknown",
            }
          })

          setOrders(ordersWithUserEmails)
        } else {
          setOrders([])
        }
      } catch (error) {
        console.error("Error fetching recent orders:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecentOrders()
  }, [supabase])

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {orders.length === 0 ? (
        <p className="text-center text-muted-foreground py-4">No recent orders found</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Order #{order.id.substring(0, 8)}</p>
                <p className="text-sm text-muted-foreground">{order.user_email}</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm">{formatCurrency(order.total_amount)}</p>
                  <Badge
                    variant={
                      order.status === "completed"
                        ? "default"
                        : order.status === "processing"
                          ? "secondary"
                          : order.status === "pending"
                            ? "outline"
                            : "destructive"
                    }
                  >
                    {order.status}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">{formatDate(order.created_at)}</p>
                <Button variant="ghost" size="icon" asChild>
                  <a href={`/admin/orders/${order.id}`}>
                    <ExternalLink className="h-4 w-4" />
                    <span className="sr-only">View order</span>
                  </a>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
