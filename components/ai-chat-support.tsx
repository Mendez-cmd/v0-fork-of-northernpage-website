"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Bot, User, ThumbsUp, ThumbsDown } from "lucide-react"
import { motion } from "framer-motion"
import { useAuth } from "@/hooks/use-auth"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

type Message = {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
  helpful?: boolean | null
}

// Knowledge base for the AI assistant
const knowledgeBase = {
  products: {
    general: [
      "Northern Chefs specializes in authentic Filipino pastil dishes with various flavors and options.",
      "Our products are made with premium ingredients and traditional recipes passed down through generations.",
      "All Northern Chefs products are prepared fresh and packaged carefully to maintain quality and flavor.",
      "We offer a variety of pastil dishes, including chicken, bangus (milkfish), and vegetarian options.",
    ],
    popular: [
      "Our most popular products include Chicken Pastil Original, Chicken Pastil Classic, Chicken Pastil with Salted Egg, and Bangus Spanish.",
      "The Chicken Pastil Original is our bestseller, featuring tender chicken with traditional spices and rice.",
      "Many customers love our Bangus Spanish for its unique flavor profile and premium ingredients.",
    ],
    ingredients: [
      "We use only high-quality ingredients sourced from trusted suppliers.",
      "Our chicken is sourced from local farms that maintain high standards of animal welfare.",
      "We don't use artificial preservatives in our products, ensuring you get the authentic taste.",
      "All our spices are carefully selected to create the perfect flavor profile for each dish.",
    ],
    nutrition: [
      "Nutritional information for each product is available on the product page and packaging.",
      "Our products are high in protein and made with balanced ingredients.",
      "We offer options for different dietary preferences, including some lower-calorie choices.",
    ],
    storage: [
      "Our products should be refrigerated upon delivery and consumed within the date indicated on the packaging.",
      "For best results, reheat our pastil dishes in a microwave for 1-2 minutes or in an oven at 350°F for 5-7 minutes.",
      "You can freeze our products for up to 1 month in an airtight container.",
    ],
    spicy: [
      "We offer different spice levels for our products, from mild to spicy.",
      "Our Spicy Chicken Pastil is perfect for those who enjoy a bit of heat.",
      "If you prefer milder flavors, we recommend our Classic or Original varieties.",
    ],
  },
  ordering: {
    process: [
      "Ordering is simple! Just browse our products, add items to your cart, and proceed to checkout.",
      "You can place orders directly through our website 24/7.",
      "After placing an order, you'll receive an email confirmation with your order details.",
    ],
    payment: [
      "We accept various payment methods including credit/debit cards and online payment services.",
      "All payments are processed securely through our payment gateway.",
      "Your payment information is never stored on our servers.",
    ],
    minimumOrder: [
      "There is a minimum order amount of ₱500 for delivery orders.",
      "There's no minimum order for pickup orders.",
    ],
  },
  delivery: {
    areas: [
      "We currently deliver to most areas in Metro Manila and select provinces.",
      "You can check if we deliver to your area by entering your address at checkout.",
      "We're continuously expanding our delivery areas to serve more customers.",
    ],
    timing: [
      "Standard delivery usually takes 1-3 business days depending on your location.",
      "We offer express delivery options in select areas for same-day or next-day delivery.",
      "Delivery times are between 9 AM and 6 PM, Monday through Saturday.",
    ],
    fees: [
      "Delivery fees start at ₱80 and may vary based on your location and order size.",
      "Free delivery is available for orders above ₱2,000 within Metro Manila.",
      "Additional fees may apply for remote areas or express delivery options.",
    ],
    tracking: [
      "Once your order is dispatched, you'll receive a tracking number via email or SMS.",
      "You can track your delivery status through our website using your order number.",
    ],
  },
  returns: {
    policy: [
      "If you're not satisfied with your order, please contact us within 24 hours of delivery.",
      "We offer replacements or refunds for products that don't meet our quality standards.",
      "To initiate a return or replacement, please contact our customer service with your order details.",
    ],
    quality: [
      "We take product quality very seriously and have strict quality control measures.",
      "All products are inspected before shipping to ensure they meet our standards.",
      "If you receive a product that doesn't meet your expectations, please let us know immediately.",
    ],
  },
  account: {
    creation: [
      "Creating an account is easy! Click on the 'Register' button and fill in your details.",
      "An account allows you to track orders, save delivery addresses, and check your order history.",
      "You can also create an account during checkout if you don't have one already.",
    ],
    benefits: [
      "Account holders get access to exclusive promotions and early access to new products.",
      "You can save multiple delivery addresses for faster checkout.",
      "Track all your orders and reorder your favorites with just a few clicks.",
    ],
    password: [
      "If you forgot your password, click on the 'Forgot Password' link on the login page.",
      "We'll send you an email with instructions to reset your password.",
      "For security reasons, we recommend using a strong, unique password for your account.",
    ],
  },
  contact: {
    methods: [
      "You can reach our customer service team via email at support@northernchefs.com.",
      "Our customer service hotline is available from Monday to Saturday, 9 AM to 6 PM.",
      "You can also send us a message through our Contact page or social media channels.",
    ],
    feedback: [
      "We value your feedback! Please share your experience with our products and service.",
      "You can leave reviews on our product pages or send feedback through our Contact form.",
      "Your suggestions help us improve our products and service for all customers.",
    ],
  },
  fallback: [
    "I'm not sure I understand. Could you please rephrase your question?",
    "I don't have that information right now, but I'd be happy to help you with questions about our products, ordering, or delivery.",
    "That's a great question! Let me connect you with our customer service team who can provide more detailed information.",
    "I'm still learning about that. Could you ask me something about our products, delivery, or ordering process instead?",
  ],
}

