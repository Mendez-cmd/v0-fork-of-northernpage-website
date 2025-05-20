"use client"

import { useState } from "react"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"

interface AddToCartButtonProps {
  product: any
  showQuantity?: boolean
  className?: string
}

export function AddToCartButton({ product, showQuantity = false, className = "" }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image_url || "/placeholder.svg",
      quantity: quantity,
    })
  }

  return (
    <div className={`flex items-center ${className}`}>
      {showQuantity && (
        <div className="flex items-center mr-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
          >
            -
          </Button>
          <span className="mx-2 w-8 text-center">{quantity}</span>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setQuantity(quantity + 1)}>
            +
          </Button>
        </div>
      )}

      <Button onClick={handleAddToCart} className="bg-gold hover:bg-amber-500 text-black">
        <ShoppingCart className="h-4 w-4 mr-2" />
        Add to Cart
      </Button>
    </div>
  )
}
