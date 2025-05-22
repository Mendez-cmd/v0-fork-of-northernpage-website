import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Truck, RotateCcw, Shield, Clock } from "lucide-react"

export default function ShippingReturnsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Shipping & Returns</h1>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Shipping Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Delivery Areas</h3>
                <p className="text-gray-600">
                  We deliver nationwide across the Philippines. Special rates apply for remote areas.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Shipping Options</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Standard Delivery: 5-7 business days (₱150)</li>
                  <li>• Express Delivery: 2-3 business days (₱300)</li>
                  <li>• Overnight Delivery: 1 business day (₱500)</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Free Shipping</h3>
                <p className="text-gray-600">Enjoy free standard shipping on orders over ₱2,000 within Metro Manila.</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RotateCcw className="h-5 w-5" />
                Returns Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Return Window</h3>
                <p className="text-gray-600">Items can be returned within 30 days of delivery for a full refund.</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Return Conditions</h3>
                <ul className="space-y-1 text-gray-600">
                  <li>• Items must be unopened and unused</li>
                  <li>• Original packaging required</li>
                  <li>• Receipt or order number needed</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Return Process</h3>
                <p className="text-gray-600">
                  Contact our support team to initiate a return. We'll provide a prepaid return label.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Processing Times
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Order Processing</h3>
                <p className="text-gray-600">
                  Orders are processed within 1-2 business days. You'll receive a confirmation email with tracking
                  information.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Holiday Delays</h3>
                <p className="text-gray-600">
                  Please allow additional processing time during holidays and peak seasons.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Packaging & Safety
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Food Safety</h3>
                <p className="text-gray-600">
                  All food items are carefully packaged with proper insulation and ice packs to maintain freshness.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Damaged Items</h3>
                <p className="text-gray-600">
                  If your order arrives damaged, contact us within 24 hours for a replacement or refund.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Customer Service</h3>
                <p className="text-gray-600">Email: support@northernchefs.com</p>
                <p className="text-gray-600">Phone: +63 917 123 4567</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Business Hours</h3>
                <p className="text-gray-600">Monday - Friday: 9AM - 6PM</p>
                <p className="text-gray-600">Saturday: 9AM - 4PM</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Response Time</h3>
                <p className="text-gray-600">We respond to all inquiries within 24 hours during business days.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
