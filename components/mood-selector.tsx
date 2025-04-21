"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Smile, Frown, Heart, Zap, Coffee, BookOpen, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

const moods = [
  { id: "happy", label: "Happy", icon: Smile, color: "bg-yellow-400 hover:bg-yellow-500 text-black" },
  { id: "sad", label: "Sad", icon: Frown, color: "bg-blue-400 hover:bg-blue-500 text-white" },
  { id: "romantic", label: "Romantic", icon: Heart, color: "bg-pink-400 hover:bg-pink-500 text-white" },
  { id: "motivated", label: "Motivated", icon: Zap, color: "bg-purple-400 hover:bg-purple-500 text-white" },
  { id: "relaxed", label: "Relaxed", icon: Coffee, color: "bg-green-400 hover:bg-green-500 text-white" },
  { id: "curious", label: "Curious", icon: BookOpen, color: "bg-orange-400 hover:bg-orange-500 text-white" },
]

export default function MoodSelector() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const router = useRouter()

  const handleMoodSelect = (moodId: string) => {
    setSelectedMood(moodId)
    router.push(`/recommendations?mood=${moodId}`)
  }

  const handleSkip = () => {
    router.push("/direct-chat")
  }

  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-transparent bg-clip-text">
        How are you feeling today?
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {moods.map((mood, index) => {
          const Icon = mood.icon
          return (
            <motion.div
              key={mood.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card
                className={`cursor-pointer transition-all transform hover:scale-105 hover:shadow-xl ${mood.color} border-2 ${selectedMood === mood.id ? "border-white ring-4 ring-opacity-50 ring-white" : "border-transparent"} rounded-xl overflow-hidden`}
                onClick={() => handleMoodSelect(mood.id)}
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <Icon className="h-12 w-12 mb-2" />
                  <span className="text-lg font-bold">{mood.label}</span>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      <motion.div
        className="mt-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <Button
          onClick={handleSkip}
          variant="outline"
          className="group bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-none hover:from-violet-700 hover:to-indigo-700 font-bold text-lg px-8 py-6 rounded-full"
        >
          <span>Skip & Chat Directly</span>
          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Button>
        <p className="mt-2 text-sm text-gray-500">Just want to talk about a specific book? Skip ahead!</p>
      </motion.div>
    </div>
  )
}
