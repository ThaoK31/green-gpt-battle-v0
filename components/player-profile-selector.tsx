"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { PlayerProfileManager, type PlayerProfile } from "@/lib/player-profiles"
import { Plus, Trash2 } from "lucide-react"

interface PlayerProfileSelectorProps {
  onProfileSelect: (profile: PlayerProfile) => void
  onClose: () => void
  mode: "single" | "multiplayer"
  selectedProfiles?: PlayerProfile[]
  maxPlayers?: number
}

const AVATARS = ["🧑", "👩", "👨", "🧒", "👧", "👦", "🧓", "👴", "👵", "🧑‍🎓", "👩‍🎓", "👨‍🎓"]

export function PlayerProfileSelector({
  onProfileSelect,
  onClose,
  mode,
  selectedProfiles = [],
  maxPlayers = 4,
}: PlayerProfileSelectorProps) {
  const [profileManager] = useState(() => PlayerProfileManager.getInstance())
  const [profiles, setProfiles] = useState<PlayerProfile[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newPlayerName, setNewPlayerName] = useState("")
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0])

  useEffect(() => {
    setProfiles(profileManager.getProfiles())
  }, [profileManager])

  const handleCreateProfile = () => {
    if (newPlayerName.trim()) {
      const newProfile = profileManager.createProfile(newPlayerName.trim(), selectedAvatar)
      setProfiles(profileManager.getProfiles())
      setNewPlayerName("")
      setShowCreateForm(false)
      onProfileSelect(newProfile)
    }
  }

  const handleDeleteProfile = (profileId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce profil ?")) {
      profileManager.deleteProfile(profileId)
      setProfiles(profileManager.getProfiles())
    }
  }

  const isProfileSelected = (profile: PlayerProfile) => {
    return selectedProfiles.some((p) => p.id === profile.id)
  }

  const canSelectMore = selectedProfiles.length < maxPlayers

  if (showCreateForm) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Créer un nouveau profil</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="playerName">Nom du joueur</Label>
              <Input
                id="playerName"
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                placeholder="Entrez votre nom"
                maxLength={20}
              />
            </div>

            <div>
              <Label>Choisissez votre avatar</Label>
              <div className="grid grid-cols-6 gap-2 mt-2">
                {AVATARS.map((avatar) => (
                  <button
                    key={avatar}
                    onClick={() => setSelectedAvatar(avatar)}
                    className={`text-2xl p-2 rounded-lg border-2 transition-all ${
                      selectedAvatar === avatar
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {avatar}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleCreateProfile} disabled={!newPlayerName.trim()} className="flex-1">
                Créer le profil
              </Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)} className="bg-transparent">
                Annuler
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[80vh] overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{mode === "single" ? "Sélectionnez votre profil" : "Sélectionnez les joueurs"}</span>
            <Button variant="outline" size="sm" onClick={onClose}>
              ✕
            </Button>
          </CardTitle>
          {mode === "multiplayer" && (
            <p className="text-sm text-gray-600">
              {selectedProfiles.length}/{maxPlayers} joueurs sélectionnés
            </p>
          )}
        </CardHeader>

        <CardContent className="overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {profiles.map((profile) => (
              <Card
                key={profile.id}
                className={`cursor-pointer transition-all ${
                  isProfileSelected(profile) ? "ring-2 ring-green-500 bg-green-50" : "hover:shadow-md"
                } ${mode === "multiplayer" && isProfileSelected(profile) ? "opacity-75" : ""}`}
                onClick={() => {
                  if (mode === "single" || (!isProfileSelected(profile) && canSelectMore)) {
                    onProfileSelect(profile)
                  }
                }}
              >
                <CardContent className="pt-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-3xl">{profile.avatar}</div>
                    <div className="flex-1">
                      <div className="font-semibold">{profile.name}</div>
                      <div className="text-sm text-gray-600">Niveau {profile.level}</div>
                    </div>
                    {isProfileSelected(profile) && <Badge className="bg-green-500">✓</Badge>}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-center">
                      <div className="font-bold text-green-600">{profile.totalScore}</div>
                      <div className="text-gray-600">Bonnes réponses</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-blue-600">{profile.maxStreak}</div>
                      <div className="text-gray-600">Meilleur streak</div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-3">
                    <Badge variant="outline" className="text-xs">
                      {profile.unlockedBadges.length}/7 badges
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteProfile(profile.id)
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Bouton pour créer un nouveau profil */}
            <Card
              className="cursor-pointer hover:shadow-md border-dashed border-2 border-gray-300"
              onClick={() => setShowCreateForm(true)}
            >
              <CardContent className="pt-4 flex flex-col items-center justify-center h-full min-h-[200px]">
                <Plus className="h-12 w-12 text-gray-400 mb-2" />
                <div className="text-gray-600 text-center">
                  <div className="font-semibold">Nouveau profil</div>
                  <div className="text-sm">Créer un joueur</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {mode === "multiplayer" && selectedProfiles.length >= 2 && (
            <div className="text-center">
              <Button onClick={onClose} className="bg-green-600 hover:bg-green-700" size="lg">
                Commencer avec {selectedProfiles.length} joueurs
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
