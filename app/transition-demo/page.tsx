"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FadeIn, SlideIn, StaggerChildren, staggerItem } from "@/components/transition-effects"
import { motion } from "framer-motion"
import Link from "next/link"

export default function TransitionDemo() {
  return (
    <div className="container py-12">
      <FadeIn>
        <h1 className="text-4xl font-bold mb-8">Transition Demo</h1>
      </FadeIn>

      <SlideIn direction="up" delay={0.2}>
        <p className="text-lg mb-8">
          This page demonstrates the various transition effects available on the Northern Chefs website. Navigate
          between pages to see the smooth page transitions in action.
        </p>
      </SlideIn>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StaggerChildren>
          {[1, 2, 3].map((i) => (
            <motion.div key={i} variants={staggerItem}>
              <Card>
                <CardHeader>
                  <CardTitle>Transition Effect {i}</CardTitle>
                  <CardDescription>Smooth animations for better UX</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>This card appears with a staggered animation, creating a cascading effect.</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </StaggerChildren>
      </div>

      <SlideIn direction="up" delay={0.4}>
        <div className="flex flex-wrap gap-4">
          <Button asChild>
            <Link href="/">Home Page</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/products">Products</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/cart">Cart</Link>
          </Button>
        </div>
      </SlideIn>
    </div>
  )
}
