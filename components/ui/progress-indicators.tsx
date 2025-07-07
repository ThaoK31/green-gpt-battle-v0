"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface AnimatedProgressProps {
  value: number
  max?: number
  className?: string
  showLabel?: boolean
  color?: "green" | "blue" | "purple" | "orange"
  size?: "sm" | "md" | "lg"
  animated?: boolean
}

export function AnimatedProgress({
  value,
  max = 100,
  className = "",
  showLabel = true,
  color = "green",
  size = "md",
  animated = true,
}: AnimatedProgressProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const percentage = Math.min((value / max) * 100, 100)

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setDisplayValue(percentage)
      }, 100)
      return () => clearTimeout(timer)
    } else {
      setDisplayValue(percentage)
    }
  }, [percentage, animated])

  const colors = {
    green: "bg-green-500",
    blue: "bg-blue-500",
    purple: "bg-purple-500",
    orange: "bg-orange-500",
  }

  const sizes = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4",
  }

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Progression</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={cn("bg-gray-200 rounded-full overflow-hidden", sizes[size])}>
        <div
          className={cn(
            "h-full rounded-full transition-all duration-1000 ease-out",
            colors[color],
            animated && "animate-pulse",
          )}
          style={{ width: `${displayValue}%` }}
        />
      </div>
    </div>
  )
}

interface CircularProgressProps {
  value: number
  max?: number
  size?: number
  strokeWidth?: number
  color?: string
  backgroundColor?: string
  showLabel?: boolean
  className?: string
}

export function CircularProgress({
  value,
  max = 100,
  size = 120,
  strokeWidth = 8,
  color = "#10b981",
  backgroundColor = "#e5e7eb",
  showLabel = true,
  className = "",
}: CircularProgressProps) {
  const [progress, setProgress] = useState(0)
  const percentage = Math.min((value / max) * 100, 100)

  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  useEffect(() => {
    const timer = setTimeout(() => setProgress(percentage), 100)
    return () => clearTimeout(timer)
  }, [percentage])

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold" style={{ color }}>
            {Math.round(percentage)}%
          </span>
        </div>
      )}
    </div>
  )
}

// Indicateur de progression par étapes
interface StepProgressProps {
  currentStep: number
  totalSteps: number
  labels?: string[]
  className?: string
}

export function StepProgress({ currentStep, totalSteps, labels, className = "" }: StepProgressProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1
          const isCompleted = stepNumber < currentStep
          const isCurrent = stepNumber === currentStep
          const isUpcoming = stepNumber > currentStep

          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <div className="flex items-center w-full">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300",
                    isCompleted && "bg-green-500 text-white",
                    isCurrent && "bg-blue-500 text-white animate-pulse",
                    isUpcoming && "bg-gray-200 text-gray-500",
                  )}
                >
                  {isCompleted ? "✓" : stepNumber}
                </div>
                {index < totalSteps - 1 && (
                  <div
                    className={cn(
                      "flex-1 h-1 mx-2 transition-all duration-300",
                      stepNumber < currentStep ? "bg-green-500" : "bg-gray-200",
                    )}
                  />
                )}
              </div>
              {labels && labels[index] && (
                <span
                  className={cn(
                    "text-xs mt-2 text-center transition-colors duration-300",
                    isCurrent ? "text-blue-600 font-medium" : "text-gray-500",
                  )}
                >
                  {labels[index]}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
