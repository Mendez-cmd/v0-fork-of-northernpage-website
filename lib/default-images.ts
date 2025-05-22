export const PRODUCT_CATEGORIES = [
  {
    label: "UI Kits",
    value: "ui_kits" as const,
    featured: [
      {
        name: "Editor picks",
        href: `/products?category=ui_kits`,
        imageSrc: "/nav/ui-kits/mixed.jpg",
      },
      {
        name: "New Arrivals",
        href: "/products?category=ui_kits&sort=desc",
        imageSrc: "/nav/ui-kits/blue.jpg",
      },
      {
        name: "Bestsellers",
        href: "/products?category=ui_kits",
        imageSrc: "/nav/ui-kits/purple.jpg",
      },
    ],
    defaultImage: "/placeholder.svg?height=400&width=400&text=UI+Kits",
  },
  {
    label: "Icons",
    value: "icons" as const,
    featured: [
      {
        name: "Editor picks",
        href: `/products?category=icons`,
        imageSrc: "/nav/icons/picks.jpg",
      },
      {
        name: "New Arrivals",
        href: "/products?category=icons&sort=desc",
        imageSrc: "/nav/icons/new.jpg",
      },
      {
        name: "Bestsellers",
        href: "/products?category=icons",
        imageSrc: "/nav/icons/bestsellers.jpg",
      },
    ],
    defaultImage: "/placeholder.svg?height=400&width=400&text=Icons",
  },
]

export function needsDefaultImage(product: { image_url?: string | null; category?: string | null }): boolean {
  if (!product) return true

  // Check if image_url is null, undefined, or empty string
  if (!product.image_url || product.image_url.trim() === "") {
    return true
  }

  // Check if it's already a placeholder/fallback image
  if (product.image_url.includes("/placeholder.svg") || product.image_url.includes("default-")) {
    return true
  }

  return false
}

export function getFallbackImage(category?: string | null): string {
  if (!category) {
    return "/placeholder.svg?height=400&width=400&text=No+Image"
  }

  const normalizedCategory = category.toLowerCase().trim()

  // Find matching category
  const categoryConfig = PRODUCT_CATEGORIES.find(
    (cat) =>
      cat.value === normalizedCategory ||
      cat.label.toLowerCase() === normalizedCategory ||
      normalizedCategory.includes(cat.value) ||
      cat.value.includes(normalizedCategory),
  )

  if (categoryConfig) {
    return categoryConfig.defaultImage
  }

  // Default fallback
  return "/placeholder.svg?height=400&width=400&text=No+Image"
}

/**
 * Get the appropriate image URL for a product
 * Uses the product's image if available, otherwise returns a category-appropriate placeholder
 * @param product The product object
 * @returns The image URL to use
 */
export function getProductImageUrl(product: { image_url?: string | null; category?: string | null }): string {
  if (!product) return getFallbackImage(null)

  if (needsDefaultImage(product)) {
    return getFallbackImage(product.category)
  }

  return product.image_url || getFallbackImage(product.category)
}

/**
 * Bulk assign default images to products without images
 * @param products Array of product objects
 * @returns Array of products with default images assigned where needed
 */
export function assignDefaultImages(products: any[]): any[] {
  if (!products || !Array.isArray(products)) return []

  return products.map((product) => {
    if (!product) return product

    if (needsDefaultImage(product)) {
      return {
        ...product,
        image_url: getFallbackImage(product.category),
      }
    }
    return product
  })
}
