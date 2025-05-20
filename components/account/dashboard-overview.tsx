"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { formatCurrency, formatDate } from "@/lib/utils"
import { ShoppingBag, Package, Heart, Star } from "lucide-react"

interface DashboardOverviewProps {
  user: any
}

export function DashboardOverview({ user }: DashboardOverviewProps) {
  const [stats, setStats] = useState({
    totalOrders: 0,
    inProgress: 0,
    wishlistItems: 0,
    reviewsCount: 0,
  })
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.id) return

      try {
        // Fetch orders count
        const { data: orders, error: ordersError } = await supabase.from("orders").select("*").eq("user_id", user.id)

        // Fetch in-progress orders
        const { data: inProgressOrders, error: inProgressError } = await supabase
          .from("orders")
          .select("*")
          .eq("user_id", user.id)
          .in("status", ["processing", "shipped"])

        // Fetch wishlist items
        const { data: wishlist, error: wishlistError } = await supabase
          .from("wishlist")
          .select("*")
          .eq("user_id", user.id)

        // Fetch reviews
        const { data: reviews, error: reviewsError } = await supabase.from("reviews").select("*").eq("user_id", user.id)

        // Set stats
        setStats({
          totalOrders: orders?.length || 0,
          inProgress: inProgressOrders?.length || 0,
          wishlistItems: wishlist?.length || 0,
          reviewsCount: reviews?.length || 0,
        })

        // Set recent orders
        setRecentOrders(orders?.slice(0, 5) || [])
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [user, supabase])

  const firstName = user?.user_metadata?.first_name || user?.user_metadata?.name?.split(" ")[0] || "there"

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gold"></div>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Dashboard</h2>
      <p className="text-gray-600 mb-6">Welcome back, {firstName}! Here's an overview of your account.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
              <ShoppingBag className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <h3 className="text-2xl font-bold">{stats.totalOrders}</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mr-4">
              <Package className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">In Progress</p>
              <h3 className="text-2xl font-bold">{stats.inProgress}</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mr-4">
              <Heart className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Wishlist Items</p>
              <h3 className="text-2xl font-bold">{stats.wishlistItems}</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
              <Star className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Reviews</p>
              <h3 className="text-2xl font-bold">{stats.reviewsCount}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Recent Orders</h3>
          <Button variant="link" className="text-gold hover:text-amber-600" asChild>
            <Link href="#" onClick={() => document.querySelector('[data-value="orders"]')?.click()}>
              View All
            </Link>
          </Button>
        </div>

        {recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Order ID</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Date</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Status</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Total</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b">
                    <td className="px-4 py-3 text-sm">#{order.id.slice(0, 8)}</td>
                    <td className="px-4 py-3 text-sm">{formatDate(order.created_at)}</td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          order.status === "delivered"
                            ? "bg-green-100 text-green-800"
                            : order.status === "shipped"
                              ? "bg-blue-100 text-blue-800"
                              : order.status === "processing"
                                ? "bg-amber-100 text-amber-800"
                                : order.status === "cancelled"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">{formatCurrency(order.total_amount)}</td>
                    <td className="px-4 py-3 text-sm">
                      <Button variant="link" size="sm" className="text-gold hover:text-amber-600 h-auto p-0">
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">You haven't placed any orders yet.</p>
            <Button className="mt-4 bg-gold hover:bg-amber-500 text-black" asChild>
              <Link href="/products">Browse Products</Link>
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="#" onClick={() => document.querySelector('[data-value="orders"]')?.click()}>
          <div className="bg-gray-50 hover:bg-gray-100 rounded-lg p-6 transition-colors">
            <ShoppingBag className="h-8 w-8 text-gold mb-4" />
            <h4 className="text-lg font-semibold mb-1">My Orders</h4>
            <p className="text-sm text-gray-500">View and track your orders</p>
          </div>
        </Link>

        <Link href="#" onClick={() => document.querySelector('[data-value="addresses"]')?.click()}>
          <div className="bg-gray-50 hover:bg-gray-100 rounded-lg p-6 transition-colors">
            <svg
              className="h-8 w-8 text-gold mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              ></path>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              ></path>
            </svg>
            <h4 className="text-lg font-semibold mb-1">Addresses</h4>
            <p className="text-sm text-gray-500">Manage your addresses</p>
          </div>
        </Link>

        <Link href="#" onClick={() => document.querySelector('[data-value="settings"]')?.click()}>
          <div className="bg-gray-50 hover:bg-gray-100 rounded-lg p-6 transition-colors">
            <svg
              className="h-8 w-8 text-gold mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              ></path>
            </svg>
            <h4 className="text-lg font-semibold mb-1">Edit Profile</h4>
            <p className="text-sm text-gray-500">Update your personal information</p>
          </div>
        </Link>

        <Link href="#" onClick={() => document.querySelector('[data-value="wishlist"]')?.click()}>
          <div className="bg-gray-50 hover:bg-gray-100 rounded-lg p-6 transition-colors">
            <Heart className="h-8 w-8 text-gold mb-4" />
            <h4 className="text-lg font-semibold mb-1">Wishlist</h4>
            <p className="text-sm text-gray-500">View your saved items</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
