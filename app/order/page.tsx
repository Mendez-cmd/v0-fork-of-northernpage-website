import type { Metadata } from "next"
import { OrderProcess } from "@/components/order-process"
import { OrderForm } from "@/components/order-form"

export const metadata: Metadata = {
  title: "Place Your Order - Northern Chefs",
  description: "Order our delicious homemade products for delivery or pickup",
}

export default function OrderPage() {
  return (
    <main>
      {/* Hero Banner */}
      <section className="relative py-20 bg-black text-white">
        <div className="absolute inset-0 bg-black opacity-70 z-0"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Place Your Order</h1>
          <p className="text-lg max-w-2xl mx-auto">Order our delicious homemade products for delivery or pickup</p>
        </div>
      </section>

      {/* Order Process */}
      <OrderProcess />

      {/* Order Form */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <OrderForm />
        </div>
      </section>
    </main>
  )
}
