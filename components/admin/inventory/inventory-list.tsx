"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { formatCurrency } from "@/lib/utils"
import { Edit, AlertTriangle, CheckCircle, Search, Save } from "lucide-react"
import Link from "next/link"

interface Product {
  id: string
  name: string
  price: number
  stock_quantity: number
  category: string
  image_url: string | null
}

interface InventoryListProps {
  filter: "all" | "low-stock" | "out-of-stock" | "in-stock"
}

export function InventoryList({ filter }: InventoryListProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState<Record<string, boolean>>({})
  const [editValues, setEditValues] = useState<Record<string, number>>({})
  const [searchQuery, setSearchQuery] = useState("")
  const supabase = createClient()

  useEffect(() => {
    async function fetchProducts() {
      try {
        let query = supabase.from("products").select("*")

        // Apply filter
        if (filter === "low-stock") {
          query = query.lt("stock_quantity", 10).gt("stock_quantity", 0)
        } else if (filter === "out-of-stock") {
          query = query.eq("stock_quantity", 0)
        } else if (filter === "in-stock") {
          query = query.gt("stock_quantity", 10)
        }

        const { data, error } = await query.order("name")

        if (error) throw error

        if (data && data.length > 0) {
          setProducts(data)
        } else {
          // If no data or empty array, use sample data
          const sampleData: Product[] = [
            {
              id: "1",
              name: "Chicken Pastil Original",
              price: 149,
              stock_quantity: 25,
              category: "chicken-pastel",
              image_url: "/images/chickenpastiloriginal.png",
            },
            {
              id: "2",
              name: "Chicken Pastil Classic",
              price: 149,
              stock_quantity: 8,
              category: "chicken-pastel",
              image_url: "/images/chickenpastilclassic.png",
            },
            {
              id: "3",
              name: "Chicken Pastil Salted Egg",
              price: 149,
              stock_quantity: 0,
              category: "chicken-pastel",
              image_url: "/images/chickenpastilsaltedegg.png",
            },
            {
              id: "4",
              name: "Laing",
              price: 149,
              stock_quantity: 15,
              category: "laing",
              image_url: "/images/laing.png",
            },
            {
              id: "5",
              name: "Spanish Bangus",
              price: 189,
              stock_quantity: 5,
              category: "bangus",
              image_url: "/images/bangusspanish.png",
            },
          ]

          // Filter sample data based on the filter prop
          let filteredSampleData = sampleData
          if (filter === "low-stock") {
            filteredSampleData = sampleData.filter(
              (product) => product.stock_quantity < 10 && product.stock_quantity > 0,
            )
          } else if (filter === "out-of-stock") {
            filteredSampleData = sampleData.filter((product) => product.stock_quantity === 0)
          } else if (filter === "in-stock") {
            filteredSampleData = sampleData.filter((product) => product.stock_quantity > 10)
          }

          setProducts(filteredSampleData)
        }
      } catch (error) {
        console.error("Error fetching products:", error)
        // Use sample data if there's an error
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [supabase, filter])

  const toggleEditMode = (productId: string) => {
    setEditMode((prev) => {
      const newState = { ...prev, [productId]: !prev[productId] }

      // Initialize edit value if entering edit mode
      if (newState[productId]) {
        const product = products.find((p) => p.id === productId)
        if (product) {
          setEditValues((prev) => ({ ...prev, [productId]: product.stock_quantity }))
        }
      }

      return newState
    })
  }

  const handleStockChange = (productId: string, value: string) => {
    const numValue = Number.parseInt(value, 10)
    if (!isNaN(numValue) && numValue >= 0) {
      setEditValues((prev) => ({ ...prev, [productId]: numValue }))
    }
  }

  const saveStockChange = async (productId: string) => {
    try {
      const newStockValue = editValues[productId]

      // In a real app, this would update the database
      const { error } = await supabase.from("products").update({ stock_quantity: newStockValue }).eq("id", productId)

      if (error) throw error

      // Update local state
      setProducts((prev) =>
        prev.map((product) => (product.id === productId ? { ...product, stock_quantity: newStockValue } : product)),
      )

      // Exit edit mode
      toggleEditMode(productId)

      // Log inventory change
      const product = products.find((p) => p.id === productId)
      if (product) {
        const previousStock = product.stock_quantity

        // In a real app, this would create an inventory log entry
        await supabase.from("inventory_logs").insert({
          product_id: productId,
          previous_quantity: previousStock,
          new_quantity: newStockValue,
          change_reason: "manual_update",
          notes: `Stock manually updated from ${previousStock} to ${newStockValue}`,
          changed_by: "current_user_id", // In a real app, this would be the actual user ID
        })
      }
    } catch (error) {
      console.error("Error updating stock:", error)
      // Handle error (show toast, etc.)
    }
  }

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) {
      return {
        badge: <Badge variant="destructive">Out of Stock</Badge>,
        icon: <AlertTriangle className="h-4 w-4 text-red-500" />,
      }
    } else if (quantity < 10) {
      return {
        badge: (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            Low Stock
          </Badge>
        ),
        icon: <AlertTriangle className="h-4 w-4 text-amber-500" />,
      }
    } else {
      return {
        badge: (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            In Stock
          </Badge>
        ),
        icon: <CheckCircle className="h-4 w-4 text-green-500" />,
      }
    }
  }

  // Filter products based on search query
  const filteredProducts = searchQuery
    ? products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : products

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

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search products..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredProducts.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-muted-foreground">No products found</p>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-12 gap-4 px-4 py-2 font-medium text-sm text-muted-foreground">
            <div className="col-span-5">Product</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-1">Price</div>
            <div className="col-span-2">Stock</div>
            <div className="col-span-2">Actions</div>
          </div>

          {filteredProducts.map((product) => {
            const stockStatus = getStockStatus(product.stock_quantity)

            return (
              <Card key={product.id} className="p-4">
                <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-5 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                      {product.image_url ? (
                        <img
                          src={product.image_url || "/placeholder.svg"}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.svg?height=40&width=40"
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                          No img
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium truncate">{product.name}</p>
                      <p className="text-xs text-muted-foreground">ID: {product.id.substring(0, 8)}</p>
                    </div>
                  </div>

                  <div className="col-span-2">
                    <Badge variant="secondary">{product.category}</Badge>
                  </div>

                  <div className="col-span-1">{formatCurrency(product.price)}</div>

                  <div className="col-span-2">
                    {editMode[product.id] ? (
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min="0"
                          value={editValues[product.id]}
                          onChange={(e) => handleStockChange(product.id, e.target.value)}
                          className="w-20 h-8"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-green-500"
                          onClick={() => saveStockChange(product.id)}
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        {stockStatus.icon}
                        <span>{product.stock_quantity}</span>
                      </div>
                    )}
                  </div>

                  <div className="col-span-2 flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => toggleEditMode(product.id)}>
                      {editMode[product.id] ? "Cancel" : "Update Stock"}
                    </Button>

                    <Link href={`/admin/products/${product.id}`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
