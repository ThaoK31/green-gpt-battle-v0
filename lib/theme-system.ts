export type ThemeMode = "light" | "dark" | "auto"

export interface ThemeConfig {
  mode: ThemeMode
}

export class ThemeManager {
  private static instance: ThemeManager
  private currentTheme: ThemeConfig = { mode: "auto" }
  private listeners: (() => void)[] = []

  private constructor() {
    this.loadTheme()
    this.applyTheme()
    this.setupSystemThemeListener()
  }

  public static getInstance(): ThemeManager {
    if (!ThemeManager.instance) {
      ThemeManager.instance = new ThemeManager()
    }
    return ThemeManager.instance
  }

  private loadTheme(): void {
    try {
      if (typeof window === "undefined") return
      const stored = localStorage.getItem("green-gpt-battle-theme")
      if (stored) {
        this.currentTheme = JSON.parse(stored)
      }
    } catch (error) {
      console.error("Erreur lors du chargement du thème:", error)
    }
  }

  private saveTheme(): void {
    try {
      if (typeof window === "undefined") return
      localStorage.setItem("green-gpt-battle-theme", JSON.stringify(this.currentTheme))
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du thème:", error)
    }
  }

  private setupSystemThemeListener(): void {
    if (typeof window === "undefined") return

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    mediaQuery.addEventListener("change", () => {
      if (this.currentTheme.mode === "auto") {
        this.applyTheme()
        this.notifyListeners()
      }
    })
  }

  private applyTheme(): void {
    if (typeof window === "undefined") return

    const root = document.documentElement

    // Appliquer le mode sombre/clair
    let isDark = false
    if (this.currentTheme.mode === "dark") {
      isDark = true
    } else if (this.currentTheme.mode === "light") {
      isDark = false
    } else {
      // Mode auto - suivre les préférences système
      isDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    }

    if (isDark) {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener())
  }

  public addListener(listener: () => void): void {
    this.listeners.push(listener)
  }

  public removeListener(listener: () => void): void {
    this.listeners = this.listeners.filter((l) => l !== listener)
  }

  public setTheme(theme: Partial<ThemeConfig>): void {
    this.currentTheme = { ...this.currentTheme, ...theme }
    this.saveTheme()
    this.applyTheme()
    // Notifier immédiatement tous les composants
    this.notifyListeners()
  }

  public getTheme(): ThemeConfig {
    return { ...this.currentTheme }
  }

  public isDarkMode(): boolean {
    if (typeof window === "undefined") return false
    return document.documentElement.classList.contains("dark")
  }

  public getBackgroundClass(): string {
    return this.isDarkMode() ? "bg-black text-white" : "bg-gradient-to-br from-green-50 to-emerald-100 text-gray-900"
  }

  // Méthode pour la compatibilité avec l'ancien code
  public getBackgroundGradient(): string {
    return this.getBackgroundClass()
  }

  // Méthode pour les couleurs (compatibilité)
  public getColors() {
    return {
      accent: "text-green-600 dark:text-green-400",
      primary: "bg-green-600 hover:bg-green-700",
      secondary: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    }
  }
}
