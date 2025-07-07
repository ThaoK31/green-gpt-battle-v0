"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface HoverEffectProps {
  children: React.ReactNode
  className?: string
  effect?: "lift" | "glow" | "tilt" | "bounce"
  intensity?: "subtle" | "medium" | "strong"
}

export function HoverEffect({ children, className = "", effect = "lift", intensity = "medium" }: HoverEffectProps) {
  const [isHovered, setIsHovered] = useState(false)

  const effects = {
    lift: {
      subtle: "hover:translate-y-[-2px] hover:shadow-md",
      medium: "hover:translate-y-[-4px] hover:shadow-lg",
      strong: "hover:translate-y-[-6px] hover:shadow-xl",
    },
    glow: {
      subtle: "hover:shadow-md hover:shadow-blue-200/50",
      medium: "hover:shadow-lg hover:shadow-blue-300/50",
      strong: "hover:shadow-xl hover:shadow-blue-400/50",
    },
    tilt: {
      subtle: "hover:rotate-1",
      medium: "hover:rotate-2",
      strong: "hover:rotate-3",
    },
    bounce: {
      subtle: "hover:animate-bounce",
      medium: "hover:animate-bounce",
      strong: "hover:animate-bounce",
    },
  }

  return (
    <div
      className={cn("transition-all duration-300 cursor-pointer", effects[effect][intensity], className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </div>
  )
}

interface PulseEffectProps {
  children: React.ReactNode
  active?: boolean
  color?: "green" | "blue" | "red" | "yellow"
  className?: string
}

export function PulseEffect({ children, active = false, color = "green", className = "" }: PulseEffectProps) {
  const colors = {
    green: "shadow-green-400/50",
    blue: "shadow-blue-400/50",
    red: "shadow-red-400/50",
    yellow: "shadow-yellow-400/50",
  }

  return (
    <div className={cn("transition-all duration-300", active && `animate-pulse shadow-lg ${colors[color]}`, className)}>
      {children}
    </div>
  )
}

interface FloatingActionProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left"
}

export function FloatingAction({ children, onClick, className = "", position = "bottom-right" }: FloatingActionProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const positions = {
    "bottom-right": "bottom-6 right-6",
    "bottom-left": "bottom-6 left-6",
    "top-right": "top-6 right-6",
    "top-left": "top-6 left-6",
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        "fixed z-50 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg",
        "flex items-center justify-center transition-all duration-300 transform",
        "hover:scale-110 active:scale-95",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0",
        positions[position],
        className,
      )}
    >
      {children}
    </button>
  )
}

// Effet de particules pour les succès
interface ParticleEffectProps {
  trigger: boolean
  onComplete?: () => void
  type?: "success" | "celebration" | "magic"
}

export function ParticleEffect({ trigger, onComplete, type = "success" }: ParticleEffectProps) {
  const [particles, setParticles] = useState<
    Array<{
      id: number
      x: number
      y: number
      vx: number
      vy: number
      life: number
      color: string
    }>
  >([])

  useEffect(() => {
    if (!trigger) return

    const colors = {
      success: ["#10b981", "#34d399", "#6ee7b7"],
      celebration: ["#f59e0b", "#fbbf24", "#fcd34d"],
      magic: ["#8b5cf6", "#a78bfa", "#c4b5fd"],
    }

    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: 50,
      y: 50,
      vx: (Math.random() - 0.5) * 10,
      vy: (Math.random() - 0.5) * 10,
      life: 1,
      color: colors[type][Math.floor(Math.random() * colors[type].length)],
    }))

    setParticles(newParticles)

    const interval = setInterval(() => {
      setParticles((prev) =>
        prev
          .map((particle) => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            vy: particle.vy + 0.5, // gravity
            life: particle.life - 0.02,
          }))
          .filter((particle) => particle.life > 0),
      )
    }, 16)

    const timeout = setTimeout(() => {
      setParticles([])
      onComplete?.()
    }, 2000)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [trigger, type, onComplete])

  if (particles.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            backgroundColor: particle.color,
            opacity: particle.life,
            transform: `scale(${particle.life})`,
          }}
        />
      ))}
    </div>
  )
}
