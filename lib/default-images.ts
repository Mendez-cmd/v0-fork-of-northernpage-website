/**
 * Default image utility for Northern Chefs e-commerce
 * Provides category-specific placeholder images for products
 */

// Product categories configuration
export const PRODUCT_CATEGORIES = [
  {
    id: "chicken-pastel",
    name: "Chicken Pastel",
    slug: "chicken-pastel",
    description: "Traditional Filipino chicken pastel dishes",
    image: "/placeholder.svg?height=200&width=200&text=Chicken+Pastel",
  },
  {
    id: "laing",
    name: "Laing",
    slug: "laing",
    description: "Traditional taro leaves in coconut milk",
    image: "/placeholder.svg?height=200&width=200&text=Laing",
  },
  {
    id: "bangus",
    name: "Bangus",
    slug: "bangus",
    description: "Filipino milkfish dishes",
    image: "/placeholder.svg?height=200&width=200&text=Bangus",
  },
  {
    id: "chili",
    name: "Chili & Spices",
    slug: "chili",
    description: "Spicy condiments and seasonings",
    image: "/placeholder.svg?height=200&width=200&text=Chili",
  },
  {
    id: "dessert",
    name: "Desserts",
    slug: "dessert",
    description: "Traditional Filipino desserts",
    image: "/placeholder.svg?height=200&width=200&text=Dessert",
  },
  {
    id: "beverage",
    name: "Beverages",
    slug: "beverage",
    description: "Traditional drinks and beverages",
    image: "/placeholder.svg?height=200&width=200&text=Beverage",
  },
  {
    id: "main-dish",
    name: "Main Dishes",
    slug: "main-dish",
    description: "Hearty main course dishes",
    image: "/placeholder.svg?height=200&width=200&text=Main+Dish",
  },
  {
    id: "side-dish",
    name: "Side Dishes",
    slug: "side-dish",
    description: "Complementary side dishes",
    image: "/placeholder.svg?height=200&width=200&text=Side+Dish",
  },
  {
    id: "other",
    name: "Other",
    slug: "other",
    description: "Miscellaneous food items",
    image: "/placeholder.svg?height=200&width=200&text=Food+Item",
  },
] as const

// Define category to image mappings
const categoryPlaceholders: Record<string, string> = {
  "chicken-pastel": "/images/placeholders/chicken-placeholder.svg",
  laing: "/images/placeholders/vegetable-placeholder.svg",
  bangus: "/images/placeholders/seafood-placeholder.svg",
  chili: "/images/placeholders/spice-placeholder.svg",
  dessert: "/images/placeholders/dessert-placeholder.svg",
  beverage: "/images/placeholders/beverage-placeholder.svg",
  "main-dish": "/images/placeholders/main-dish-placeholder.svg",
  "side-dish": "/images/placeholders/side-dish-placeholder.svg",
  other: "/images/placeholders/food-placeholder.svg",
}

// Fallback SVG placeholders (inline SVG data URLs)
const fallbackPlaceholders: Record<string, string> = {
  "chicken-pastel": "/placeholder.svg?height=200&width=200&text=Chicken+Dish",
  laing: "/placeholder.svg?height=200&width=200&text=Vegetable+Dish",
  bangus: "/placeholder.svg?height=200&width=200&text=Seafood+Dish",
  chili: "/placeholder.svg?height=200&width=200&text=Spice",
  dessert: "/placeholder.svg?height=200&width=200&text=Dessert",
  beverage: "/placeholder.svg?height=200&width=200&text=Beverage",
  "main-dish": "/placeholder.svg?height=200&width=200&text=Main+Dish",
  "side-dish": "/placeholder.svg?height=200&width=200&text=Side+Dish",
  other: "/placeholder.svg?height=200&width=200&text=Food+Item",
}

/**
 * Get a fallback image URL for a specific category
 * @param category The product category
 * @returns URL to the appropriate placeholder image
 */
export function getFallbackImage(category: string): string {
  // Normalize category
  const normalizedCategory = category.toLowerCase().trim()

  // Check if we have a specific placeholder for this category
  for (const [key, value] of Object.entries(categoryPlaceholders)) {
    if (normalizedCategory.includes(key)) {
      return value
    }
  }

  // If no specific match, use a generic fallback based on broader categories
  if (normalizedCategory.includes("chicken") || normalizedCategory.includes("poultry")) {
    return categoryPlaceholders["chicken-pastel"] || fallbackPlaceholders["chicken-pastel"]
  } else if (normalizedCategory.includes("fish") || normalizedCategory.includes("seafood")) {
    return categoryPlaceholders["bangus"] || fallbackPlaceholders["bangus"]
  } else if (normalizedCategory.includes("vegetable") || normalizedCategory.includes("veg")) {
    return categoryPlaceholders["laing"] || fallbackPlaceholders["laing"]
  } else if (normalizedCategory.includes("spice") || normalizedCategory.includes("sauce")) {
    return categoryPlaceholders["chili"] || fallbackPlaceholders["chili"]
  } else if (normalizedCategory.includes("dessert") || normalizedCategory.includes("sweet")) {
    return categoryPlaceholders["dessert"] || fallbackPlaceholders["dessert"]
  } else if (normalizedCategory.includes("drink") || normalizedCategory.includes("beverage")) {
    return categoryPlaceholders["beverage"] || fallbackPlaceholders["beverage"]
  } else if (normalizedCategory.includes("main")) {
    return categoryPlaceholders["main-dish"] || fallbackPlaceholders["main-dish"]
  } else if (normalizedCategory.includes("side")) {
    return categoryPlaceholders["side-dish"] || fallbackPlaceholders["side-dish"]
  }

  // Default fallback
  return categoryPlaceholders["other"] || fallbackPlaceholders["other"]
}

/**
 * Check if a product needs a default image
 * @param product The product object
 * @returns Boolean indicating if the product needs a default image
 */
export function needsDefaultImage(product: any): boolean {
  return !product.image_url || product.image_url.trim() === ""
}

/**
 * Get the appropriate image URL for a product
 * Uses the product's image if available, otherwise returns a category-appropriate placeholder
 * @param product The product object
 * @returns The image URL to use
 */
export function getProductImageUrl(product: any): string {
  if (!product) return getFallbackImage("other")

  if (needsDefaultImage(product)) {
    return getFallbackImage(product.category || "other")
  }

  return product.image_url
}

/**
 * Bulk assign default images to products without images
 * @param products Array of product objects
 * @returns Array of products with default images assigned where needed
 */
export function assignDefaultImages(products: any[]): any[] {
  return products.map((product) => {
    if (needsDefaultImage(product)) {
      return {
        ...product,
        image_url: getFallbackImage(product.category || "other"),
      }
    }
    return product
  })
}
