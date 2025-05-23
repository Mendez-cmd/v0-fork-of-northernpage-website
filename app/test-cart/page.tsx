"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useCart } from "@/hooks/use-cart"
import { formatCurrency } from "@/lib/utils"
import { ShoppingCart, ArrowRight, Home, Package } from "lucide-react"

// Sample test products
const testProducts = [
  {
    id: "test-1",
    name: "Test Chicken Pastil",
    price: 150,
    image_url: "/images/chickenpastiloriginal.png",
    description: "A test product for the cart",
  },
  {
    id: "test-2",
    name: "Test Laing",
    price: 120,
    image_url: "/images/laing.png",
    description: "Another test product for the cart",
  },
  {
    id: "test-3",
    name: "Test Spanish Bangus",
    price: 180,
    image_url: "/images/bangusspanish.png",
    description: "A third test product for the cart",
  },
]

export default function TestCartPage() {
  const { items, addItem, removeItem, clearCart, subtotal } = useCart()
  const [addedMessage, setAddedMessage] = useState<string | null>(null)
  const router = useRouter()

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image_url,
      quantity: 1,
    })

    setAddedMessage(`Added ${product.name} to cart!`)
    setTimeout(() => setAddedMessage(null), 3000)
  }

  const navigateToCart = () => {
    router.push("/cart")
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-2xl font-bold mb-4">Cart Testing Page</h1>
          <p className="text-gray-600 mb-6">
            This page allows you to test adding items to your cart and navigating between pages to verify that the cart
            state is maintained correctly.
          </p>

          <div className="flex flex-wrap gap-4 mb-8">
            <Link href="/">
              <Button variant="outline" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Home
              </Button>
            </Link>
            <Link href="/products">
              <Button variant="outline" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Products
              </Button>
            </Link>
            <Button onClick={navigateToCart} className="flex items-center gap-2 bg-gold hover:bg-amber-500 text-black">
              <ShoppingCart className="h-4 w-4" />
              Go to Cart ({items.length} items)
            </Button>
          </div>

          {addedMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6 relative">
              <span className="block sm:inline">{addedMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {testProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <div className="h-48 relative bg-gray-100">
                  <Image
                    src={product.image_url || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-contain p-4"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{product.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-2">{product.description}</p>
                  <p className="font-bold">{formatCurrency(product.price)}</p>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-gold hover:bg-amber-500 text-black"
                  >
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="bg-gray-100 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Current Cart Contents</h2>
            {items.length === 0 ? (
              <p className="text-gray-500">Your cart is empty.</p>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between border-b pb-4">
                      <div className="flex items-center">
                        <div className="w-16 h-16 relative bg-gray-100 rounded mr-4">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            fill
                            className="object-contain p-2"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-gray-500">
                            {item.quantity} x {formatCurrency(item.price)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium mr-4">{formatCurrency(item.price * item.quantity)}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="mt-6 flex justify-between">
                  <Button variant="outline" onClick={clearCart}>
                    Clear Cart
                  </Button>
                  <Button
                    onClick={navigateToCart}
                    className="bg-gold hover:bg-amber-500 text-black flex items-center gap-2"
                  >
                    Go to Cart
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Testing Instructions</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Add some products to your cart using the buttons above</li>
            <li>Navigate to another page using the navigation links</li>
            <li>Return to this page or go to the cart page</li>
            <li>Verify that your cart items are still present</li>
            <li>Try removing items or clearing the cart</li>
            <li>Test the checkout flow by going to the cart page</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
