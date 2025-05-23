"use client"

import type React from "react"

import Link from "next/link"
import Image from "next/image"
import { Facebook, Phone, MapPin, Mail, Clock, Send, ChevronUp, ChevronDown, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/hooks/use-auth"
import { useState, useEffect } from "react"

// Custom TikTok Icon Component
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43V7.56a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.05z" />
  </svg>
)

// Custom Shopee Icon Component
const ShopeeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.5 7.5h-21c-.828 0-1.5.672-1.5 1.5v12c0 .828.672 1.5 1.5 1.5h21c.828 0 1.5-.672 1.5-1.5V9c0-.828-.672-1.5-1.5-1.5zM12 3c1.657 0 3 1.343 3 3s-1.343 3-3 3-3-1.343-3-3 1.343-3 3-3zm-6 6h12l-6 6-6-6z" />
  </svg>
)

interface CollapsibleSectionProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}

const CollapsibleSection = ({ title, children, defaultOpen = false }: CollapsibleSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-gray-800 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-5 text-left hover:text-gold transition-colors duration-200"
        aria-expanded={isOpen}
      >
        <h3 className="text-lg font-semibold">{title}</h3>
        <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-96 pb-5" : "max-h-0"}`}
      >
        {children}
      </div>
    </div>
  )
}

