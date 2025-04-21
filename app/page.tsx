import MoodSelector from "@/components/mood-selector"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "MoodBook | Find Books Based on Your Mood",
  description: "Discover books that match your current emotional state and read them in your preferred language.",
}

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-violet-50 via-pink-50 to-yellow-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-800 p-4 md:p-12">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-extrabold mb-4 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 text-transparent bg-clip-text">
            MoodBook
          </h1>
          <div className="relative">
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-24 h-24 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full opacity-20 blur-xl"></div>
            <p className="text-xl relative z-10">
              Discover books that match your vibe and read them in your language of choice!
            </p>
          </div>
        </div>
        <MoodSelector />
      </div>
    </main>
  )
}
