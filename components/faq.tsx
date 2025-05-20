"use client"

import { useState } from "react"
import { Plus, Minus } from "lucide-react"

interface FaqItem {
  question: string
  answer: string
}

const faqItems: FaqItem[] = [
  {
    question: "How can I track my order?",
    answer:
      'You can track your order by logging into your account and visiting the "My Orders" section. Alternatively, you can use the tracking number provided in your order confirmation email.',
  },
  {
    question: "What are your delivery areas?",
    answer:
      "We currently deliver to all areas within Metro Manila. For areas outside Metro Manila, please contact our customer service for availability and additional delivery fees.",
  },
  {
    question: "How do I return or exchange a product?",
    answer:
      "If you're not satisfied with your purchase, you can return or exchange it within 7 days of delivery. Please contact our customer service team to initiate the return or exchange process.",
  },
  {
    question: "Do you offer wholesale or bulk orders?",
    answer:
      "Yes, we offer wholesale and bulk orders for businesses and events. Please contact our sales team at sales@northernchefs.com for more information and special pricing.",
  },
  {
    question: "How can I become a reseller?",
    answer:
      "We welcome resellers to join our network. Please send your business details and proposal to partnerships@northernchefs.com, and our team will get back to you with more information.",
  },
]

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto">
          {faqItems.map((item, index) => (
            <div key={index} className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
              <div
                className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer"
                onClick={() => toggleFaq(index)}
              >
                <h3 className="text-lg font-semibold">{item.question}</h3>
                <span className="text-gold">
                  {openIndex === index ? <Minus className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                </span>
              </div>
              <div
                className={`p-4 bg-white transition-all duration-300 ease-in-out ${
                  openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0 hidden"
                }`}
              >
                <p className="text-gray-600">{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
