"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  Upload,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Database,
  CloudUpload,
  FileImage,
  Loader2,
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface Product {
  id: string
  name: string
  image_url: string
}

interface MigrationResult {
  id: string
  name: string
  originalUrl: string
  newUrl?: string
  status: "pending" | "success" | "error" | "skipped"
  error?: string
  fileSize?: number
}

export default function MigrateImagesPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [migrationResults, setMigrationResults] = useState<MigrationResult[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isMigrating, setIsMigrating] = useState(false)
  const [currentProgress, setCurrentProgress] = useState(0)
  const [currentItem, setCurrentItem] = useState("")
  const [stats, setStats] = useState({
    total: 0,
    success: 0,
    error: 0,
    skipped: 0,
    pending: 0,
  })

  const supabase = createClient()

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    updateStats()
  }, [migrationResults])

  const fetchProducts = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.from("products").select("id, name, image_url").not("image_url", "is", null)

      if (error) throw error

      setProducts(data || [])

      // Initialize migration results
      const results: MigrationResult[] = (data || []).map((product) => ({
        id: product.id,
        name: product.name,
        originalUrl: product.image_url,
        status: shouldMigrate(product.image_url) ? "pending" : "skipped",
      }))

      setMigrationResults(results)
    } catch (error) {
      console.error("Error fetching products:", error)
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const shouldMigrate = (imageUrl: string): boolean => {
    if (!imageUrl) return false

    // Skip if already using Supabase Storage
    if (imageUrl.includes("supabase")) return false

    // Skip external URLs (keep them as-is)
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) return false

    // Migrate local images
    return imageUrl.startsWith("/images/") || imageUrl.startsWith("images/")
  }

  const updateStats = () => {
    const newStats = migrationResults.reduce(
      (acc, result) => {
        acc[result.status]++
        acc.total++
        return acc
      },
      { total: 0, success: 0, error: 0, skipped: 0, pending: 0 },
    )
    setStats(newStats)
  }

  const downloadImageAsFile = async (imageUrl: string): Promise<File> => {
    // Handle relative URLs
    let fullUrl = imageUrl
    if (imageUrl.startsWith("/")) {
      fullUrl = `${window.location.origin}${imageUrl}`
    }

    const response = await fetch(fullUrl)
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`)
    }

    const blob = await response.blob()

    // Extract filename from URL
    const urlParts = imageUrl.split("/")
    const filename = urlParts[urlParts.length - 1] || "image.jpg"

    return new File([blob], filename, { type: blob.type })
  }

  const uploadToStorage = async (file: File): Promise<string> => {
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 8)
    const extension = file.name.split(".").pop()?.toLowerCase()
    const fileName = `migrated-${timestamp}-${randomString}.${extension}`
    const filePath = `products/${fileName}`

    const { data, error } = await supabase.storage.from("product-images").upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (error) {
      throw error
    }

    // Get public URL
    const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(filePath)

    return urlData.publicUrl
  }

  const migrateImage = async (product: Product): Promise<MigrationResult> => {
    const result: MigrationResult = {
      id: product.id,
      name: product.name,
      originalUrl: product.image_url,
      status: "pending",
    }

    try {
      setCurrentItem(`Migrating: ${product.name}`)

      // Download the image
      const imageFile = await downloadImageAsFile(product.image_url)
      result.fileSize = imageFile.size

      // Upload to Supabase Storage
      const newUrl = await uploadToStorage(imageFile)
      result.newUrl = newUrl

      // Update database
      const { error: updateError } = await supabase.from("products").update({ image_url: newUrl }).eq("id", product.id)

      if (updateError) {
        throw updateError
      }

      result.status = "success"
      return result
    } catch (error) {
      console.error(`Error migrating image for ${product.name}:`, error)
      result.status = "error"
      result.error = error instanceof Error ? error.message : "Unknown error"
      return result
    }
  }

  const startMigration = async () => {
    setIsMigrating(true)
    setCurrentProgress(0)

    const itemsToMigrate = migrationResults.filter((r) => r.status === "pending")
    const totalItems = itemsToMigrate.length

    if (totalItems === 0) {
      toast({
        title: "No Migration Needed",
        description: "All images are already migrated or don't need migration",
      })
      setIsMigrating(false)
      return
    }

    const updatedResults = [...migrationResults]

    for (let i = 0; i < itemsToMigrate.length; i++) {
      const item = itemsToMigrate[i]
      const product = products.find((p) => p.id === item.id)

      if (!product) continue

      try {
        const result = await migrateImage(product)

        // Update the result in our array
        const index = updatedResults.findIndex((r) => r.id === item.id)
        if (index !== -1) {
          updatedResults[index] = result
        }

        setMigrationResults([...updatedResults])
        setCurrentProgress(((i + 1) / totalItems) * 100)

        // Small delay to prevent overwhelming the server
        await new Promise((resolve) => setTimeout(resolve, 500))
      } catch (error) {
        console.error(`Failed to migrate ${product.name}:`, error)
      }
    }

    setCurrentItem("")
    setIsMigrating(false)

    toast({
      title: "Migration Complete",
      description: `Successfully migrated ${updatedResults.filter((r) => r.status === "success").length} images`,
    })
  }

  const rollbackMigration = async () => {
    const successfulMigrations = migrationResults.filter((r) => r.status === "success")

    if (successfulMigrations.length === 0) {
      toast({
        title: "No Rollback Needed",
        description: "No successful migrations to rollback",
      })
      return
    }

    setIsMigrating(true)
    setCurrentItem("Rolling back migrations...")

    try {
      for (const result of successfulMigrations) {
        await supabase.from("products").update({ image_url: result.originalUrl }).eq("id", result.id)

        // Update status
        const index = migrationResults.findIndex((r) => r.id === result.id)
        if (index !== -1) {
          migrationResults[index].status = "pending"
          migrationResults[index].newUrl = undefined
        }
      }

      setMigrationResults([...migrationResults])

      toast({
        title: "Rollback Complete",
        description: "All migrations have been rolled back",
      })
    } catch (error) {
      console.error("Error during rollback:", error)
      toast({
        title: "Rollback Failed",
        description: "Some migrations could not be rolled back",
        variant: "destructive",
      })
    } finally {
      setIsMigrating(false)
      setCurrentItem("")
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-600" />
      case "pending":
        return <Upload className="h-5 w-5 text-blue-600" />
      case "skipped":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800"
      case "error":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-blue-100 text-blue-800"
      case "skipped":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "Unknown"
    const kb = bytes / 1024
    const mb = kb / 1024
    if (mb >= 1) return `${mb.toFixed(1)} MB`
    return `${kb.toFixed(1)} KB`
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mr-3" />
          <span>Loading products...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Image Migration Tool</h1>

      <div className="grid gap-6">
        {/* Overview Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CloudUpload className="h-5 w-5" />
              Migration Overview
            </CardTitle>
            <CardDescription>Migrate existing product images from local storage to Supabase Storage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-500">Total</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-500">Pending</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-blue-600">{stats.pending}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-500">Success</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-green-600">{stats.success}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-500">Errors</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-red-600">{stats.error}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-500">Skipped</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-yellow-600">{stats.skipped}</p>
                </CardContent>
              </Card>
            </div>

            {isMigrating && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Migration Progress</span>
                  <span className="text-sm text-gray-500">{Math.round(currentProgress)}%</span>
                </div>
                <Progress value={currentProgress} className="w-full" />
                {currentItem && <p className="text-sm text-gray-600">{currentItem}</p>}
              </div>
            )}

            <div className="flex gap-4 mt-6">
              <Button
                onClick={startMigration}
                disabled={isMigrating || stats.pending === 0}
                className="flex items-center gap-2"
              >
                {isMigrating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                Start Migration ({stats.pending} items)
              </Button>

              <Button
                variant="outline"
                onClick={rollbackMigration}
                disabled={isMigrating || stats.success === 0}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Rollback ({stats.success} items)
              </Button>

              <Button
                variant="outline"
                onClick={fetchProducts}
                disabled={isMigrating}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Migration Status */}
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Products ({stats.total})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
            <TabsTrigger value="success">Success ({stats.success})</TabsTrigger>
            <TabsTrigger value="error">Errors ({stats.error})</TabsTrigger>
            <TabsTrigger value="skipped">Skipped ({stats.skipped})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {migrationResults.map((result) => (
                    <div key={result.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="mt-1">{getStatusIcon(result.status)}</div>
                          <div className="flex-1">
                            <h3 className="font-medium">{result.name}</h3>
                            <p className="text-sm text-gray-500 mt-1">ID: {result.id}</p>

                            <div className="mt-2">
                              <Badge className={getStatusColor(result.status)}>
                                {result.status.charAt(0).toUpperCase() + result.status.slice(1)}
                              </Badge>
                              {result.fileSize && (
                                <Badge variant="outline" className="ml-2">
                                  {formatFileSize(result.fileSize)}
                                </Badge>
                              )}
                            </div>

                            <div className="mt-3 space-y-1">
                              <p className="text-sm">
                                <span className="font-medium">Original:</span>{" "}
                                <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{result.originalUrl}</code>
                              </p>

                              {result.newUrl && (
                                <p className="text-sm">
                                  <span className="font-medium">New:</span>{" "}
                                  <code className="bg-green-100 px-1 py-0.5 rounded text-xs">{result.newUrl}</code>
                                </p>
                              )}

                              {result.error && (
                                <p className="text-sm text-red-600">
                                  <span className="font-medium">Error:</span> {result.error}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                          {result.status === "success" && result.newUrl ? (
                            <img
                              src={result.newUrl || "/placeholder.svg"}
                              alt={result.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = "/placeholder.svg?height=64&width=64"
                              }}
                            />
                          ) : result.originalUrl ? (
                            <img
                              src={result.originalUrl || "/placeholder.svg"}
                              alt={result.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = "/placeholder.svg?height=64&width=64"
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200">
                              <FileImage className="h-8 w-8 text-gray-400" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other tabs with filtered content */}
          {["pending", "success", "error", "skipped"].map((status) => (
            <TabsContent key={status} value={status} className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {migrationResults
                      .filter((result) => result.status === status)
                      .map((result) => (
                        <div key={result.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <div className="mt-1">{getStatusIcon(result.status)}</div>
                              <div className="flex-1">
                                <h3 className="font-medium">{result.name}</h3>
                                <p className="text-sm text-gray-500 mt-1">ID: {result.id}</p>

                                <div className="mt-3 space-y-1">
                                  <p className="text-sm">
                                    <span className="font-medium">Original:</span>{" "}
                                    <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">
                                      {result.originalUrl}
                                    </code>
                                  </p>

                                  {result.newUrl && (
                                    <p className="text-sm">
                                      <span className="font-medium">New:</span>{" "}
                                      <code className="bg-green-100 px-1 py-0.5 rounded text-xs">{result.newUrl}</code>
                                    </p>
                                  )}

                                  {result.error && (
                                    <p className="text-sm text-red-600">
                                      <span className="font-medium">Error:</span> {result.error}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                              {result.status === "success" && result.newUrl ? (
                                <img
                                  src={result.newUrl || "/placeholder.svg"}
                                  alt={result.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.src = "/placeholder.svg?height=64&width=64"
                                  }}
                                />
                              ) : result.originalUrl ? (
                                <img
                                  src={result.originalUrl || "/placeholder.svg"}
                                  alt={result.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.src = "/placeholder.svg?height=64&width=64"
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                  <FileImage className="h-8 w-8 text-gray-400" />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        {/* Migration Guide */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Migration Guide
            </CardTitle>
            <CardDescription>Understanding the image migration process</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">What Gets Migrated</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>
                    Images with paths starting with <code className="bg-gray-100 px-1 py-0.5 rounded">/images/</code>
                  </li>
                  <li>
                    Images with relative paths like{" "}
                    <code className="bg-gray-100 px-1 py-0.5 rounded">images/product.jpg</code>
                  </li>
                  <li>Local images that exist in your project</li>
                </ul>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-2">What Gets Skipped</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>External URLs (http/https) - these remain unchanged</li>
                  <li>Images already using Supabase Storage</li>
                  <li>Products without image URLs</li>
                </ul>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-2">Migration Process</h3>
                <ol className="list-decimal pl-5 space-y-1 text-sm">
                  <li>Download the original image from your server</li>
                  <li>Upload it to Supabase Storage with a unique filename</li>
                  <li>Update the product record with the new Supabase URL</li>
                  <li>Verify the new image is accessible</li>
                </ol>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-2">Safety Features</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>
                    <strong>Rollback capability:</strong> Can restore original URLs if needed
                  </li>
                  <li>
                    <strong>Error handling:</strong> Failed migrations don't affect other images
                  </li>
                  <li>
                    <strong>Progress tracking:</strong> Real-time status updates
                  </li>
                  <li>
                    <strong>Validation:</strong> Checks image accessibility before migration
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
