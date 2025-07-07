export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  condition: (stats: GameStats) => boolean
  unlocked: boolean
}

export interface GameStats {
  score: number
  totalQuestions: number
  currentStreak: number
  maxStreak: number
  correctAnswers: number
  level: number
  xp: number
}

export const BADGES: Badge[] = [
  {
    id: "first-correct",
    name: "Premier Pas",
    description: "Première bonne réponse",
    icon: "🌱",
    condition: (stats) => stats.correctAnswers >= 1,
    unlocked: false,
  },
  {
    id: "streak-3",
    name: "En Forme",
    description: "3 bonnes réponses d'affilée",
    icon: "🔥",
    condition: (stats) => stats.maxStreak >= 3,
    unlocked: false,
  },
  {
    id: "streak-5",
    name: "Expert",
    description: "5 bonnes réponses d'affilée",
    icon: "⚡",
    condition: (stats) => stats.maxStreak >= 5,
    unlocked: false,
  },
  {
    id: "score-10",
    name: "Connaisseur",
    description: "10 bonnes réponses",
    icon: "🧠",
    condition: (stats) => stats.correctAnswers >= 10,
    unlocked: false,
  },
  {
    id: "perfectionist",
    name: "Perfectionniste",
    description: "100% de réussite sur 5+ questions",
    icon: "💎",
    condition: (stats) => stats.totalQuestions >= 5 && stats.score === stats.totalQuestions,
    unlocked: false,
  },
  {
    id: "persistent",
    name: "Persévérant",
    description: "20 questions répondues",
    icon: "🏆",
    condition: (stats) => stats.totalQuestions >= 20,
    unlocked: false,
  },
  {
    id: "eco-warrior",
    name: "Guerrier Vert",
    description: "Niveau 5 atteint",
    icon: "🌍",
    condition: (stats) => stats.level >= 5,
    unlocked: false,
  },
]

export function calculateLevel(xp: number): number {
  return Math.floor(xp / 100) + 1
}

export function getXPForNextLevel(level: number): number {
  return level * 100
}

export function getXPProgress(xp: number): number {
  const currentLevelXP = (calculateLevel(xp) - 1) * 100
  const nextLevelXP = calculateLevel(xp) * 100
  return ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100
}
