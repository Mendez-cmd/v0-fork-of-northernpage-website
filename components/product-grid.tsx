"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import type { Product } from "@/lib/products"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { ProductGridSkeleton } from "@/components/product-grid-skeleton"
import { PlaceholderImage } from "@/components/placeholder-image"

interface ProductGridProps {
  products: Product[]
  loading?: boolean
}

export function ProductGrid({ products, loading = false }: ProductGridProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (loading || !isClient) {
    return <ProductGridSkeleton />
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-2">No products found</h3>
        <p className="text-gray-500">Try adjusting your filters or check back later.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => (
        <div key={product.id} className="bg-custom-card rounded-lg p-4 md:p-6 flex flex-col h-full">
          <Link href={`/products/${product.id}`} className="group">
            <div className="relative aspect-square w-full mb-4 bg-gray-800 rounded-md overflow-hidden">
              {product.image_url ? (
                <Image
                  src={product.image_url || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <PlaceholderImage />
              )}
            </div>
            <h3 className="text-xl font-semibold text-gold mb-2">{product.name}</h3>
            <p className="text-gray-300 mb-2 line-clamp-2">{product.description}</p>
            <p className="text-white font-bold mb-4">${product.price.toFixed(2)}</p>
          </Link>
          <div className="mt-auto">
            <AddToCartButton product={product} />
          </div>
        </div>
      ))}
    </div>
  )
}