export function Footer() {
  const { isAdmin } = useAuth()
  const currentYear = new Date().getFullYear()
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [scrollToTopVisible, setScrollToTopVisible] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [newsletterEmail, setNewsletterEmail] = useState("")
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false)

  // Intersection Observer for footer visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    const footerElement = document.getElementById("main-footer")
    if (footerElement) {
      observer.observe(footerElement)
    }

    return () => {
      if (footerElement) {
        observer.unobserve(footerElement)
      }
    }
  }, [])

  // Show scroll to top button when user scrolls down
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setScrollToTopVisible(true)
      } else {
        setScrollToTopVisible(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Handle feedback submission
  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFeedbackSubmitted(true)
    setTimeout(() => {
      setFeedbackSubmitted(false)
      setRating(0)
      const form = e.target as HTMLFormElement
      form.reset()
    }, 3000)
  }

  // Handle newsletter submission
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setNewsletterSubmitted(true)
    setTimeout(() => {
      setNewsletterSubmitted(false)
      setNewsletterEmail("")
    }, 3000)
  }

  // Don't show footer for admin users
  if (isAdmin) {
    return null
  }

  const socialLinks = [
    {
      href: "https://www.facebook.com/profile.php?id=61564084831551",
      icon: Facebook,
      label: "Facebook",
      color: "hover:bg-blue-600",
    },
    {
      href: "https://shopee.ph/north3rnchefs?uls_trackid=52pchlg20099&utm_campaign=-&utm_content=product&utm_medium=affiliates&utm_source=an_13331440115&utm_term=d2s2q28vmowu",
      icon: ShopeeIcon,
      label: "Shopee",
      color: "hover:bg-orange-600",
    },
    {
      href: "https://vt.tiktok.com/ZShWabnEo/?page=TikTokShop",
      icon: TikTokIcon,
      label: "TikTok",
      color: "hover:bg-pink-600",
    },
  ]

  const contactInfo = [
    { icon: Phone, text: "09773962388", href: "tel:09773962388", label: "Call us" },
    { icon: Mail, text: "north3rnchefs@gmail.com", href: "mailto:north3rnchefs@gmail.com", label: "Email us" },
    { icon: MapPin, text: "P3R6+JXX, Everlasting, Lungsod Quezon, Kalakhang Maynila", href: "#", label: "Visit us" },
    { icon: Clock, text: "7AM-8PM Daily", href: "#", label: "Business hours" },
  ]

  const navigationLinks = [
    { href: "/", text: "Home" },
    { href: "/products", text: "Products" },
    { href: "/order", text: "Order" },
    { href: "/contact", text: "Contact" },
  ]

  const productLinks = [
    { href: "/products?category=chicken-pastel", text: "Chicken Pastil" },
    { href: "/products?category=laing", text: "Laing" },
    { href: "/products?category=bangus", text: "Spanish Bangus" },
    { href: "/products?category=chili", text: "Chili Garlic" },
  ]

  return (
    <footer
      id="main-footer"
      className="bg-gradient-to-b from-gray-900 to-black text-white relative overflow-hidden mt-12 pt-12"
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gold/20 via-transparent to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-gold/10 rounded-full blur-2xl"></div>
      </div>

      {/* Scroll to top button */}
      <div
        className={`fixed bottom-20 right-4 md:bottom-8 md:right-8 z-50 transition-all duration-500 ${
          scrollToTopVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-16 opacity-0 scale-75"
        }`}
      >
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="bg-gold text-black p-3 rounded-full shadow-2xl hover:bg-amber-400 hover:scale-110 transition-all duration-300 group"
          aria-label="Scroll to top"
        >
          <ChevronUp className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
        </button>
      </div>

      <div className="container mx-auto px-6 md:px-8 pb-8 relative z-10">
        {/* Hero Section with Logos */}
        <div
          className={`text-center py-8 md:py-12 transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 mb-10">
            <div className="group">
              <Image
                src="/images/ChefGabrielslogo.png"
                alt="Chef Gabriel's Logo"
                width={100}
                height={100}
                className="h-24 w-24 md:h-28 md:w-28 object-contain group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="group">
              <Image
                src="/images/Nothernchefslogo.png"
                alt="Northern Chefs Logo"
                width={200}
                height={80}
                className="h-20 md:h-24 object-contain group-hover:scale-110 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Social Media Links */}
          <div className="flex justify-center gap-6 mb-10">
            {socialLinks.map((social, index) => (
              <Link
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className={`group relative overflow-hidden rounded-full transition-all duration-300 delay-${index * 100}`}
              >
                <div
                  className={`bg-gray-800 ${social.color} p-4 md:p-5 rounded-full transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg`}
                >
                  <social.icon className="h-6 w-6 md:h-7 md:w-7 text-white group-hover:scale-110 transition-transform duration-200" />
                </div>
                <div className="absolute inset-0 bg-white/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"></div>
              </Link>
            ))}
          </div>

          {/* Quick Newsletter Signup */}
          <div className="max-w-md mx-auto px-4">
            {newsletterSubmitted ? (
              <div className="bg-green-800/30 p-5 rounded-lg text-center animate-pulse">
                <p className="text-white font-medium">Thank you for subscribing!</p>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex gap-3">
                <Input
                  type="email"
                  placeholder="Subscribe to our newsletter"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:ring-gold focus:border-gold py-6"
                  required
                />
                <Button
                  type="submit"
                  className="bg-gold hover:bg-amber-500 text-black px-6 hover:scale-105 transition-all duration-300"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* Mobile Collapsible Sections */}
        <div className="block md:hidden space-y-3 px-2 mt-8">
          <CollapsibleSection title="Contact Information" defaultOpen={true}>
            <div className="grid gap-4 px-2">
              {contactInfo.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className={`flex items-center gap-4 p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-all duration-300 ${
                    item.href === "#" ? "cursor-default" : "hover:scale-105"
                  }`}
                  onClick={(e) => item.href === "#" && e.preventDefault()}
                >
                  <div className="bg-gold/20 p-3 rounded-full">
                    <item.icon className="h-5 w-5 text-gold" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-300">{item.label}</p>
                    <p className="text-white font-medium">{item.text}</p>
                  </div>
                </a>
              ))}
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Quick Links">
            <div className="grid grid-cols-2 gap-4 px-2">
              <div>
                <h4 className="text-gold font-medium mb-4">Navigate</h4>
                <ul className="space-y-3">
                  {navigationLinks.map((link, index) => (
                    <li key={index}>
                      <Link
                        href={link.href}
                        className="text-gray-300 hover:text-gold transition-colors duration-200 flex items-center gap-2"
                      >
                        <div className="w-1.5 h-1.5 bg-gold rounded-full"></div>
                        {link.text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-gold font-medium mb-4">Products</h4>
                <ul className="space-y-3">
                  {productLinks.map((link, index) => (
                    <li key={index}>
                      <Link
                        href={link.href}
                        className="text-gray-300 hover:text-gold transition-colors duration-200 flex items-center gap-2"
                      >
                        <div className="w-1.5 h-1.5 bg-gold rounded-full"></div>
                        {link.text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Leave Feedback">
            <div className="px-2">
              {feedbackSubmitted ? (
                <div className="bg-green-800/30 p-5 rounded-lg text-center">
                  <Star className="h-10 w-10 text-gold mx-auto mb-3" />
                  <p className="text-white font-medium">Thank you for your feedback!</p>
                  <p className="text-gray-300 text-sm mt-2">We appreciate your input.</p>
                </div>
              ) : (
                <form onSubmit={handleFeedbackSubmit} className="space-y-5">
                  <Textarea
                    placeholder="Share your experience with us..."
                    className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 resize-none h-24 focus:ring-gold focus:border-gold"
                    required
                  />
                  <div className="text-center">
                    <p className="text-sm text-gray-300 mb-3">Rate your experience:</p>
                    <div className="flex justify-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoveredRating(star)}
                          onMouseLeave={() => setHoveredRating(0)}
                          className="text-2xl focus:outline-none hover:scale-125 transition-all duration-200 p-1"
                          aria-label={`Rate ${star} stars`}
                        >
                          <span
                            className={`${
                              star <= (hoveredRating || rating) ? "text-gold" : "text-gray-600"
                            } transition-colors duration-200`}
                          >
                            ★
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gold hover:bg-amber-500 text-black font-medium hover:scale-105 transition-all duration-300 py-6"
                  >
                    Submit Feedback
                  </Button>
                </form>
              )}
            </div>
          </CollapsibleSection>
        </div>

        {/* Desktop Grid Layout */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-10 py-12 mt-4">
          {/* Contact Information */}
          <div
            className={`space-y-8 transition-all duration-700 delay-100 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <h3 className="text-xl font-bold text-gold border-b border-gold/30 pb-3">Contact Us</h3>
            <div className="space-y-5">
              {contactInfo.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className={`flex items-start gap-4 p-4 rounded-lg hover:bg-gray-800/30 transition-all duration-300 group ${
                    item.href === "#" ? "cursor-default" : "hover:scale-105"
                  }`}
                  onClick={(e) => item.href === "#" && e.preventDefault()}
                >
                  <div className="bg-gold/20 p-3 rounded-full group-hover:bg-gold/30 transition-colors duration-200">
                    <item.icon className="h-5 w-5 text-gold" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">{item.label}</p>
                    <p className="text-white group-hover:text-gold transition-colors duration-200">{item.text}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div
            className={`space-y-8 transition-all duration-700 delay-200 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <h3 className="text-xl font-bold text-gold border-b border-gold/30 pb-3">Quick Links</h3>
            <div className="grid grid-cols-1 gap-8">
              <div>
                <h4 className="text-gold font-medium mb-4">Navigate</h4>
                <ul className="space-y-3">
                  {navigationLinks.map((link, index) => (
                    <li key={index}>
                      <Link
                        href={link.href}
                        className="text-gray-300 hover:text-gold transition-all duration-200 flex items-center gap-3 hover:translate-x-1"
                      >
                        <div className="w-1.5 h-1.5 bg-gold rounded-full"></div>
                        {link.text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-gold font-medium mb-4">Products</h4>
                <ul className="space-y-3">
                  {productLinks.map((link, index) => (
                    <li key={index}>
                      <Link
                        href={link.href}
                        className="text-gray-300 hover:text-gold transition-all duration-200 flex items-center gap-3 hover:translate-x-1"
                      >
                        <div className="w-1.5 h-1.5 bg-gold rounded-full"></div>
                        {link.text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div
            className={`space-y-8 transition-all duration-700 delay-300 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <h3 className="text-xl font-bold text-gold border-b border-gold/30 pb-3">Stay Updated</h3>
            <div>
              <p className="text-gray-300 mb-5">Get the latest updates and special offers</p>
              {newsletterSubmitted ? (
                <div className="bg-green-800/30 p-5 rounded-lg text-center">
                  <p className="text-white font-medium">Thank you for subscribing!</p>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                  <Input
                    type="email"
                    placeholder="Your email address"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:ring-gold focus:border-gold py-6"
                    required
                  />
                  <Button
                    type="submit"
                    className="w-full bg-gold hover:bg-amber-500 text-black font-medium hover:scale-105 transition-all duration-300 py-6"
                  >
                    Subscribe
                  </Button>
                </form>
              )}
            </div>
          </div>

          {/* Feedback */}
          <div
            className={`space-y-8 transition-all duration-700 delay-400 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <h3 className="text-xl font-bold text-gold border-b border-gold/30 pb-3">Your Feedback</h3>
            {feedbackSubmitted ? (
              <div className="bg-green-800/30 p-5 rounded-lg text-center">
                <Star className="h-10 w-10 text-gold mx-auto mb-3" />
                <p className="text-white font-medium">Thank you!</p>
                <p className="text-gray-300 text-sm">We appreciate your feedback.</p>
              </div>
            ) : (
              <form onSubmit={handleFeedbackSubmit} className="space-y-5">
                <Textarea
                  placeholder="Share your experience..."
                  className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 resize-none h-24 focus:ring-gold focus:border-gold"
                  required
                />
                <div className="text-center">
                  <p className="text-sm text-gray-300 mb-3">Rate us:</p>
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="text-2xl focus:outline-none hover:scale-125 transition-all duration-200 p-1"
                        aria-label={`Rate ${star} stars`}
                      >
                        <span
                          className={`${
                            star <= (hoveredRating || rating) ? "text-gold" : "text-gray-600"
                          } transition-colors duration-200`}
                        >
                          ★
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gold hover:bg-amber-500 text-black font-medium hover:scale-105 transition-all duration-300 py-6"
                >
                  Submit
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* Footer Bottom */}
        <div
          className={`pt-8 mt-4 border-t border-gray-800 text-center transition-all duration-700 delay-500 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <p className="text-gray-400 text-sm mb-4">© {currentYear} Northern Chefs. All Rights Reserved.</p>
          <div className="flex flex-wrap justify-center gap-6 text-xs pb-4">
            <Link href="/privacy" className="text-gray-400 hover:text-gold transition-colors duration-200">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-gold transition-colors duration-200">
              Terms & Conditions
            </Link>
            <Link href="/shipping-returns" className="text-gray-400 hover:text-gold transition-colors duration-200">
              Shipping & Returns
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
