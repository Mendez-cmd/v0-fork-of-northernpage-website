"use client"

import { useState, useEffect } from "react"
import { X, Star, Bot, ThumbsUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModernReviewForm } from "@/components/modern-review-form"
import { AIChatSupport } from "@/components/ai-chat-support"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function FloatingReviewButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [products, setProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isVisible, setIsVisible] = useState(true)
  const [activeTab, setActiveTab] = useState<string>("chat") // Default to chat
  const pathname = usePathname()

  // Hide on certain pages
  useEffect(() => {
    const excludedPaths = ["/login", "/register", "/admin", "/checkout", "/order-confirmation", "/auth"]

    // Check if current path starts with any excluded path
    const shouldHide = excludedPaths.some((path) => pathname.startsWith(path))
    setIsVisible(!shouldHide)
  }, [pathname])

  useEffect(() => {
    const loadProducts = async () => {
      if (activeTab !== "review") return // Only load products for review tab

      try {
        const supabase = createClient()
        const { data: products, error } = await supabase
          .from("products")
          .select("id, name, image_url")
          .eq("is_featured", true)
          .limit(10)

        if (error) {
          console.error("Error loading products:", error)
          // Fallback: load all products if featured query fails
          const { data: allProducts, error: allError } = await supabase
            .from("products")
            .select("id, name, image_url")
            .limit(10)

          if (allError) {
            console.error("Error loading all products:", allError)
            setProducts([])
          } else {
            setProducts(allProducts || [])
          }
        } else {
          setProducts(products || [])
        }
      } catch (error) {
        console.error("Error loading products for review button:", error)
        setProducts([])
      } finally {
        setIsLoading(false)
      }
    }

    if (isOpen) {
      loadProducts()
    }
  }, [isOpen, activeTab])

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  if (!isVisible) return null

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={() => setIsOpen(true)}
              size="lg"
              className="rounded-full w-14 h-14 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
              aria-label="Open support and reviews"
            >
              <div className="absolute inset-0 rounded-full bg-white opacity-0 hover:opacity-10 transition-opacity"></div>
              <Bot className="h-6 w-6" />
              <span className="sr-only">Support & Reviews</span>
            </Button>
            <div className="absolute -top-10 right-0 bg-black text-white text-sm py-1 px-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md">
              Support & Reviews
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal with Tabs */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-2xl max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <Button
                  onClick={() => setIsOpen(false)}
                  size="icon"
                  variant="ghost"
                  className="absolute top-4 right-4 z-10 rounded-full bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
                  aria-label="Close support dialog"
                >
                  <X className="h-5 w-5" />
                </Button>

                <Tabs defaultValue="chat" value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid grid-cols-2 w-full rounded-t-xl rounded-b-none bg-gradient-to-r from-amber-500 to-orange-500 p-1">
                    <TabsTrigger
                      value="chat"
                      className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/80 rounded-md transition-all"
                    >
                      <Bot className="mr-2 h-4 w-4" />
                      AI Chat Support
                    </TabsTrigger>
                    <TabsTrigger
                      value="review"
                      className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/80 rounded-md transition-all"
                    >
                      <ThumbsUp className="mr-2 h-4 w-4" />
                      Write a Review
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="chat" className="m-0">
                    <AIChatSupport />
                  </TabsContent>

                  <TabsContent value="review" className="m-0">
                    {isLoading && activeTab === "review" ? (
                      <div className="bg-white p-12 rounded-b-xl shadow-2xl flex flex-col items-center justify-center">
                        <div className="w-16 h-16 relative">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Star className="w-8 h-8 text-amber-400 animate-pulse" />
                          </div>
                          <div className="w-full h-full border-4 border-t-amber-500 border-r-amber-300 border-b-amber-400 border-l-amber-200 rounded-full animate-spin"></div>
                        </div>
                        <p className="mt-4 text-gray-600">Loading review form...</p>
                      </div>
                    ) : (
                      <ModernReviewForm products={products} onReviewSubmitted={() => setIsOpen(false)} />
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
