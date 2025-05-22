"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Skeleton } from "@/components/ui/skeleton"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface TopProduct {
  id: string
  name: string
  total_sold: number
  revenue: number
}

export function TopProducts() {
  const [products, setProducts] = useState<TopProduct[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchTopProducts() {
      try {
        // In a real app, this would be a more complex query joining order_items and products
        // For now, we'll use sample data
        const sampleData = [
          { id: "1", name: "Chicken Pastil Original", total_sold: 120, revenue: 17880 },
          { id: "2", name: "Chicken Pastil Classic", total_sold: 95, revenue: 14155 },
          { id: "3", name: "Spanish Bangus", total_sold: 85, revenue: 16065 },
          { id: "4", name: "Laing", total_sold: 70, revenue: 10430 },
          { id: "5", name: "Chili Garlic", total_sold: 65, revenue: 10335 },
        ]

        setProducts(sampleData)
      } catch (error) {
        console.error("Error fetching top products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTopProducts()
  }, [supabase])

  if (loading) {
    return <Skeleton className="h-[350px] w-full" />
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={products} layout="vertical" margin={{ left: 20, right: 20 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
        <XAxis type="number" />
        <YAxis type="category" dataKey="name" width={150} tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
        <Tooltip
          formatter={(value, name) => [
            name === "total_sold" ? `${value} units` : `₱${value.toLocaleString()}`,
            name === "total_sold" ? "Units Sold" : "Revenue",
          ]}
          labelFormatter={(label) => `Product: ${label}`}
        />
        <Bar dataKey="total_sold" fill="#8884d8" name="Units Sold" barSize={20} />
        <Bar dataKey="revenue" fill="#82ca9d" name="Revenue" barSize={20} />
      </BarChart>
    </ResponsiveContainer>
  )
}
