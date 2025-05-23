"use client"

import { useCart } from "@/hooks/use-cart"
import { ShoppingCart, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function CartStatusIndicator() {
  const { items, removeFromCart, clearCart, getCartTotal } = useCart()
  const [isExpanded, setIsExpanded] = useState(false)

  if (items.length === 0) {
    return (
      <div className="fixed bottom-20 right-4 z-50 lg:bottom-4">
        <Card className="bg-green-100 border-green-300">
          <CardContent className="p-3">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-700">Cart is empty</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed bottom-20 right-4 z-50 lg:bottom-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="bg-blue-50 border-blue-300 max-w-sm">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <ShoppingCart className="h-4 w-4 text-blue-600" />
                <span className="text-blue-700">Cart ({items.length} items)</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)} className="h-6 w-6 p-0">
                {isExpanded ? <X className="h-3 w-3" /> : <span className="text-xs">+</span>}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-sm text-blue-600 font-medium mb-2">Total: ₱{getCartTotal().toFixed(2)}</div>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-2 mb-3 max-h-40 overflow-y-auto">
                    {items.map((item) => (
                      <div
                        key={`${item.id}-${item.size}`}
                        className="flex items-center justify-between text-xs bg-white p-2 rounded"
                      >
                        <div className="flex-1">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-gray-500">
                            {item.size} × {item.quantity} = ₱{(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.id, item.size)}
                          className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={clearCart} className="flex-1 text-xs">
                      Clear Cart
                    </Button>
                    <Button size="sm" className="flex-1 text-xs" onClick={() => (window.location.href = "/cart")}>
                      View Cart
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
