import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { extractValidJSON } from "@/lib/json-utils"

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt requis" }, { status: 400 })
    }

    console.log("=== API GENERATE-STATEMENT ===")
    console.log("Prompt reçu:", prompt)

    const systemPrompt = `Tu es un expert en écologie qui génère des questions de quiz.

INSTRUCTIONS STRICTES :
1. Génère UNE SEULE question de type vrai/faux
2. Réponds UNIQUEMENT avec un JSON valide
3. Utilise EXACTEMENT cette structure :

{
  "affirmation": "Une affirmation claire et précise",
  "reponse": true ou false,
  "explication": "Explication détaillée de 1-2 phrases",
  "categorie": "Catégorie (Énergie, Transport, Déchets, etc.)",
  "icone": "Un emoji approprié",
  "difficulte": "facile, moyen ou difficile"
}

RÈGLES :
- L'affirmation doit être factuelle et vérifiable
- L'explication doit être éducative
- Utilise des données récentes (2020-2024)
- Varie les sujets écologiques`

    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: systemPrompt,
      prompt: prompt,
      temperature: 0.7,
      maxTokens: 500,
    })

    console.log("Réponse brute de l'IA:", text)

    // Extraire le JSON valide
    const jsonData = extractValidJSON(text)

    if (!jsonData) {
      throw new Error("Impossible d'extraire un JSON valide de la réponse")
    }

    console.log("JSON extrait:", jsonData)

    // Validation des champs requis
    if (!jsonData.affirmation || typeof jsonData.reponse !== "boolean" || !jsonData.explication) {
      throw new Error("JSON invalide - champs manquants")
    }

    // Ajouter des valeurs par défaut si nécessaire
    const result = {
      affirmation: jsonData.affirmation,
      reponse: jsonData.reponse,
      explication: jsonData.explication,
      categorie: jsonData.categorie || "Écologie",
      icone: jsonData.icone || "🌱",
      difficulte: jsonData.difficulte || "moyen",
    }

    console.log("Résultat final:", result)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Erreur dans generate-statement:", error)

    // Retourner une question de fallback en cas d'erreur
    return NextResponse.json({
      affirmation: "Le recyclage du plastique permet de réduire significativement l'impact environnemental.",
      reponse: true,
      explication:
        "Le recyclage du plastique évite la production de nouveau plastique et réduit les déchets, diminuant ainsi l'impact environnemental global.",
      categorie: "Déchets",
      icone: "♻️",
      difficulte: "facile",
    })
  }
}
