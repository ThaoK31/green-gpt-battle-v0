"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface EnhancedButtonProps extends React.ComponentProps<typeof Button> {
  rippleEffect?: boolean
  hapticFeedback?: boolean
  loadingState?: boolean
  successState?: boolean
  errorState?: boolean
  children: React.ReactNode
}

export function EnhancedButton({
  rippleEffect = true,
  hapticFeedback = true,
  loadingState = false,
  successState = false,
  errorState = false,
  className,
  onClick,
  children,
  disabled,
  ...props
}: EnhancedButtonProps) {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([])
  const [isPressed, setIsPressed] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const createRipple = (event: React.MouseEvent) => {
    if (!rippleEffect || !buttonRef.current) return

    const button = buttonRef.current
    const rect = button.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    const newRipple = {
      id: Date.now(),
      x,
      y,
    }

    setRipples((prev) => [...prev, newRipple])

    // Remove ripple after animation
    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id))
    }, 600)
  }

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loadingState) return

    // Haptic feedback for mobile devices
    if (hapticFeedback && "vibrate" in navigator) {
      navigator.vibrate(10)
    }

    // Visual press feedback
    setIsPressed(true)
    setTimeout(() => setIsPressed(false), 150)

    // Create ripple effect
    createRipple(event)

    // Call original onClick
    onClick?.(event)
  }

  const getButtonState = () => {
    if (loadingState) return "loading"
    if (successState) return "success"
    if (errorState) return "error"
    return "default"
  }

  const stateClasses = {
    loading: "bg-blue-500 hover:bg-blue-600 cursor-wait",
    success: "bg-green-500 hover:bg-green-600 animate-pulse",
    error: "bg-red-500 hover:bg-red-600 animate-shake",
    default: "",
  }

  return (
    <Button
      ref={buttonRef}
      className={cn(
        "relative overflow-hidden transition-all duration-200 transform",
        isPressed && "scale-95",
        stateClasses[getButtonState()],
        className,
      )}
      onClick={handleClick}
      disabled={disabled || loadingState}
      {...props}
    >
      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute bg-white/30 rounded-full animate-ping pointer-events-none"
          style={{
            left: ripple.x - 10,
            top: ripple.y - 10,
            width: 20,
            height: 20,
            animationDuration: "0.6s",
          }}
        />
      ))}

      {/* Button content with state indicators */}
      <span className="relative flex items-center gap-2">
        {loadingState && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
        {successState && <span className="text-lg">✓</span>}
        {errorState && <span className="text-lg">✗</span>}
        {children}
      </span>
    </Button>
  )
}
