"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trophy, Star, RotateCcw, Home } from "lucide-react"

interface ChallengeEndScreenProps {
  score: number
  totalQuestions: number
  category: string
  categoryIcon: string
  onRestart: () => void
  onBackToModes: () => void
}

export function ChallengeEndScreen({
  score,
  totalQuestions,
  category,
  categoryIcon,
  onRestart,
  onBackToModes,
}: ChallengeEndScreenProps) {
  const percentage = Math.round((score / totalQuestions) * 100)
  const isPerfect = score === totalQuestions
  const isGood = percentage >= 80
  const isOkay = percentage >= 60

  const getResultMessage = () => {
    if (isPerfect) return "🏆 PARFAIT ! Vous maîtrisez cette catégorie !"
    if (isGood) return "🌟 Excellent ! Très bonne connaissance du sujet !"
    if (isOkay) return "👍 Bien joué ! Quelques révisions et ce sera parfait !"
    return "📚 Continuez à apprendre, vous progressez !"
  }

  const getResultColor = () => {
    if (isPerfect) return "from-yellow-400 to-yellow-600"
    if (isGood) return "from-green-400 to-green-600"
    if (isOkay) return "from-blue-400 to-blue-600"
    return "from-gray-400 to-gray-600"
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className={`p-4 rounded-full bg-gradient-to-r ${getResultColor()}`}>
              <Trophy className="h-12 w-12 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-green-800">🎲 Défi Terminé !</CardTitle>
          <Badge variant="outline" className="mx-auto bg-blue-50 text-lg py-1 px-3">
            {categoryIcon} {category}
          </Badge>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Score principal */}
          <div className="text-center space-y-2">
            <div className="text-6xl font-bold text-green-600">
              {score}/{totalQuestions}
            </div>
            <div className="text-xl font-semibold text-gray-700">{percentage}% de réussite</div>
            <div className="text-lg text-gray-600">{getResultMessage()}</div>
          </div>

          {/* Étoiles de performance */}
          <div className="flex justify-center gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-8 w-8 ${
                  i < Math.ceil((score / totalQuestions) * 5) ? "text-yellow-500 fill-current" : "text-gray-300"
                }`}
              />
            ))}
          </div>

          {/* Bonus parfait */}
          {isPerfect && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
              <div className="text-yellow-800 font-bold">🎉 BONUS PARFAIT !</div>
              <div className="text-yellow-700 text-sm">+50 XP supplémentaires pour un score parfait !</div>
            </div>
          )}

          {/* Statistiques détaillées */}
          <Card className="bg-gray-50">
            <CardContent className="pt-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">{score}</div>
                  <div className="text-sm text-gray-600">Bonnes réponses</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">{totalQuestions - score}</div>
                  <div className="text-sm text-gray-600">Erreurs</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Boutons d'action */}
          <div className="flex gap-3 justify-center">
            <Button onClick={onRestart} className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2">
              <RotateCcw className="h-4 w-4" />
              Recommencer
            </Button>
            <Button onClick={onBackToModes} variant="outline" className="flex items-center gap-2 bg-transparent">
              <Home className="h-4 w-4" />
              Accueil
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
