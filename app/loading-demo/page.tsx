"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingLogo } from "@/components/loading-logo"
import { LoadingWrapper } from "@/components/loading-wrapper"
import { SlideIn } from "@/components/transition-effects"

export default function LoadingDemo() {
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState("Loading content...")

  const toggleLoading = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 2000)
  }

  const messages = [
    "Loading content...",
    "Preparing delicious food...",
    "Gathering ingredients...",
    "Cooking up something special...",
    "Almost ready to serve...",
  ]

  const changeMessage = () => {
    const randomIndex = Math.floor(Math.random() * messages.length)
    setLoadingMessage(messages[randomIndex])
  }

  return (
    <div className="container py-12">
      <SlideIn>
        <h1 className="text-4xl font-bold mb-8">Loading Animation Demo</h1>
      </SlideIn>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <Card>
          <CardHeader>
            <CardTitle>Loading Logo Sizes</CardTitle>
            <CardDescription>The Northern Chefs logo in different sizes</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-8">
            <div>
              <h3 className="text-lg font-medium mb-2">Small</h3>
              <LoadingLogo size="small" />
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Medium</h3>
              <LoadingLogo size="medium" />
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Large</h3>
              <LoadingLogo size="large" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Loading Wrapper Demo</CardTitle>
            <CardDescription>Test the loading wrapper component</CardDescription>
          </CardHeader>
          <CardContent>
            <LoadingWrapper isLoading={isLoading} message={loadingMessage}>
              <div className="bg-muted p-6 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Content Area</h3>
                <p>This content will be hidden while loading is active.</p>
                <p className="mt-4">Try the buttons below to test loading states.</p>
              </div>
            </LoadingWrapper>

            <div className="flex flex-wrap gap-4 mt-6">
              <Button onClick={toggleLoading}>{isLoading ? "Loading..." : "Simulate Loading"}</Button>
              <Button variant="outline" onClick={changeMessage}>
                Change Loading Message
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center">
        <Button asChild variant="secondary">
          <a href="/">Back to Home</a>
        </Button>
      </div>
    </div>
  )
}
