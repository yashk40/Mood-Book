import type { Metadata } from "next"
import DirectBookChat from "@/components/direct-book-chat"

export const metadata: Metadata = {
  title: "Direct Book Chat | MoodBook",
  description: "Chat about any book and get summaries in your preferred language.",
}

export default function DirectChatPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-12">
      <div className="z-10 w-full max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-transparent bg-clip-text">
          MoodBook Direct Chat
        </h1>
        <p className="text-center mb-8 text-lg">
          Tell me a book name, and I'll summarize it for you in your preferred language!
        </p>
        <DirectBookChat />
      </div>
    </main>
  )
}
