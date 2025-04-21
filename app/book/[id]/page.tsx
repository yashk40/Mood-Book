import type { Metadata } from "next"
import BookReader from "@/components/book-reader"

export const metadata: Metadata = {
  title: "Reading Book | MoodBook",
  description: "Read your selected book in your preferred language.",
}

export default function BookPage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { mood?: string }
}) {
  const bookId = params.id
  const mood = searchParams.mood || "happy"

  return (
    <main className="min-h-screen bg-gradient-to-br from-violet-50 via-pink-50 to-yellow-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-800 p-4 md:p-12">
      <div className="max-w-4xl mx-auto">
        <BookReader bookId={bookId} mood={mood} />
      </div>
    </main>
  )
}
