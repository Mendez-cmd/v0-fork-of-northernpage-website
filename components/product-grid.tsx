import Link from "next/link"
import Image from "next/image"
import { formatCurrency } from "@/lib/utils"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { PlaceholderImage } from "@/components/placeholder-image"

interface ProductGridProps {
  products: any[]
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold mb-4">No products found</h2>
        <p className="text-gray-500">Try changing your filters or check back later for new products.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="relative">
            <Link href={`/products/${product.id}`}>
              <div className="h-64 bg-gray-100">
                {product.image_url ? (
                  <Image
                    src={product.image_url || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-contain p-4"
                  />
                ) : (
                  <PlaceholderImage name={product.name} width={300} height={256} className="w-full h-full" />
                )}
              </div>
            </Link>
            {product.is_bestseller && (
              <span className="absolute top-2 left-2 bg-gold text-black text-xs font-bold px-2 py-1 rounded">
                Best Seller
              </span>
            )}
          </div>

          <div className="p-4">
            <Link href={`/products/${product.id}`}>
              <h3 className="text-lg font-semibold mb-2 hover:text-gold transition-colors">{product.name}</h3>
            </Link>

            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>

            <div className="flex items-center justify-between">
              <span className="text-lg font-bold">{formatCurrency(product.price)}</span>

              <AddToCartButton product={product} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
