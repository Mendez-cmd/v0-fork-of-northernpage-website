"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FadeIn, SlideUp, SlideIn, Stagger, StaggerItem, ScaleIn, RotateIn } from "@/components/transition-effects"

export default function TransitionDemo() {
  const [key, setKey] = useState(0)

  const resetAnimations = () => {
    setKey((prev) => prev + 1)
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Page Transition Demo</h1>

      <div className="mb-8 text-center">
        <Button onClick={resetAnimations} className="bg-gold hover:bg-amber-500 text-black">
          Reset Animations
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" key={key}>
        <Card>
          <CardHeader>
            <CardTitle>Fade In</CardTitle>
          </CardHeader>
          <CardContent>
            <FadeIn>
              <div className="bg-gray-100 p-6 rounded-lg">
                <p>This content fades in smoothly.</p>
              </div>
            </FadeIn>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Slide Up</CardTitle>
          </CardHeader>
          <CardContent>
            <SlideUp>
              <div className="bg-gray-100 p-6 rounded-lg">
                <p>This content slides up from below.</p>
              </div>
            </SlideUp>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Slide In</CardTitle>
          </CardHeader>
          <CardContent>
            <SlideIn>
              <div className="bg-gray-100 p-6 rounded-lg">
                <p>This content slides in from the left.</p>
              </div>
            </SlideIn>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Scale In</CardTitle>
          </CardHeader>
          <CardContent>
            <ScaleIn>
              <div className="bg-gray-100 p-6 rounded-lg">
                <p>This content scales in from slightly smaller.</p>
              </div>
            </ScaleIn>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rotate In</CardTitle>
          </CardHeader>
          <CardContent>
            <RotateIn>
              <div className="bg-gray-100 p-6 rounded-lg">
                <p>This content rotates in slightly.</p>
              </div>
            </RotateIn>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Staggered Animation</CardTitle>
          </CardHeader>
          <CardContent>
            <Stagger>
              {[1, 2, 3].map((item) => (
                <StaggerItem key={item}>
                  <div className="bg-gray-100 p-4 rounded-lg mb-2">
                    <p>Staggered item {item}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Delayed Animations</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FadeIn delay={0}>
            <div className="bg-gray-100 p-6 rounded-lg">
              <p>No delay</p>
            </div>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div className="bg-gray-100 p-6 rounded-lg">
              <p>0.2s delay</p>
            </div>
          </FadeIn>
          <FadeIn delay={0.4}>
            <div className="bg-gray-100 p-6 rounded-lg">
              <p>0.4s delay</p>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  )
}
