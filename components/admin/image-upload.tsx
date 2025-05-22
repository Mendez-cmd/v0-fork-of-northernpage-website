"use client"

import type React from "react"

import { useState, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/components/ui/use-toast"
import { Upload, X, ImageIcon, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  onError?: (error: string) => void
  maxSizeInMB?: number
  acceptedFormats?: string[]
}

export function ImageUpload({
  value,
  onChange,
  onError,
  maxSizeInMB = 5,
  acceptedFormats = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"],
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!acceptedFormats.includes(file.type)) {
      return `Invalid file type. Please upload: ${acceptedFormats.map((f) => f.split("/")[1]).join(", ")}`
    }

    // Check file size
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024
    if (file.size > maxSizeInBytes) {
      return `File too large. Maximum size is ${maxSizeInMB}MB`
    }

    return null
  }

  const generateFileName = (file: File): string => {
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 8)
    const extension = file.name.split(".").pop()?.toLowerCase()
    return `product-${timestamp}-${randomString}.${extension}`
  }

  const uploadFile = async (file: File) => {
    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Validate file
      const validationError = validateFile(file)
      if (validationError) {
        throw new Error(validationError)
      }

      // Generate unique filename
      const fileName = generateFileName(file)
      const filePath = `products/${fileName}`

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 100)

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage.from("product-images").upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      })

      clearInterval(progressInterval)

      if (error) {
        // If bucket doesn't exist, try to create it
        if (error.message.includes("Bucket not found")) {
          toast({
            title: "Storage Setup Required",
            description: "Please set up the product-images storage bucket in Supabase first.",
            variant: "destructive",
          })
          throw new Error("Storage bucket not found. Please contact administrator.")
        }
        throw error
      }

      // Get public URL
      const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(filePath)

      setUploadProgress(100)

      // Use the public URL or fallback to a relative path
      const imageUrl = urlData.publicUrl || `/images/${fileName}`

      onChange(imageUrl)

      toast({
        title: "Upload Successful",
        description: "Image uploaded successfully!",
      })
    } catch (error) {
      console.error("Upload error:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to upload image"

      toast({
        title: "Upload Failed",
        description: errorMessage,
        variant: "destructive",
      })

      onError?.(errorMessage)
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return

    const file = files[0]
    uploadFile(file)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files)
    }
  }

  const removeImage = () => {
    onChange("")
  }

  return (
    <div className="space-y-4">
      <Label>Product Image</Label>

      {/* Upload Area */}
      {!value && (
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-gray-400"
          } ${isUploading ? "pointer-events-none opacity-50" : ""}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedFormats.join(",")}
            onChange={(e) => handleFileSelect(e.target.files)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isUploading}
          />

          <div className="space-y-2">
            {isUploading ? (
              <>
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-500" />
                <p className="text-sm text-gray-600">Uploading image...</p>
                <Progress value={uploadProgress} className="w-full max-w-xs mx-auto" />
                <p className="text-xs text-gray-500">{uploadProgress}%</p>
              </>
            ) : (
              <>
                <Upload className="mx-auto h-8 w-8 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF, WebP up to {maxSizeInMB}MB</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Image Preview */}
      {value && !isUploading && (
        <div className="relative">
          <div className="relative w-32 h-32 border rounded-lg overflow-hidden">
            <img
              src={value || "/placeholder.svg"}
              alt="Product preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                console.log(`Image failed to load: ${value}`)
                e.currentTarget.src = "/placeholder.svg?height=128&width=128"
              }}
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-1 right-1 h-6 w-6 p-0"
              onClick={removeImage}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-1 break-all">{value}</p>
        </div>
      )}

      {/* Manual URL Input */}
      <div className="space-y-2">
        <Label htmlFor="manual-url" className="text-sm text-gray-600">
          Or enter image URL manually
        </Label>
        <Input
          id="manual-url"
          placeholder="/images/product-name.jpg or https://example.com/image.jpg"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          disabled={isUploading}
        />
      </div>

      {/* Upload Instructions */}
      <Alert>
        <ImageIcon className="h-4 w-4" />
        <AlertDescription className="text-sm">
          <strong>Image Guidelines:</strong>
          <ul className="mt-1 space-y-1 text-xs">
            <li>• Use high-quality images (800-1200px width recommended)</li>
            <li>• Keep file size under {maxSizeInMB}MB for faster loading</li>
            <li>• Square or landscape orientation works best</li>
            <li>• Avoid images with text overlay when possible</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  )
}
