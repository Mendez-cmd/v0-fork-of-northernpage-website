"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { createClient } from "@/lib/supabase/client"
import { needsDefaultImage, getFallbackImage, PRODUCT_CATEGORIES } from "@/lib/default-images"
import { AlertCircle, CheckCircle, ImageIcon, Scan, Wand2, Loader2 } from "lucide-react"

interface Product {
  id: string
  name: string
  category: string | null
  image_url: string | null
}

export default function AssignDefaultImagesPage() {
  const [mounted, setMounted] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [productsNeedingImages, setProductsNeedingImages] = useState<Product[]>([])
  const [isScanning, setIsScanning] = useState(false)
  const [isAssigning, setIsAssigning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<{
    success: number
    failed: number
    errors: string[]
  } | null>(null)

  // Prevent hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  const scanProducts = async () => {
    setIsScanning(true)
    setResults(null)

    try {
      const supabase = createClient()
      const { data, error } = await supabase.from("products").select("id, name, category, image_url").order("name")

      if (error) throw error

      const products = data || []
      setProducts(products)

      // Filter products that need images with proper null checks
      const needingImages = products.filter((product) => {
        try {
          return needsDefaultImage(product)
        } catch (error) {
          console.error("Error checking product:", product, error)
          return false
        }
      })

      setProductsNeedingImages(needingImages)
    } catch (error) {
      console.error("Error scanning products:", error)
    } finally {
      setIsScanning(false)
    }
  }

  const assignDefaultImages = async () => {
    if (productsNeedingImages.length === 0) return

    setIsAssigning(true)
    setProgress(0)

    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
    }

    const supabase = createClient()

    for (let i = 0; i < productsNeedingImages.length; i++) {
      const product = productsNeedingImages[i]

      try {
        const defaultImageUrl = getFallbackImage(product.category)

        const { error } = await supabase.from("products").update({ image_url: defaultImageUrl }).eq("id", product.id)

        if (error) throw error

        results.success++
      } catch (error) {
        results.failed++
        const errorMessage = error instanceof Error ? error.message : "Unknown error"
        results.errors.push(`Failed to update ${product.name}: ${errorMessage}`)
        console.error(`Error updating product ${product.id}:`, error)
      }

      setProgress(((i + 1) / productsNeedingImages.length) * 100)
    }

    setResults(results)
    setIsAssigning(false)

    // Refresh the scan
    await scanProducts()
  }

  useEffect(() => {
    if (mounted) {
      scanProducts()
    }
  }, [mounted])

  // Show loading state until mounted
  if (!mounted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Assign Default Images</h1>
          <p className="text-gray-600">
            Scan your products and automatically assign default placeholder images to products without images.
          </p>
        </div>

        {/* Scan Results */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scan className="h-5 w-5" />
              Product Scan Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{products.length}</div>
                <div className="text-sm text-blue-600">Total Products</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {products.length - productsNeedingImages.length}
                </div>
                <div className="text-sm text-green-600">Have Images</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{productsNeedingImages.length}</div>
                <div className="text-sm text-orange-600">Need Images</div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={scanProducts} disabled={isScanning} variant="outline">
                <Scan className="h-4 w-4 mr-2" />
                {isScanning ? "Scanning..." : "Scan Products"}
              </Button>

              {productsNeedingImages.length > 0 && (
                <Button
                  onClick={assignDefaultImages}
                  disabled={isAssigning}
                  className="bg-gold hover:bg-amber-500 text-black"
                >
                  <Wand2 className="h-4 w-4 mr-2" />
                  {isAssigning ? "Assigning..." : `Assign Default Images (${productsNeedingImages.length})`}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Progress */}
        {isAssigning && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Assigning default images...</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="w-full" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {results && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Assignment Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{results.success}</div>
                  <div className="text-sm text-green-600">Successfully Updated</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{results.failed}</div>
                  <div className="text-sm text-red-600">Failed</div>
                </div>
              </div>

              {results.errors.length > 0 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="font-medium mb-2">Errors occurred:</div>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {results.errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}

        {/* Products Needing Images */}
        {productsNeedingImages.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Products Needing Images ({productsNeedingImages.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {productsNeedingImages.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-gray-500">Category: {product.category || "Uncategorized"}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{product.category || "other"}</Badge>
                      <div className="w-12 h-12 bg-gray-100 rounded border flex items-center justify-center">
                        <img
                          src={getFallbackImage(product.category) || "/placeholder.svg"}
                          alt="Preview"
                          className="w-8 h-8 object-contain"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.svg?height=32&width=32&text=No+Image"
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Category Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Default Image Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {PRODUCT_CATEGORIES.map((category) => (
                <div key={category.value} className="text-center">
                  <div className="w-20 h-20 mx-auto mb-2 bg-gray-100 rounded-lg flex items-center justify-center">
                    <img
                      src={getFallbackImage(category.value) || "/placeholder.svg"}
                      alt={category.label}
                      className="w-16 h-16 object-contain"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg?height=64&width=64&text=No+Image"
                      }}
                    />
                  </div>
                  <div className="text-sm font-medium">{category.label}</div>
                  <div className="text-xs text-gray-500">{category.value}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
