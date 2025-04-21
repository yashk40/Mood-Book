"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useRouter } from "next/navigation"
import { BookOpen, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

interface Book {
  id: string
  title: string
  author: string
  description: string
  genre: string
}

export default function BookRecommendations({ mood }: { mood: string }) {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/recommendations?mood=${mood}`)
        const data = await response.json()
        setBooks(data.books)
      } catch (error) {
        console.error("Error fetching recommendations:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendations()
  }, [mood])

  const handleBookSelect = (bookId: string) => {
    router.push(`/book/${bookId}?mood=${mood}`)
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="w-full overflow-hidden">
            <CardHeader>
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-24 w-full" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6" variants={container} initial="hidden" animate="show">
      {books.map((book, index) => (
        <motion.div key={book.id} variants={item}>
          <Card className="w-full overflow-hidden bg-white dark:bg-gray-800 border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 opacity-10 rounded-bl-full"></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
                {book.title}
              </CardTitle>
              <CardDescription className="text-sm">{book.author}</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="line-clamp-4 text-gray-700 dark:text-gray-300">{book.description}</p>
              <div className="mt-3">
                <span className="inline-flex items-center bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 text-purple-800 dark:text-purple-200 rounded-full px-3 py-1 text-sm font-medium">
                  <Sparkles className="h-3 w-3 mr-1" />
                  {book.genre}
                </span>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-lg"
                onClick={() => handleBookSelect(book.id)}
              >
                <BookOpen className="mr-2 h-4 w-4" /> Read This Book
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  )
}
