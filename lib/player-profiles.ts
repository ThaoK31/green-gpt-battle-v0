export interface PlayerProfile {
  id: string
  name: string
  avatar: string
  createdAt: string
  lastPlayedAt: string

  // Statistiques globales
  totalScore: number
  totalQuestions: number
  totalCorrectAnswers: number
  xp: number
  level: number
  currentStreak: number
  maxStreak: number
  unlockedBadges: string[]

  // Statistiques par mode
  modeStats: Record<
    string,
    {
      gamesPlayed: number
      totalScore: number
      totalQuestions: number
      bestStreak: number
      xpGained: number
    }
  >

  // Statistiques par catégorie
  categoryStats: Record<
    string,
    {
      questionsAnswered: number
      correctAnswers: number
      averageTime: number
    }
  >

  // Préférences
  preferences: {
    theme: "light" | "dark" | "auto"
    colorScheme: "green" | "blue" | "purple" | "orange"
    soundEnabled: boolean
    animationsEnabled: boolean
  }
}

const STORAGE_KEY_PROFILES = "green-gpt-battle-profiles"
const STORAGE_KEY_CURRENT_PLAYER = "green-gpt-battle-current-player"

export class PlayerProfileManager {
  private static instance: PlayerProfileManager
  private profiles: PlayerProfile[] = []
  private currentPlayerId: string | null = null

  private constructor() {
    this.loadProfiles()
  }

  public static getInstance(): PlayerProfileManager {
    if (!PlayerProfileManager.instance) {
      PlayerProfileManager.instance = new PlayerProfileManager()
    }
    return PlayerProfileManager.instance
  }

  private loadProfiles(): void {
    try {
      if (typeof window === "undefined") return

      const stored = localStorage.getItem(STORAGE_KEY_PROFILES)
      if (stored) {
        this.profiles = JSON.parse(stored)
      }

      const currentPlayer = localStorage.getItem(STORAGE_KEY_CURRENT_PLAYER)
      if (currentPlayer) {
        this.currentPlayerId = currentPlayer
      }
    } catch (error) {
      console.error("Erreur lors du chargement des profils:", error)
    }
  }

  private saveProfiles(): void {
    try {
      if (typeof window === "undefined") return
      localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(this.profiles))
      if (this.currentPlayerId) {
        localStorage.setItem(STORAGE_KEY_CURRENT_PLAYER, this.currentPlayerId)
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des profils:", error)
    }
  }

  public createProfile(name: string, avatar: string): PlayerProfile {
    const profile: PlayerProfile = {
      id: `player_${Date.now()}`,
      name,
      avatar,
      createdAt: new Date().toISOString(),
      lastPlayedAt: new Date().toISOString(),
      totalScore: 0,
      totalQuestions: 0,
      totalCorrectAnswers: 0,
      xp: 0,
      level: 1,
      currentStreak: 0,
      maxStreak: 0,
      unlockedBadges: [],
      modeStats: {},
      categoryStats: {},
      preferences: {
        theme: "auto",
        colorScheme: "green",
        soundEnabled: true,
        animationsEnabled: true,
      },
    }

    this.profiles.push(profile)
    this.saveProfiles()
    return profile
  }

  public getProfiles(): PlayerProfile[] {
    return [...this.profiles]
  }

  public getCurrentPlayer(): PlayerProfile | null {
    if (!this.currentPlayerId) return null
    return this.profiles.find((p) => p.id === this.currentPlayerId) || null
  }

  public setCurrentPlayer(playerId: string): void {
    this.currentPlayerId = playerId
    this.saveProfiles()
  }

  public updateProfile(playerId: string, updates: Partial<PlayerProfile>): void {
    const profileIndex = this.profiles.findIndex((p) => p.id === playerId)
    if (profileIndex !== -1) {
      this.profiles[profileIndex] = { ...this.profiles[profileIndex], ...updates }
      this.saveProfiles()
    }
  }

  public deleteProfile(playerId: string): void {
    this.profiles = this.profiles.filter((p) => p.id !== playerId)
    if (this.currentPlayerId === playerId) {
      this.currentPlayerId = null
    }
    this.saveProfiles()
  }

  public recordGameResult(
    playerId: string,
    mode: string,
    score: number,
    totalQuestions: number,
    streak: number,
    xpGained: number,
    categories: string[],
  ): void {
    const profile = this.profiles.find((p) => p.id === playerId)
    if (!profile) return

    // Mettre à jour les stats globales
    profile.totalScore += score
    profile.totalQuestions += totalQuestions
    profile.totalCorrectAnswers += score
    profile.xp += xpGained
    profile.level = Math.floor(profile.xp / 100) + 1
    profile.maxStreak = Math.max(profile.maxStreak, streak)
    profile.lastPlayedAt = new Date().toISOString()

    // Mettre à jour les stats par mode
    if (!profile.modeStats[mode]) {
      profile.modeStats[mode] = {
        gamesPlayed: 0,
        totalScore: 0,
        totalQuestions: 0,
        bestStreak: 0,
        xpGained: 0,
      }
    }
    profile.modeStats[mode].gamesPlayed++
    profile.modeStats[mode].totalScore += score
    profile.modeStats[mode].totalQuestions += totalQuestions
    profile.modeStats[mode].bestStreak = Math.max(profile.modeStats[mode].bestStreak, streak)
    profile.modeStats[mode].xpGained += xpGained

    // Mettre à jour les stats par catégorie
    categories.forEach((category) => {
      if (!profile.categoryStats[category]) {
        profile.categoryStats[category] = {
          questionsAnswered: 0,
          correctAnswers: 0,
          averageTime: 0,
        }
      }
      // Note: On pourrait ajouter plus de logique ici pour les stats par catégorie
    })

    this.saveProfiles()
  }
}
