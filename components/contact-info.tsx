import { MapPin, Phone, Mail, Clock } from "lucide-react"

export function ContactInfo() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-8 w-8 text-black" />
            </div>
            <h3 className="text-xl font-bold mb-2">Visit Us</h3>
            <p className="text-gray-600">
              P3R6+JXX, Everlasting, <br /> Lungsod Quezon, Kalakhang Maynila
            </p>
            <p className="text-gray-600">Metro Manila, Philippines</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="h-8 w-8 text-black" />
            </div>
            <h3 className="text-xl font-bold mb-2">Call Us</h3>
            <p className="text-gray-600">Phone: 0-123-4567-8900</p>
            <p className="text-gray-600">Hotline: 1-800-NORTHERN</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8 text-black" />
            </div>
            <h3 className="text-xl font-bold mb-2">Email Us</h3>
            <p className="text-gray-600">info@northernchefs.com</p>
            <p className="text-gray-600">support@northernchefs.com</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="h-8 w-8 text-black" />
            </div>
            <h3 className="text-xl font-bold mb-2">Business Hours</h3>
            <p className="text-gray-600">Monday - Saturday: 9AM - 7PM</p>
            <p className="text-gray-600">Sunday: 10AM - 5PM</p>
          </div>
        </div>
      </div>
    </section>
  )
}
