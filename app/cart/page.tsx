"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Trash2, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/hooks/use-cart"
import { formatCurrency } from "@/lib/utils"
import { useMobile } from "@/hooks/use-mobile"

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, clearCart } = useCart()
  const [couponCode, setCouponCode] = useState("")
  const [discount, setDiscount] = useState(0)
  const isMobile = useMobile()

  const handleApplyCoupon = () => {
    if (couponCode.toLowerCase() === "welcome10") {
      const discountAmount = subtotal * 0.1
      setDiscount(discountAmount)
    } else {
      setDiscount(0)
    }
  }

  const total = subtotal - discount

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-16 text-center">
        <div className="max-w-md mx-auto">
          <ShoppingBag className="h-12 w-12 md:h-16 md:w-16 mx-auto mb-4 md:mb-6 text-gray-300" />
          <h1 className="text-xl md:text-2xl font-bold mb-2 md:mb-4">Your cart is empty</h1>
          <p className="text-gray-500 mb-6 md:mb-8">Looks like you haven't added any products to your cart yet.</p>
          <Link href="/products">
            <Button className="bg-gold hover:bg-amber-500 text-black">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-12">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 md:p-6">
              <div className="flex justify-between items-center mb-4 md:mb-6">
                <h2 className="text-lg md:text-xl font-semibold">Cart Items ({items.length})</h2>
                <Button
                  variant="outline"
                  onClick={clearCart}
                  className="text-red-500 hover:text-red-700 text-xs md:text-sm"
                  size={isMobile ? "sm" : "default"}
                >
                  Clear Cart
                </Button>
              </div>

              <div className="space-y-4 md:space-y-6">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row items-center gap-3 md:gap-4 pb-4 md:pb-6 border-b"
                  >
                    <div className="w-20 h-20 md:w-24 md:h-24 relative bg-gray-100 rounded">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        sizes="(max-width: 768px) 80px, 96px"
                        className="object-contain p-2"
                      />
                    </div>

                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-gray-500 text-sm">Unit Price: {formatCurrency(item.price)}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </Button>
                    </div>

                    <div className="text-center sm:text-right">
                      <p className="font-semibold">{formatCurrency(item.price * item.quantity)}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700 mt-1"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        <span className="hidden sm:inline">Remove</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 md:mt-6">
            <Link href="/products">
              <Button variant="outline" className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6 sticky top-20">
            <h2 className="text-lg md:text-xl font-semibold mb-4">Order Summary</h2>

            <div className="space-y-3 md:space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-{formatCurrency(discount)}</span>
                </div>
              )}

              <Separator />

              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>

              <div className="pt-3 md:pt-4">
                <label className="block text-sm font-medium mb-2">Coupon Code</label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter coupon code"
                  />
                  <Button variant="outline" onClick={handleApplyCoupon}>
                    Apply
                  </Button>
                </div>
                {discount > 0 && <p className="text-green-600 text-sm mt-2">Coupon applied successfully!</p>}
              </div>

              <Link href="/checkout">
                <Button className="w-full bg-gold hover:bg-amber-500 text-black">Proceed to Checkout</Button>
              </Link>

              <p className="text-xs text-gray-500 text-center">Shipping and taxes will be calculated at checkout</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
