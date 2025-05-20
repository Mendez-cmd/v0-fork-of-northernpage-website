import { createClient } from "@/lib/supabase/server"
import { ProductForm } from "@/components/admin/product-form"
import { notFound } from "next/navigation"

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  // Fetch product
  const { data: product, error } = await supabase.from("products").select("*").eq("id", params.id).single()

  if (error || !product) {
    notFound()
  }

  // Fetch unique categories
  const { data: categories } = await supabase.from("products").select("category").order("category")

  const uniqueCategories = categories ? [...new Set(categories.map((item) => item.category).filter(Boolean))] : []

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Edit Product</h1>
      <ProductForm product={product} categories={uniqueCategories} />
    </div>
  )
}
