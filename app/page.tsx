import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getFeaturedProducts } from "@/lib/products"
import { DbSetupNotification } from "@/components/db-setup-notification"
import { Card, CardContent } from "@/components/ui/card"
import { PlaceholderImage } from "@/components/placeholder-image"
import Image from "next/image"
import { Suspense } from "react"
import LoadingLogo from "@/components/loading-logo"
import { ReviewCard } from "@/components/review-card"
import { getServerReviews } from "@/lib/server-reviews"
import { ReviewsCarousel } from "@/components/reviews-carousel"
import { ModernReviewForm } from "@/components/modern-review-form"

// Make the page dynamic to avoid static rendering issues
export const dynamic = "force-dynamic"
export const revalidate = 0

// Separate component for featured products to use with Suspense
async function FeaturedProducts() {
  const featuredProducts = await getFeaturedProducts()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {featuredProducts.map((product) => (
        <Card key={product.id} className="overflow-hidden transition-all hover:shadow-lg h-full flex flex-col">
          <div className="aspect-square relative bg-gray-100 p-4 flex items-center justify-center">
            {product.image_url ? (
              <div className="relative w-full h-full max-w-[180px] max-h-[180px] mx-auto">
                <Image
                  src={product.image_url || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 180px, (max-width: 768px) 180px, 180px"
                  className="object-contain"
                />
              </div>
            ) : (
              <PlaceholderImage className="w-full h-full" />
            )}
            {product.is_bestseller && (
              <div className="absolute top-2 right-2 bg-gold text-black text-xs font-bold px-2 py-1 rounded">
                Bestseller
              </div>
            )}
          </div>
          <CardContent className="p-6 flex-grow flex flex-col">
            <h3 className="font-bold text-xl mb-2 line-clamp-2">{product.name}</h3>
            <p className="text-gray-600 mb-4 line-clamp-2 flex-grow">{product.description}</p>
            <div className="flex justify-between items-center mt-auto">
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

// Separate component for reviews to use with Suspense
async function ReviewsSection() {
  try {
    // Use server-side function to get reviews
    const reviews = await getServerReviews()

    if (!reviews || reviews.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500">No reviews available at this time.</p>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {reviews.slice(0, 3).map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    )
  } catch (error) {
    console.error("Error rendering reviews section:", error)
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Reviews are temporarily unavailable. Please check back later.</p>
      </div>
    )
  }
}

// Separate component for review form to use with Suspense
async function ReviewFormSection() {
  try {
    const products = await getFeaturedProducts()
    return <ModernReviewForm products={products} className="max-w-2xl mx-auto" />
  } catch (error) {
    console.error("Error loading products for review form:", error)
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4">Add Your Review</h3>
        <p className="text-gray-600">Unable to load products at the moment. Please try again later.</p>
      </div>
    )
  }
}

export default function Home() {
  return (
    <main className="flex-1">
      {/* Database Setup Notification */}
      <DbSetupNotification />

      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/background.png"
            alt="Northern Chefs Background"
            fill
            className="object-cover opacity-70"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/40"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="flex justify-center mb-8">
            <Image
              src="/images/Nothernchefslogo.png"
              alt="Northern Chefs Logo"
              width={300}
              height={120}
              className="h-auto"
              priority
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">Authentic Filipino Cuisine</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
            Handcrafted with love and tradition. Taste the flavors of home with our premium homemade products.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="bg-gold hover:bg-amber-600 text-black">
              <Link href="/products">Shop Now</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-sm"
            >
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center mb-12">
            <h2 className="text-3xl font-bold text-center mb-4">Featured Products</h2>
            <div className="w-24 h-24 mb-2">
              <Image
                src="/images/ChefGabrielslogo.png"
                alt="Chef Gabriel's Logo"
                width={96}
                height={96}
                className="w-full h-full"
              />
            </div>
            <p className="text-gray-600 text-center max-w-2xl">
              Chef Gabriel's premium handcrafted Filipino dishes, made with authentic recipes and the finest
              ingredients.
            </p>
          </div>

          <Suspense
            fallback={
              <div className="flex flex-col items-center justify-center py-12">
                <LoadingLogo size="md" showText={true} message="Loading featured products..." />
              </div>
            }
          >
            <FeaturedProducts />
          </Suspense>

          <div className="text-center mt-12">
            <Button asChild size="lg" className="bg-gold hover:bg-amber-500 text-black">
              <Link href="/products">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src="/images/background2.png" alt="Chef Gabriel's Products" fill className="object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/40"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-white">Our Story</h2>
            <p className="text-white/90 mb-8">
              Northern Chefs started as a small family business with a passion for authentic Filipino cuisine. Today, we
              continue to create homemade products using traditional recipes passed down through generations, bringing
              the taste of Filipino heritage to your table.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-gold hover:bg-amber-600 text-black font-bold py-3 px-8 rounded-md transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center text-black font-bold text-xl mr-4">
                  J
                </div>
                <div>
                  <h3 className="font-bold">Juan Dela Cruz</h3>
                  <div className="flex text-gold">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600">
                "The Chicken Pastil is absolutely delicious! It reminds me of home and the flavors are spot on. Will
                definitely order again!"
              </p>
            </Card>
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center text-black font-bold text-xl mr-4">
                  M
                </div>
                <div>
                  <h3 className="font-bold">Maria Santos</h3>
                  <div className="flex text-gold">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600">
                "I ordered the Laing and it was amazing! The delivery was prompt and the packaging kept everything
                fresh. Northern Chefs has become my go-to for Filipino food."
              </p>
            </Card>
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center text-black font-bold text-xl mr-4">
                  R
                </div>
                <div>
                  <h3 className="font-bold">Roberto Reyes</h3>
                  <div className="flex text-gold">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600">
                "The Spanish Bangus is a must-try! The fish was perfectly cooked and the flavors were incredible. I've
                already recommended Northern Chefs to all my friends."
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <ReviewsCarousel />

      {/* CTA Section */}
      <section className="py-16 bg-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Experience Authentic Filipino Cuisine?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Order now and enjoy the rich flavors of the Philippines delivered straight to your door.
          </p>
          <Button asChild size="lg" className="bg-gold hover:bg-amber-500 text-black">
            <Link href="/products">Order Now</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
