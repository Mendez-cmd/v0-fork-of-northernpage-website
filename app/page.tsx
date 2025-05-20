import { Suspense } from "react"
import { getFeaturedProducts } from "@/lib/products"
import { ProductGrid } from "@/components/product-grid"
import { LoadingLogo } from "@/components/loading-logo"
import Image from "next/image"
import Link from "next/link"

export default async function Home() {
  const featuredProducts = await getFeaturedProducts()

  return (
    <main className="flex-1">
      {/* Hero Section with Background Image */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/background.png"
            alt="Northern Chefs Background"
            fill
            className="object-cover opacity-30"
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
            <Link
              href="/products"
              className="bg-gold hover:bg-amber-600 text-black font-bold py-3 px-8 rounded-md transition-colors"
            >
              Shop Now
            </Link>
            <Link
              href="/about"
              className="bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-8 rounded-md border border-white/30 backdrop-blur-sm transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
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
                <LoadingLogo size="medium" showText={true} />
                <p className="mt-4 text-gray-500 animate-pulse">Loading featured products...</p>
              </div>
            }
          >
            <ProductGrid products={featuredProducts} />
          </Suspense>
        </div>
      </section>

      {/* About Section with Background Image */}
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
            <div className="bg-white p-6 rounded-lg shadow-md">
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
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
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
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
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
            </div>
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
          <Link
            href="/products"
            className="bg-gold hover:bg-amber-600 text-black font-bold py-3 px-8 rounded-md transition-colors"
          >
            Order Now
          </Link>
        </div>
      </section>
    </main>
  )
}
