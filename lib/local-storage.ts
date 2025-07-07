export interface UserProgress {
  // Statistiques de base
  totalScore: number
  totalQuestions: number
  totalCorrectAnswers: number

  // Progression
  xp: number
  level: number

  // Streaks
  currentStreak: number
  maxStreak: number

  // Badges
  unlockedBadges: string[]

  // Historique des sessions
  sessions: GameSession[]

  // Statistiques avancées
  categoryStats: Record<string, CategoryStats>
  difficultyStats: Record<string, DifficultyStats>

  // Métadonnées
  createdAt: string
  lastPlayedAt: string
  totalPlayTime: number
}

export interface GameSession {
  id: string
  date: string
  score: number
  totalQuestions: number
  maxStreak: number
  xpGained: number
  duration: number // en secondes
  categories: string[]
}

export interface CategoryStats {
  questionsAnswered: number
  correctAnswers: number
  averageTime: number
}

export interface DifficultyStats {
  questionsAnswered: number
  correctAnswers: number
  xpGained: number
}

const STORAGE_KEY = "green-gpt-battle-progress"
const STORAGE_VERSION = "1.0"

// Données par défaut
const defaultProgress: UserProgress = {
  totalScore: 0,
  totalQuestions: 0,
  totalCorrectAnswers: 0,
  xp: 0,
  level: 1,
  currentStreak: 0,
  maxStreak: 0,
  unlockedBadges: [],
  sessions: [],
  categoryStats: {},
  difficultyStats: {
    facile: { questionsAnswered: 0, correctAnswers: 0, xpGained: 0 },
    moyen: { questionsAnswered: 0, correctAnswers: 0, xpGained: 0 },
    difficile: { questionsAnswered: 0, correctAnswers: 0, xpGained: 0 },
  },
  createdAt: new Date().toISOString(),
  lastPlayedAt: new Date().toISOString(),
  totalPlayTime: 0,
}

export class LocalStorageManager {
  private static instance: LocalStorageManager
  private progress: UserProgress
  private sessionStartTime = 0
  private currentSession: Partial<GameSession> = {}

  private constructor() {
    this.progress = this.loadProgress()
  }

  public static getInstance(): LocalStorageManager {
    if (!LocalStorageManager.instance) {
      LocalStorageManager.instance = new LocalStorageManager()
    }
    return LocalStorageManager.instance
  }

