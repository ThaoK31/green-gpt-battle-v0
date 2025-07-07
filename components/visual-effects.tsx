"use client"

import { useEffect, useState } from "react"

interface VisualEffectsProps {
  isCorrect: boolean | null
  category: string
  showEffect: boolean
  onEffectComplete: () => void
}

export function VisualEffects({ isCorrect, category, showEffect, onEffectComplete }: VisualEffectsProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([])

  useEffect(() => {
    if (showEffect && isCorrect === false) {
      // Créer des particules de pollution
      const newParticles = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
      }))
      setParticles(newParticles)

      // Nettoyer après l'animation
      const timer = setTimeout(() => {
        setParticles([])
        onEffectComplete()
      }, 2000)

      return () => clearTimeout(timer)
    } else if (showEffect && isCorrect === true) {
      // Effet de vague pour bonne réponse
      const timer = setTimeout(() => {
        onEffectComplete()
      }, 1200)

      return () => clearTimeout(timer)
    }
  }, [showEffect, isCorrect, onEffectComplete])

  if (!showEffect) return null

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Effet de vague pour bonne réponse */}
      {isCorrect === true && <div className="wave-effect absolute inset-0" />}

      {/* Particules de pollution pour mauvaise réponse */}
      {isCorrect === false && (
        <div className="pollution-effect absolute inset-0">
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="pollution-particle"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                animationDelay: `${particle.id * 0.1}s`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
