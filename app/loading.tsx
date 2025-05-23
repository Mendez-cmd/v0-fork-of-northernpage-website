"use client"

import { FeaturedProductsSkeleton } from "@/components/featured-products-skeleton"
import { motion } from "framer-motion"

export default function Loading() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Hero Section Skeleton */}
      <div className="relative py-24 bg-gray-200 animate-pulse">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="flex justify-center mb-8">
            <div className="h-20 w-60 bg-gray-300 rounded-md"></div>
          </div>
          <div className="h-10 w-3/4 mx-auto bg-gray-300 rounded-md mb-6"></div>
          <div className="h-6 w-2/4 mx-auto bg-gray-300 rounded-md mb-8"></div>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <div className="h-12 w-32 bg-gray-300 rounded-md"></div>
            <div className="h-12 w-32 bg-gray-300 rounded-md"></div>
          </div>
        </div>
      </div>

      {/* Featured Products Section Skeleton */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center mb-12">
            <div className="h-8 w-64 bg-gray-300 rounded-md mb-4"></div>
            <div className="w-24 h-24 bg-gray-300 rounded-full mb-2"></div>
            <div className="h-4 w-full max-w-2xl bg-gray-300 rounded-md"></div>
          </div>

          <FeaturedProductsSkeleton count={3} />

          <div className="text-center mt-12">
            <div className="h-12 w-40 bg-gray-300 rounded-md mx-auto"></div>
          </div>
        </div>
      </div>

      {/* About Section Skeleton */}
      <div className="relative py-24 bg-gray-200 animate-pulse">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="h-8 w-48 bg-gray-300 rounded-md mb-6 mx-auto"></div>
            <div className="h-4 w-full bg-gray-300 rounded-md mb-2"></div>
            <div className="h-4 w-full bg-gray-300 rounded-md mb-2"></div>
            <div className="h-4 w-3/4 bg-gray-300 rounded-md mb-8 mx-auto"></div>
            <div className="h-12 w-32 bg-gray-300 rounded-md mx-auto"></div>
          </div>
        </div>
      </div>

      {/* Testimonials Section Skeleton */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="h-8 w-64 bg-gray-300 rounded-md mb-12 mx-auto"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                  <div>
                    <div className="h-4 w-24 bg-gray-300 rounded-md mb-2"></div>
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, j) => (
                        <div key={j} className="w-4 h-4 bg-gray-300 rounded-full"></div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-full bg-gray-300 rounded-md"></div>
                  <div className="h-4 w-full bg-gray-300 rounded-md"></div>
                  <div className="h-4 w-3/4 bg-gray-300 rounded-md"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
