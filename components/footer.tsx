import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Twitter, Phone, MapPin, Mail, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex space-x-4">
              <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <Button variant="ghost" size="icon" className="text-white hover:text-gold">
                  <Facebook className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Button variant="ghost" size="icon" className="text-white hover:text-gold">
                  <Instagram className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <Button variant="ghost" size="icon" className="text-white hover:text-gold">
                  <Twitter className="h-5 w-5" />
                </Button>
              </Link>
            </div>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gold" />
                <span>0-123-4567-8900</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gold" />
                <span>BLK Try Lot Try South, Caloocan</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gold" />
                <span>info@northernchefs.com</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Write your Experience!</h3>
            <form className="space-y-4">
              <Input
                type="text"
                placeholder="Write your feedback..."
                className="bg-gray-800 border-gray-700 text-white"
              />
              <h3 className="text-xl font-semibold">Rate your Experience!</h3>
              <div className="flex space-x-1 text-gold">
                <span>⭐</span>
                <span>⭐</span>
                <span>⭐</span>
                <span>⭐</span>
                <span>⭐</span>
              </div>
              <Button className="bg-gold hover:bg-amber-500 text-black">Submit Feedback</Button>
            </form>
          </div>

          <div className="flex flex-col items-center space-y-4">
            <Image src="/images/Logo1.png" alt="Chef Gabriel's Logo" width={150} height={150} className="h-auto" />
            <Image src="/images/Logo2.png" alt="Northern Chefs Logo" width={200} height={80} className="h-auto" />
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">Navigate</h3>
              <ul className="space-y-1">
                <li>
                  <Link href="/" className="hover:text-gold transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="hover:text-gold transition-colors">
                    Products
                  </Link>
                </li>
                <li>
                  <Link href="/order" className="hover:text-gold transition-colors">
                    Order
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-gold transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Product</h3>
              <ul className="space-y-1">
                <li>
                  <Link href="/products?category=chicken-pastel" className="hover:text-gold transition-colors">
                    Chicken Pastil
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=laing" className="hover:text-gold transition-colors">
                    Laing
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=bangus" className="hover:text-gold transition-colors">
                    Spanish Bangus
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=chili" className="hover:text-gold transition-colors">
                    Chili Garlic
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-4 border-t border-gray-800 text-center">
          <div className="mb-4">
            <h3 className="text-xl font-semibold mb-2">Newsletter</h3>
            <p className="text-gray-400 mb-4">Subscribe to get special offers and updates</p>
            <form className="flex max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Your email address"
                className="bg-gray-800 border-gray-700 text-white rounded-r-none"
                required
              />
              <Button className="bg-gold hover:bg-amber-500 text-black rounded-l-none">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>

          <p className="text-gray-400">Copyright © {currentYear} Northern Chefs. All Rights Reserved.</p>
          <div className="flex justify-center space-x-4 mt-2">
            <Link href="/privacy" className="text-gray-400 hover:text-gold transition-colors">
              Privacy Policy
            </Link>
            <span className="text-gray-600">|</span>
            <Link href="/terms" className="text-gray-400 hover:text-gold transition-colors">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
