import { ProductForm } from "@/components/admin/product-form"

export default function NewProductPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Add New Product</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <ProductForm />
      </div>
    </div>
  )
}
