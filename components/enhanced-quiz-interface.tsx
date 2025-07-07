"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import type { GameMode } from "@/lib/game-modes"

interface Question {
  affirmation: string
  reponse: boolean
  explication: string
  categorie?: string
  icone?: string
  difficulte?: string
}

interface EnhancedQuizInterfaceProps {
  currentQuestion: Question | null
  loading: boolean
  showResult: boolean
  userAnswer: boolean | null
  score: number
  totalQuestions: number
  currentStreak: number
  onAnswer: (answer: boolean) => void
  onNextQuestion: () => void
  gameMode: GameMode
  questionsRemaining?: number
}

export function EnhancedQuizInterface({
  currentQuestion,
  loading,
  showResult,
  userAnswer,
  score,
  totalQuestions,
  currentStreak,
  onAnswer,
  onNextQuestion,
  gameMode,
  questionsRemaining,
}: EnhancedQuizInterfaceProps) {
  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case "facile":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "moyen":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "difficile":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const isCorrect = userAnswer !== null && currentQuestion && userAnswer === currentQuestion.reponse

  return (
    <div className="space-y-6">
      {/* Carte principale du quiz avec taille fixe */}
      <Card className="w-full max-w-4xl mx-auto card-adaptive-translucent min-h-[600px] flex flex-col">
        <CardHeader className="flex-shrink-0">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <CardTitle className="flex items-center gap-2 text-card-foreground">
              <span className="text-2xl">🌱</span>
              Question Écologique
              {currentQuestion?.icone && <span className="text-xl">{currentQuestion.icone}</span>}
            </CardTitle>

            <div className="flex items-center gap-2 flex-wrap">
              {currentQuestion?.categorie && (
                <Badge variant="outline" className="text-xs">
                  {currentQuestion.icone} {currentQuestion.categorie}
                </Badge>
              )}
              {currentQuestion?.difficulte && (
                <Badge className={`text-xs ${getDifficultyColor(currentQuestion.difficulte)}`}>
                  {currentQuestion.difficulte}
                </Badge>
              )}
              {(gameMode === "challenge" || gameMode === "marathon") && questionsRemaining !== undefined && (
                <Badge variant="outline" className="text-xs">
                  {questionsRemaining} restantes
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col justify-between space-y-6">
          {loading ? (
            <div className="flex items-center justify-center flex-1">
              <div className="text-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-green-600" />
                <p className="text-muted-foreground">Génération de la question...</p>
              </div>
            </div>
          ) : currentQuestion ? (
            <>
              {/* Question - Espace fixe */}
              <div className="text-center py-8 flex-shrink-0">
                <p className="text-lg md:text-xl font-medium leading-relaxed text-card-foreground min-h-[3rem] flex items-center justify-center">
                  {currentQuestion.affirmation}
                </p>
              </div>

              {/* Zone de contenu principal avec hauteur fixe */}
              <div className="flex-1 flex flex-col justify-center space-y-6 min-h-[280px]">
                {/* Boutons de réponse */}
                {!showResult && (
                  <div className="flex gap-4 justify-center flex-wrap">
                    <Button
                      onClick={() => onAnswer(true)}
                      size="lg"
                      className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg font-semibold min-w-[120px]"
                    >
                      <CheckCircle className="h-5 w-5 mr-2" />
                      VRAI
                    </Button>
                    <Button
                      onClick={() => onAnswer(false)}
                      size="lg"
                      className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg font-semibold min-w-[120px]"
                    >
                      <XCircle className="h-5 w-5 mr-2" />
                      FAUX
                    </Button>
                  </div>
                )}

                {/* Résultat - Espace réservé */}
                <div className="flex-1 flex flex-col justify-center">
                  {showResult ? (
                    <div className="space-y-4">
                      <div
                        className={`text-center p-6 rounded-lg border-2 ${
                          isCorrect
                            ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800"
                            : "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800"
                        }`}
                      >
                        <div className="flex items-center justify-center gap-2 mb-3">
                          {isCorrect ? (
                            <>
                              <span className="text-2xl">🎉</span>
                              <h3 className="text-xl font-bold text-green-700 dark:text-green-300">Excellent ! 🎉</h3>
                            </>
                          ) : (
                            <>
                              <span className="text-2xl">❌</span>
                              <h3 className="text-xl font-bold text-red-700 dark:text-red-300">Incorrect</h3>
                            </>
                          )}
                        </div>

                        <p className="text-sm text-muted-foreground mb-3">
                          Réponse correcte : <strong>{currentQuestion.reponse ? "VRAI" : "FAUX"}</strong>
                        </p>

                        <div className="max-h-[120px] overflow-y-auto">
                          <p className="text-sm leading-relaxed text-card-foreground">{currentQuestion.explication}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Espace réservé quand pas de résultat
                    <div className="min-h-[200px] flex items-center justify-center">
                      <p className="text-muted-foreground/50 text-sm">Choisissez votre réponse ci-dessus</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Bouton suivant - Toujours en bas */}
              <div className="text-center flex-shrink-0 pt-4">
                {showResult && (
                  <Button
                    onClick={onNextQuestion}
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
                  >
                    Question Suivante →
                  </Button>
                )}
              </div>
            </>
          ) : (
            <div className="text-center flex-1 flex items-center justify-center">
              <p className="text-muted-foreground">Aucune question disponible</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
