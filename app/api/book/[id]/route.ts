export async function GET(request: Request, { params }: { params: { id: string } }) {
  const bookId = params.id

  // In a real application, you would fetch this from a database
  // For now, we'll return mock data
  const book = {
    id: bookId,
    title: getMockBookTitle(bookId),
    author: getMockBookAuthor(bookId),
  }

  return Response.json({ book })
}

function getMockBookTitle(id: string): string {
  const titles: Record<string, string> = {
    "1": "The Happiness Project",
    "2": "A Man Called Ove",
    "3": "The Little Book of Hygge",
    "4": "Born a Crime",
  }

  return titles[id] || `Book ${id}`
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
