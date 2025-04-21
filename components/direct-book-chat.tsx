"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, BookOpen, User, Languages } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion, AnimatePresence } from "framer-motion"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

const languages = [
  { id: "en", name: "English" },
  { id: "hi", name: "Hindi" },
  { id: "es", name: "Spanish" },
  { id: "fr", name: "French" },
  { id: "de", name: "German" },
]

export default function DirectBookChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [language, setLanguage] = useState("en")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Initial welcome message
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content:
          "👋 Hey there! I'm your book buddy. Tell me any book name, and I'll give you a summary. What would you like to know about today?",
      },
    ])
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim() || loading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      const response = await fetch(`/api/direct-chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
          language,
          history: messages,
        }),
      })

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error sending message:", error)

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Oops! I hit a snag. Can you try again?",
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[70vh] bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 rounded-xl p-4 shadow-xl">
      <div className="flex justify-end mb-4">
        <div className="flex items-center bg-white dark:bg-gray-800 rounded-full px-3 py-1 shadow-md">
          <Languages className="mr-2 h-4 w-4 text-purple-500" />
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-[140px] border-none focus:ring-0">
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.id} value={lang.id}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <ScrollArea className="flex-1 pr-4 mb-4">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} mb-4`}
            >
              <div
                className={`flex items-start gap-3 max-w-[85%] ${message.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <Avatar
                  className={`h-10 w-10 ${message.role === "user" ? "bg-purple-500" : "bg-gradient-to-r from-pink-500 to-orange-500"}`}
                >
                  {message.role === "assistant" ? (
                    <>
                      <AvatarImage src="/placeholder.svg?height=40&width=40" />
                      <AvatarFallback>
                        <BookOpen className="h-5 w-5 text-white" />
                      </AvatarFallback>
                    </>
                  ) : (
                    <>
                      <AvatarImage src="/placeholder.svg?height=40&width=40" />
                      <AvatarFallback>
                        <User className="h-5 w-5 text-white" />
                      </AvatarFallback>
                    </>
                  )}
                </Avatar>
                <div
                  className={`rounded-2xl px-5 py-3 ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                      : "bg-white dark:bg-gray-800 shadow-md"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </AnimatePresence>
      </ScrollArea>

      <form onSubmit={handleSendMessage} className="flex gap-3">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about a book or request a summary..."
          className="flex-1 min-h-[60px] rounded-xl border-2 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
          disabled={loading}
        />
        <Button
          type="submit"
          disabled={loading || !input.trim()}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-xl h-auto"
        >
          {loading ? (
            <div className="animate-pulse">
              <div className="flex items-center space-x-1">
                <div className="h-2 w-2 rounded-full bg-white"></div>
                <div className="h-2 w-2 rounded-full bg-white"></div>
                <div className="h-2 w-2 rounded-full bg-white"></div>
              </div>
            </div>
          ) : (
            <Send className="h-5 w-5" />
          )}
          <span className="sr-only">Send</span>
        </Button>
      </form>
    </div>
  )
}
