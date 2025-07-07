"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GAME_MODES, QUIZ_CATEGORIES, type GameMode } from "@/lib/game-modes"
import { ArrowLeft, Users, Plus, Minus } from "lucide-react"

interface GameModeSelectorProps {
  onModeSelect: (mode: GameMode, config: any) => void
  onBack: () => void
  preselectedMode?: GameMode | null
}

export function GameModeSelector({ onModeSelect, onBack, preselectedMode }: GameModeSelectorProps) {
  const [selectedMode, setSelectedMode] = useState<GameMode | null>(preselectedMode || null)
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [players, setPlayers] = useState<string[]>(["Joueur 1", "Joueur 2"])

  useEffect(() => {
    if (preselectedMode) {
      setSelectedMode(preselectedMode)
    }
  }, [preselectedMode])

  const handleModeClick = (mode: GameMode) => {
    if (mode === "challenge" || mode === "multiplayer") {
      setSelectedMode(mode)
    } else {
      onModeSelect(mode, {})
    }
  }

  const handleStartChallenge = () => {
    if (selectedCategory) {
      onModeSelect("challenge", { category: selectedCategory })
    }
  }

  const handleStartMultiplayer = () => {
    if (players.length >= 2) {
      onModeSelect("multiplayer", { players: players.filter((p) => p.trim()) })
    }
  }

  const addPlayer = () => {
    if (players.length < 4) {
      setPlayers([...players, `Joueur ${players.length + 1}`])
    }
  }

  const removePlayer = (index: number) => {
    if (players.length > 2) {
      setPlayers(players.filter((_, i) => i !== index))
    }
  }

  const updatePlayerName = (index: number, name: string) => {
    const newPlayers = [...players]
    newPlayers[index] = name
    setPlayers(newPlayers)
  }

  if (selectedMode === "challenge") {
    return (
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setSelectedMode(null)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <CardTitle className="flex items-center gap-2">🎲 Mode Défi - Configuration</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="category">Choisissez une catégorie :</Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une catégorie" />
              </SelectTrigger>
              <SelectContent>
                {QUIZ_CATEGORIES.map((category) => (
                  <SelectItem key={category.name} value={category.name}>
                    {category.icon} {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Règles du Mode Défi :</h3>
            <ul className="text-sm space-y-1 text-gray-700">
              <li>• 5 questions de la catégorie sélectionnée</li>
              <li>• Score final sur 5 points</li>
              <li>• Bonus XP si score parfait</li>
              <li>• Statistiques spéciales par catégorie</li>
            </ul>
          </div>

          <Button
            onClick={handleStartChallenge}
            disabled={!selectedCategory}
            className="w-full bg-purple-600 hover:bg-purple-700"
            size="lg"
          >
            Commencer le Défi
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (selectedMode === "multiplayer") {
    return (
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setSelectedMode(null)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <CardTitle className="flex items-center gap-2">👥 Mode Multijoueur - Configuration</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label>Joueurs ({players.length}/4) :</Label>
            <div className="space-y-2 mt-2">
              {players.map((player, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={player}
                    onChange={(e) => updatePlayerName(index, e.target.value)}
                    placeholder={`Nom du joueur ${index + 1}`}
                  />
                  {players.length > 2 && (
                    <Button variant="outline" size="sm" onClick={() => removePlayer(index)}>
                      <Minus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            {players.length < 4 && (
              <Button variant="outline" size="sm" onClick={addPlayer} className="mt-2 bg-transparent">
                <Plus className="h-4 w-4" />
                Ajouter un joueur
              </Button>
            )}
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Règles du Multijoueur :</h3>
            <ul className="text-sm space-y-1 text-gray-700">
              <li>• Chaque joueur a 3 vies</li>
              <li>• Tour par tour</li>
              <li>• Mauvaise réponse = -1 vie</li>
              <li>• Le dernier survivant gagne</li>
              <li>• Bonus de streak conservés</li>
            </ul>
          </div>

          <Button
            onClick={handleStartMultiplayer}
            disabled={players.length < 2 || players.some((p) => !p.trim())}
            className="w-full bg-green-600 hover:bg-green-700"
            size="lg"
          >
            <Users className="h-4 w-4 mr-2" />
            Commencer la Partie
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="w-full max-w-4xl">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-2xl font-bold text-green-800">Choisissez votre mode de jeu</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {GAME_MODES.map((mode) => (
          <Card
            key={mode.id}
            className="cursor-pointer hover:shadow-lg transition-all transform hover:scale-105 relative overflow-hidden"
            onClick={() => handleModeClick(mode.id)}
          >
            <div className={`absolute top-0 left-0 right-0 h-1 ${mode.color}`} />
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <span className="text-2xl">{mode.icon}</span>
                {mode.name}
              </CardTitle>
              <p className="text-sm text-gray-600">{mode.description}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {mode.rules.map((rule, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {rule}
                  </Badge>
                ))}
              </div>

              {/* Indicateurs spéciaux */}
              <div className="mt-3 flex gap-2">
                {mode.settings.timeLimit && (
                  <Badge className="bg-red-100 text-red-800">⏱️ {mode.settings.timeLimit}s</Badge>
                )}
                {mode.settings.questionCount && (
                  <Badge className="bg-blue-100 text-blue-800">📊 {mode.settings.questionCount}Q</Badge>
                )}
                {mode.settings.difficulty && (
                  <Badge className="bg-gray-100 text-gray-800">🎯 {mode.settings.difficulty}</Badge>
                )}
                {mode.settings.multiplayer && <Badge className="bg-green-100 text-green-800">👥 Multi</Badge>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
