"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface FadeTransitionProps {
  show: boolean
  children: React.ReactNode
  className?: string
  duration?: number
}

export function FadeTransition({ show, children, className = "", duration = 300 }: FadeTransitionProps) {
  const [shouldRender, setShouldRender] = useState(show)

  useEffect(() => {
    if (show) {
      setShouldRender(true)
    } else {
      const timer = setTimeout(() => setShouldRender(false), duration)
      return () => clearTimeout(timer)
    }
  }, [show, duration])

  if (!shouldRender) return null

  return (
    <div
      className={cn("transition-opacity duration-300", show ? "opacity-100" : "opacity-0", className)}
      style={{ transitionDuration: `${duration}ms` }}
    >
      {children}
    </div>
  )
}

interface SlideTransitionProps {
  show: boolean
  children: React.ReactNode
  direction?: "up" | "down" | "left" | "right"
  className?: string
  duration?: number
}

export function SlideTransition({
  show,
  children,
  direction = "up",
  className = "",
  duration = 300,
}: SlideTransitionProps) {
  const [shouldRender, setShouldRender] = useState(show)

  useEffect(() => {
    if (show) {
      setShouldRender(true)
    } else {
      const timer = setTimeout(() => setShouldRender(false), duration)
      return () => clearTimeout(timer)
    }
  }, [show, duration])

  const transforms = {
    up: show ? "translateY(0)" : "translateY(100%)",
    down: show ? "translateY(0)" : "translateY(-100%)",
    left: show ? "translateX(0)" : "translateX(100%)",
    right: show ? "translateX(0)" : "translateX(-100%)",
  }

  if (!shouldRender) return null

  return (
    <div
      className={cn("transition-transform duration-300", className)}
      style={{
        transform: transforms[direction],
        transitionDuration: `${duration}ms`,
      }}
    >
      {children}
    </div>
  )
}

interface ScaleTransitionProps {
  show: boolean
  children: React.ReactNode
  className?: string
  duration?: number
}

export function ScaleTransition({ show, children, className = "", duration = 300 }: ScaleTransitionProps) {
  const [shouldRender, setShouldRender] = useState(show)

  useEffect(() => {
    if (show) {
      setShouldRender(true)
    } else {
      const timer = setTimeout(() => setShouldRender(false), duration)
      return () => clearTimeout(timer)
    }
  }, [show, duration])

  if (!shouldRender) return null

  return (
    <div
      className={cn(
        "transition-all duration-300 origin-center",
        show ? "scale-100 opacity-100" : "scale-95 opacity-0",
        className,
      )}
      style={{ transitionDuration: `${duration}ms` }}
    >
      {children}
    </div>
  )
}

// Composant pour les transitions de liste
interface ListTransitionProps {
  items: any[]
  renderItem: (item: any, index: number) => React.ReactNode
  className?: string
  staggerDelay?: number
}

export function ListTransition({ items, renderItem, className = "", staggerDelay = 100 }: ListTransitionProps) {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set())

  useEffect(() => {
    items.forEach((_, index) => {
      setTimeout(() => {
        setVisibleItems((prev) => new Set([...prev, index]))
      }, index * staggerDelay)
    })

    return () => setVisibleItems(new Set())
  }, [items, staggerDelay])

  return (
    <div className={className}>
      {items.map((item, index) => (
        <div
          key={index}
          className={cn(
            "transition-all duration-500 transform",
            visibleItems.has(index) ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
          )}
        >
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  )
}
