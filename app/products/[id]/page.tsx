import { getProduct, getProducts } from "@/lib/products"
import { notFound } from "next/navigation"
import Image from "next/image"
import AddToCartButton from "@/components/add-to-cart-button"
import { FadeIn, SlideIn, SlideUp } from "@/components/transition-effects"

export async function generateStaticParams() {
  const products = await getProducts()

  return products.map((product) => ({
    id: product.id.toString(),
  }))
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(Number.parseInt(params.id))

  if (!product) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2">
          <FadeIn>
            <div className="bg-white rounded-lg overflow-hidden shadow-lg">
              <Image
                src={product.image || "/images/comingsoon.png"}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-auto object-cover"
              />
            </div>
          </FadeIn>
        </div>

        <div className="md:w-1/2">
          <SlideIn>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          </SlideIn>

          <SlideIn delay={0.1}>
            <div className="text-2xl font-bold text-gold mb-6">₱{product.price.toFixed(2)}</div>
          </SlideIn>

          <SlideIn delay={0.2}>
            <div className="prose max-w-none mb-8">
              <p>{product.description}</p>
            </div>
          </SlideIn>

          <SlideUp delay={0.3}>
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-2">Product Details:</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Category: {product.category}</li>
                {product.weight && <li>Weight: {product.weight}</li>}
                {product.dimensions && <li>Dimensions: {product.dimensions}</li>}
                {product.ingredients && <li>Ingredients: {product.ingredients}</li>}
              </ul>
            </div>
          </SlideUp>

          <SlideUp delay={0.4}>
            <AddToCartButton product={product} />
          </SlideUp>
        </div>
      </div>
    </div>
  )
}
