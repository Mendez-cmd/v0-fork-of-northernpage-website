import { ShoppingCart, CreditCard, Truck, Utensils } from "lucide-react"

export function OrderProcess() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="h-8 w-8 text-black" />
            </div>
            <h3 className="text-xl font-bold mb-2">Add to Cart</h3>
            <p className="text-gray-600">Select your favorite products and add them to your cart</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="h-8 w-8 text-black" />
            </div>
            <h3 className="text-xl font-bold mb-2">Checkout</h3>
            <p className="text-gray-600">Provide your delivery details and payment information</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck className="h-8 w-8 text-black" />
            </div>
            <h3 className="text-xl font-bold mb-2">Delivery</h3>
            <p className="text-gray-600">We'll deliver your order fresh to your doorstep</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center mx-auto mb-4">
              <Utensils className="h-8 w-8 text-black" />
            </div>
            <h3 className="text-xl font-bold mb-2">Enjoy</h3>
            <p className="text-gray-600">Enjoy our delicious homemade products with your family</p>
          </div>
        </div>
      </div>
    </section>
  )
}
