import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import { WishlistButton } from "@/components/wishlist-button"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import { AddToCartButton } from "./add-to-cart-button"
import { getProductImageUrl } from "@/lib/default-images"

interface ProductCardProps {
  product: any
  showAddToCart?: boolean
}

export function ProductCard({ product, showAddToCart = true }: ProductCardProps) {
  const isNew = new Date(product.created_at || Date.now()).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
  const isOnSale = product.sale_price && product.sale_price < product.price
  const discount = isOnSale ? Math.round(((product.price - product.sale_price) / product.price) * 100) : 0

  return (
    <div className="group relative bg-white rounded-lg shadow-sm overflow-hidden border hover:shadow-md transition-all duration-200">
      <div className="relative aspect-square bg-gray-100 p-4">
        <Image
          src={getProductImageUrl(product) || "/placeholder.svg"}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-contain transition-transform group-hover:scale-105"
        />
        <div className="absolute top-2 right-2 z-10">
          <WishlistButton productId={product.id} />
        </div>
        {isNew && <Badge className="absolute top-2 left-2 bg-blue-500 hover:bg-blue-600">New</Badge>}
        {isOnSale && <Badge className="absolute bottom-2 left-2 bg-red-500 hover:bg-red-600">-{discount}%</Badge>}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <Link
            href={`/products/${product.id}`}
            className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-200"
          >
            <Button variant="secondary" size="sm" className="rounded-full">
              <Eye className="h-4 w-4 mr-2" />
              Quick View
            </Button>
          </Link>
        </div>
      </div>
      <div className="p-4">
        <Link href={`/products/${product.id}`} className="block">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-gray-900 line-clamp-1">{product.name}</h3>
            {product.average_rating && (
              <div className="flex items-center">
                <span className="text-sm text-amber-500">★</span>
                <span className="text-xs text-gray-600 ml-1">{product.average_rating.toFixed(1)}</span>
              </div>
            )}
          </div>
          <p className="mt-1 text-sm text-gray-500 line-clamp-2">{product.description}</p>
          <div className="mt-2 flex items-center">
            {isOnSale ? (
              <>
                <span className="font-bold text-red-600">{formatCurrency(product.sale_price)}</span>
                <span className="ml-2 text-sm text-gray-500 line-through">{formatCurrency(product.price)}</span>
              </>
            ) : (
              <span className="font-bold text-gold">{formatCurrency(product.price)}</span>
            )}
          </div>
        </Link>
        {showAddToCart && (
          <div className="mt-4">
            <AddToCartButton product={product} variant="outline" className="w-full" />
          </div>
        )}
      </div>
    </div>
  )
}
