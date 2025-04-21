import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

export async function GET(request: Request) {
  console.log("✅ GET endpoint hit")

  const { searchParams } = new URL(request.url)
  const mood = searchParams.get("mood") || "happy"
  console.log("🧠 Mood received:", mood)

  const prompt = `
    You are a book recommendation system. Based on the user's mood "${mood}", 
    suggest 4 books that would be appropriate for that mood , make sure evrey time give diffrent book if user select same mood again and again. 

    For each book, provide:
    - A unique ID (use a simple number like 1, 2, 3, 4)
    - Title
    - Author
    - A brief description
    - Genre

    Format your response as a valid JSON array of book objects with the fields: id, title, author, description, and genre.
    Do not include any explanations or text outside of the JSON array.
  `

  try {
    console.log("🤖 Calling generateText...")

    const { text } = await generateText({
      model: groq("llama3-70b-8192"),
      prompt,
      temperature: 0.7,
      maxTokens: 1000,
    })

    console.log("📦 AI Response text:", text)

    const books = JSON.parse(text)
    console.log("✅ Parsed books:", books)

    return Response.json({ books })
  } catch (error) {
    console.error("❌ Error generating recommendations:", error)

    const fallbackBooks = getMockBooks(mood)
    return Response.json(
      {
        error: "Failed to generate recommendations",
        books: fallbackBooks,
      },
      { status: 500 }
    )
  }
}

// Fallback mock data
function getMockBooks(mood: string) {
  const moodBooks: Record<string, any[]> = {
    Curious: [
      {
        id: "1",
        title: "The Happiness Project",
        author: "Gretchen Rubin",
        description: "A memoir about a year spent testing the wisdom of the ages to find happiness.",
        genre: "Self-help",
      }
     
    ],
    // (Add rest of your moods here as needed)
  }

  return moodBooks[mood] || moodBooks["happy"]
}
