import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

export async function POST(request: Request) {
  const { bookId, language, message, history = [] } = await request.json()

  try {
    // Build the conversation history for context
    let conversationHistory = ""
    if (history.length > 0) {
      conversationHistory = history
        .map((msg: any) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`)
        .join("\n\n")
    }

    const languageName = getLanguageName(language)

    let prompt = ""

    if (message.toLowerCase() === "start reading this book" || !history.length) {
      // Initial request to start reading the book
      prompt = `
        You are an AI book reader assistant that provides content from "${getMockBookTitle(bookId)}" by ${getMockBookAuthor(bookId)}.
        
        The user wants to read this book in ${languageName}.
        
        Provide an introduction to the book and the first part of the content in ${languageName}.
        If the language is not English, first provide a brief introduction in English, then continue in ${languageName}.
        
        Make the content engaging and formatted for easy reading. Include chapter titles if appropriate.
        
        Remember, you are simulating the actual content of the book, so respond as if you are presenting real book content.
      `
    } else {
      // Follow-up requests
      prompt = `
        You are an AI book reader assistant that provides content from "${getMockBookTitle(bookId)}" by ${getMockBookAuthor(bookId)}.
        
        Previous conversation:
        ${conversationHistory}
        
        The user's request is: "${message}"
        
        Respond to their request in ${languageName}. If they want to continue reading, provide the next part of the book.
        If they have questions about the book, answer them based on the book's content.
        If they want to switch to a different part of the book, accommodate their request.
        
        Make the content engaging and formatted for easy reading.
      `
    }

    const { text } = await generateText({
      model: groq("llama3-70b-8192"),
      prompt,
      temperature: 0.7,
      maxTokens: 1000,
    })

    return Response.json({ response: text })
  } catch (error) {
    console.error("Error generating chat response:", error)
    return Response.json(
      {
        response: `I apologize, but I encountered an error while trying to process your request. Please try again.`,
      },
      { status: 500 },
    )
  }
}

function getLanguageName(code: string): string {
  const languages: Record<string, string> = {
    en: "English",
    hi: "Hindi",
    es: "Spanish",
    fr: "French",
    de: "German",
  }

  return languages[code] || "English"
}

function getMockBookTitle(id: string): string {
  const bookTitles: Record<string, string> = {
    "1": "The Happiness Project",
    "2": "A Man Called Ove",
    "3": "The Little Book of Hygge",
    "4": "Born a Crime",
  }

  return bookTitles[id] || `Book ${id}`
}

function getMockBookAuthor(id: string): string {
  const authors: Record<string, string> = {
    "1": "Gretchen Rubin",
    "2": "Fredrik Backman",
    "3": "Meik Wiking",
    "4": "Trevor Noah",
  }

  return authors[id] || "Unknown Author"
}
