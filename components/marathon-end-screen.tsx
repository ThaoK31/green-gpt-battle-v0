"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trophy, Target, RotateCcw, Home, Zap } from "lucide-react"

interface MarathonEndScreenProps {
  score: number
  totalQuestions: number
  maxStreak: number
  onRestart: () => void
  onBackToModes: () => void
}

export function MarathonEndScreen({
  score,
  totalQuestions,
  maxStreak,
  onRestart,
  onBackToModes,
}: MarathonEndScreenProps) {
  const percentage = Math.round((score / totalQuestions) * 100)
  const isExceptional = percentage >= 90
  const isExcellent = percentage >= 75
  const isGood = percentage >= 60

  const getResultMessage = () => {
    if (isExceptional) return "🏆 EXCEPTIONNEL ! Vous êtes un vrai expert de l'écologie !"
    if (isExcellent) return "🌟 EXCELLENT ! Votre endurance et vos connaissances sont remarquables !"
    if (isGood) return "👍 BIEN JOUÉ ! Vous avez tenu bon jusqu'au bout !"
    return "💪 BRAVO ! Terminer un marathon, c'est déjà une victoire !"
  }

  const getResultColor = () => {
    if (isExceptional) return "from-yellow-400 to-yellow-600"
    if (isExcellent) return "from-green-400 to-green-600"
    if (isGood) return "from-blue-400 to-blue-600"
    return "from-purple-400 to-purple-600"
  }

  const getRank = () => {
    if (percentage >= 95) return { title: "Éco-Génie", icon: "🧠", color: "text-yellow-600" }
    if (percentage >= 85) return { title: "Éco-Expert", icon: "🎓", color: "text-green-600" }
    if (percentage >= 70) return { title: "Éco-Warrior", icon: "⚔️", color: "text-blue-600" }
    if (percentage >= 55) return { title: "Éco-Apprenti", icon: "🌱", color: "text-purple-600" }
    return { title: "Éco-Débutant", icon: "🌿", color: "text-gray-600" }
  }

  const rank = getRank()

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className={`p-4 rounded-full bg-gradient-to-r ${getResultColor()}`}>
              <Trophy className="h-12 w-12 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-green-800">🏃‍♂️ Marathon Terminé !</CardTitle>
          <Badge variant="outline" className="mx-auto bg-orange-50 text-lg py-1 px-3">
            20 Questions • Difficulté Progressive
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

          {/* Rang obtenu */}
          <div className="text-center">
            <div className={`text-4xl ${rank.color} font-bold`}>
              {rank.icon} {rank.title}
            </div>
            <div className="text-sm text-gray-600 mt-1">Votre rang pour ce marathon</div>
          </div>

          {/* Statistiques détaillées */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="bg-green-50">
              <CardContent className="pt-4 text-center">
                <Target className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <div className="text-xl font-bold text-green-600">{score}</div>
                <div className="text-xs text-gray-600">Réussites</div>
              </CardContent>
            </Card>
            <Card className="bg-orange-50">
              <CardContent className="pt-4 text-center">
                <Zap className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                <div className="text-xl font-bold text-orange-600">{maxStreak}</div>
                <div className="text-xs text-gray-600">Meilleur Streak</div>
              </CardContent>
            </Card>
            <Card className="bg-red-50">
              <CardContent className="pt-4 text-center">
                <div className="text-xl font-bold text-red-600">{totalQuestions - score}</div>
                <div className="text-xs text-gray-600">Erreurs</div>
              </CardContent>
            </Card>
          </div>

          {/* Bonus d'endurance */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <div className="text-blue-800 font-bold">🏃‍♂️ BONUS MARATHON !</div>
            <div className="text-blue-700 text-sm">+100 XP pour avoir terminé les 20 questions !</div>
          </div>

          {/* Boutons d'action */}
          <div className="flex gap-3 justify-center">
            <Button onClick={onRestart} className="bg-orange-600 hover:bg-orange-700 flex items-center gap-2">
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
