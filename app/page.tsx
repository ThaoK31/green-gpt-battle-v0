"use client"

import { useState, useCallback, useEffect } from "react"
import Image from "next/image" // Import Image
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Home, BarChart3, Settings, User } from "lucide-react" // Leaf removed
import { VisualEffects } from "@/components/visual-effects"
import { BadgeSystem } from "@/components/gamification/badge-system"
import { ProgressCircle } from "@/components/gamification/progress-circle"
import { StatsDashboard } from "@/components/stats-dashboard"
import { HeroSection } from "@/components/hero-section"
import { FooterSection } from "@/components/footer-section"
import { BADGES, type GameStats, calculateLevel, getXPProgress, type Badge as BadgeType } from "@/lib/gamification"
import { LocalStorageManager } from "@/lib/local-storage"
import { getGameModeConfig, type GameMode, type Player, type MultiplayerState, GAME_MODES } from "@/lib/game-modes"
import { MultiplayerHUD } from "@/components/multiplayer-hud"
import { MultiplayerEndScreen } from "@/components/multiplayer-end-screen"
import { GameTimer } from "@/components/game-timer"
import { ChallengeEndScreen } from "@/components/challenge-end-screen"
import { MarathonEndScreen } from "@/components/marathon-end-screen"
import { PlayerProfileSelector } from "@/components/player-profile-selector"
import { ThemeSettings } from "@/components/theme-settings"
import { PlayerProfileManager, type PlayerProfile } from "@/lib/player-profiles"
import { ThemeManager } from "@/lib/theme-system"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { QUIZ_CATEGORIES } from "@/lib/quiz-categories"
import { EnhancedQuizInterface } from "@/components/enhanced-quiz-interface"
import { GameStatsHUD } from "@/components/game-stats-hud"

interface Question {
  affirmation: string
  reponse: boolean
  explication: string
  categorie?: string
  icone?: string
  difficulte?: string
}

