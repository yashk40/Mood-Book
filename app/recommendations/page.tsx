import type { Metadata } from "next"
import BookRecommendations from "@/components/book-recommendations"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Home } from "lucide-react"

export const metadata: Metadata = {
  title: "Book Recommendations | MoodBook",
  description: "Discover books that match your current emotional state.",
}

export default function RecommendationsPage({
  searchParams,
}: {
  searchParams: { mood?: string }
}) {
  const mood = searchParams.mood || "happy"

  return (
    <main className="min-h-screen bg-gradient-to-br from-violet-50 via-pink-50 to-yellow-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-800 p-4 md:p-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link href="/">
            <Button
              variant="outline"
              className="bg-white dark:bg-gray-800 border-purple-200 dark:border-gray-700 hover:bg-purple-50 dark:hover:bg-gray-700"
            >
              <Home className="mr-2 h-4 w-4 text-purple-500" /> Home
            </Button>
          </Link>
          <Link href="/direct-chat">
            <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white">
              Skip to Direct Chat
            </Button>
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold mb-2 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 text-transparent bg-clip-text">
            Book Recommendations
          </h1>
          <div className="inline-block bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-md">
            <p className="text-xl">
              Based on your <span className="font-bold text-purple-600 dark:text-purple-400">{mood}</span> mood
            </p>
          </div>
        </div>

        <BookRecommendations mood={mood} />
      </div>
    </main>
  )
}
