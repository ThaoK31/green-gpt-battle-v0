"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Leaf, Sparkles, TreePine } from "lucide-react"

interface LoadingSkeletonProps {
  type: "question" | "stats" | "profile" | "generic"
  className?: string
}

export function LoadingSkeleton({ type, className = "" }: LoadingSkeletonProps) {
  const skeletons = {
    question: (
      <Card className={`w-full animate-pulse ${className}`}>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="flex gap-2">
                <div className="h-6 bg-gray-200 rounded w-16"></div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg">
              <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto mt-2"></div>
            </div>
            <div className="flex gap-4 justify-center">
              <div className="h-12 bg-gray-200 rounded w-24"></div>
              <div className="h-12 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    ),
    stats: (
      <div className={`space-y-4 ${className}`}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="space-y-1">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
            <div className="h-6 bg-gray-200 rounded w-12"></div>
          </div>
        ))}
      </div>
    ),
    profile: (
      <div className={`flex items-center gap-4 p-4 bg-gray-50 rounded-lg animate-pulse ${className}`}>
        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-32"></div>
          <div className="h-3 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
    ),
    generic: (
      <div className={`space-y-3 ${className}`}>
        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6 animate-pulse"></div>
      </div>
    ),
  }

  return skeletons[type]
}

interface EcoLoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  message?: string
  showProgress?: boolean
  progress?: number
}

export function EcoLoadingSpinner({
  size = "md",
  message = "Génération d'une question écologique...",
  showProgress = false,
  progress = 0,
}: EcoLoadingSpinnerProps) {
  const [currentIcon, setCurrentIcon] = useState(0)
  const [dots, setDots] = useState("")

  const icons = [
    { Icon: Leaf, color: "text-green-500" },
    { Icon: TreePine, color: "text-green-600" },
    { Icon: Sparkles, color: "text-blue-500" },
  ]

  const sizes = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  }

  useEffect(() => {
    const iconInterval = setInterval(() => {
      setCurrentIcon((prev) => (prev + 1) % icons.length)
    }, 800)

    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."))
    }, 500)

    return () => {
      clearInterval(iconInterval)
      clearInterval(dotsInterval)
    }
  }, [icons.length])

  const CurrentIcon = icons[currentIcon].Icon

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <div className="relative">
        <CurrentIcon
          className={`${sizes[size]} ${icons[currentIcon].color} animate-spin`}
          style={{ animationDuration: "2s" }}
        />
        <div className="absolute inset-0 border-2 border-green-200 rounded-full animate-pulse"></div>
      </div>

      <div className="text-center space-y-2">
        <p className="text-sm text-gray-600 font-medium">
          {message}
          {dots}
        </p>

        {showProgress && (
          <div className="w-48 bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
