import { getServerReviews } from "@/lib/server-reviews"
import { ReviewCard } from "@/components/review-card"
import { AutoScrollCarousel } from "@/components/auto-scroll-carousel"
import LoadingLogo from "@/components/loading-logo"
import { Suspense } from "react"

async function ReviewsCarouselContent() {
  try {
    const reviews = await getServerReviews()

    if (!reviews || reviews.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500">No reviews available at this time.</p>
        </div>
      )
    }

    // Duplicate reviews if we have fewer than 10 to ensure a good scrolling effect
    const displayReviews = reviews.length < 10 ? [...reviews, ...reviews, ...reviews].slice(0, 15) : reviews

    return (
      <AutoScrollCarousel className="py-4">
        {displayReviews.map((review, index) => (
          <div key={`${review.id}-${index}`} className="min-w-[300px] md:min-w-[350px]">
            <ReviewCard review={review} />
          </div>
        ))}
      </AutoScrollCarousel>
    )
  } catch (error) {
    console.error("Error rendering reviews carousel:", error)
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Reviews are temporarily unavailable. Please check back later.</p>
      </div>
    )
  }
}

export function ReviewsCarousel() {
  return (
    <section className="bg-gray-100 py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl text-center mb-12">What Our Customers Say</h2>

        <Suspense
          fallback={
            <div className="flex flex-col items-center justify-center py-12">
              <LoadingLogo size="md" showText={true} message="Loading reviews..." />
            </div>
          }
        >
          <ReviewsCarouselContent />
        </Suspense>
      </div>
    </section>
  )
}
