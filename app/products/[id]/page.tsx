import Image from "next/image"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import { getProductById } from "@/lib/products"
import { getReviewsByProductId } from "@/lib/reviews"
import { formatCurrency } from "@/lib/utils"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { ReviewCard } from "@/components/review-card"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"

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

  // Calculate average rating
  const averageRating =
    reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0

  // Generate stars based on rating
  const renderStars = (rating: number) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(<Star key={i} className={`h-5 w-5 ${i <= rating ? "fill-gold text-gold" : "text-gray-300"}`} />)
    }
    return stars
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="relative h-96">
            <Image src={product.image_url || "/placeholder.svg"} alt={product.name} fill className="object-contain" />
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

          <div className="flex items-center mb-4">
            <div className="flex mr-2">{renderStars(averageRating)}</div>
            <span className="text-gray-500">
              {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
            </span>
          </div>

          <p className="text-2xl font-bold text-gold mb-6">{formatCurrency(product.price)}</p>

          <div className="prose mb-6">
            <p>{product.description}</p>
          </div>

          <AddToCartButton product={product} showQuantity className="mb-6" />

          <div className="border-t border-gray-200 pt-6">
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
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
            <form className="space-y-4">
              <div>
                <label htmlFor="rating" className="block text-sm font-medium mb-1">
                  Rating
                </label>
                <div className="flex text-gray-300">
                  <Star className="h-6 w-6 cursor-pointer hover:text-gold" />
                  <Star className="h-6 w-6 cursor-pointer hover:text-gold" />
                  <Star className="h-6 w-6 cursor-pointer hover:text-gold" />
                  <Star className="h-6 w-6 cursor-pointer hover:text-gold" />
                  <Star className="h-6 w-6 cursor-pointer hover:text-gold" />
                </div>
              </div>

              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-1">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Give your review a title"
                />
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-medium mb-1">
                  Review
                </label>
                <textarea
                  id="content"
                  rows={4}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Write your review here"
                ></textarea>
              </div>

              <Button className="bg-gold hover:bg-amber-500 text-black">Submit Review</Button>
            </form>
          </div>

          <div>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4">Rating Summary</h3>
              <div className="flex items-center mb-2">
                <div className="flex text-gold mr-2">{renderStars(averageRating)}</div>
                <span>{averageRating.toFixed(1)} out of 5</span>
              </div>
              <p className="text-gray-500">
                Based on {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
              </p>
            </div>
          </div>
        </div>

        <Suspense fallback={<div>Loading reviews...</div>}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.length > 0 ? (
              reviews.map((review) => <ReviewCard key={review.id} review={review} />)
            ) : (
              <div className="col-span-2 text-center py-12">
                <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
              </div>
            )}
          </div>
        </Suspense>
      </div>
    </div>
  )
}
