import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlaceholderImage } from "@/components/placeholder-image"

interface Product {
  id: string | number
  name: string
  description: string
  price: number
  image_url?: string
  category?: string
  is_bestseller?: boolean
  is_featured?: boolean
}

interface ProductGridProps {
  products: Product[]
  showCategory?: boolean
}

export function ProductGrid({ products, showCategory = false }: ProductGridProps) {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-xl font-medium text-gray-500">No products found</h3>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="overflow-hidden transition-all hover:shadow-lg">
          <div className="aspect-square relative">
            {product.image_url ? (
              <Image
                src={product.image_url || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <PlaceholderImage name={product.name} className="w-full h-full" />
            )}
            {product.is_bestseller && (
              <div className="absolute top-2 right-2 bg-gold text-black text-xs font-bold px-2 py-1 rounded">
                Bestseller
              </div>
            )}
          </div>
          <CardContent className="p-6">
            <div className="flex items-center mb-2">
              <Image src="/images/ChefGabrielslogo.png" alt="Chef Gabriel's" width={24} height={24} className="mr-2" />
              <h3 className="font-bold text-xl">{product.name}</h3>
            </div>
            {showCategory && product.category && (
              <div className="mb-2">
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{product.category}</span>
              </div>
            )}
            <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold">₱{product.price.toFixed(2)}</span>
              <Button asChild className="bg-gold hover:bg-amber-500 text-black">
                <Link href={`/products/${product.id}`}>View Details</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
