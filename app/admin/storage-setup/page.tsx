"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, AlertCircle, Loader2, Database, Shield, Upload } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export default function StorageSetupPage() {
  const [isChecking, setIsChecking] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [bucketExists, setBucketExists] = useState<boolean | null>(null)
  const [bucketPublic, setBucketPublic] = useState<boolean | null>(null)
  const supabase = createClient()

  const checkBucketStatus = async () => {
    setIsChecking(true)
    try {
      // Check if bucket exists
      const { data: buckets, error } = await supabase.storage.listBuckets()

      if (error) {
        throw error
      }

      const productImagesBucket = buckets.find((bucket) => bucket.name === "product-images")
      setBucketExists(!!productImagesBucket)
      setBucketPublic(productImagesBucket?.public || false)

      if (productImagesBucket) {
        toast({
          title: "Bucket Found",
          description: `Product images bucket exists and is ${productImagesBucket.public ? "public" : "private"}`,
        })
      } else {
        toast({
          title: "Bucket Not Found",
          description: "Product images bucket needs to be created",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error checking bucket:", error)
      toast({
        title: "Check Failed",
        description: "Failed to check bucket status. You may need to set this up manually in Supabase.",
        variant: "destructive",
      })
    } finally {
      setIsChecking(false)
    }
  }

  const createBucket = async () => {
    setIsCreating(true)
    try {
      // Create the bucket
      const { data, error } = await supabase.storage.createBucket("product-images", {
        public: true,
        allowedMimeTypes: ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"],
        fileSizeLimit: 5242880, // 5MB
      })

      if (error) {
        throw error
      }

      setBucketExists(true)
      setBucketPublic(true)

      toast({
        title: "Success",
        description: "Product images bucket created successfully!",
      })
    } catch (error) {
      console.error("Error creating bucket:", error)
      toast({
        title: "Creation Failed",
        description: "Failed to create bucket automatically. Please create it manually in Supabase.",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Storage Setup</h1>
          <p className="text-gray-600 mt-2">Set up Supabase Storage for product image uploads</p>
        </div>

        {/* Status Check */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Storage Bucket Status
            </CardTitle>
            <CardDescription>Check if the product-images storage bucket is properly configured</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Button onClick={checkBucketStatus} disabled={isChecking}>
                {isChecking && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Check Status
              </Button>

              {bucketExists === false && (
                <Button onClick={createBucket} disabled={isCreating} variant="outline">
                  {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Bucket
                </Button>
              )}
            </div>

            {bucketExists !== null && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {bucketExists ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className={bucketExists ? "text-green-700" : "text-red-700"}>
                    Bucket {bucketExists ? "exists" : "does not exist"}
                  </span>
                </div>

                {bucketExists && (
                  <div className="flex items-center gap-2">
                    {bucketPublic ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                    )}
                    <span className={bucketPublic ? "text-green-700" : "text-yellow-700"}>
                      Bucket is {bucketPublic ? "public" : "private"}
                    </span>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Manual Setup Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Manual Setup Instructions
            </CardTitle>
            <CardDescription>
              If automatic setup doesn't work, follow these steps in your Supabase dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold">Step 1: Create Storage Bucket</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600 mt-1">
                  <li>Go to your Supabase project dashboard</li>
                  <li>Navigate to Storage in the sidebar</li>
                  <li>Click "Create a new bucket"</li>
                  <li>
                    Name it: <code className="bg-gray-100 px-1 rounded">product-images</code>
                  </li>
                  <li>Make it public (check the "Public bucket" option)</li>
                  <li>Click "Create bucket"</li>
                </ol>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-semibold">Step 2: Configure Bucket Policies</h4>
                <p className="text-sm text-gray-600 mt-1">
                  The bucket should automatically have the right policies for public access. If you encounter permission
                  issues, you may need to add RLS policies.
                </p>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-semibold">Step 3: Test Upload</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Once the bucket is created, try uploading an image through the product form to verify everything is
                  working correctly.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Features
            </CardTitle>
            <CardDescription>What you get with the new image upload system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-green-700">✅ Drag & Drop Upload</h4>
                <p className="text-sm text-gray-600">Simply drag images onto the upload area or click to browse</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-green-700">✅ File Validation</h4>
                <p className="text-sm text-gray-600">Automatic validation of file type, size, and format</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-green-700">✅ Progress Tracking</h4>
                <p className="text-sm text-gray-600">Real-time upload progress with visual feedback</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-green-700">✅ Automatic Naming</h4>
                <p className="text-sm text-gray-600">Files are automatically renamed to prevent conflicts</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-green-700">✅ Image Preview</h4>
                <p className="text-sm text-gray-600">Instant preview of uploaded images with remove option</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-green-700">✅ Manual Override</h4>
                <p className="text-sm text-gray-600">Still allows manual URL entry for external images</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {bucketExists && bucketPublic && (
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>
              <strong>Setup Complete!</strong> Your storage is ready for image uploads. You can now use the image upload
              feature in the product form.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}
