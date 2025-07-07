"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy, Crown, Medal, RotateCcw } from "lucide-react"
import type { Player } from "@/lib/game-modes"

interface MultiplayerEndScreenProps {
  players: Player[]
  winner: Player | null
  onRestart: () => void
  onBackToMenu: () => void
}

export function MultiplayerEndScreen({ players, winner, onRestart, onBackToMenu }: MultiplayerEndScreenProps) {
  // Trier les joueurs par score décroissant
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score)

  const getPodiumIcon = (position: number) => {
    switch (position) {
      case 0:
        return <Crown className="h-8 w-8 text-yellow-500" />
      case 1:
        return <Medal className="h-6 w-6 text-gray-400" />
      case 2:
        return <Medal className="h-6 w-6 text-orange-600" />
      default:
        return <Trophy className="h-5 w-5 text-gray-500" />
    }
  }

  const getPodiumColor = (position: number) => {
    switch (position) {
      case 0:
        return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white"
      case 1:
        return "bg-gradient-to-r from-gray-300 to-gray-500 text-white"
      case 2:
        return "bg-gradient-to-r from-orange-400 to-orange-600 text-white"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Trophy className="h-16 w-16 text-yellow-500 animate-bounce" />
          </div>
          <CardTitle className="text-3xl font-bold text-green-800">🎉 Partie Terminée !</CardTitle>
          {winner && (
            <div className="text-xl text-purple-600 font-semibold">
              🏆 Félicitations <span className="text-yellow-600">{winner.name}</span> !
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Podium */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-center mb-4">🏆 Classement Final</h3>
            {sortedPlayers.map((player, index) => (
              <Card
                key={player.id}
                className={`${getPodiumColor(index)} ${index === 0 ? "ring-4 ring-yellow-400" : ""}`}
              >
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getPodiumIcon(index)}
                      <div>
                        <div className="font-bold text-lg">{player.name}</div>
                        <div className="text-sm opacity-90">
                          {index === 0
                            ? "🥇 Champion"
                            : index === 1
                              ? "🥈 Vice-champion"
                              : index === 2
                                ? "🥉 Troisième place"
                                : `${index + 1}ème place`}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{player.score}</div>
                      <div className="text-sm opacity-90">points</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Statistiques de la partie */}
          <Card className="bg-green-50">
            <CardContent className="pt-4">
              <h4 className="font-semibold mb-3 text-center">📊 Statistiques de la partie</h4>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-green-600">
                    {sortedPlayers.reduce((sum, p) => sum + p.score, 0)}
                  </div>
                  <div className="text-sm text-gray-600">Points totaux</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-blue-600">
                    {Math.max(...sortedPlayers.map((p) => p.streak))}
                  </div>
                  <div className="text-sm text-gray-600">Meilleure série</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Boutons d'action */}
          <div className="flex gap-3 justify-center">
            <Button onClick={onRestart} className="bg-green-600 hover:bg-green-700 flex items-center gap-2">
              <RotateCcw className="h-4 w-4" />
              Rejouer
            </Button>
            <Button onClick={onBackToMenu} variant="outline" className="flex items-center gap-2 bg-transparent">
              🏠 Menu Principal
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