  // Charger les données depuis localStorage
  private loadProgress(): UserProgress {
    try {
      if (typeof window === "undefined") return defaultProgress

      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) return defaultProgress

      const parsed = JSON.parse(stored)

      // Vérifier la version et migrer si nécessaire
      if (parsed.version !== STORAGE_VERSION) {
        return this.migrateData(parsed)
      }

      return { ...defaultProgress, ...parsed.data }
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error)
      return defaultProgress
    }
  }

  // Sauvegarder les données dans localStorage
  private saveProgress(): void {
    try {
      if (typeof window === "undefined") return

      const dataToSave = {
        version: STORAGE_VERSION,
        data: this.progress,
        savedAt: new Date().toISOString(),
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave))
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error)
    }
  }

  // Migration des données (pour les futures versions)
  private migrateData(oldData: any): UserProgress {
    console.log("Migration des données depuis une ancienne version")
    // Ici on pourrait ajouter la logique de migration
    return defaultProgress
  }

  // Démarrer une nouvelle session
  public startSession(): void {
    this.sessionStartTime = Date.now()
    this.currentSession = {
      id: `session_${Date.now()}`,
      date: new Date().toISOString(),
      score: 0,
      totalQuestions: 0,
      maxStreak: 0,
      xpGained: 0,
      categories: [],
    }
  }

  // Enregistrer une réponse
  public recordAnswer(
    isCorrect: boolean,
    category: string,
    difficulty: string,
    xpGained: number,
    currentStreak: number,
  ): void {
    // Mettre à jour les stats globales
    this.progress.totalQuestions++
    if (isCorrect) {
      this.progress.totalScore++
      this.progress.totalCorrectAnswers++
    }

    // Mettre à jour la session courante
    if (this.currentSession) {
      this.currentSession.totalQuestions = (this.currentSession.totalQuestions || 0) + 1
      if (isCorrect) {
        this.currentSession.score = (this.currentSession.score || 0) + 1
      }
      this.currentSession.xpGained = (this.currentSession.xpGained || 0) + xpGained
      this.currentSession.maxStreak = Math.max(this.currentSession.maxStreak || 0, currentStreak)

      // Ajouter la catégorie si pas déjà présente
      if (!this.currentSession.categories?.includes(category)) {
        this.currentSession.categories = [...(this.currentSession.categories || []), category]
      }
    }

    // Stats par catégorie
    if (!this.progress.categoryStats[category]) {
      this.progress.categoryStats[category] = {
        questionsAnswered: 0,
        correctAnswers: 0,
        averageTime: 0,
      }
    }
    this.progress.categoryStats[category].questionsAnswered++
    if (isCorrect) {
      this.progress.categoryStats[category].correctAnswers++
    }

    // Stats par difficulté
    if (this.progress.difficultyStats[difficulty]) {
      this.progress.difficultyStats[difficulty].questionsAnswered++
      if (isCorrect) {
        this.progress.difficultyStats[difficulty].correctAnswers++
      }
      this.progress.difficultyStats[difficulty].xpGained += xpGained
    }

    // Mettre à jour les streaks
    this.progress.currentStreak = currentStreak
    this.progress.maxStreak = Math.max(this.progress.maxStreak, currentStreak)

    // Mettre à jour XP et niveau
    this.progress.xp += xpGained
    this.progress.level = Math.floor(this.progress.xp / 100) + 1

    // Mettre à jour la dernière activité
    this.progress.lastPlayedAt = new Date().toISOString()

    this.saveProgress()
  }

  // Débloquer un badge
  public unlockBadge(badgeId: string): void {
    if (!this.progress.unlockedBadges.includes(badgeId)) {
      this.progress.unlockedBadges.push(badgeId)
      this.saveProgress()
    }
  }

  // Terminer la session
  public endSession(): void {
    if (this.currentSession && this.sessionStartTime) {
      const duration = Math.floor((Date.now() - this.sessionStartTime) / 1000)

      const completedSession: GameSession = {
        ...this.currentSession,
        duration,
      } as GameSession

      this.progress.sessions.push(completedSession)
      this.progress.totalPlayTime += duration

      // Garder seulement les 50 dernières sessions
      if (this.progress.sessions.length > 50) {
        this.progress.sessions = this.progress.sessions.slice(-50)
      }

      this.saveProgress()
    }
  }

  // Reset du streak (quand mauvaise réponse)
  public resetStreak(): void {
    this.progress.currentStreak = 0
    this.saveProgress()
  }

  // Getters pour accéder aux données
  public getProgress(): UserProgress {
    return { ...this.progress }
  }

  public getTotalXP(): number {
    return this.progress.xp
  }

  public getLevel(): number {
    return this.progress.level
  }

  public getCurrentStreak(): number {
    return this.progress.currentStreak
  }

  public getMaxStreak(): number {
    return this.progress.maxStreak
  }

  public getUnlockedBadges(): string[] {
    return [...this.progress.unlockedBadges]
  }

  public getTotalScore(): number {
    return this.progress.totalScore
  }

  public getTotalQuestions(): number {
    return this.progress.totalQuestions
  }

  // Statistiques avancées
  public getCategoryStats(): Record<string, CategoryStats> {
    return { ...this.progress.categoryStats }
  }

  public getDifficultyStats(): Record<string, DifficultyStats> {
    return { ...this.progress.difficultyStats }
  }

  public getRecentSessions(limit = 10): GameSession[] {
    return this.progress.sessions.slice(-limit).reverse()
  }

  // Utilitaires
  public exportData(): string {
    return JSON.stringify(
      {
        version: STORAGE_VERSION,
        data: this.progress,
        exportedAt: new Date().toISOString(),
      },
      null,
      2,
    )
  }

  public importData(jsonData: string): boolean {
    try {
      const parsed = JSON.parse(jsonData)
      if (parsed.data) {
        this.progress = { ...defaultProgress, ...parsed.data }
        this.saveProgress()
        return true
      }
      return false
    } catch (error) {
      console.error("Erreur lors de l'import:", error)
      return false
    }
  }

  public resetAllData(): void {
    this.progress = { ...defaultProgress }
    this.saveProgress()
  }

  public getPlayTime(): string {
    const hours = Math.floor(this.progress.totalPlayTime / 3600)
    const minutes = Math.floor((this.progress.totalPlayTime % 3600) / 60)

    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }
}
