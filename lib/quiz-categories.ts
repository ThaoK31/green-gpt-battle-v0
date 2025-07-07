export interface QuizCategory {
  name: string
  icon: string
  subjects: string[]
  prompts: string[]
}

export const QUIZ_CATEGORIES: QuizCategory[] = [
  {
    name: "Changement Climatique",
    icon: "🌡️",
    subjects: ["réchauffement", "CO2", "effet de serre", "températures", "glaciers", "niveau des mers"],
    prompts: [
      "Génère une affirmation sur le réchauffement climatique avec des données chiffrées précises",
      "Crée une question sur les conséquences du changement climatique",
      "Pose une question sur les causes des émissions de gaz à effet de serre",
    ],
  },
  {
    name: "Biodiversité",
    icon: "🦋",
    subjects: ["espèces menacées", "extinction", "écosystèmes", "faune", "flore", "habitats"],
    prompts: [
      "Génère une question sur les espèces en voie de disparition",
      "Crée une affirmation sur la biodiversité et les écosystèmes",
      "Pose une question sur la protection des habitats naturels",
    ],
  },
  {
    name: "Énergies",
    icon: "⚡",
    subjects: ["renouvelables", "fossiles", "éolien", "solaire", "nucléaire", "consommation"],
    prompts: [
      "Génère une question comparative entre énergies renouvelables et fossiles",
      "Crée une affirmation sur l'efficacité des panneaux solaires ou éoliennes",
      "Pose une question sur la consommation énergétique mondiale",
    ],
  },
  {
    name: "Pollution",
    icon: "🏭",
    subjects: ["plastique", "air", "eau", "sols", "déchets", "microplastiques"],
    prompts: [
      "Génère une question sur la pollution plastique dans les océans",
      "Crée une affirmation sur la qualité de l'air en ville",
      "Pose une question sur les microplastiques et leur impact",
    ],
  },
  {
    name: "Océans",
    icon: "🌊",
    subjects: ["acidification", "coraux", "pêche", "niveau", "courants", "vie marine"],
    prompts: [
      "Génère une question sur l'acidification des océans",
      "Crée une affirmation sur les récifs coralliens",
      "Pose une question sur la surpêche et ses conséquences",
    ],
  },
  {
    name: "Forêts",
    icon: "🌳",
    subjects: ["déforestation", "Amazon", "reforestation", "bois", "papier", "carbone"],
    prompts: [
      "Génère une question sur la déforestation en Amazonie ou ailleurs",
      "Crée une affirmation sur le rôle des forêts dans le climat",
      "Pose une question sur la reforestation et ses bénéfices",
    ],
  },
  {
    name: "Agriculture",
    icon: "🌾",
    subjects: ["bio", "pesticides", "élevage", "végétarien", "eau", "sols"],
    prompts: [
      "Génère une question sur l'agriculture biologique vs conventionnelle",
      "Crée une affirmation sur l'impact de l'élevage sur l'environnement",
      "Pose une question sur l'usage de l'eau en agriculture",
    ],
  },
  {
    name: "Transport",
    icon: "🚗",
    subjects: ["électrique", "avion", "train", "vélo", "carburants", "mobilité"],
    prompts: [
      "Génère une question sur les véhicules électriques vs thermiques",
      "Crée une affirmation sur l'impact carbone des transports",
      "Pose une question sur les alternatives de mobilité durable",
    ],
  },
  {
    name: "Déchets",
    icon: "♻️",
    subjects: ["recyclage", "compost", "incinération", "tri", "réduction", "économie circulaire"],
    prompts: [
      "Génère une question sur l'efficacité du recyclage",
      "Crée une affirmation sur la réduction des déchets",
      "Pose une question sur le compostage et ses bénéfices",
    ],
  },
  {
    name: "Innovations",
    icon: "🔬",
    subjects: ["technologies vertes", "captage CO2", "hydrogène", "batteries", "smart cities"],
    prompts: [
      "Génère une question sur les nouvelles technologies écologiques",
      "Crée une affirmation sur l'hydrogène vert ou les batteries",
      "Pose une question sur les innovations pour capturer le CO2",
    ],
  },
]

// Système de rotation et historique
let categoryHistory: number[] = []
const lastUsedCategories: Set<number> = new Set()

export function getNextCategory(): QuizCategory {
  // Si on a utilisé toutes les catégories, on reset
  if (lastUsedCategories.size >= QUIZ_CATEGORIES.length) {
    lastUsedCategories.clear()
  }

  // Trouver les catégories non utilisées récemment
  const availableCategories = QUIZ_CATEGORIES.map((_, index) => index).filter((index) => !lastUsedCategories.has(index))

  // Sélectionner aléatoirement parmi les disponibles
  const selectedIndex = availableCategories[Math.floor(Math.random() * availableCategories.length)]

  // Marquer comme utilisée
  lastUsedCategories.add(selectedIndex)
  categoryHistory.push(selectedIndex)

  // Garder seulement les 5 dernières dans l'historique
  if (categoryHistory.length > 5) {
    categoryHistory = categoryHistory.slice(-5)
  }

  return QUIZ_CATEGORIES[selectedIndex]
}

export function getRandomPromptFromCategory(category: QuizCategory): string {
  return category.prompts[Math.floor(Math.random() * category.prompts.length)]
}

export function getRandomSubjectFromCategory(category: QuizCategory): string {
  return category.subjects[Math.floor(Math.random() * category.subjects.length)]
}
