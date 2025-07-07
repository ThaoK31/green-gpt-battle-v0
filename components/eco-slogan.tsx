"use client"

import { useState, useEffect } from "react"
import { Leaf, Heart, Globe, Lightbulb } from "lucide-react"

const ECO_SLOGANS = [
  {
    text: "Apprenez, jouez, sauvez la planète !",
    icon: Leaf,
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-900/20",
  },
  {
    text: "Chaque bonne réponse compte pour notre Terre",
    icon: Heart,
    color: "text-red-500 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-900/20",
  },
  {
    text: "Votre savoir, notre avenir commun",
    icon: Globe,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
  },
  {
    text: "Transformez vos connaissances en actions",
    icon: Lightbulb,
    color: "text-yellow-600 dark:text-yellow-400",
    bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
  },
]

interface EcoSloganProps {
  className?: string
}

export function EcoSlogan({ className = "" }: EcoSloganProps) {
  const [currentSloganIndex, setCurrentSloganIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true)

      setTimeout(() => {
        setCurrentSloganIndex((prev) => (prev + 1) % ECO_SLOGANS.length)
        setIsAnimating(false)
      }, 300)
    }, 4000) // Change toutes les 4 secondes

    return () => clearInterval(interval)
  }, [])

  const currentSlogan = ECO_SLOGANS[currentSloganIndex]
  const IconComponent = currentSlogan.icon

  return (
    <div className={`text-center ${className}`}>
      <div
        className={`
          inline-flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-300
          ${currentSlogan.bgColor} border border-opacity-20
          ${isAnimating ? "scale-95 opacity-70" : "scale-100 opacity-100"}
        `}
      >
        <IconComponent className={`h-5 w-5 ${currentSlogan.color} animate-pulse`} />
        <span className={`font-medium ${currentSlogan.color} text-lg`}>{currentSlogan.text}</span>
        <IconComponent className={`h-5 w-5 ${currentSlogan.color} animate-pulse`} />
      </div>

      {/* Indicateurs de progression */}
      <div className="flex justify-center gap-2 mt-3">
        {ECO_SLOGANS.map((_, index) => (
          <div
            key={index}
            className={`
              w-2 h-2 rounded-full transition-all duration-300
              ${
                index === currentSloganIndex
                  ? `${currentSlogan.color.replace("text-", "bg-")}`
                  : "bg-gray-300 dark:bg-gray-600"
              }
            `}
          />
        ))}
      </div>
    </div>
  )
}
