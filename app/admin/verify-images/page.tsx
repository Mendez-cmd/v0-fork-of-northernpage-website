"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, XCircle, AlertTriangle, FileImage, RefreshCw, Database, FolderTree } from "lucide-react"

export default function VerifyImagesPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [verificationResults, setVerificationResults] = useState({
    total: 0,
    valid: 0,
    invalid: 0,
    missing: 0,
    fixable: 0,
    details: [],
  })
  const [fixedCount, setFixedCount] = useState(0)
  const [isFixing, setIsFixing] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    const supabase = createClient()

    try {
      const { data, error } = await supabase.from("products").select("*")

      if (error) {
        throw error
      }

      setProducts(data || [])
      await verifyImagePaths(data || [])
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  const verifyImagePaths = async (productList) => {
    const results = {
      total: productList.length,
      valid: 0,
      invalid: 0,
      missing: 0,
      fixable: 0,
      details: [],
    }

    for (const product of productList) {
      const imageUrl = product.image_url
      const result = {
        id: product.id,
        name: product.name,
        originalPath: imageUrl,
        status: "unknown",
        message: "",
        fixedPath: null,
        canFix: false,
      }

      // Check if image URL exists
      if (!imageUrl) {
        result.status = "missing"
        result.message = "No image URL specified"
        results.missing++
      } else {
        // Check if image path is valid
        try {
          // For absolute paths starting with /
          if (imageUrl.startsWith("/")) {
            const publicPath = imageUrl
            const exists = await checkImageExists(publicPath)

            if (exists) {
              result.status = "valid"
              result.message = "Image exists at specified path"
              results.valid++
            } else {
              // Try to find the image in the /images directory
              const alternativePath = `/images/${imageUrl.split("/").pop()}`
              const alternativeExists = await checkImageExists(alternativePath)

              if (alternativeExists) {
                result.status = "fixable"
                result.message = `Image found at alternative path: ${alternativePath}`
                result.fixedPath = alternativePath
                result.canFix = true
                results.fixable++
              } else {
                result.status = "invalid"
                result.message = "Image not found at specified path"
                results.invalid++
              }
            }
          }
          // For relative paths (no leading /)
          else {
            // Try with /images/ prefix
            const withImagesPath = `/images/${imageUrl}`
            const withImagesExists = await checkImageExists(withImagesPath)

            if (withImagesExists) {
              result.status = "fixable"
              result.message = `Image found at: ${withImagesPath}`
              result.fixedPath = withImagesPath
              result.canFix = true
              results.fixable++
            }
            // Try direct in public folder
            else {
              const directPath = `/${imageUrl}`
              const directExists = await checkImageExists(directPath)

              if (directExists) {
                result.status = "fixable"
                result.message = `Image found at: ${directPath}`
                result.fixedPath = directPath
                result.canFix = true
                results.fixable++
              } else {
                result.status = "invalid"
                result.message = "Image not found in any expected location"
                results.invalid++
              }
            }
          }
        } catch (error) {
          result.status = "error"
          result.message = `Error checking image: ${error.message}`
          results.invalid++
        }
      }

      results.details.push(result)
    }

    setVerificationResults(results)
  }

  const checkImageExists = async (path) => {
    try {
      // Remove query parameters for checking
      const cleanPath = path.split("?")[0]

      // Try to fetch the image to see if it exists
      const response = await fetch(cleanPath, { method: "HEAD" })
      return response.ok
    } catch (error) {
      console.error(`Error checking if image exists at ${path}:`, error)
      return false
    }
  }

  const fixImagePaths = async () => {
    setIsFixing(true)
    const supabase = createClient()
    let fixed = 0

    try {
      for (const result of verificationResults.details) {
        if (result.canFix && result.fixedPath) {
          const { error } = await supabase.from("products").update({ image_url: result.fixedPath }).eq("id", result.id)

          if (!error) {
            fixed++
          }
        }
      }

      setFixedCount(fixed)
      // Refresh the product list
      await fetchProducts()
    } catch (error) {
      console.error("Error fixing image paths:", error)
    } finally {
      setIsFixing(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "valid":
        return "bg-green-100 text-green-800"
      case "invalid":
        return "bg-red-100 text-red-800"
      case "missing":
        return "bg-yellow-100 text-yellow-800"
      case "fixable":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "valid":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />
      case "invalid":
        return <XCircle className="h-5 w-5 text-red-600" />
      case "missing":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      case "fixable":
        return <RefreshCw className="h-5 w-5 text-blue-600" />
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Image Path Verification</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Database Image Path Verification
            </CardTitle>
            <CardDescription>Verify that image paths in your database match your actual file structure</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                <span className="ml-3">Checking image paths...</span>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-gray-500">Total Products</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">{verificationResults.total}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-gray-500">Valid Images</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold text-green-600">{verificationResults.valid}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-gray-500">Invalid Paths</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold text-red-600">{verificationResults.invalid}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-gray-500">Fixable Paths</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold text-blue-600">{verificationResults.fixable}</p>
                    </CardContent>
                  </Card>
                </div>

                {verificationResults.fixable > 0 && (
                  <Alert className="bg-blue-50 border-blue-200">
                    <AlertTriangle className="h-4 w-4 text-blue-600" />
                    <AlertTitle>Fixable image paths detected</AlertTitle>
                    <AlertDescription>
                      {verificationResults.fixable} product images have paths that can be automatically fixed. Click the
                      "Fix Image Paths" button to update them in the database.
                    </AlertDescription>
                  </Alert>
                )}

                {fixedCount > 0 && (
                  <Alert className="bg-green-50 border-green-200">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertTitle>Image paths fixed</AlertTitle>
                    <AlertDescription>Successfully fixed {fixedCount} image paths in the database.</AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={fetchProducts} disabled={loading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>

            <Button onClick={fixImagePaths} disabled={loading || isFixing || verificationResults.fixable === 0}>
              {isFixing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Fixing...
                </>
              ) : (
                <>Fix Image Paths ({verificationResults.fixable})</>
              )}
            </Button>
          </CardFooter>
        </Card>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Products ({verificationResults.total})</TabsTrigger>
            <TabsTrigger value="valid">Valid ({verificationResults.valid})</TabsTrigger>
            <TabsTrigger value="fixable">Fixable ({verificationResults.fixable})</TabsTrigger>
            <TabsTrigger value="invalid">Invalid ({verificationResults.invalid})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {verificationResults.details.map((result) => (
                    <div key={result.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="mt-1">{getStatusIcon(result.status)}</div>
                          <div>
                            <h3 className="font-medium">{result.name}</h3>
                            <p className="text-sm text-gray-500 mt-1">ID: {result.id}</p>
                            <div className="mt-2">
                              <Badge className={getStatusColor(result.status)}>
                                {result.status.charAt(0).toUpperCase() + result.status.slice(1)}
                              </Badge>
                            </div>
                            <p className="text-sm mt-2">{result.message}</p>

                            <div className="mt-3 space-y-1">
                              <p className="text-sm">
                                <span className="font-medium">Original path:</span>{" "}
                                <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">
                                  {result.originalPath || "None"}
                                </code>
                              </p>

                              {result.fixedPath && (
                                <p className="text-sm">
                                  <span className="font-medium">Fixed path:</span>{" "}
                                  <code className="bg-blue-100 px-1 py-0.5 rounded text-xs">{result.fixedPath}</code>
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                          {result.status === "valid" || result.status === "fixable" ? (
                            <img
                              src={result.fixedPath || result.originalPath}
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

          <TabsContent value="valid" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {verificationResults.details
                    .filter((result) => result.status === "valid")
                    .map((result) => (
                      <div key={result.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="mt-1">
                              <CheckCircle2 className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <h3 className="font-medium">{result.name}</h3>
                              <p className="text-sm text-gray-500 mt-1">ID: {result.id}</p>
                              <p className="text-sm mt-2">{result.message}</p>

                              <div className="mt-3">
                                <p className="text-sm">
                                  <span className="font-medium">Path:</span>{" "}
                                  <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{result.originalPath}</code>
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                            <img
                              src={result.originalPath || "/placeholder.svg"}
                              alt={result.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = "/placeholder.svg?height=64&width=64"
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fixable" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {verificationResults.details
                    .filter((result) => result.status === "fixable")
                    .map((result) => (
                      <div key={result.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="mt-1">
                              <RefreshCw className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-medium">{result.name}</h3>
                              <p className="text-sm text-gray-500 mt-1">ID: {result.id}</p>
                              <p className="text-sm mt-2">{result.message}</p>

                              <div className="mt-3 space-y-1">
                                <p className="text-sm">
                                  <span className="font-medium">Original path:</span>{" "}
                                  <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{result.originalPath}</code>
                                </p>

                                <p className="text-sm">
                                  <span className="font-medium">Fixed path:</span>{" "}
                                  <code className="bg-blue-100 px-1 py-0.5 rounded text-xs">{result.fixedPath}</code>
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                            <img
                              src={result.fixedPath || "/placeholder.svg"}
                              alt={result.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = "/placeholder.svg?height=64&width=64"
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="invalid" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {verificationResults.details
                    .filter((result) => result.status === "invalid" || result.status === "missing")
                    .map((result) => (
                      <div key={result.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="mt-1">
                              {result.status === "invalid" ? (
                                <XCircle className="h-5 w-5 text-red-600" />
                              ) : (
                                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                              )}
                            </div>
                            <div>
                              <h3 className="font-medium">{result.name}</h3>
                              <p className="text-sm text-gray-500 mt-1">ID: {result.id}</p>
                              <div className="mt-2">
                                <Badge className={getStatusColor(result.status)}>
                                  {result.status.charAt(0).toUpperCase() + result.status.slice(1)}
                                </Badge>
                              </div>
                              <p className="text-sm mt-2">{result.message}</p>

                              {result.originalPath && (
                                <div className="mt-3">
                                  <p className="text-sm">
                                    <span className="font-medium">Path:</span>{" "}
                                    <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">
                                      {result.originalPath}
                                    </code>
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0 flex items-center justify-center">
                            <FileImage className="h-8 w-8 text-gray-400" />
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderTree className="h-5 w-5" />
              Image Path Structure Guide
            </CardTitle>
            <CardDescription>Understanding how image paths should be structured in your database</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Recommended Image Path Structure</h3>
                <p className="text-sm text-gray-600">
                  For best results, all product images should follow a consistent path structure:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                  <li>
                    Store all product images in the{" "}
                    <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">/public/images/</code> directory
                  </li>
                  <li>
                    Use absolute paths starting with{" "}
                    <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">/images/</code> in your database
                  </li>
                  <li>
                    Example: <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">/images/product-name.jpg</code>
                  </li>
                </ul>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-2">Common Issues</h3>
                <ul className="list-disc pl-5 mt-2 space-y-2 text-sm">
                  <li>
                    <strong>Missing leading slash:</strong> Paths like{" "}
                    <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">images/product.jpg</code> instead of{" "}
                    <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">/images/product.jpg</code>
                  </li>
                  <li>
                    <strong>Missing images directory:</strong> Paths like{" "}
                    <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">/product.jpg</code> instead of{" "}
                    <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">/images/product.jpg</code>
                  </li>
                  <li>
                    <strong>Case sensitivity:</strong>{" "}
                    <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">/images/Product.jpg</code> is different
                    from <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">/images/product.jpg</code> on some
                    servers
                  </li>
                  <li>
                    <strong>File doesn't exist:</strong> The image file referenced in the database doesn't exist in your
                    project
                  </li>
                </ul>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-2">Manual Fix Instructions</h3>
                <p className="text-sm text-gray-600">For images that can't be automatically fixed:</p>
                <ol className="list-decimal pl-5 mt-2 space-y-2 text-sm">
                  <li>
                    Upload the missing image to your{" "}
                    <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">/public/images/</code> directory
                  </li>
                  <li>Update the product record in the database with the correct path</li>
                  <li>Refresh this page to verify the fix</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
