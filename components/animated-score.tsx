"use client"

import { useEffect, useState } from "react"
import { Trophy, Star, Zap, Crown } from "lucide-react"

interface AnimatedScoreProps {
  score: number
  total: number
  triggerAnimation: boolean
  animationType?: "normal" | "perfect-streak" | "mega-streak" | "legendary-streak"
  streakCount?: number
}

export function AnimatedScore({
  score,
  total,
  triggerAnimation,
  animationType = "normal",
  streakCount = 0,
}: AnimatedScoreProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const [showSpecialEffect, setShowSpecialEffect] = useState(false)

  useEffect(() => {
    if (triggerAnimation) {
      setIsAnimating(true)

      // Effet spécial pour les séries parfaites
      if (animationType !== "normal") {
        setShowSpecialEffect(true)
      }

      const timer = setTimeout(
        () => {
          setIsAnimating(false)
          setShowSpecialEffect(false)
        },
        animationType === "normal" ? 600 : 2000,
      ) // Plus long pour les effets spéciaux

      return () => clearTimeout(timer)
    }
  }, [triggerAnimation, animationType])

  const getAnimationClass = () => {
    if (!isAnimating) return ""

    switch (animationType) {
      case "perfect-streak":
        return "perfect-streak-animation"
      case "mega-streak":
        return "mega-streak-animation"
      case "legendary-streak":
        return "legendary-streak-animation"
      default:
        return "score-animation"
    }
  }

  const getIcon = () => {
    switch (animationType) {
      case "perfect-streak":
        return <Star className="h-5 w-5 text-yellow-500 animate-spin" />
      case "mega-streak":
        return <Zap className="h-5 w-5 text-purple-500 animate-bounce" />
      case "legendary-streak":
        return <Crown className="h-5 w-5 text-gold-500 animate-pulse" />
      default:
        return <Trophy className="h-5 w-5 text-yellow-500" />
    }
  }

  const getBackgroundClass = () => {
    if (!showSpecialEffect) return "bg-white dark:bg-gray-800"

    switch (animationType) {
      case "perfect-streak":
        return "bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 border-2 border-yellow-400"
      case "mega-streak":
        return "bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 border-2 border-purple-400"
      case "legendary-streak":
        return "bg-gradient-to-r from-yellow-200 to-amber-200 dark:from-yellow-900/40 dark:to-amber-900/40 border-2 border-amber-500 shadow-lg shadow-amber-500/50"
      default:
        return "bg-white dark:bg-gray-800"
    }
  }

  const getStreakMessage = () => {
    switch (animationType) {
      case "perfect-streak":
        return `🌟 SÉRIE PARFAITE ! ${streakCount} d'affilée !`
      case "mega-streak":
        return `⚡ MÉGA SÉRIE ! ${streakCount} bonnes réponses !`
      case "legendary-streak":
        return `👑 SÉRIE LÉGENDAIRE ! ${streakCount} PARFAIT !`
      default:
        return null
    }
  }

  return (
    <div className="relative">
      {/* Score principal */}
      <div
        className={`
        flex items-center gap-2 px-4 py-2 rounded-lg shadow transition-all duration-300
        ${getBackgroundClass()}
        ${isAnimating ? getAnimationClass() : ""}
      `}
      >
        {getIcon()}
        <span className={`font-semibold ${isAnimating && animationType !== "normal" ? "text-lg" : ""}`}>
          {score}/{total}
        </span>
      </div>

      {/* Message de série spéciale */}
      {showSpecialEffect && getStreakMessage() && (
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 z-10">
          <div
            className={`
            px-4 py-2 rounded-full text-sm font-bold text-center whitespace-nowrap
            animate-bounce-in shadow-lg
            ${animationType === "perfect-streak" ? "bg-yellow-500 text-white" : ""}
            ${animationType === "mega-streak" ? "bg-purple-500 text-white" : ""}
            ${animationType === "legendary-streak" ? "bg-gradient-to-r from-yellow-400 to-amber-500 text-black" : ""}
          `}
          >
            {getStreakMessage()}
          </div>
        </div>
      )}

      {/* Particules pour les effets spéciaux */}
      {showSpecialEffect && animationType !== "normal" && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: animationType === "legendary-streak" ? 12 : 8 }).map((_, i) => (
            <div
              key={i}
              className={`
                absolute w-1 h-1 rounded-full animate-ping
                ${animationType === "perfect-streak" ? "bg-yellow-400" : ""}
                ${animationType === "mega-streak" ? "bg-purple-400" : ""}
                ${animationType === "legendary-streak" ? "bg-amber-400" : ""}
              `}
              style={{
                left: `${20 + i * 10}%`,
                top: `${10 + (i % 3) * 30}%`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: "1s",
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
