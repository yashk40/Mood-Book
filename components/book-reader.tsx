"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, Languages } from "lucide-react"
import { useRouter } from "next/navigation"
import BookChat from "@/components/book-chat"
import { motion } from "framer-motion"

interface Book {
  id: string
  title: string
  author: string
}

const languages = [
  { id: "en", name: "English" },
  { id: "hi", name: "Hindi" },
  { id: "es", name: "Spanish" },
  { id: "fr", name: "French" },
  { id: "de", name: "German" },
]

export default function BookReader({ bookId, mood }: { bookId: string; mood: string }) {
  const [book, setBook] = useState<Book | null>(null)
  const [language, setLanguage] = useState("en")
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchBookDetails = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/book/${bookId}`)
        const data = await response.json()
        setBook(data.book)
      } catch (error) {
        console.error("Error fetching book details:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBookDetails()
  }, [bookId])

  const handleBack = () => {
    router.push(`/recommendations?mood=${mood}`)
  }

  if (loading) {
    return (
      <Card className="bg-white dark:bg-gray-800 border-0 shadow-xl">
        <CardHeader>
          <Skeleton className="h-8 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[90vh] w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={handleBack}
          className="bg-white dark:bg-gray-800 border-purple-200 dark:border-gray-700 hover:bg-purple-50 dark:hover:bg-gray-700"
        >
          <ArrowLeft className="mr-2 h-4 w-4 text-purple-500" /> Back to Recommendations
        </Button>
        {/* <div className="flex items-center bg-white dark:bg-gray-800 rounded-full px-2 py-1 shadow-md">
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
        </div> */}
      </div>

      <Card className="bg-white dark:bg-gray-800 border-0 shadow-xl overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 opacity-10 rounded-bl-full"></div>
        <CardHeader className="border-b border-gray-100 dark:border-gray-700">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
            {book?.title}
          </CardTitle>
          <p className="text-gray-500 dark:text-gray-400">by {book?.author}</p>
        </CardHeader>
        <CardContent className="p-0">
          <BookChat bookId={bookId} language={language} />
        </CardContent>
      </Card>
    </motion.div>
  )
}
