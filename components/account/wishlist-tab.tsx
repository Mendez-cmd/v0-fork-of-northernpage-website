"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { formatCurrency } from "@/lib/utils"
import { useCart } from "@/hooks/use-cart"
import { Heart, ShoppingCart, Package, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface WishlistTabProps {
  userId: string
}

// Sample fallback data in case the wishlist table doesn't exist yet
const fallbackWishlistItems = [
  {
    id: "1",
    product: {
      id: "1",
      name: "Chicken Pastil Original",
      price: 149.0,
      image_url: "/images/chickenpastiloriginal.png",
      category: "chicken-pastel",
    },
  },
  {
    id: "2",
    product: {
      id: "4",
      name: "Laing",
      price: 149.0,
      image_url: "/images/laing.png",
      category: "laing",
    },
  },
]

export function WishlistTab({ userId }: WishlistTabProps) {
  const [wishlistItems, setWishlistItems] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [tableExists, setTableExists] = useState(true)
  const supabase = createClient()
  const { toast } = useToast()
  const { addItem } = useCart()

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!userId) return

      try {
        // Try to fetch wishlist items directly
        const { data, error } = await supabase
          .from("wishlist")
          .select(`
            id,
            user_id,
            product_id,
            created_at
          `)
          .eq("user_id", userId)
          .order("created_at", { ascending: false })

        // Check for the specific "relation does not exist" error
        if (error) {
          console.error("Error fetching wishlist:", error)

          // PostgreSQL error code for "relation does not exist" is 42P01
          if (error.code === "42P01" || error.message.includes("does not exist")) {
            console.log("Wishlist table does not exist yet, using fallback data")
            setTableExists(false)
            setWishlistItems(fallbackWishlistItems)
            setIsLoading(false)
            return
          }
          throw error
        }

        // If we get here, the table exists but might be empty
        if (data && data.length === 0) {
          setWishlistItems([])
          setIsLoading(false)
          return
        }

        // Fetch product details for each wishlist item
        const itemsWithProducts = await Promise.all(
          (data || []).map(async (item) => {
            const { data: product, error: productError } = await supabase
              .from("products")
              .select("*")
              .eq("id", item.product_id)
              .single()

            if (productError) {
              console.error("Error fetching product:", productError)
              return { ...item, product: null }
            }

            return { ...item, product }
          }),
        )

        // Filter out items with null products
        const validItems = itemsWithProducts.filter((item) => item.product !== null)
        setWishlistItems(validItems)
      } catch (error) {
        console.error("Error in wishlist processing:", error)
        // Use fallback data in case of any error
        setTableExists(false)
        setWishlistItems(fallbackWishlistItems)
      } finally {
        setIsLoading(false)
      }
    }

    fetchWishlist()
  }, [userId, supabase])

  const handleRemoveFromWishlist = async (wishlistId: string) => {
    try {
      // Check if we're using fallback data
      if (!tableExists || fallbackWishlistItems.some((item) => item.id === wishlistId)) {
        setWishlistItems((prev) => prev.filter((item) => item.id !== wishlistId))
        toast({
          title: "Removed from wishlist",
          description: "Item has been removed from your wishlist.",
        })
        return
      }

      const { error } = await supabase.from("wishlist").delete().eq("id", wishlistId)

      if (error) throw error

      setWishlistItems((prev) => prev.filter((item) => item.id !== wishlistId))

      toast({
        title: "Removed from wishlist",
        description: "Item has been removed from your wishlist.",
      })
    } catch (error) {
      console.error("Error removing from wishlist:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove item from wishlist. Please try again.",
      })
    }
  }

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image_url || "/placeholder.svg",
      quantity: 1,
    })

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gold"></div>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">My Wishlist</h2>
      <p className="text-gray-600 mb-6">Your saved items for future purchase.</p>

      {!tableExists && (
        <Alert className="mb-6 bg-amber-50 border-amber-200">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            The wishlist feature is currently in demo mode. To enable full functionality, please run the database setup.{" "}
            <Link href="/admin/setup" className="font-medium underline">
              Setup Database
            </Link>
          </AlertDescription>
        </Alert>
      )}

      {wishlistItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item) => (
            <div key={item.id} className="bg-white border rounded-lg overflow-hidden">
              <div className="relative h-48 bg-gray-100">
                {item.product?.image_url ? (
                  <img
                    src={item.product.image_url || "/placeholder.svg"}
                    alt={item.product.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Package className="h-12 w-12" />
                  </div>
                )}
                <button
                  className="absolute top-2 right-2 bg-white p-1.5 rounded-full text-red-500 hover:bg-red-50"
                  onClick={() => handleRemoveFromWishlist(item.id)}
                >
                  <Heart className="h-5 w-5 fill-current" />
                </button>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1">{item.product?.name || "Product"}</h3>
                <p className="text-gray-500 text-sm mb-2">{item.product?.category || "Category"}</p>
                <p className="text-lg font-bold text-gold mb-4">{formatCurrency(item.product?.price || 0)}</p>

                <div className="flex gap-2">
                  <Button
                    className="flex-1 bg-gold hover:bg-amber-500 text-black"
                    onClick={() => handleAddToCart(item.product)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>

                  <Button variant="outline" className="flex-1" asChild>
                    <Link href={`/products/${item.product?.id || "#"}`}>View</Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Heart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
          <p className="text-gray-500 mb-6">Save your favorite items to your wishlist for later.</p>
          <Button className="bg-gold hover:bg-amber-500 text-black" asChild>
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
