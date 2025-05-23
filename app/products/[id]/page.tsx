import Image from "next/image"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import { getProductById } from "@/lib/products"
import { getReviewsByProductId, getProductRatingStats } from "@/lib/reviews"
import { formatCurrency } from "@/lib/utils"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { WishlistButton } from "@/components/wishlist-button"
import { ReviewItem } from "@/components/review-item"
import { ReviewForm } from "@/components/review-form"
import { Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

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

  const reviews = await getReviewsByProductId(params.id)
  const ratingStats = await getProductRatingStats(params.id)

  // Generate stars based on rating
  const renderStars = (rating: number) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(<Star key={i} className={`h-5 w-5 ${i <= rating ? "fill-gold text-gold" : "text-gray-300"}`} />)
    }
    return stars
  }

  // Generate rating bars
  const renderRatingBars = () => {
    return [5, 4, 3, 2, 1].map((star) => {
      const count = ratingStats.ratingDistribution[star as keyof typeof ratingStats.ratingDistribution] || 0
      const percentage = ratingStats.totalReviews > 0 ? (count / ratingStats.totalReviews) * 100 : 0

      return (
        <div key={star} className="flex items-center gap-2 mb-1">
          <div className="flex items-center gap-1 w-16">
            <span>{star}</span>
            <Star className="h-4 w-4 fill-gold text-gold" />
          </div>
          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gold rounded-full" style={{ width: `${percentage}%` }}></div>
          </div>
          <div className="w-10 text-right text-sm text-gray-500">{count}</div>
        </div>
      )
    })
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6 order-1 md:order-1 relative">
          <div className="absolute top-6 right-6 z-10">
            <WishlistButton productId={product.id} />
          </div>
          <div className="flex items-center justify-center h-64 sm:h-80 md:h-96">
            <div className="relative w-full h-full max-w-[300px] max-h-[300px] mx-auto">
              <Image
                src={product.image_url || "/placeholder.svg"}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 300px, 300px"
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>

        <div className="order-2 md:order-2">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{product.name}</h1>

          <div className="flex items-center mb-4">
            <div className="flex mr-2">{renderStars(ratingStats.averageRating)}</div>
            <span className="text-gray-500">
              {ratingStats.totalReviews} {ratingStats.totalReviews === 1 ? "review" : "reviews"}
            </span>
          </div>

          <p className="text-xl md:text-2xl font-bold text-gold mb-4 md:mb-6">{formatCurrency(product.price)}</p>

          <div className="prose mb-4 md:mb-6">
            <p>{product.description}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-4 md:mb-6">
            <AddToCartButton product={product} showQuantity className="w-full sm:w-auto" />
            <WishlistButton productId={product.id} variant="button" className="w-full sm:w-auto" />
          </div>

          <div className="border-t border-gray-200 pt-4 md:pt-6">
            <h3 className="text-lg font-semibold mb-2">Product Details</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>Category: {product.category}</li>
              <li>Net Weight: 200g</li>
              <li>Shelf Life: 6 months</li>
              <li>Storage: Keep refrigerated after opening</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-8 md:mt-16">
        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Customer Reviews</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
          <div>
            <ReviewForm productId={params.id} onReviewSubmitted={() => {}} />
          </div>

          <div>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg md:text-xl font-semibold mb-4">Rating Summary</h3>
                <div className="flex items-center mb-4">
                  <div className="flex text-gold mr-2">{renderStars(ratingStats.averageRating)}</div>
                  <span className="font-medium">{ratingStats.averageRating.toFixed(1)} out of 5</span>
                </div>

                <p className="text-gray-500 mb-4">
                  Based on {ratingStats.totalReviews} {ratingStats.totalReviews === 1 ? "review" : "reviews"}
                </p>

                <div className="space-y-2">{renderRatingBars()}</div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Suspense fallback={<div className="text-center py-4">Loading reviews...</div>}>
          <div className="space-y-4">
            {reviews.length > 0 ? (
              reviews.map((review) => <ReviewItem key={review.id} review={review} />)
            ) : (
              <div className="text-center py-8 md:py-12">
                <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
              </div>
            )}
          </div>
        </Suspense>
      </div>
    </div>
  )
}
