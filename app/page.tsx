import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getFeaturedProducts } from "@/lib/products"
import { ReviewCard } from "@/components/review-card"
import { getReviews } from "@/lib/reviews"
import { DbSetupNotification } from "@/components/db-setup-notification"

// Make the page dynamic to avoid static rendering issues
export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function Home() {
  // Make sure we have products even if there's an error
  let featuredProducts = []
  let reviews = []

  try {
    console.log("Fetching featured products...")
    featuredProducts = await getFeaturedProducts()
    console.log(`Successfully fetched ${featuredProducts.length} featured products`)
  } catch (error) {
    console.error("Error loading featured products:", error)
    // Use empty array if there's an error
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
    <>
      {/* Database Setup Notification */}
      <DbSetupNotification />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-image" style={{ backgroundImage: "url('/images/background2.png')" }}>
          <div className="hero-content">
            <Image
              src="/images/Logo1.png"
              alt="Chef Gabriel's Logo"
              width={200}
              height={200}
              className="animate-float mx-auto"
            />
            <h1 className="font-schoolbell text-4xl md:text-5xl lg:text-6xl text-gold mb-6">
              A Taste of Home
              <br />
              in every Jar.
            </h1>
            <Link href="#product-section">
              <Button className="bg-gold hover:bg-amber-500 text-black font-bold px-8 py-6 text-lg">PRODUCT</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="bg-custom-dark text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-schoolbell text-3xl md:text-4xl mb-4">Welcome!</h2>
          <p className="max-w-2xl mx-auto text-lg">
            Enjoy the rich, authentic flavors of Chef Gabriel's—convenient, delicious, and made with love.
          </p>
          <p className="text-gold font-schoolbell text-xl mt-2">Just open, serve, and savor!</p>
        </div>
      </section>

      {/* Featured Products Section */}
      <section id="product-section" className="bg-custom-dark text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-schoolbell text-3xl md:text-4xl text-gold mb-4">Try some of this!</h2>
            <div className="flex justify-center">
              <Image src="/images/arrow.png" alt="Arrow" width={100} height={50} className="h-12 w-auto" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.slice(0, 3).map((product) => (
              <div key={product.id} className="product-card">
                <h3 className="product-title text-xl">{product.name}</h3>
                <div className="product-image-container">
                  <Image
                    src={product.image_url || "/placeholder.svg"}
                    alt={product.name}
                    width={200}
                    height={200}
                    className="product-image"
                  />
                </div>
                <h4 className="product-name text-lg">{product.name}</h4>
                <p className="price text-lg">₱{product.price.toFixed(2)}</p>
                <Link href={`/products/${product.id}`}>
                  <Button className="bg-gold hover:bg-amber-500 text-black font-bold">BUY</Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Products Section */}
      <section className="bg-custom-dark text-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-schoolbell text-3xl md:text-4xl text-center text-gold mb-12">PRODUCT</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <div key={product.id} className="bg-custom-card rounded-lg overflow-hidden">
                <div className="relative">
                  <Image
                    src={product.image_url || "/placeholder.svg"}
                    alt={product.name}
                    width={400}
                    height={400}
                    className="w-full h-64 object-contain bg-gray-800"
                  />
                  {product.is_bestseller && (
                    <span className="absolute top-2 left-2 bg-gold text-black text-xs font-bold px-2 py-1 rounded">
                      Best Seller
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                  <div className="flex text-gold mb-2">
                    <span>★★★★★</span>
                  </div>
                  <p className="text-gray-300 mb-4 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold">₱{product.price.toFixed(2)}</span>
                    <Link href={`/products/${product.id}`}>
                      <Button className="bg-gold hover:bg-amber-500 text-black">Add to Cart</Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/products">
              <Button className="bg-gold hover:bg-amber-500 text-black font-bold px-8 py-6 text-lg">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Coming Soon Banner */}
      <section className="bg-custom-dark text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="mb-4">
              <div className="text-4xl md:text-5xl font-bold text-gold mb-2">COMING</div>
              <div className="text-5xl md:text-6xl font-bold text-gold">SOON</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="bg-custom-card rounded-lg p-6 text-center">
                <div className="text-5xl text-gold mb-4">?</div>
                <Image
                  src="/images/comingsoon.png"
                  alt="New Flavor Coming Soon"
                  width={200}
                  height={200}
                  className="mx-auto mb-4"
                />
                <div className="text-lg font-bold mb-2">New Special Flavor</div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Mystery Flavor</h3>
                  <p className="text-gray-300">
                    A unique fusion of traditional and modern flavors. Get ready for an exciting new taste experience!
                  </p>
                </div>
              </div>

              <div className="bg-custom-card rounded-lg p-6 text-center">
                <div className="text-5xl text-gold mb-4">?</div>
                <Image
                  src="/images/comingsoon.png"
                  alt="Limited Edition Coming Soon"
                  width={200}
                  height={200}
                  className="mx-auto mb-4"
                />
                <div className="text-lg font-bold mb-2">Limited Edition</div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Special Release</h3>
                  <p className="text-gray-300">
                    Our most exclusive creation yet. A premium blend of secret ingredients for a truly special occasion.
                  </p>
                </div>
              </div>

              <div className="bg-custom-card rounded-lg p-6 text-center">
                <div className="text-5xl text-gold mb-4">?</div>
                <Image
                  src="/images/comingsoon.png"
                  alt="Seasonal Special Coming Soon"
                  width={200}
                  height={200}
                  className="mx-auto mb-4"
                />
                <div className="text-lg font-bold mb-2">Seasonal Special</div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Holiday Exclusive</h3>
                  <p className="text-gray-300">
                    A festive treat perfect for celebrations. Made with seasonal ingredients and lots of love.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 max-w-2xl mx-auto">
              <p className="text-lg">
                Exciting new flavors and special editions are on their way! Stay tuned for these amazing additions to
                our menu.
              </p>
              <p className="text-gold text-xl mt-2">Be the first to taste our newest creations!</p>
            </div>
          </div>
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
    </>
  )
}
