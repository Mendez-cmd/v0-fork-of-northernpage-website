import { createClient } from "@/lib/supabase/server"

// Fallback products data when database is not set up
const fallbackProducts = [
  {
    id: "1",
    name: "Chicken Pastil Original",
    description: "The original chicken pastil that started it all. A must-try!",
    price: 149.0,
    image_url: "/images/chickenpastiloriginal.png",
    category: "chicken-pastel",
    is_featured: true,
    is_bestseller: true,
    stock_quantity: 100,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Chicken Pastil Classic",
    description: "Our classic chicken pastil recipe, a timeless favorite.",
    price: 149.0,
    image_url: "/images/chickenpastilclassic.png",
    category: "chicken-pastel",
    is_featured: true,
    is_bestseller: false,
    stock_quantity: 100,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Chicken Pastil Salted Egg",
    description: "A unique fusion of chicken pastil with rich salted egg flavor.",
    price: 149.0,
    image_url: "/images/chickenpastilsaltedegg.png",
    category: "chicken-pastel",
    is_featured: true,
    is_bestseller: false,
    stock_quantity: 100,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Laing",
    description: "Traditional Bicolano dish made with taro leaves in coconut milk.",
    price: 149.0,
    image_url: "/images/laing.png",
    category: "laing",
    is_featured: true,
    is_bestseller: false,
    stock_quantity: 100,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "5",
    name: "Spanish Bangus",
    description: "Premium milkfish marinated in Spanish-style sauce, perfect for any occasion.",
    price: 189.0,
    image_url: "/images/bangusspanish.png",
    category: "bangus",
    is_featured: true,
    is_bestseller: true,
    stock_quantity: 100,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "6",
    name: "Chili Garlic",
    description: "Homemade chili garlic sauce, perfect for adding heat to any dish.",
    price: 159.0,
    image_url: "/images/chiligarlic.png",
    category: "chili",
    is_featured: true,
    is_bestseller: false,
    stock_quantity: 100,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

// Helper function to check if a table exists
async function checkTableExists(supabase, tableName) {
  try {
    // Try to get a single row from the table
    const { data, error } = await supabase.from(tableName).select("*").limit(1)

    // If there's no error, the table exists
    if (!error) {
      return true
    }

    // Check if the error is about the table not existing
    if (error.message.includes("does not exist")) {
      return false
    }

    // For other errors, log and return false
    console.error(`Error checking if table ${tableName} exists:`, error)
    return false
  } catch (error) {
    console.error(`Exception checking if table ${tableName} exists:`, error)
    return false
  }
}

export async function getFeaturedProducts() {
  const supabase = createClient()

  try {
    // First check if the products table exists
    const tableExists = await checkTableExists(supabase, "products")

    if (!tableExists) {
      console.log("Products table does not exist, returning fallback data")
      return fallbackProducts.filter((p) => p.is_featured)
    }

    // If table exists, query it
    const { data, error } = await supabase.from("products").select("*").eq("is_featured", true).order("name")

    if (error) {
      console.error("Error fetching featured products:", error.message)
      // Return fallback data if there's an error
      return fallbackProducts.filter((p) => p.is_featured)
    }

    return data || []
  } catch (error) {
    console.error("Exception fetching featured products:", error instanceof Error ? error.message : String(error))
    // Return fallback data if there's an exception
    return fallbackProducts.filter((p) => p.is_featured)
  }
}

export async function getAllProducts() {
  const supabase = createClient()

  try {
    // First check if the products table exists
    const tableExists = await checkTableExists(supabase, "products")

    if (!tableExists) {
      console.log("Products table does not exist, returning fallback data")
      return fallbackProducts
    }

    const { data, error } = await supabase.from("products").select("*").order("name")

    if (error) {
      console.error("Error fetching all products:", error.message)
      // Return fallback data if there's an error
      return fallbackProducts
    }

    return data || []
  } catch (error) {
    console.error("Exception fetching all products:", error instanceof Error ? error.message : String(error))
    // Return fallback data if there's an exception
    return fallbackProducts
  }
}

export async function getProductsByCategory(category: string) {
  const supabase = createClient()

  try {
    // First check if the products table exists
    const tableExists = await checkTableExists(supabase, "products")

    if (!tableExists) {
      console.log("Products table does not exist, returning fallback data")
      return fallbackProducts.filter((p) => p.category === category)
    }

    const { data, error } = await supabase.from("products").select("*").eq("category", category).order("name")

    if (error) {
      console.error(`Error fetching products in category ${category}:`, error.message)
      // Return fallback data filtered by category
      return fallbackProducts.filter((p) => p.category === category)
    }

    return data || []
  } catch (error) {
    console.error(
      `Exception fetching products in category ${category}:`,
      error instanceof Error ? error.message : String(error),
    )
    // Return fallback data filtered by category
    return fallbackProducts.filter((p) => p.category === category)
  }
}

export async function getProductById(id: string) {
  const supabase = createClient()

  try {
    // First check if the products table exists
    const tableExists = await checkTableExists(supabase, "products")

    if (!tableExists) {
      console.log("Products table does not exist, returning fallback data")
      return fallbackProducts.find((p) => p.id === id) || null
    }

    const { data, error } = await supabase.from("products").select("*").eq("id", id).single()

    if (error) {
      console.error(`Error fetching product with ID ${id}:`, error.message)
      // Return fallback product with matching ID
      return fallbackProducts.find((p) => p.id === id) || null
    }

    return data
  } catch (error) {
    console.error(`Exception fetching product with ID ${id}:`, error instanceof Error ? error.message : String(error))
    // Return fallback product with matching ID
    return fallbackProducts.find((p) => p.id === id) || null
  }
}