// Quick reply suggestions based on context
const quickReplies = {
  initial: [
    "What products do you offer?",
    "How does delivery work?",
    "What are your most popular dishes?",
    "Do you have spicy options?",
  ],
  afterProductQuestion: [
    "How do I store the products?",
    "Are there any promotions?",
    "What are the ingredients?",
    "How do I place an order?",
  ],
  afterDeliveryQuestion: [
    "What are the delivery fees?",
    "Do you deliver to my area?",
    "How long does delivery take?",
    "What's your return policy?",
  ],
  afterOrderQuestion: [
    "How do I track my order?",
    "Can I modify my order?",
    "What payment methods do you accept?",
    "What's your return policy?",
  ],
}

export function AIChatSupport() {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [currentSuggestions, setCurrentSuggestions] = useState<string[]>(quickReplies.initial)
  const [conversationContext, setConversationContext] = useState<string>("initial")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const getInitialMessage = () => {
    const userName = user?.user_metadata?.first_name || user?.email?.split("@")[0] || "there"
    return [
      {
        id: "1",
        content: `Hello ${userName}! I'm your AI assistant. How can I help you with Northern Chefs products today?`,
        role: "assistant" as const,
        timestamp: new Date(),
      },
    ]
  }

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    setMessages(getInitialMessage())
  }, [user])

  // Function to analyze user query and find the best response
  const analyzeQuery = (query: string): { response: string; context: string } => {
    const queryLower = query.toLowerCase()

    // Define keywords for different categories
    const keywords = {
      products: [
        "product",
        "dish",
        "pastil",
        "food",
        "menu",
        "offer",
        "chicken",
        "bangus",
        "spicy",
        "flavor",
        "taste",
        "option",
      ],
      popular: ["popular", "best", "bestseller", "recommend", "favorite", "top"],
      ingredients: [
        "ingredient",
        "made",
        "contain",
        "what's in",
        "recipe",
        "halal",
        "vegetarian",
        "vegan",
        "allergen",
        "gluten",
      ],
      nutrition: ["nutrition", "calorie", "protein", "fat", "carb", "healthy", "diet"],
      storage: ["store", "keep", "refrigerate", "freeze", "shelf", "life", "expiry", "expiration", "reheat"],
      spicy: ["spicy", "hot", "mild", "spice", "level", "heat"],
      delivery: ["deliver", "shipping", "ship", "send", "courier", "receive"],
      areas: ["area", "location", "address", "where", "place", "region", "city", "province"],
      timing: ["time", "long", "hour", "day", "fast", "quick", "soon", "when", "schedule"],
      fees: ["fee", "cost", "price", "charge", "free", "peso", "php", "₱"],
      returns: ["return", "refund", "replace", "money back", "not satisfied", "damaged", "wrong", "issue", "problem"],
      account: ["account", "profile", "register", "sign up", "login", "password", "forgot", "reset"],
      contact: ["contact", "reach", "call", "phone", "email", "message", "support", "help", "service"],
    }

    // Check for category matches
    let bestCategory = "fallback"
    let bestSubcategory = ""
    let maxMatches = 0

    // First check for product-related queries
    for (const [category, keywordList] of Object.entries(keywords)) {
      const matches = keywordList.filter((word) => queryLower.includes(word)).length
      if (matches > maxMatches) {
        maxMatches = matches

        // Map the keyword category to knowledge base categories
        if (["products", "popular", "ingredients", "nutrition", "storage", "spicy"].includes(category)) {
          bestCategory = "products"
          bestSubcategory = category === "products" ? "general" : category
        } else if (["delivery", "areas", "timing", "fees"].includes(category)) {
          bestCategory = "delivery"
          bestSubcategory = category === "delivery" ? "areas" : category
        } else if (category === "returns") {
          bestCategory = "returns"
          bestSubcategory = "policy"
        } else if (category === "account") {
          bestCategory = "account"
          bestSubcategory = "creation"
        } else if (category === "contact") {
          bestCategory = "contact"
          bestSubcategory = "methods"
        }
      }
    }

    // Check for ordering-related queries
    const orderKeywords = ["order", "buy", "purchase", "checkout", "cart", "payment", "pay", "process"]
    const orderMatches = orderKeywords.filter((word) => queryLower.includes(word)).length
    if (orderMatches > maxMatches) {
      bestCategory = "ordering"
      bestSubcategory = "process"
      maxMatches = orderMatches

      // Check for payment-specific queries
      const paymentKeywords = ["payment", "pay", "credit", "debit", "card", "cash", "gcash", "online"]
      const paymentMatches = paymentKeywords.filter((word) => queryLower.includes(word)).length
      if (paymentMatches > 0) {
        bestSubcategory = "payment"
      }
    }

    // If no good matches, use fallback
    if (maxMatches === 0) {
      return {
        response: knowledgeBase.fallback[Math.floor(Math.random() * knowledgeBase.fallback.length)],
        context: "initial",
      }
    }

    // Get responses from the matched category
    const responses =
      knowledgeBase[bestCategory as keyof typeof knowledgeBase][bestSubcategory as any] || knowledgeBase.fallback
    const response = responses[Math.floor(Math.random() * responses.length)]

    // Determine new context for quick replies
    let newContext = "initial"
    if (bestCategory === "products") newContext = "afterProductQuestion"
    else if (bestCategory === "delivery") newContext = "afterDeliveryQuestion"
    else if (bestCategory === "ordering") newContext = "afterOrderQuestion"

    return { response, context: newContext }
  }

  const handleSendMessage = async (e: React.FormEvent | string) => {
    e?.preventDefault?.()

    const messageText = typeof e === "string" ? e : input
    if (!messageText.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageText,
      role: "user",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Analyze query and get appropriate response
    setTimeout(() => {
      const { response, context } = analyzeQuery(messageText)

      const aiMessage: Message = {
        id: Date.now().toString(),
        content: response,
        role: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
      setIsLoading(false)
      setConversationContext(context)
      setCurrentSuggestions(quickReplies[context as keyof typeof quickReplies])
    }, 1500)
  }

  // Handle quick reply click
  const handleQuickReplyClick = (reply: string) => {
    handleSendMessage(reply)
  }

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user) return "U"

    const firstName = user.user_metadata?.first_name || ""
    const lastName = user.user_metadata?.last_name || ""

    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase()
    } else if (firstName) {
      return firstName[0].toUpperCase()
    } else if (user.email) {
      return user.email[0].toUpperCase()
    }

    return "U"
  }

  // Handle feedback on AI responses
  const handleFeedback = (messageId: string, helpful: boolean) => {
    setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, helpful } : msg)))
  }

  return (
    <div className="flex flex-col h-[600px] max-h-[80vh] bg-white rounded-xl shadow-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-4 text-white">
        <h2 className="text-xl font-bold flex items-center">
          <Bot className="mr-2 h-5 w-5" />
          Northern Chefs AI Assistant
        </h2>
        <p className="text-sm opacity-90">Ask anything about our products, orders, or delivery</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`mb-4 flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {message.role === "assistant" && (
              <Avatar className="h-8 w-8 mr-2 mt-1 border-2 border-white shadow-sm">
                <AvatarImage src="/images/Nothernchefslogo.png" alt="AI Assistant" />
                <AvatarFallback className="bg-amber-100 text-amber-800">NC</AvatarFallback>
              </Avatar>
            )}
            <div
              className={`max-w-[75%] rounded-lg p-3 ${
                message.role === "user"
                  ? "bg-amber-500 text-white rounded-tr-none"
                  : "bg-white border border-gray-200 shadow-sm rounded-tl-none"
              }`}
            >
              <div className="flex items-center mb-1">
                {message.role === "assistant" ? (
                  <Bot className="h-4 w-4 mr-1 text-amber-500" />
                ) : (
                  <User className="h-4 w-4 mr-1 text-white" />
                )}
                <span className={`text-xs ${message.role === "user" ? "text-white/80" : "text-gray-500"}`}>
                  {message.role === "user"
                    ? user?.user_metadata?.first_name || user?.email?.split("@")[0] || "You"
                    : "AI Assistant"}{" "}
                  • {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
              <p className={`text-sm ${message.role === "user" ? "text-white" : "text-gray-800"}`}>{message.content}</p>

              {/* Feedback buttons for AI responses */}
              {message.role === "assistant" && message.id !== "1" && (
                <div className="flex items-center justify-end mt-2 space-x-2">
                  <span className="text-xs text-gray-400">Was this helpful?</span>
                  <button
                    onClick={() => handleFeedback(message.id, true)}
                    className={`p-1 rounded-full ${message.helpful === true ? "bg-green-100 text-green-600" : "text-gray-400 hover:text-green-600"}`}
                    aria-label="Helpful"
                  >
                    <ThumbsUp className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => handleFeedback(message.id, false)}
                    className={`p-1 rounded-full ${message.helpful === false ? "bg-red-100 text-red-600" : "text-gray-400 hover:text-red-600"}`}
                    aria-label="Not helpful"
                  >
                    <ThumbsDown className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
            {message.role === "user" && (
              <Avatar className="h-8 w-8 ml-2 mt-1 border-2 border-white shadow-sm">
                {user?.user_metadata?.avatar_url || user?.user_metadata?.picture ? (
                  <AvatarImage src={user.user_metadata.avatar_url || user.user_metadata.picture} alt="User" />
                ) : (
                  <AvatarFallback className="bg-amber-500 text-white">{getUserInitials()}</AvatarFallback>
                )}
              </Avatar>
            )}
          </motion.div>
        ))}
        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start mb-4">
            <Avatar className="h-8 w-8 mr-2 mt-1 border-2 border-white shadow-sm">
              <AvatarImage src="/images/Nothernchefslogo.png" alt="AI Assistant" />
              <AvatarFallback className="bg-amber-100 text-amber-800">NC</AvatarFallback>
            </Avatar>
            <div className="bg-white border border-gray-200 rounded-lg p-3 rounded-tl-none shadow-sm">
              <div className="flex items-center">
                <Bot className="h-4 w-4 mr-1 text-amber-500" />
                <span className="text-xs text-gray-500">AI Assistant</span>
              </div>
              <div className="mt-1 flex items-center">
                <div className="flex space-x-1">
                  <div
                    className="w-2 h-2 rounded-full bg-amber-500 animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full bg-amber-500 animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full bg-amber-500 animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick replies */}
      <div className="px-3 py-2 bg-gray-50 border-t border-gray-100 flex flex-wrap gap-2">
        {currentSuggestions.map((suggestion, index) => (
          <Badge
            key={index}
            variant="outline"
            className="bg-white hover:bg-amber-50 cursor-pointer transition-colors border-amber-200 text-amber-800 hover:text-amber-900"
            onClick={() => handleQuickReplyClick(suggestion)}
          >
            {suggestion}
          </Badge>
        ))}
      </div>

      <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200 bg-white">
        <div className="flex items-center">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 focus-visible:ring-amber-500"
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="icon"
            className="ml-2 bg-amber-500 hover:bg-amber-600"
            disabled={isLoading || !input.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-1 text-center">Free AI support powered by Northern Chefs</p>
      </form>
    </div>
  )
}