export default function GreenGPTBattle() {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [loading, setLoading] = useState(false)
  const [score, setScore] = useState(0)
  const [totalQuestions, setTotalQuestions] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [userAnswer, setUserAnswer] = useState<boolean | null>(null)
  const [gameStarted, setGameStarted] = useState(false)
  const [showEffect, setShowEffect] = useState(false)
  const [triggerScoreAnimation, setTriggerScoreAnimation] = useState(false)
  const [showStats, setShowStats] = useState(false)

  // États de gamification avec stockage local
  const [storageManager] = useState(() => LocalStorageManager.getInstance())
  const [profileManager] = useState(() => PlayerProfileManager.getInstance())
  const [themeManager] = useState(() => ThemeManager.getInstance())
  const [currentStreak, setCurrentStreak] = useState(0)
  const [maxStreak, setMaxStreak] = useState(0)
  const [xp, setXp] = useState(0)
  const [level, setLevel] = useState(1)
  const [badges, setBadges] = useState(BADGES)
  const [triggerStreakAnimation, setTriggerStreakAnimation] = useState(false)
  const [newBadges, setNewBadges] = useState<BadgeType[]>([])

  // NOUVEAUX ÉTATS POUR LES SÉRIES PARFAITES
  const [scoreAnimationType, setScoreAnimationType] = useState<
    "normal" | "perfect-streak" | "mega-streak" | "legendary-streak"
  >("normal")
  const [streakType, setStreakType] = useState<"normal" | "perfect" | "mega" | "legendary">("normal")

  // États des profils de joueurs
  const [currentPlayer, setCurrentPlayer] = useState<PlayerProfile | null>(null)
  const [showProfileSelector, setShowProfileSelector] = useState(false)
  const [selectedPlayers, setSelectedPlayers] = useState<PlayerProfile[]>([])

  // États des modes de jeu
  const [gameMode, setGameMode] = useState<GameMode>("classic")
  const [gameModeConfig, setGameModeConfig] = useState<any>({})
  const [selectedModeForConfig, setSelectedModeForConfig] = useState<GameMode | null>(null)

  // États du mode chrono - CORRECTION: Supprimer onTick qui causait le problème
  const [timeLeft, setTimeLeft] = useState(0)
  const [timerActive, setTimerActive] = useState(false)

  // États du mode défi/marathon
  const [questionsRemaining, setQuestionsRemaining] = useState(0)
  const [modeProgress, setModeProgress] = useState(0)

  // États du multijoueur
  const [multiplayerState, setMultiplayerState] = useState<MultiplayerState | null>(null)
  const [gameEnded, setGameEnded] = useState(false)
  const [winner, setWinner] = useState<Player | null>(null)

  // États pour la configuration des modes
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [players, setPlayers] = useState<string[]>(["Joueur 1", "Joueur 2"])

  // États des paramètres
  const [showThemeSettings, setShowThemeSettings] = useState(false)
  const [profileChangeNotification, setProfileChangeNotification] = useState<string | null>(null)

  // État pour forcer le re-render quand le thème change
  const [themeUpdateTrigger, setThemeUpdateTrigger] = useState(0)

  // Variables pour la session de jeu
  const [sessionStartTime, setSessionStartTime] = useState(0)
  const [sessionCategories, setSessionCategories] = useState<string[]>([])

  const xpProgress = getXPProgress(xp)

  const gameStats: GameStats = {
    score,
    totalQuestions,
    currentStreak,
    maxStreak,
    correctAnswers: score,
    level,
    xp,
  }

  // FONCTION POUR DÉTERMINER LE TYPE DE SÉRIE
  const getStreakType = (streak: number): { scoreType: typeof scoreAnimationType; streakType: typeof streakType } => {
    if (streak >= 8) {
      return { scoreType: "legendary-streak", streakType: "legendary" }
    } else if (streak >= 5) {
      return { scoreType: "mega-streak", streakType: "mega" }
    } else if (streak >= 3) {
      return { scoreType: "perfect-streak", streakType: "perfect" }
    }
    return { scoreType: "normal", streakType: "normal" }
  }

  // Écouter les changements de thème
  useEffect(() => {
    const handleThemeChange = () => {
      setThemeUpdateTrigger((prev) => prev + 1)
    }

    themeManager.addListener(handleThemeChange)

    return () => {
      themeManager.removeListener(handleThemeChange)
    }
  }, [themeManager])

  // Charger les données au démarrage
  useEffect(() => {
    const player = profileManager.getCurrentPlayer()
    setCurrentPlayer(player)

    if (player) {
      // Charger les stats du profil actuel
      setCurrentStreak(player.currentStreak)
      setMaxStreak(player.maxStreak)
      setXp(player.xp)
      setLevel(player.level)

      // Mettre à jour les badges
      const updatedBadges = BADGES.map((badge) => ({
        ...badge,
        unlocked: player.unlockedBadges.includes(badge.id),
      }))
      setBadges(updatedBadges)
    } else {
      // Si aucun profil n'est sélectionné, afficher le sélecteur
      setShowProfileSelector(true)
    }
  }, [profileManager])

  // Synchroniser les stats avec le profil quand elles changent
  const updatePlayerStats = useCallback(() => {
    if (currentPlayer) {
      profileManager.updateProfile(currentPlayer.id, {
        totalScore: currentPlayer.totalScore + score,
        totalQuestions: currentPlayer.totalQuestions + totalQuestions,
        totalCorrectAnswers: currentPlayer.totalCorrectAnswers + score,
        xp,
        level,
        currentStreak,
        maxStreak: Math.max(currentPlayer.maxStreak, maxStreak),
        unlockedBadges: badges.filter((b) => b.unlocked).map((b) => b.id),
        lastPlayedAt: new Date().toISOString(),
      })
    }
  }, [currentPlayer, profileManager, score, totalQuestions, xp, level, currentStreak, maxStreak, badges])

  // FONCTION MODIFIÉE - Accepte maintenant une config optionnelle
  const fetchQuestion = async (overrideConfig?: any) => {
    setLoading(true)
    setShowResult(false)
    setUserAnswer(null)
    setShowEffect(false)

    // Timer pour le mode chrono
    if (gameMode === "chrono") {
      setTimeLeft(5)
      setTimerActive(true)
    }

    try {
      // Utiliser la config passée en paramètre ou celle de l'état
      const configToUse = overrideConfig || gameModeConfig

      const requestBody: any = { mode: gameMode }

      console.log("=== FETCH QUESTION ===")
      console.log("Mode:", gameMode)
      console.log("Config utilisée:", configToUse)

      // CORRECTION : Utiliser la config passée en paramètre
      if (gameMode === "challenge" && configToUse.category) {
        requestBody.category = configToUse.category
        console.log("🎲 DÉFI: Catégorie envoyée:", configToUse.category)
      }

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      }

      if (gameMode === "marathon") {
        headers["x-question-number"] = (modeProgress + 1).toString()
      }

      console.log("Body envoyé à l'API:", requestBody)

      const response = await fetch("/api/quiz-question", {
        method: "POST",
        headers,
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Erreur API:", errorText)
        throw new Error(`Erreur HTTP: ${response.status}`)
      }

      const questionData = await response.json()
      console.log("Question reçue:", questionData)
      setCurrentQuestion(questionData)
    } catch (error) {
      console.error("Erreur lors de la génération de la question:", error)

      // Fallback avec une question par défaut
      setCurrentQuestion({
        affirmation: "Les forêts absorbent plus de CO2 qu'elles n'en rejettent.",
        reponse: true,
        explication: "Les forêts sont des puits de carbone naturels qui stockent le CO2 de l'atmosphère.",
        categorie: "Forêts",
        icone: "🌳",
        difficulte: "facile",
      })
    }

    setLoading(false)
  }

  const handleAnswer = (answer: boolean) => {
    setUserAnswer(answer)
    setShowResult(true)
    setTotalQuestions((prev) => prev + 1)
    setTimerActive(false) // Arrêter le timer

    const isCorrect = currentQuestion && answer === currentQuestion.reponse

    // Ajouter la catégorie à la session
    if (currentQuestion?.categorie && !sessionCategories.includes(currentQuestion.categorie)) {
      setSessionCategories((prev) => [...prev, currentQuestion.categorie!])
    }

    // Logique multijoueur
    if (gameMode === "multiplayer" && multiplayerState) {
      const currentPlayerInGame = multiplayerState.players[multiplayerState.currentPlayerIndex]

      if (isCorrect) {
        currentPlayerInGame.score++
        currentPlayerInGame.streak++
      } else {
        currentPlayerInGame.lives--
        currentPlayerInGame.streak = 0
      }

      setMultiplayerState({ ...multiplayerState })
    }

    // Logique normale pour les autres modes
    if (isCorrect) {
      setScore((prev) => prev + 1)

      const newStreak = currentStreak + 1
      setCurrentStreak(newStreak)

      // NOUVELLE LOGIQUE : Déterminer le type d'animation selon la série
      const { scoreType, streakType: newStreakType } = getStreakType(newStreak)

      // Déclencher l'animation seulement pour les séries parfaites
      // Dans handleAnswer, supprimer ces lignes :
      // if (scoreType !== "normal") {
      //   setScoreAnimationType(scoreType)
      //   setTriggerScoreAnimation(true)
      //   console.log(`🎉 SÉRIE PARFAITE DÉTECTÉE ! Type: ${scoreType}, Streak: ${newStreak}`)
      // }
      // Plus d'animation de scintillement pour le score
      setScoreAnimationType("normal")

      setStreakType(newStreakType)
      setTriggerStreakAnimation(true)

      if (newStreak > maxStreak) {
        setMaxStreak(newStreak)
      }

      // XP avec bonus selon le mode
      let xpGain = 10
      if (currentQuestion?.difficulte === "moyen") xpGain = 15
      if (currentQuestion?.difficulte === "difficile") xpGain = 25

      // Bonus de mode
      if (gameMode === "expert") xpGain *= 2
      if (gameMode === "chrono" && timeLeft > 3) xpGain += 5
      if (gameMode === "marathon") xpGain += Math.floor((modeProgress + 1) / 5)

      // Bonus de série parfaite
      if (newStreak >= 3) xpGain += 5
      if (newStreak >= 5) xpGain += 10
      if (newStreak >= 8) xpGain += 20

      setXp((prev) => prev + xpGain)
      setLevel(calculateLevel(xp + xpGain))

      // Enregistrer dans le système de stockage local (pour compatibilité)
      storageManager.recordAnswer(
        true,
        currentQuestion?.categorie || "Inconnu",
        currentQuestion?.difficulte || "facile",
        xpGain,
        newStreak,
      )
    } else {
      setCurrentStreak(0)
      setStreakType("normal")
      setScoreAnimationType("normal")
      storageManager.resetStreak()

      storageManager.recordAnswer(
        false,
        currentQuestion?.categorie || "Inconnu",
        currentQuestion?.difficulte || "facile",
        0,
        0,
      )
    }

    // Gestion des modes avec limite de questions
    if (gameMode === "challenge" || gameMode === "marathon") {
      setQuestionsRemaining((prev) => prev - 1)
      setModeProgress((prev) => prev + 1)
    }

    setShowEffect(true)
  }

  const handleEffectComplete = useCallback(() => {
    setShowEffect(false)
  }, [])

  const handleBadgeUnlock = useCallback(
    (badge: BadgeType) => {
      setNewBadges((prev) => [...prev, badge])
      storageManager.unlockBadge(badge.id)

      // Retirer le badge de la liste des nouveaux après 3 secondes
      setTimeout(() => {
        setNewBadges((prev) => prev.filter((b) => b.id !== badge.id))
      }, 3000)
    },
    [storageManager],
  )

  // FONCTION MODIFIÉE - Accepte maintenant une config optionnelle
  const startGame = (config?: any) => {
    setGameStarted(true)
    setSessionStartTime(Date.now())
    setSessionCategories([])
    storageManager.startSession()

    // CORRECTION : Passer la config à fetchQuestion
    fetchQuestion(config)
  }

  const backToHome = () => {
    // Sauvegarder les résultats de la session dans le profil
    if (currentPlayer && totalQuestions > 0) {
      const sessionDuration = Math.floor((Date.now() - sessionStartTime) / 1000)

      profileManager.recordGameResult(
        currentPlayer.id,
        gameMode,
        score,
        totalQuestions,
        maxStreak,
        xp - currentPlayer.xp, // XP gagné cette session
        sessionCategories,
      )

      // Mettre à jour le profil avec les nouvelles stats
      profileManager.updateProfile(currentPlayer.id, {
        totalScore: currentPlayer.totalScore + score,
        totalQuestions: currentPlayer.totalQuestions + totalQuestions,
        totalCorrectAnswers: currentPlayer.totalCorrectAnswers + score,
        xp,
        level,
        currentStreak,
        maxStreak: Math.max(currentPlayer.maxStreak, maxStreak),
        unlockedBadges: badges.filter((b) => b.unlocked).map((b) => b.id),
        lastPlayedAt: new Date().toISOString(),
      })
    }

    // Terminer la session courante
    storageManager.endSession()

    // Reset complet
    setScore(0)
    setTotalQuestions(0)
    setCurrentQuestion(null)
    setShowResult(false)
    setUserAnswer(null)
    setGameStarted(false)
    setShowEffect(false)
    setTriggerScoreAnimation(false)
    setTriggerStreakAnimation(false)
    setNewBadges([])
    setGameEnded(false)
    setWinner(null)
    setMultiplayerState(null)
    setGameMode("classic")
    setGameModeConfig({})
    setQuestionsRemaining(0)
    setModeProgress(0)
    setTimerActive(false)
    setTimeLeft(0)
    setSelectedModeForConfig(null)
    setSelectedCategory("")
    setPlayers(["Joueur 1", "Joueur 2"])
    setSelectedPlayers([])
    setSessionStartTime(0)
    setSessionCategories([])

    // Reset des types d'animation
    setScoreAnimationType("normal")
    setStreakType("normal")

    // Remettre les stats du profil
    if (currentPlayer) {
      setCurrentStreak(currentPlayer.currentStreak)
      setMaxStreak(currentPlayer.maxStreak)
      setXp(currentPlayer.xp)
      setLevel(currentPlayer.level)
    } else {
      setCurrentStreak(0)
      setMaxStreak(0)
      setXp(0)
      setLevel(1)
    }
  }

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case "facile":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "moyen":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "difficile":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  // FONCTION MODIFIÉE - Passer la config directement
  const handleModeSelect = (mode: GameMode, config: any) => {
    console.log("=== HANDLE MODE SELECT ===")
    console.log("Mode sélectionné:", mode)
    console.log("Config reçue:", config)

    setGameMode(mode)
    setGameModeConfig(config)
    setSelectedModeForConfig(null)

    const modeConfig = getGameModeConfig(mode)

    // Configuration spécifique par mode
    if (mode === "challenge") {
      setQuestionsRemaining(5)
      setModeProgress(0)
      console.log("🎲 Mode défi configuré avec catégorie:", config.category)
    } else if (mode === "marathon") {
      setQuestionsRemaining(20)
      setModeProgress(0)
    } else if (mode === "multiplayer") {
      const players: Player[] = config.players.map((profile: PlayerProfile, index: number) => ({
        id: profile.id,
        name: profile.name,
        score: 0,
        streak: 0,
        lives: 3,
        isActive: index === 0,
      }))

      setMultiplayerState({
        players,
        currentPlayerIndex: 0,
        round: 1,
        maxRounds: 50,
      })
    }

    // CORRECTION : Passer la config directement à startGame
    startGame(config)
  }

  const handleModeClick = (mode: GameMode) => {
    if (mode === "challenge") {
      setSelectedModeForConfig(mode)
    } else if (mode === "multiplayer") {
      setShowProfileSelector(true)
      setSelectedModeForConfig(mode)
    } else {
      handleModeSelect(mode, {})
    }
  }

  const handleStartChallenge = () => {
    if (selectedCategory) {
      console.log("=== DÉMARRAGE DÉFI ===")
      console.log("Catégorie sélectionnée:", selectedCategory)
      handleModeSelect("challenge", { category: selectedCategory })
    }
  }

  const handleProfileSelect = (profile: PlayerProfile) => {
    if (selectedModeForConfig === "multiplayer") {
      if (!selectedPlayers.find((p) => p.id === profile.id)) {
        const newSelectedPlayers = [...selectedPlayers, profile]
        setSelectedPlayers(newSelectedPlayers)

        if (newSelectedPlayers.length >= 2) {
          setShowProfileSelector(false)
          handleModeSelect("multiplayer", { players: newSelectedPlayers })
        }
      }
    } else {
      // Sauvegarder les stats de la session actuelle pour l'ancien profil
      if (currentPlayer && totalQuestions > 0 && gameStarted) {
        const sessionDuration = Math.floor((Date.now() - sessionStartTime) / 1000)

        profileManager.recordGameResult(
          currentPlayer.id,
          gameMode,
          score,
          totalQuestions,
          maxStreak,
          xp - currentPlayer.xp, // XP gagné cette session
          sessionCategories,
        )

        profileManager.updateProfile(currentPlayer.id, {
          totalScore: currentPlayer.totalScore + score,
          totalQuestions: currentPlayer.totalQuestions + totalQuestions,
          totalCorrectAnswers: currentPlayer.totalCorrectAnswers + score,
          xp,
          level,
          currentStreak,
          maxStreak: Math.max(currentPlayer.maxStreak, maxStreak),
          unlockedBadges: badges.filter((b) => b.unlocked).map((b) => b.id),
          lastPlayedAt: new Date().toISOString(),
        })
      }

      // Changer de profil
      setCurrentPlayer(profile)
      profileManager.setCurrentPlayer(profile.id)

      // Charger les stats du nouveau profil
      setCurrentStreak(profile.currentStreak)
      setMaxStreak(profile.maxStreak)
      setXp(profile.xp)
      setLevel(profile.level)

      // Mettre à jour les badges
      const updatedBadges = BADGES.map((badge) => ({
        ...badge,
        unlocked: profile.unlockedBadges.includes(badge.id),
      }))
      setBadges(updatedBadges)

      setShowProfileSelector(false)

      // Si on était en cours de jeu, afficher une notification
      if (gameStarted && totalQuestions > 0) {
        setProfileChangeNotification(`Profil changé vers ${profile.name} !`)
        setTimeout(() => setProfileChangeNotification(null), 3000)
      }

      if (selectedModeForConfig) {
        if (selectedModeForConfig === "challenge") {
          // Aller à la config du défi
        } else {
          handleModeSelect(selectedModeForConfig, {})
        }
      }
    }
  }

  // CORRECTION: Callback mémorisé pour éviter les re-renders
  const handleTimeUp = useCallback(() => {
    if (gameMode === "chrono" && !showResult) {
      // Réponse automatique fausse
      handleAnswer(false)
    }
  }, [gameMode, showResult])

  const nextPlayer = () => {
    if (!multiplayerState) return

    const activePlayers = multiplayerState.players.filter((p) => p.lives > 0)
    if (activePlayers.length <= 1) {
      // Fin de partie
      setGameEnded(true)
      setWinner(activePlayers[0] || null)
      return
    }

    let nextIndex = (multiplayerState.currentPlayerIndex + 1) % multiplayerState.players.length

    // Trouver le prochain joueur actif
    while (multiplayerState.players[nextIndex].lives === 0) {
      nextIndex = (nextIndex + 1) % multiplayerState.players.length
    }

    setMultiplayerState({
      ...multiplayerState,
      currentPlayerIndex: nextIndex,
      round: multiplayerState.round + 1,
    })
  }

  const handleNextQuestion = () => {
    // Vérifier fin de mode
    if ((gameMode === "challenge" || gameMode === "marathon") && questionsRemaining <= 1) {
      // Fin du mode
      setGameEnded(true)
      return
    }

    if (gameMode === "multiplayer") {
      nextPlayer()
    }

    // CORRECTION : Passer la config actuelle pour les questions suivantes
    fetchQuestion(gameModeConfig)
  }

  const restartCurrentMode = () => {
    setScore(0)
    setTotalQuestions(0)
    setCurrentQuestion(null)
    setShowResult(false)
    setUserAnswer(null)
    setShowEffect(false)
    setTriggerScoreAnimation(false)
    setTriggerStreakAnimation(false)
    setGameEnded(false)
    setWinner(null)
    setSessionCategories([])

    // Reset des types d'animation
    setScoreAnimationType("normal")
    setStreakType("normal")

    // Remettre les stats du profil
    if (currentPlayer) {
      setCurrentStreak(currentPlayer.currentStreak)
    } else {
      setCurrentStreak(0)
    }

    // Réinitialiser selon le mode
    if (gameMode === "challenge") {
      setQuestionsRemaining(5)
      setModeProgress(0)
    } else if (gameMode === "marathon") {
      setQuestionsRemaining(20)
      setModeProgress(0)
    } else if (gameMode === "multiplayer" && multiplayerState) {
      const resetPlayers = multiplayerState.players.map((p) => ({
        ...p,
        score: 0,
        streak: 0,
        lives: 3,
      }))
      setMultiplayerState({
        ...multiplayerState,
        players: resetPlayers,
        currentPlayerIndex: 0,
        round: 1,
      })
    }

    setSessionStartTime(Date.now())
    // CORRECTION : Passer la config actuelle au restart
    fetchQuestion(gameModeConfig)
  }

  // Configuration du mode défi
  if (selectedModeForConfig === "challenge") {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl card-adaptive">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setSelectedModeForConfig(null)}>
                <Home className="h-4 w-4" />
              </Button>
              <CardTitle className="flex items-center gap-2 text-card-foreground">
                🎲 Mode Défi - Configuration
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="category" className="text-card-foreground">
                Choisissez une catégorie :
              </Label>
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

            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold mb-2 text-card-foreground">Règles du Mode Défi :</h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
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
      </div>
    )
  }

  // Écran d'accueil avec sélection des modes
  if (!gameStarted) {
    return (
      <div className={`min-h-screen p-4 ${themeManager.getBackgroundClass()}`}>
        {/* Particules flottantes de fond */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="floating-particle floating-particle-adaptive absolute w-2 h-2 rounded-full"
              style={{
                left: `${10 + i * 12}%`,
                top: `${15 + (i % 4) * 20}%`,
                animationDelay: `${i * 0.7}s`,
              }}
            />
          ))}
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Header SIMPLIFIÉ - SUPPRESSION DES ARRIÈRE-PLANS BLANCS */}
          <div className="h-20 flex justify-between items-center mb-6 flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Image src="/logo.png" alt="Green GPT Battle Logo" width={40} height={40} />
              <h1 className="text-2xl font-bold text-green-600 dark:text-green-400">Green GPT Battle</h1>
              {currentPlayer && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowProfileSelector(true)}
                  className="ml-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                >
                  <User className="h-4 w-4 mr-1" />
                  {currentPlayer.avatar} {currentPlayer.name}
                  <span className="ml-1 text-xs opacity-60">▼</span>
                </Button>
              )}
            </div>

            <div className="flex items-center gap-4">
              <ProgressCircle progress={xpProgress} level={level} />

              <Button
                onClick={() => setShowStats(true)}
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                <BarChart3 className="h-4 w-4" />
                Stats
              </Button>

              <Button
                onClick={() => setShowThemeSettings(true)}
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                <Settings className="h-4 w-4" />
                Thème
              </Button>

              <Button
                onClick={backToHome}
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                <Home className="h-4 w-4" />
                Accueil
              </Button>
            </div>
          </div>

          {/* NOUVELLE SECTION HERO AVEC SLOGANS */}
          <HeroSection
            totalPlayers={1247 + (currentPlayer ? profileManager.getProfiles().length * 47 : 0)}
            totalQuestions={15832 + totalQuestions * 3}
          />

          {/* Sélection des modes de jeu */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-center mb-6 text-green-600 dark:text-green-400">
              Choisissez votre mode de jeu
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {GAME_MODES.map((mode) => (
                <Card
                  key={mode.id}
                  className="cursor-pointer hover:shadow-xl transition-all transform hover:scale-105 relative overflow-hidden card-adaptive-translucent border-2 hover:border-green-300"
                  onClick={() => handleModeClick(mode.id)}
                >
                  <div className={`absolute top-0 left-0 right-0 h-2 ${mode.color}`} />
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-3 text-xl text-card-foreground">
                      <span className="text-3xl">{mode.icon}</span>
                      <div>
                        <div>{mode.name}</div>
                        <p className="text-sm text-muted-foreground font-normal">{mode.description}</p>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {mode.rules.slice(0, 2).map((rule, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {rule}
                          </Badge>
                        ))}
                      </div>

                      {/* Indicateurs spéciaux */}
                      <div className="flex gap-2 flex-wrap">
                        {mode.settings.timeLimit && (
                          <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                            ⏱️ {mode.settings.timeLimit}s
                          </Badge>
                        )}
                        {mode.settings.questionCount && (
                          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            📊 {mode.settings.questionCount}Q
                          </Badge>
                        )}
                        {mode.settings.difficulty && (
                          <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                            🎯 {mode.settings.difficulty}
                          </Badge>
                        )}
                        {mode.settings.multiplayer && (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            👥 Multi
                          </Badge>
                        )}
                      </div>

                      <Button
                        className="w-full mt-4 bg-transparent"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleModeClick(mode.id)
                        }}
                      >
                        {mode.id === "challenge" || mode.id === "multiplayer" ? "Configurer" : "Jouer"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* NOUVEAU FOOTER */}
          <FooterSection />
        </div>

        {/* Modals */}
        {showProfileSelector && (
          <PlayerProfileSelector
            onProfileSelect={handleProfileSelect}
            onClose={() => {
              setShowProfileSelector(false)
              setSelectedModeForConfig(null)
              setSelectedPlayers([])
            }}
            mode={selectedModeForConfig === "multiplayer" ? "multiplayer" : "single"}
            selectedProfiles={selectedPlayers}
            maxPlayers={4}
          />
        )}

        <ThemeSettings isOpen={showThemeSettings} onClose={() => setShowThemeSettings(false)} />
        <StatsDashboard isOpen={showStats} onClose={() => setShowStats(false)} />
      </div>
    )
  }

  return (
    <div className={`min-h-screen p-4 ${themeManager.getBackgroundClass()}`}>
      {/* Effets visuels globaux */}
      <VisualEffects
        isCorrect={userAnswer !== null ? userAnswer === currentQuestion?.reponse : null}
        category={currentQuestion?.categorie || ""}
        showEffect={showEffect}
        onEffectComplete={handleEffectComplete}
      />

      {/* Notifications de nouveaux badges */}
      {newBadges.length > 0 && (
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {newBadges.map((badge) => (
            <div
              key={badge.id}
              className="bg-yellow-100 border border-yellow-300 rounded-lg p-3 shadow-lg badge-unlock dark:bg-yellow-900 dark:border-yellow-700"
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">{badge.icon}</span>
                <div>
                  <div className="font-bold text-yellow-800 dark:text-yellow-200">Badge débloqué !</div>
                  <div className="text-sm text-yellow-700 dark:text-yellow-300">{badge.name}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Notification de changement de profil */}
      {profileChangeNotification && (
        <div className="fixed top-4 left-4 z-50">
          <div className="bg-blue-100 border border-blue-300 rounded-lg p-3 shadow-lg dark:bg-blue-900 dark:border-blue-700">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <div className="font-medium text-blue-800 dark:text-blue-200">{profileChangeNotification}</div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header SIMPLIFIÉ - SUPPRESSION DES ARRIÈRE-PLANS BLANCS */}
        <div className="h-20 flex justify-between items-center mb-6 flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="Green GPT Battle Logo" width={40} height={40} />
            <h1 className="text-2xl font-bold text-green-600 dark:text-green-400">Green GPT Battle</h1>
            {currentPlayer && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowProfileSelector(true)}
                className="ml-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                <User className="h-4 w-4 mr-1" />
                {currentPlayer.avatar} {currentPlayer.name}
                <span className="ml-1 text-xs opacity-60">▼</span>
              </Button>
            )}
          </div>

          <div className="flex items-center gap-4">
            <ProgressCircle progress={xpProgress} level={level} />

            <Button
              onClick={() => setShowStats(true)}
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              <BarChart3 className="h-4 w-4" />
              Stats
            </Button>

            <Button
              onClick={() => setShowThemeSettings(true)}
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              <Settings className="h-4 w-4" />
              Thème
            </Button>

            <Button
              onClick={backToHome}
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              <Home className="h-4 w-4" />
              Accueil
            </Button>
          </div>
        </div>

        {/* NOUVELLE SECTION DE STATS */}
        {gameStarted && (
          <GameStatsHUD
            score={score}
            totalQuestions={totalQuestions}
            currentStreak={currentStreak}
            maxStreak={maxStreak}
            triggerScoreAnimation={triggerScoreAnimation}
            triggerStreakAnimation={triggerStreakAnimation}
            scoreAnimationType={scoreAnimationType}
            streakType={streakType}
          />
        )}

        {/* Timer pour le mode chrono */}
        {gameMode === "chrono" && timerActive && (
          <div className="mb-6">
            <GameTimer duration={5} isActive={timerActive} onTimeUp={handleTimeUp} />
          </div>
        )}

        {/* HUD Multijoueur */}
        {gameMode === "multiplayer" && multiplayerState && (
          <div className="mb-6">
            <MultiplayerHUD
              players={multiplayerState.players}
              currentPlayerIndex={multiplayerState.currentPlayerIndex}
              round={multiplayerState.round}
              maxRounds={multiplayerState.maxRounds}
            />
          </div>
        )}

        {/* Carte principale du quiz */}
        {gameStarted && (
          <div className="mb-12">
            <EnhancedQuizInterface
              currentQuestion={currentQuestion}
              loading={loading}
              showResult={showResult}
              userAnswer={userAnswer}
              score={score}
              totalQuestions={totalQuestions}
              currentStreak={currentStreak}
              onAnswer={handleAnswer}
              onNextQuestion={handleNextQuestion}
              gameMode={gameMode}
              questionsRemaining={questionsRemaining}
            />
          </div>
        )}

        {/* Système de badges */}
        <BadgeSystem badges={badges} stats={gameStats} onBadgeUnlock={handleBadgeUnlock} />

        {/* RECORD SEUL EN DESSOUS DES BADGES */}
        {totalQuestions > 0 && maxStreak > 0 && (
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900 dark:to-yellow-900 rounded-lg border border-amber-200 dark:border-amber-700">
              <span className="text-lg">🏅</span>
              <span className="font-semibold text-amber-800 dark:text-amber-200">Record : {maxStreak}</span>
            </div>
          </div>
        )}
      </div>

      {/* Écrans de fin selon le mode */}
      {gameMode === "challenge" && gameEnded && (
        <ChallengeEndScreen
          score={score}
          totalQuestions={5}
          category={gameModeConfig.category || "Écologie"}
          categoryIcon="🎲"
          onRestart={restartCurrentMode}
          onBackToModes={backToHome}
        />
      )}

      {gameMode === "marathon" && gameEnded && (
        <MarathonEndScreen
          score={score}
          totalQuestions={20}
          maxStreak={maxStreak}
          onRestart={restartCurrentMode}
          onBackToMenu={backToHome}
        />
      )}

      {gameMode === "multiplayer" && gameEnded && (
        <MultiplayerEndScreen
          players={multiplayerState?.players || []}
          winner={winner}
          onRestart={restartCurrentMode}
          onBackToMenu={backToHome}
        />
      )}

      {/* Modals */}
      {showProfileSelector && (
        <PlayerProfileSelector
          onProfileSelect={handleProfileSelect}
          onClose={() => {
            setShowProfileSelector(false)
            setSelectedModeForConfig(null)
            setSelectedPlayers([])
          }}
          mode={selectedModeForConfig === "multiplayer" ? "multiplayer" : "single"}
          selectedProfiles={selectedPlayers}
          maxPlayers={4}
        />
      )}

      <ThemeSettings isOpen={showThemeSettings} onClose={() => setShowThemeSettings(false)} />
      <StatsDashboard isOpen={showStats} onClose={() => setShowStats(false)} />
    </div>
  )
}
