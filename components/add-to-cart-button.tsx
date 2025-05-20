"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Check } from "lucide-react"
import { useCart } from "@/hooks/use-cart"

interface AddToCartButtonProps {
  productId: string
  name: string
  price: number
  image?: string
  quantity?: number
  className?: string
  showIcon?: boolean
}

export function AddToCartButton({
  productId,
  name,
  price,
  image,
  quantity = 1,
  className = "",
  showIcon = true,
}: AddToCartButtonProps) {
  const { addItem } = useCart()
  const [isAdded, setIsAdded] = useState(false)

  const handleAddToCart = () => {
    addItem({
      id: productId,
      name,
      price,
      image,
      quantity,
    })
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  return (
    <Button
      onClick={handleAddToCart}
      className={`bg-amber-600 hover:bg-amber-700 text-white ${className}`}
      disabled={isAdded}
    >
      {isAdded ? (
        <>
          {showIcon && <Check className="mr-2 h-4 w-4" />}
          Added to Cart
        </>
      ) : (
        <>
          {showIcon && <ShoppingCart className="mr-2 h-4 w-4" />}
          Add to Cart
        </>
      )}
    </Button>
  )
}

export default AddToCartButton
