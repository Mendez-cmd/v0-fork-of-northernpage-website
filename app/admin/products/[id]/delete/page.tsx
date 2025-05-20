"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

export default function DeleteProductPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(false)
  const [product, setProduct] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  // Fetch product details
  useState(() => {
    const fetchProduct = async () => {
      setIsLoading(true)
      try {
        const { data, error } = await supabase.from("products").select("*").eq("id", params.id).single()

        if (error) {
          throw error
        }

        setProduct(data)
      } catch (error: any) {
        console.error("Error fetching product:", error)
        setError(error.message || "Failed to fetch product")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  })

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      const { error } = await supabase.from("products").delete().eq("id", params.id)

      if (error) {
        throw error
      }

      toast({
        title: "Success",
        description: "Product deleted successfully",
      })

      router.push("/admin/products")
      router.refresh()
    } catch (error: any) {
      console.error("Error deleting product:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete product",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
              <p className="mt-2">
                <Button variant="outline" onClick={() => router.push("/admin/products")} className="text-red-700">
                  Back to Products
                </Button>
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading || !product) {
    return (
      <div className="container mx-auto p-6 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
        <p className="mt-2 text-gray-500">Loading product details...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Delete Product</h1>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold text-red-600 mb-4">Are you sure you want to delete this product?</h2>
        <p className="mb-4 text-gray-600">
          This action cannot be undone. The product will be permanently removed from the database.
        </p>

        <div className="bg-gray-50 p-4 rounded mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-16 w-16">
              <img
                className="h-16 w-16 rounded object-cover"
                src={product.image_url || "/placeholder.svg?height=64&width=64"}
                alt={product.name}
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg?height=64&width=64"
                }}
              />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium">{product.name}</h3>
              <p className="text-sm text-gray-500">
                {product.category || "Uncategorized"} • ₱{product.price?.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete Product
          </Button>
          <Button variant="outline" onClick={() => router.push("/admin/products")}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}
