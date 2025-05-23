import type { Metadata } from "next"
import { ContactForm } from "@/components/contact-form"
import { ContactInfo } from "@/components/contact-info"
import { Faq } from "@/components/faq"
import { ScrollReveal } from "@/components/scroll-reveal"

export const metadata: Metadata = {
  title: "Contact Us - Northern Chefs",
  description: "Get in touch with Northern Chefs. We'd love to hear from you!",
}

export default function ContactPage() {
  return (
    <main>
      {/* Hero Banner */}
      <section className="relative py-20 bg-black text-white">
        <div className="absolute inset-0 bg-black opacity-70 z-0"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg max-w-2xl mx-auto">
            We'd love to hear from you! Reach out with any questions, feedback, or inquiries.
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <ScrollReveal>
        <ContactInfo />
      </ScrollReveal>

      {/* Contact Form Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <ScrollReveal direction="left" delay={0.2}>
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-4">Send Us a Message</h2>
                <p className="text-gray-600 mb-6">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
                <ContactForm />
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={0.4}>
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-4">Find Us</h2>
                <div className="h-80 w-full mb-6 rounded-lg overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241.15537198126705!2d121.06248752426683!3d14.741630297712621!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397b10074aec5e3%3A0x48e041991c3e017a!2sNorth3rn%20Chefs%20Homemade%20Food%20Trading!5e0!3m2!1sen!2sph!4v1746507316484!5m2!1sen!2sph"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3">Connect With Us</h3>
                  <div className="flex space-x-4">
                    <a
                      href="#"
                      className="bg-gray-200 hover:bg-gold hover:text-black transition-colors p-3 rounded-full"
                      aria-label="Facebook"
                    >
                      <i className="fab fa-facebook-f"></i>
                    </a>
                    <a
                      href="#"
                      className="bg-gray-200 hover:bg-gold hover:text-black transition-colors p-3 rounded-full"
                      aria-label="Instagram"
                    >
                      <i className="fab fa-instagram"></i>
                    </a>
                    <a
                      href="#"
                      className="bg-gray-200 hover:bg-gold hover:text-black transition-colors p-3 rounded-full"
                      aria-label="Twitter"
                    >
                      <i className="fab fa-twitter"></i>
                    </a>
                    <a
                      href="#"
                      className="bg-gray-200 hover:bg-gold hover:text-black transition-colors p-3 rounded-full"
                      aria-label="YouTube"
                    >
                      <i className="fab fa-youtube"></i>
                    </a>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <ScrollReveal delay={0.6}>
        <Faq />
      </ScrollReveal>
    </main>
  )
}
