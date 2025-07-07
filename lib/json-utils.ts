export function extractValidJSON(text: string): string {
  // Essayer de trouver un bloc de code JSON, y compris sans le "json" spécifié
  const jsonCodeBlockMatch = text.match(/```(json)?\s*([\s\S]+?)\s*```/)
  if (jsonCodeBlockMatch && jsonCodeBlockMatch[2]) {
    const potentialJson = jsonCodeBlockMatch[2].trim()
    try {
      JSON.parse(potentialJson)
      return potentialJson
    } catch (e) {
      // Pas un JSON valide, on continue
    }
  }

  // Essayer de trouver le premier '{' ou '[' et le dernier '}' ou ']'
  const firstBrace = text.indexOf("{")
  const lastBrace = text.lastIndexOf("}")
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    const potentialJson = text.substring(firstBrace, lastBrace + 1)
    try {
      JSON.parse(potentialJson)
      return potentialJson
    } catch (e) {
      // Pas un JSON valide, on continue
    }
  }

  const firstBracket = text.indexOf("[")
  const lastBracket = text.lastIndexOf("]")
  if (firstBracket !== -1 && lastBracket > firstBracket) {
    const potentialJsonArray = text.substring(firstBracket, lastBracket + 1)
    try {
      JSON.parse(potentialJsonArray)
      return potentialJsonArray
    } catch (e) {
      // Pas un JSON valide, on continue
    }
  }

  // Si rien n'est trouvé, retourner la chaîne nettoyée de base
  return text.trim()
}

export function cleanJsonResponse(text: string): string {
  // Cette fonction est maintenant un alias pour extractValidJSON pour la compatibilité
  return extractValidJSON(text)
}

export function parseJsonSafely<T>(text: string): T | null {
  try {
    const jsonString = extractValidJSON(text)
    return JSON.parse(jsonString) as T
  } catch (error) {
    console.error("Erreur de parsing JSON:", error)
    console.error("Texte original:", text)
    return null
  }
}
