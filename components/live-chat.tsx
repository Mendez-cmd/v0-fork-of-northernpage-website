"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle, X, Send, Minimize2, Maximize2, User, Bot } from "lucide-react"

interface Message {
  id: string
  text: string
  sender: "user" | "support"
  timestamp: Date
}

export function LiveChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [newMessage, setNewMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! How can I help you today?",
      sender: "support",
      timestamp: new Date(),
    },
  ])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = () => {
    if (!newMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setNewMessage("")

    // Simulate support response
    setTimeout(() => {
      const responses = [
        "Thank you for your message! Our team will get back to you shortly.",
        "I understand your concern. Let me check that for you.",
        "That's a great question! The shipping usually takes 3-5 business days.",
        "I'd be happy to help you with your order.",
        "We have several payment options available including credit cards and PayPal.",
      ]
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]

      const supportMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        sender: "support",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, supportMessage])
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      sendMessage()
    }
  }

  const toggleChat = () => {
    setIsOpen(!isOpen)
    setIsMinimized(false)
  }

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized)
  }

  if (!isOpen) {
    return (
      <Button
        onClick={toggleChat}
        className="fixed bottom-4 right-4 rounded-full h-12 w-12 shadow-lg flex items-center justify-center"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className={`w-80 shadow-lg transition-all duration-300 ${isMinimized ? "h-14" : "h-96"}`}>
        <CardHeader className="p-3 border-b flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center">
            <MessageCircle className="h-4 w-4 mr-2" />
            Customer Support
          </CardTitle>
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={toggleMinimize}>
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={toggleChat}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        {!isMinimized && (
          <>
            <CardContent className="p-0 flex flex-col h-80">
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] p-2 rounded-lg ${
                        message.sender === "user" ? "bg-gold text-black" : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <div className="flex items-center gap-1 mb-1">
                        {message.sender === "user" ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                        <span className="text-xs opacity-70">{message.sender === "user" ? "You" : "Support"}</span>
                      </div>
                      <p className="text-sm">{message.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div ref={messagesEndRef} />
            </CardContent>
            <CardFooter className="p-3 border-t">
              <div className="flex w-full items-center space-x-2">
                <Input
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                />
                <Button size="icon" onClick={sendMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  )
}
