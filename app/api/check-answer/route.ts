import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { NextResponse } from "next/server"
import { parseJsonSafely } from "@/lib/json-utils"

export async function POST(request: Request) {
  try {
    // Vérifier que la clé API est configurée
    if (!process.env.OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY n'est pas configurée")
      return NextResponse.json(
        {
          error: "Configuration manquante : OPENAI_API_KEY",
        },
        { status: 500 },
      )
    }

    const { statement, userAnswer } = await request.json()

    if (!statement || userAnswer === undefined) {
      return NextResponse.json(
        {
          error: "Données manquantes : statement et userAnswer requis",
        },
        { status: 400 },
      )
    }

    console.log("Vérification de la réponse pour:", statement)
    console.log("Réponse utilisateur:", userAnswer)

    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: `Tu es un expert en écologie qui évalue les réponses à un quiz.
On te donne une affirmation et la réponse de l'utilisateur (vrai ou faux).
Tu dois déterminer si la réponse est correcte et fournir une explication courte et éducative.

IMPORTANT: Réponds UNIQUEMENT avec un objet JSON valide, sans backticks markdown, sans formatage supplémentaire.
Format exact requis :
{"correct": true, "explanation": "Votre explication ici"}
ou
{"correct": false, "explanation": "Votre explication ici"}

Ne pas utiliser de backticks, ne pas ajouter de texte avant ou après le JSON.`,
      prompt: `Affirmation: "${statement}"
      Réponse de l'utilisateur: ${userAnswer}
      
      Cette réponse est-elle correcte ? Fournis une explication.`,
    })

    console.log("Réponse brute de l'API:", text)

    const result = parseJsonSafely<{ correct: boolean; explanation: string }>(text)

    if (!result || typeof result.correct !== "boolean" || typeof result.explanation !== "string") {
      console.error("Format de réponse invalide:", result)
      return NextResponse.json({
        correct: false,
        explanation: "Erreur lors de l'analyse de la réponse. Veuillez réessayer.",
      })
    }

    console.log("Résultat parsé:", result)
    return NextResponse.json(result)
  } catch (error: any) {
    console.error("Erreur détaillée lors de la vérification:", error)

    // Gestion d'erreurs spécifiques
    if (error.message?.includes("API key")) {
      return NextResponse.json(
        {
          error: "Erreur d'authentification API. Vérifiez votre clé OpenAI.",
        },
        { status: 401 },
      )
    }

    if (error.message?.includes("quota")) {
      return NextResponse.json(
        {
          error: "Quota API dépassé. Vérifiez votre compte OpenAI.",
        },
        { status: 429 },
      )
    }

    return NextResponse.json(
      {
        error: `Erreur lors de la vérification: ${error.message || "Erreur inconnue"}`,
      },
      { status: 500 },
    )
  }
}
