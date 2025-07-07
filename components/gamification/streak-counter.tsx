"use client"

import { useEffect, useState } from "react"

interface StreakCounterProps {
  streak: number
  maxStreak: number
  triggerAnimation: boolean
  streakType?: "normal" | "perfect" | "mega" | "legendary"
}

export function StreakCounter({ streak, maxStreak, triggerAnimation, streakType = "normal" }: StreakCounterProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const [showSpecialEffect, setShowSpecialEffect] = useState(false)

  useEffect(() => {
    if (triggerAnimation && streak > 0) {
      setIsAnimating(true)

      // Effet spécial pour les séries parfaites
      if (streakType !== "normal") {
        setShowSpecialEffect(true)
      }

      const timer = setTimeout(
        () => {
          setIsAnimating(false)
          setShowSpecialEffect(false)
        },
        streakType === "normal" ? 500 : 1500,
      )

      return () => clearTimeout(timer)
    }
  }, [triggerAnimation, streak, streakType])

  if (streak === 0 && maxStreak === 0) return null

  const getStreakClass = () => {
    if (streak === 0) return "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400"

    switch (streakType) {
      case "perfect":
        return "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg shadow-yellow-500/50"
      case "mega":
        return "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50"
      case "legendary":
        return "bg-gradient-to-r from-yellow-400 to-amber-500 text-black shadow-xl shadow-amber-500/50 border-2 border-amber-300"
      default:
        return "bg-red-500 text-white"
    }
  }

  const getAnimationClass = () => {
    if (!isAnimating) return ""

    switch (streakType) {
      case "perfect":
        return "perfect-streak-pulse animate-bounce"
      case "mega":
        return "mega-streak-pulse animate-pulse"
      case "legendary":
        return "legendary-streak-pulse animate-bounce"
      default:
        return "streak-pulse"
    }
  }

  const getFireIcon = () => {
    switch (streakType) {
      case "perfect":
        return "⭐"
      case "mega":
        return "⚡"
      case "legendary":
        return "👑"
      default:
        return "🔥"
    }
  }

  return (
    <div className="flex items-center gap-4 relative">
      <div
        className={`
          flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-300
          ${getStreakClass()}
          ${getAnimationClass()}
        `}
      >
        <span className="text-xl">{getFireIcon()}</span>
        <span className="font-bold text-lg">{streak}</span>
        <span className="text-sm">série</span>
      </div>

      {maxStreak > 0 && (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Record: <span className="font-semibold text-orange-600">{maxStreak}</span>
        </div>
      )}

      {/* Effet spécial pour les séries parfaites */}
      {showSpecialEffect && streakType !== "normal" && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-10">
          <div
            className={`
            px-3 py-1 rounded-full text-xs font-bold text-center whitespace-nowrap
            animate-bounce-in
            ${streakType === "perfect" ? "bg-yellow-500 text-white" : ""}
            ${streakType === "mega" ? "bg-purple-500 text-white" : ""}
            ${streakType === "legendary" ? "bg-gradient-to-r from-yellow-400 to-amber-500 text-black" : ""}
          `}
          >
            {streakType === "perfect" && "SÉRIE PARFAITE !"}
            {streakType === "mega" && "MÉGA SÉRIE !"}
            {streakType === "legendary" && "LÉGENDAIRE !"}
          </div>
        </div>
      )}
    </div>
  )
}
