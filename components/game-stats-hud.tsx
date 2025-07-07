"use client"

import { Card, CardContent } from "@/components/ui/card"
import { AnimatedScore } from "@/components/animated-score"
import { StreakCounter } from "@/components/gamification/streak-counter"
import { Target } from "lucide-react"

interface GameStatsHUDProps {
  score: number
  totalQuestions: number
  currentStreak: number
  maxStreak: number
  triggerScoreAnimation: boolean
  triggerStreakAnimation: boolean
  scoreAnimationType: "normal" | "perfect-streak" | "mega-streak" | "legendary-streak"
  streakType: "normal" | "perfect" | "mega" | "legendary"
}

export function GameStatsHUD({
  score,
  totalQuestions,
  currentStreak,
  maxStreak,
  triggerScoreAnimation,
  triggerStreakAnimation,
  scoreAnimationType,
  streakType,
}: GameStatsHUDProps) {
  const successRate = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0

  return (
    <Card className="w-full max-w-4xl mx-auto card-adaptive-translucent mb-6">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          {/* Score */}
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="text-sm font-medium text-muted-foreground">Score</div>
            <AnimatedScore
              score={score}
              total={totalQuestions}
              triggerAnimation={triggerScoreAnimation}
              animationType={scoreAnimationType}
              streakCount={currentStreak}
            />
          </div>

          {/* Pourcentage de réussite */}
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="text-sm font-medium text-muted-foreground">Réussite</div>
            <div className="flex items-center gap-2">
              <Target className="h-6 w-6 text-blue-500" />
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{successRate}%</span>
            </div>
          </div>

          {/* Série en cours */}
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="text-sm font-medium text-muted-foreground">Série</div>
            <StreakCounter
              streak={currentStreak}
              maxStreak={maxStreak}
              triggerAnimation={triggerStreakAnimation}
              streakType={streakType}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
