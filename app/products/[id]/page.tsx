// Update the product page to use server-side review functions
import { notFound } from "next/navigation"
import Image from "next/image"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { getProductById } from "@/lib/products"
import { PlaceholderImage } from "@/components/placeholder-image"
import { ReviewsSection } from "@/components/reviews-section"
import { Suspense } from "react"
import LoadingLogo from "@/components/loading-logo"
import { getServerReviewsByProductId, getServerProductRatingStats } from "@/lib/server-reviews"

export const dynamic = "force-dynamic"
export const revalidate = 0

interface ProductPageProps {
  params: {
    id: string
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductById(params.id)

  if (!product) {
    notFound()
  }

  // Get reviews and stats using server-side functions
  const reviews = await getServerReviewsByProductId(params.id)
  const ratingStats = await getServerProductRatingStats(params.id)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white rounded-lg shadow-md p-4 flex items-center justify-center">
          {product.image_url ? (
            <div className="relative w-full h-[300px] md:h-[400px]">
              <Image
                src={product.image_url || "/placeholder.svg"}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain"
              />
            </div>
          ) : (
            <PlaceholderImage className="w-full h-[300px] md:h-[400px]" />
          )}
        </div>

        <div className="flex flex-col">
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <div className="flex items-center mb-4">
            <div className="flex text-gold mr-2">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill={i < Math.round(ratingStats.averageRating) ? "currentColor" : "none"}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={i < Math.round(ratingStats.averageRating) ? 0 : 1.5}
                    d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                  />
                </svg>
              ))}
            </div>
            <span className="text-gray-600">
              {ratingStats.averageRating} ({ratingStats.totalReviews} reviews)
            </span>
          </div>
          <p className="text-gray-700 mb-6">{product.description}</p>
          <div className="flex items-center mb-6">
            <span className="text-2xl font-bold mr-4">₱{product.price.toFixed(2)}</span>
            {product.is_bestseller && (
              <span className="bg-gold text-black text-xs font-bold px-2 py-1 rounded">Bestseller</span>
            )}
          </div>
          <div className="mt-auto">
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
        <Suspense
          fallback={
            <div className="flex flex-col items-center justify-center py-12">
              <LoadingLogo size="sm" showText={true} message="Loading reviews..." />
            </div>
          }
        >
          <ReviewsSection productId={params.id} reviews={reviews} ratingStats={ratingStats} />
        </Suspense>
      </div>
    </div>
  )
}
