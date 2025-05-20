import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getFeaturedProducts } from "@/lib/products"
import { ReviewCard } from "@/components/review-card"
import { getReviews } from "@/lib/reviews"
import { DbSetupNotification } from "@/components/db-setup-notification"
import { Card, CardContent } from "@/components/ui/card"
import { PlaceholderImage } from "@/components/placeholder-image"

// Make the page dynamic to avoid static rendering issues
export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function Home() {
  // Add console log to debug
  console.log("Fetching featured products for homepage")

  // Fetch featured products with error handling
  let featuredProducts = []
  let reviews = []

  try {
    featuredProducts = await getFeaturedProducts()
    console.log(`Successfully fetched ${featuredProducts.length} featured products`)
  } catch (error) {
    console.error("Error in Home component:", error)
  }

  try {
    console.log("Fetching reviews...")
    reviews = await getReviews()
    console.log(`Successfully fetched ${reviews.length} reviews`)
  } catch (error) {
    console.error("Error loading reviews:", error)
    // Use empty array if there's an error
  }

  return (
    <main className="flex-1">
      {/* Database Setup Notification */}
      <DbSetupNotification />

      {/* Hero Section */}
      <section className="bg-gold text-black py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Northern Chefs</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Authentic Filipino cuisine delivered to your doorstep. Experience the taste of home with our premium
            handcrafted dishes.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="bg-black text-gold hover:bg-gray-800">
              <Link href="/products">Shop Now</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-black text-black hover:bg-black/10">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden transition-all hover:shadow-lg">
                <div className="aspect-square relative">
                  {product.image_url ? (
                    <img
                      src={product.image_url || "/placeholder.svg"}
                      alt={product.name}
                      className="object-cover w-full h-full"
                      width={400}
                      height={400}
                    />
                  ) : (
                    <PlaceholderImage className="w-full h-full" />
                  )}
                  {product.is_bestseller && (
                    <div className="absolute top-2 right-2 bg-gold text-black text-xs font-bold px-2 py-1 rounded">
                      Bestseller
                    </div>
                  )}
                </div>
                <CardContent className="p-6">
                  <h3 className="font-bold text-xl mb-2">{product.name}</h3>
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
          <div className="text-center mt-12">
            <Button asChild size="lg" className="bg-gold hover:bg-amber-500 text-black">
              <Link href="/products">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-gray-600 mb-4">
                Northern Chefs was born from a passion for authentic Filipino cuisine and a desire to share the rich
                culinary traditions of the Philippines with food lovers everywhere.
              </p>
              <p className="text-gray-600 mb-6">
                Our team of skilled chefs combines traditional recipes with modern techniques to create dishes that are
                both authentic and innovative. We source only the finest ingredients to ensure that every bite delivers
                the true taste of Filipino hospitality.
              </p>
              <Button asChild className="bg-gold hover:bg-amber-500 text-black">
                <Link href="/contact">Learn More</Link>
              </Button>
            </div>
            <div className="md:w-1/2">
              <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                <PlaceholderImage className="w-full h-full" />
              </div>
            </div>
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

      {/* Reviews Section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-schoolbell text-3xl md:text-4xl text-center mb-12">Reviews</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.slice(0, 3).map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>

          <div className="mt-12">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4">Add Your Review</h3>
              <form className="space-y-4">
                <div>
                  <label htmlFor="review-username" className="block text-sm font-medium mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="review-username"
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="Your Name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Rating</label>
                  <div className="flex text-gold">
                    <span className="cursor-pointer">★</span>
                    <span className="cursor-pointer">★</span>
                    <span className="cursor-pointer">★</span>
                    <span className="cursor-pointer">★</span>
                    <span className="cursor-pointer">★</span>
                  </div>
                </div>

                <div>
                  <label htmlFor="review-title" className="block text-sm font-medium mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    id="review-title"
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="Review Title"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="review-content" className="block text-sm font-medium mb-1">
                    Review
                  </label>
                  <textarea
                    id="review-content"
                    className="w-full px-3 py-2 border rounded-md"
                    rows={4}
                    placeholder="Write your review..."
                    required
                  ></textarea>
                </div>

                <Button className="w-full bg-gold hover:bg-amber-500 text-black">Submit Review</Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
