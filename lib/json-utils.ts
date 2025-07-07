/**
 * Utilitaires pour la manipulation et validation de JSON
 */

/**
 * Extrait et valide du JSON à partir d'une chaîne de caractères
 * Gère les cas où le JSON peut être entouré de texte supplémentaire
 */
export function extractValidJSON(text: string): any {
  if (!text || typeof text !== "string") {
    throw new Error("Le texte fourni n'est pas valide")
  }

  // Nettoyer le texte
  const cleanText = text.trim()

  // Essayer de parser directement
  try {
    return JSON.parse(cleanText)
  } catch (error) {
    // Si ça échoue, essayer d'extraire le JSON du texte
    return extractJSONFromText(cleanText)
  }
}

/**
 * Extrait le JSON d'un texte qui peut contenir du contenu supplémentaire
 */
function extractJSONFromText(text: string): any {
  // Chercher les patterns JSON courants
  const jsonPatterns = [
    /\{[\s\S]*\}/, // Objet JSON
    /\[[\s\S]*\]/, // Array JSON
  ]

  for (const pattern of jsonPatterns) {
    const match = text.match(pattern)
    if (match) {
      try {
        return JSON.parse(match[0])
      } catch (error) {
        continue
      }
    }
  }

  // Si aucun pattern ne fonctionne, essayer de nettoyer le texte
  const lines = text.split("\n")
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (line.startsWith("{") || line.startsWith("[")) {
      // Essayer de reconstruire le JSON à partir de cette ligne
      let jsonCandidate = ""
      let braceCount = 0
      let bracketCount = 0

      for (let j = i; j < lines.length; j++) {
        const currentLine = lines[j]
        jsonCandidate += currentLine

        // Compter les accolades et crochets
        for (const char of currentLine) {
          if (char === "{") braceCount++
          if (char === "}") braceCount--
          if (char === "[") bracketCount++
          if (char === "]") bracketCount--
        }

        // Si on a fermé tous les objets/arrays, essayer de parser
        if (braceCount === 0 && bracketCount === 0) {
          try {
            return JSON.parse(jsonCandidate)
          } catch (error) {
            break
          }
        }
      }
    }
  }

  throw new Error("Impossible d'extraire un JSON valide du texte fourni")
}

/**
 * Valide si une chaîne contient du JSON valide
 */
export function isValidJSON(text: string): boolean {
  try {
    extractValidJSON(text)
    return true
  } catch (error) {
    return false
  }
}

/**
 * Nettoie et formate du JSON
 */
export function cleanJSON(obj: any): string {
  return JSON.stringify(obj, null, 2)
}

/**
 * Fusionne deux objets JSON de manière sécurisée
 */
export function mergeJSON(obj1: any, obj2: any): any {
  if (typeof obj1 !== "object" || typeof obj2 !== "object") {
    throw new Error("Les deux paramètres doivent être des objets")
  }

  return { ...obj1, ...obj2 }
}
