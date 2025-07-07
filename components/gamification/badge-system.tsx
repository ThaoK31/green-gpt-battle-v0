"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Badge as BadgeType, GameStats } from "@/lib/gamification"

interface BadgeSystemProps {
  badges: BadgeType[]
  stats: GameStats
  onBadgeUnlock: (badge: BadgeType) => void
}

export function BadgeSystem({ badges, stats, onBadgeUnlock }: BadgeSystemProps) {
  const [newlyUnlocked, setNewlyUnlocked] = useState<string[]>([])
  const [hoveredBadge, setHoveredBadge] = useState<string | null>(null)

  useEffect(() => {
    badges.forEach((badge) => {
      if (!badge.unlocked && badge.condition(stats)) {
        badge.unlocked = true
        setNewlyUnlocked((prev) => [...prev, badge.id])
        onBadgeUnlock(badge)

        // Retirer l'animation après 2 secondes
        setTimeout(() => {
          setNewlyUnlocked((prev) => prev.filter((id) => id !== badge.id))
        }, 2000)
      }
    })
  }, [badges, stats, onBadgeUnlock])

  const unlockedBadges = badges.filter((badge) => badge.unlocked)

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          🏆 Badges ({unlockedBadges.length}/{badges.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`
                relative flex flex-col items-center p-2 rounded-lg border transition-all cursor-help
                ${
                  badge.unlocked
                    ? "bg-yellow-50 border-yellow-200 text-yellow-800"
                    : "bg-gray-50 border-gray-200 text-gray-400"
                }
                ${newlyUnlocked.includes(badge.id) ? "badge-unlock" : ""}
              `}
              onMouseEnter={() => setHoveredBadge(badge.id)}
              onMouseLeave={() => setHoveredBadge(null)}
            >
              <div className="text-2xl mb-1">{badge.icon}</div>
              <div className="text-xs text-center font-medium">{badge.name}</div>

              {/* Tooltip */}
              {hoveredBadge === badge.id && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-10">
                  <div className="bg-black text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
                    <div className="font-semibold">{badge.name}</div>
                    <div className="text-gray-300">{badge.description}</div>
                    {/* Flèche */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black"></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
