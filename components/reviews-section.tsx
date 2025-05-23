import { getReviews } from "@/lib/reviews"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export async function ReviewsSection() {
  const reviews = await getReviews()

  // Only show the top 3 reviews on the home page
  const featuredReviews = reviews.slice(0, 3)

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">What Our Customers Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Read honest reviews from our satisfied customers who have enjoyed our authentic Filipino dishes.
          </p>
        </div>

        {featuredReviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredReviews.map((review) => (
              <Card key={review.id} className="h-full">
                <CardHeader>
                  <CardTitle className="line-clamp-1">{review.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <p className="text-gray-600 line-clamp-4">{review.content}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      {review.users?.first_name} {review.users?.last_name?.charAt(0)}.
                    </div>
                    <div className="text-sm text-gray-500">
                      {review.products?.name && (
                        <Link href={`/products/${review.product_id}`} className="text-gold hover:underline">
                          View Product
                        </Link>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No reviews yet. Be the first to review our products!</p>
          </div>
        )}

        <div className="text-center mt-8">
          <Button asChild className="bg-gold hover:bg-amber-500 text-black">
            <Link href="/products">Browse All Products</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
