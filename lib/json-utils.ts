export function cleanJsonResponse(text: string): string {
  let cleaned = text.trim()

  // Supprimer les backticks markdown
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.replace(/^```json\s*/, "").replace(/\s*```$/, "")
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```\s*/, "").replace(/\s*```$/, "")
  }

  // Supprimer les espaces en début et fin
  cleaned = cleaned.trim()

  // Si le texte commence par du texte avant le JSON, essayer d'extraire le JSON
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/)
  if (jsonMatch) {
    cleaned = jsonMatch[0]
  }

  return cleaned
}

export function parseJsonSafely<T>(text: string): T | null {
  try {
    const cleaned = cleanJsonResponse(text)
    return JSON.parse(cleaned) as T
  } catch (error) {
    console.error("Erreur de parsing JSON:", error)
    console.error("Texte original:", text)
    return null
  }
}
