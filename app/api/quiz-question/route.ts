import { type NextRequest, NextResponse } from "next/server"
import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"
import { QUIZ_CATEGORIES } from "@/lib/quiz-categories"

// Schéma pour valider la réponse de l'IA
const QuestionSchema = z.object({
  affirmation: z.string().describe("L'affirmation à évaluer"),
  reponse: z.boolean().describe("True si l'affirmation est vraie, false sinon"),
  explication: z.string().describe("Explication détaillée de la réponse"),
  categorie: z.string().describe("Catégorie de la question"),
  icone: z.string().describe("Icône emoji représentant la catégorie"),
  difficulte: z.enum(["facile", "moyen", "difficile"]).describe("Niveau de difficulté"),
})

// Questions de fallback par catégorie
const FALLBACK_QUESTIONS = [
  {
    affirmation: "Les forêts absorbent plus de CO2 qu'elles n'en rejettent.",
    reponse: true,
    explication:
      "Les forêts sont des puits de carbone naturels qui stockent le CO2 de l'atmosphère dans leur biomasse.",
    categorie: "Forêts",
    icone: "🌳",
    difficulte: "facile" as const,
  },
  {
    affirmation: "L'énergie solaire produit plus de CO2 que l'énergie nucléaire.",
    reponse: false,
    explication:
      "L'énergie solaire a une empreinte carbone très faible, bien inférieure à celle du nucléaire sur l'ensemble du cycle de vie.",
    categorie: "Énergie",
    icone: "⚡",
    difficulte: "moyen" as const,
  },
  {
    affirmation: "Le transport maritime représente environ 3% des émissions mondiales de CO2.",
    reponse: true,
    explication:
      "Le transport maritime international représente environ 2-3% des émissions mondiales de gaz à effet de serre.",
    categorie: "Transport",
    icone: "🚢",
    difficulte: "difficile" as const,
  },
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { mode, category } = body

    console.log("=== API QUIZ-QUESTION ===")
    console.log("Mode reçu:", mode)
    console.log("Catégorie reçue:", category)

    // Construire le prompt selon le mode et la catégorie
    let systemPrompt = `Tu es un expert en écologie et développement durable. Génère une question sous forme d'affirmation vraie ou fausse sur l'écologie, l'environnement, le climat ou le développement durable.

L'affirmation doit être :
- Claire et précise
- Éducative et intéressante
- Basée sur des faits scientifiques
- Adaptée au niveau demandé

L'explication doit être :
- Pédagogique et accessible
- Factuelle et sourcée
- Encourageante pour l'apprentissage
- D'environ 1-2 phrases`

    let userPrompt = "Génère une question écologique intéressante."

    // Adaptation selon la catégorie pour le mode défi
    if (mode === "challenge" && category) {
      const categoryInfo = QUIZ_CATEGORIES.find((cat) => cat.name === category)
      if (categoryInfo) {
        userPrompt = `Génère une question spécifiquement sur la catégorie "${category}" (${categoryInfo.description}). La question doit porter sur ${categoryInfo.keywords.join(", ")}.`
        systemPrompt += `\n\nFocus spécial sur la catégorie "${category}": ${categoryInfo.description}`
      }
    }

    // Adaptation selon le mode
    switch (mode) {
      case "expert":
        systemPrompt += "\n\nNiveau EXPERT : Génère une question difficile avec des détails techniques précis."
        break
      case "marathon":
        const questionNumber = Number.parseInt(request.headers.get("x-question-number") || "1")
        if (questionNumber > 10) {
          systemPrompt += "\n\nNiveau AVANCÉ : Génère une question de difficulté moyenne à difficile."
        }
        break
      case "chrono":
        systemPrompt += "\n\nMode CHRONO : Génère une question claire et directe, facile à comprendre rapidement."
        break
    }

    console.log("Prompt système:", systemPrompt)
    console.log("Prompt utilisateur:", userPrompt)

    // Générer la question avec l'IA
    const result = await generateObject({
      model: openai("gpt-4o"),
      system: systemPrompt,
      prompt: userPrompt,
      schema: QuestionSchema,
      temperature: 0.8,
    })

    console.log("Question générée:", result.object)

    // Valider et retourner la question
    const question = QuestionSchema.parse(result.object)
    return NextResponse.json(question)
  } catch (error) {
    console.error("Erreur lors de la génération de la question:", error)

    // Retourner une question de fallback
    const fallbackQuestion = FALLBACK_QUESTIONS[Math.floor(Math.random() * FALLBACK_QUESTIONS.length)]
    console.log("Utilisation d'une question de fallback:", fallbackQuestion)

    return NextResponse.json(fallbackQuestion)
  }
}
