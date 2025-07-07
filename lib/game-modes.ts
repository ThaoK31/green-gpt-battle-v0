import { QUIZ_CATEGORIES } from "./quiz-categories"

export type GameMode = "classic" | "chrono" | "challenge" | "marathon" | "multiplayer" | "expert"

export interface GameModeConfig {
  id: GameMode
  name: string
  description: string
  icon: string
  color: string
  rules: string[]
  settings: {
    timeLimit?: number
    questionCount?: number
    difficulty?: string
    multiplayer?: boolean
    category?: boolean
  }
}

export interface Player {
  id: string
  name: string
  score: number
  streak: number
  lives: number
  isActive: boolean
}

export interface MultiplayerState {
  players: Player[]
  currentPlayerIndex: number
  round: number
  maxRounds: number
}

export const GAME_MODES: GameModeConfig[] = [
  {
    id: "classic",
    name: "Mode Classique",
    description: "Le mode original avec questions variées",
    icon: "🎯",
    color: "bg-blue-500",
    rules: ["Questions variées", "Pas de limite de temps", "Progression libre"],
    settings: {},
  },
  {
    id: "chrono",
    name: "Mode Chrono",
    description: "5 secondes par question !",
    icon: "⏱️",
    color: "bg-red-500",
    rules: ["5 secondes par question", "Réponse automatique si timeout", "Bonus XP si réponse rapide"],
    settings: {
      timeLimit: 5,
    },
  },
  {
    id: "challenge",
    name: "Mode Défi",
    description: "5 questions d'une catégorie",
    icon: "🎲",
    color: "bg-purple-500",
    rules: ["5 questions", "Catégorie au choix", "Score sur 5", "Bonus si parfait"],
    settings: {
      questionCount: 5,
      category: true,
    },
  },
  {
    id: "marathon",
    name: "Mode Marathon",
    description: "20 questions, difficulté progressive",
    icon: "🏃‍♂️",
    color: "bg-orange-500",
    rules: ["20 questions", "Difficulté progressive", "Bonus XP croissant", "Endurance requise"],
    settings: {
      questionCount: 20,
    },
  },
  {
    id: "multiplayer",
    name: "Mode Multijoueur",
    description: "Jusqu'à 4 joueurs, tour par tour",
    icon: "👥",
    color: "bg-green-500",
    rules: ["2-4 joueurs", "3 vies par joueur", "Tour par tour", "Dernier survivant gagne"],
    settings: {
      multiplayer: true,
    },
  },
  {
    id: "expert",
    name: "Mode Expert",
    description: "Que des questions difficiles",
    icon: "🧠",
    color: "bg-gray-800",
    rules: ["Questions difficiles uniquement", "XP doublé", "Pour les experts", "Défi ultime"],
    settings: {
      difficulty: "difficile",
    },
  },
]

export function getGameModeConfig(mode: GameMode): GameModeConfig {
  return GAME_MODES.find((m) => m.id === mode) || GAME_MODES[0]
}

export { QUIZ_CATEGORIES }
