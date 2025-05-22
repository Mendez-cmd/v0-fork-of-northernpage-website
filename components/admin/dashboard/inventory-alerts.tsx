"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertTriangle, ArrowUpCircle } from "lucide-react"

interface Product {
  id: string
  name: string
  stock_quantity: number
  category: string
}

export function InventoryAlerts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchLowStockProducts() {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("id, name, stock_quantity, category")
          .lt("stock_quantity", 10)
          .order("stock_quantity", { ascending: true })
          .limit(5)

        if (error) throw error
        setProducts(data || [])
      } catch (error) {
        console.error("Error fetching low stock products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchLowStockProducts()
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
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-4 text-center">
          <ArrowUpCircle className="h-10 w-10 text-green-500 mb-2" />
          <p className="text-muted-foreground">All products have sufficient stock</p>
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((product) => (
            <div key={product.id} className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">{product.name}</p>
                <p className="text-sm text-muted-foreground">{product.category}</p>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      product.stock_quantity === 0
                        ? "destructive"
                        : product.stock_quantity < 5
                          ? "outline"
                          : "secondary"
                    }
                  >
                    {product.stock_quantity === 0 ? "Out of stock" : `${product.stock_quantity} left`}
                  </Badge>
                  {product.stock_quantity < 5 && <AlertTriangle className="h-3 w-3 text-amber-500" />}
                </div>
              </div>
              <Button variant="outline" size="sm" asChild>
                <a href={`/admin/products/${product.id}`}>Update Stock</a>
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
