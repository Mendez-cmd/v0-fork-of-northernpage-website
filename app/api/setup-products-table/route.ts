import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = createClient()

  try {
    // Check if the products table exists
    const { data: tableExists, error: checkError } = await supabase.from("products").select("*").limit(1)

    if (checkError && checkError.message.includes("does not exist")) {
      // Create the products table
      const { error: createError } = await supabase.rpc("create_products_table")

      if (createError) {
        console.error("Error creating products table:", createError)
        return NextResponse.json({ success: false, error: createError.message }, { status: 500 })
      }

      // Insert sample products
      const { error: insertError } = await supabase.from("products").insert([
        {
          name: "Chicken Pastil Original",
          description: "The original chicken pastil that started it all. A must-try!",
          price: 149.0,
          image_url: "/images/chickenpastiloriginal.png",
          category: "chicken-pastel",
          is_featured: true,
          is_bestseller: true,
          stock_quantity: 100,
        },
        {
          name: "Chicken Pastil Classic",
          description: "Our classic chicken pastil recipe, a timeless favorite.",
          price: 149.0,
          image_url: "/images/chickenpastilclassic.png",
          category: "chicken-pastel",
          is_featured: true,
          is_bestseller: false,
          stock_quantity: 100,
        },
        {
          name: "Chicken Pastil Salted Egg",
          description: "A unique fusion of chicken pastil with rich salted egg flavor.",
          price: 149.0,
          image_url: "/images/chickenpastilsaltedegg.png",
          category: "chicken-pastel",
          is_featured: true,
          is_bestseller: false,
          stock_quantity: 100,
        },
        {
          name: "Laing",
          description: "Traditional Bicolano dish made with taro leaves in coconut milk.",
          price: 149.0,
          image_url: "/images/laing.png",
          category: "laing",
          is_featured: true,
          is_bestseller: false,
          stock_quantity: 100,
        },
        {
          name: "Spanish Bangus",
          description: "Premium milkfish marinated in Spanish-style sauce, perfect for any occasion.",
          price: 189.0,
          image_url: "/images/bangusspanish.png",
          category: "bangus",
          is_featured: true,
          is_bestseller: true,
          stock_quantity: 100,
        },
        {
          name: "Chili Garlic",
          description: "Homemade chili garlic sauce, perfect for adding heat to any dish.",
          price: 159.0,
          image_url: "/images/chiligarlic.png",
          category: "chili",
          is_featured: true,
          is_bestseller: false,
          stock_quantity: 100,
        },
      ])

      if (insertError) {
        console.error("Error inserting sample products:", insertError)
        return NextResponse.json({ success: false, error: insertError.message }, { status: 500 })
      }

      return NextResponse.json({ success: true, message: "Products table created and sample data inserted" })
    }

    return NextResponse.json({ success: true, message: "Products table already exists" })
  } catch (error) {
    console.error("Error setting up products table:", error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
