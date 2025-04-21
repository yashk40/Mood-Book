import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

export async function POST(request: Request) {
  const { message, language, history = [] } = await request.json()

  try {
    // Build the conversation history for context
    let conversationHistory = ""
    if (history.length > 0) {
      conversationHistory = history
        .map((msg: any) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`)
        .join("\n\n")
    }

    const languageName = getLanguageName(language)

    // Check if the message contains a book title request
    const bookTitleMatch = message.match(/(?:tell me about|summarize|what is|summary of|about)(.*?)(?:$|\?)/i)
    const potentialBookTitle = bookTitleMatch ? bookTitleMatch[1].trim() : message.trim()

    const prompt = `
      You are a fun, energetic book expert assistant named MoodBook. Your personality is playful and enthusiastic.
      
      ${conversationHistory ? `Previous conversation:\n${conversationHistory}\n\n` : ""}
      
      The user's message is: "${message}"
      
      If the user is asking about a specific book (which appears to be "${potentialBookTitle}"), provide:
      1. A brief, engaging introduction to the book
      2. A summary of the plot without spoiling major twists
      3. Information about the author and publication
      4. Why people might enjoy this book
      
      If the user is not asking about a specific book, respond helpfully to their query.
      
      Respond in ${languageName}. If the language is not English, first provide a very brief introduction in English (1 sentence), then continue with the full response in ${languageName}.
      
      Use emojis occasionally to keep the tone fun and engaging. Format your response with clear sections and good spacing for readability.
    `

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
        response: `Oops! 😅 Something went wrong while I was thinking. Can you try asking me again?`,
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
