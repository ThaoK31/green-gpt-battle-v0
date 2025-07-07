"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Crown, Heart, User } from "lucide-react"
import type { Player } from "@/lib/game-modes"

interface MultiplayerHUDProps {
  players: Player[]
  currentPlayerIndex: number
  round: number
  maxRounds: number
}

export function MultiplayerHUD({ players, currentPlayerIndex, round, maxRounds }: MultiplayerHUDProps) {
  const activePlayers = players.filter((p) => p.lives > 0)
  const currentPlayer = players[currentPlayerIndex]
  const leaderScore = Math.max(...players.map((p) => p.score))

  return (
    <div className="space-y-4">
      {/* Tour actuel - Plus visible */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
        <CardContent className="pt-4 pb-4">
          <div className="text-center">
            <div className="text-sm opacity-90">Tour {round}</div>
            <div className="text-xl font-bold flex items-center justify-center gap-2">
              <User className="h-6 w-6" />
              Au tour de <span className="text-yellow-300 underline">{currentPlayer?.name}</span> !
            </div>
            <div className="text-sm opacity-90 mt-1">
              {activePlayers.length} joueur{activePlayers.length > 1 ? "s" : ""} encore en vie
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tableau des joueurs - Plus grand et visible */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {players.map((player, index) => (
          <Card
            key={player.id}
            className={`relative transition-all duration-300 ${
              index === currentPlayerIndex
                ? "ring-4 ring-blue-500 bg-blue-50 shadow-lg scale-105 border-blue-300"
                : player.lives === 0
                  ? "opacity-60 bg-gray-100 border-gray-300"
                  : "bg-white hover:shadow-md border-gray-200"
            }`}
          >
            {/* Indicateur du joueur actuel */}
            {index === currentPlayerIndex && (
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-500 text-white animate-pulse">▶ À TON TOUR</Badge>
              </div>
            )}

            <CardContent className="pt-4 pb-4">
              <div className="text-center space-y-3">
                {/* Couronne pour le leader */}
                {player.score === leaderScore && player.score > 0 && (
                  <Crown className="h-5 w-5 text-yellow-500 mx-auto animate-bounce" />
                )}

                {/* Nom du joueur */}
                <div
                  className={`font-bold text-lg truncate ${
                    index === currentPlayerIndex
                      ? "text-blue-700"
                      : player.lives === 0
                        ? "text-gray-500"
                        : "text-gray-800"
                  }`}
                >
                  {player.name}
                </div>

                {/* Score */}
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-green-600">{player.score}</div>
                  <div className="text-xs text-gray-500">points</div>
                </div>

                {/* Vies - Plus visibles */}
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-700">Vies restantes</div>
                  <div className="flex justify-center gap-1">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Heart
                        key={i}
                        className={`h-6 w-6 transition-all ${
                          i < player.lives ? "text-red-500 fill-current animate-pulse" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <div
                    className={`text-sm font-bold ${
                      player.lives === 0 ? "text-red-600" : player.lives === 1 ? "text-orange-600" : "text-green-600"
                    }`}
                  >
                    {player.lives}/3
                  </div>
                </div>

                {/* Streak */}
                {player.streak > 0 && (
                  <Badge variant="outline" className="text-xs bg-orange-50 border-orange-200">
                    🔥 Série de {player.streak}
                  </Badge>
                )}

                {/* Statut */}
                {player.lives === 0 && (
                  <Badge variant="destructive" className="animate-pulse">
                    ❌ ÉLIMINÉ
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Statistiques de la partie */}
      <Card className="bg-gray-50">
        <CardContent className="pt-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">{activePlayers.length}</div>
              <div className="text-sm text-gray-600">Survivants</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{leaderScore}</div>
              <div className="text-sm text-gray-600">Meilleur score</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">{Math.max(...players.map((p) => p.streak))}</div>
              <div className="text-sm text-gray-600">Meilleure série</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
