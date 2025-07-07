"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PlayerProfileManager } from "@/lib/player-profiles"
import { Download, RotateCcw, TrendingUp, Clock, Target } from "lucide-react"

interface StatsDashboardProps {
  isOpen: boolean
  onClose: () => void
}

export function StatsDashboard({ isOpen, onClose }: StatsDashboardProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "categories" | "sessions" | "settings">("overview")
  const profileManager = PlayerProfileManager.getInstance()
  const currentPlayer = profileManager.getCurrentPlayer()

  if (!isOpen) return null

  if (!currentPlayer) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Aucun profil sélectionné</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Veuillez sélectionner un profil pour voir vos statistiques.</p>
            <Button onClick={onClose} className="w-full">
              Fermer
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleExport = () => {
    const data = JSON.stringify(currentPlayer, null, 2)
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${currentPlayer.name}-stats-${new Date().toISOString().split("T")[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleReset = () => {
    if (confirm("Êtes-vous sûr de vouloir effacer toutes vos données ? Cette action est irréversible.")) {
      profileManager.deleteProfile(currentPlayer.id)
      window.location.reload()
    }
  }

  const getSuccessRate = (correct: number, total: number) => {
    return total > 0 ? Math.round((correct / total) * 100) : 0
  }

  const getPlayTime = () => {
    const totalSeconds = Object.values(currentPlayer.modeStats).reduce((sum, stats) => sum + stats.xpGained * 6, 0) // Estimation basée sur XP
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)

    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            📊 Statistiques de {currentPlayer.name} {currentPlayer.avatar}
          </CardTitle>
          <Button variant="outline" size="sm" onClick={onClose}>
            ✕
          </Button>
        </CardHeader>

        <CardContent className="overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Onglets */}
          <div className="flex gap-2 mb-6 border-b">
            {[
              { id: "overview", label: "📈 Vue d'ensemble", icon: TrendingUp },
              { id: "categories", label: "📚 Catégories", icon: Target },
              { id: "sessions", label: "🎮 Modes de jeu", icon: Clock },
              { id: "settings", label: "⚙️ Paramètres", icon: RotateCcw },
            ].map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab(tab.id as any)}
                className="flex items-center gap-2"
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </Button>
            ))}
          </div>

          {/* Vue d'ensemble */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Statistiques principales */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{currentPlayer.level}</div>
                    <div className="text-sm text-gray-600">Niveau</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{currentPlayer.xp}</div>
                    <div className="text-sm text-gray-600">Points XP</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">{currentPlayer.maxStreak}</div>
                    <div className="text-sm text-gray-600">Meilleur Streak</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4 text-center">
                    <div className="text-2xl font-bold text-orange-600">{getPlayTime()}</div>
                    <div className="text-sm text-gray-600">Temps de jeu</div>
                  </CardContent>
                </Card>
              </div>

              {/* Progression globale */}
              <Card>
                <CardHeader>
                  <CardTitle>Progression Globale</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <div className="text-lg font-semibold">
                        {currentPlayer.totalCorrectAnswers}/{currentPlayer.totalQuestions}
                      </div>
                      <div className="text-sm text-gray-600">Questions réussies</div>
                      <div className="text-xs text-green-600">
                        {getSuccessRate(currentPlayer.totalCorrectAnswers, currentPlayer.totalQuestions)}% de réussite
                      </div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold">{currentPlayer.unlockedBadges.length}/7</div>
                      <div className="text-sm text-gray-600">Badges débloqués</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold">
                        {Math.floor((Date.now() - new Date(currentPlayer.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
                      </div>
                      <div className="text-sm text-gray-600">Jours d'ancienneté</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Badges débloqués */}
              <Card>
                <CardHeader>
                  <CardTitle>Badges Débloqués</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {currentPlayer.unlockedBadges.map((badgeId) => (
                      <Badge key={badgeId} className="bg-yellow-100 text-yellow-800">
                        🏆 {badgeId}
                      </Badge>
                    ))}
                    {currentPlayer.unlockedBadges.length === 0 && (
                      <p className="text-muted-foreground">Aucun badge débloqué pour le moment</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Statistiques par catégories */}
          {activeTab === "categories" && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Performance par Catégorie</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(currentPlayer.categoryStats).map(([category, stats]) => (
                      <div key={category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium">{category}</div>
                          <div className="text-sm text-gray-600">
                            {stats.correctAnswers}/{stats.questionsAnswered} questions
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-green-600">
                            {getSuccessRate(stats.correctAnswers, stats.questionsAnswered)}%
                          </div>
                          <div className="text-sm text-gray-600">de réussite</div>
                        </div>
                      </div>
                    ))}
                    {Object.keys(currentPlayer.categoryStats).length === 0 && (
                      <p className="text-muted-foreground text-center py-4">
                        Aucune statistique par catégorie disponible
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Statistiques par mode de jeu */}
          {activeTab === "sessions" && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Performance par Mode de Jeu</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(currentPlayer.modeStats).map(([mode, stats]) => (
                      <div key={mode} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium capitalize">{mode}</div>
                          <div className="text-sm text-gray-600">{stats.gamesPlayed} parties jouées</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-blue-600">
                            {stats.totalScore}/{stats.totalQuestions}
                          </div>
                          <div className="text-sm text-gray-600">
                            {getSuccessRate(stats.totalScore, stats.totalQuestions)}% • +{stats.xpGained} XP
                          </div>
                        </div>
                      </div>
                    ))}
                    {Object.keys(currentPlayer.modeStats).length === 0 && (
                      <p className="text-muted-foreground text-center py-4">Aucune partie jouée pour le moment</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Paramètres */}
          {activeTab === "settings" && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Sauvegarde & Restauration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-4">
                    <Button onClick={handleExport} className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Exporter mes données
                    </Button>
                  </div>
                  <div className="text-sm text-gray-600">
                    Vos données sont automatiquement sauvegardées dans votre navigateur. Vous pouvez les exporter pour
                    les sauvegarder.
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Zone de Danger</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button onClick={handleReset} variant="destructive" className="flex items-center gap-2">
                    <RotateCcw className="h-4 w-4" />
                    Supprimer ce profil
                  </Button>
                  <div className="text-sm text-gray-600 mt-2">
                    Cette action supprimera définitivement ce profil et toutes ses données.
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Informations du Profil</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm space-y-2">
                    <div>
                      <strong>Profil créé :</strong> {new Date(currentPlayer.createdAt).toLocaleDateString("fr-FR")}
                    </div>
                    <div>
                      <strong>Dernière activité :</strong>{" "}
                      {new Date(currentPlayer.lastPlayedAt).toLocaleDateString("fr-FR")}
                    </div>
                    <div>
                      <strong>Avatar :</strong> {currentPlayer.avatar}
                    </div>
                    <div>
                      <strong>Version :</strong> 1.0
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
