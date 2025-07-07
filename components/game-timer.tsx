"use client"

import { useEffect, useState, useCallback } from "react"
import { Progress } from "@/components/ui/progress"

interface GameTimerProps {
  duration: number
  isActive: boolean
  onTimeUp: () => void
  onTick?: (remaining: number) => void
}

export function GameTimer({ duration, isActive, onTimeUp, onTick }: GameTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration)

  // Mémoriser les callbacks pour éviter les re-créations
  const handleTimeUp = useCallback(onTimeUp, [onTimeUp])
  const handleTick = useCallback(onTick || (() => {}), [onTick])

  // Réinitialiser le timer quand la durée change
  useEffect(() => {
    setTimeLeft(duration)
  }, [duration])

  // Gérer le timer principal
  useEffect(() => {
    if (!isActive) return

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = Math.max(0, prev - 0.1)

        // Appeler onTick dans le prochain cycle de rendu pour éviter les conflits
        if (handleTick) {
          setTimeout(() => handleTick(newTime), 0)
        }

        if (newTime <= 0) {
          // Appeler onTimeUp dans le prochain cycle de rendu
          setTimeout(() => handleTimeUp(), 0)
          return 0
        }
        return newTime
      })
    }, 100)

    return () => clearInterval(interval)
  }, [isActive, handleTimeUp, handleTick])

  const progress = (timeLeft / duration) * 100
  const isUrgent = timeLeft <= 2
  const isWarning = timeLeft <= 3

  return (
    <div className="w-full space-y-3 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border-2 border-red-200 dark:border-red-800">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">⏱️ Temps restant</span>
        <span
          className={`text-2xl font-bold ${
            isUrgent
              ? "text-red-600 dark:text-red-400 animate-pulse"
              : isWarning
                ? "text-orange-600 dark:text-orange-400"
                : "text-green-600 dark:text-green-400"
          }`}
        >
          {Math.ceil(timeLeft)}s
        </span>
      </div>
      <Progress value={progress} className={`h-4 ${isUrgent ? "animate-pulse" : ""}`} />
      {isUrgent && (
        <div className="text-center text-red-600 dark:text-red-400 font-bold animate-bounce">
          ⚠️ TEMPS ÉCOULÉ DANS {Math.ceil(timeLeft)}s !
        </div>
      )}
    </div>
  )
}
