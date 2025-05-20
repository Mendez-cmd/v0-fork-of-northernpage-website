import Link from "next/link"
import Image from "next/image"
import { formatCurrency } from "@/lib/utils"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { PlaceholderImage } from "@/components/placeholder-image"
import { ProductGridSkeleton } from "./product-grid-skeleton"

interface ProductGridProps {
  products: any[]
  isLoading?: boolean
}

export function ProductGrid({ products, isLoading = false }: ProductGridProps) {
  if (isLoading) {
    return <ProductGridSkeleton count={products.length || 6} />
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold mb-4">No products found</h2>
        <p className="text-gray-500">Try changing your filters or check back later for new products.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {products.map((product) => (
        <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col">
          <div className="relative">
            <Link href={`/products/${product.id}`}>
              <div className="h-48 sm:h-56 md:h-64 bg-gray-100 relative">
                {product.image_url ? (
                  <div className="flex items-center justify-center h-full p-4">
                    <div className="relative w-full h-full max-w-[180px] max-h-[180px] mx-auto">
                      <Image
                        src={product.image_url || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 180px, (max-width: 768px) 180px, 180px"
                        className="object-contain"
                      />
                    </div>
                  </div>
                ) : (
                  <PlaceholderImage name={product.name} width={180} height={180} className="w-full h-full" />
                )}
              </div>
            </Link>
            {product.is_bestseller && (
              <span className="absolute top-2 left-2 bg-gold text-black text-xs font-bold px-2 py-1 rounded">
                Best Seller
              </span>
            )}
          </div>

          <div className="p-4 flex-grow flex flex-col">
            <Link href={`/products/${product.id}`}>
              <h3 className="text-lg font-semibold mb-2 hover:text-gold transition-colors line-clamp-2">
                {product.name}
              </h3>
            </Link>

            <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">{product.description}</p>

            <div className="flex items-center justify-between mt-auto">
              <span className="text-lg font-bold">{formatCurrency(product.price)}</span>

              <AddToCartButton product={product} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
