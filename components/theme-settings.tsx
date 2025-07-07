"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ThemeManager, type ThemeMode } from "@/lib/theme-system"
import { Sun, Moon, Monitor, Palette } from "lucide-react"

interface ThemeSettingsProps {
  isOpen: boolean
  onClose: () => void
}

export function ThemeSettings({ isOpen, onClose }: ThemeSettingsProps) {
  const [themeManager] = useState(() => ThemeManager.getInstance())
  const [currentTheme, setCurrentTheme] = useState(themeManager.getTheme())

  useEffect(() => {
    setCurrentTheme(themeManager.getTheme())
  }, [themeManager])

  const handleModeChange = (mode: ThemeMode) => {
    themeManager.setTheme({ mode })
    setCurrentTheme(themeManager.getTheme())
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md bg-card text-card-foreground border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Thème
            </CardTitle>
            <Button variant="outline" size="sm" onClick={onClose}>
              ✕
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Mode sombre/clair */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Mode d'affichage</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { mode: "light" as ThemeMode, icon: Sun, label: "Clair" },
                { mode: "dark" as ThemeMode, icon: Moon, label: "Sombre" },
                { mode: "auto" as ThemeMode, icon: Monitor, label: "Auto" },
              ].map(({ mode, icon: Icon, label }) => (
                <Button
                  key={mode}
                  variant={currentTheme.mode === mode ? "default" : "outline"}
                  onClick={() => handleModeChange(mode)}
                  className="flex flex-col items-center gap-2 h-20"
                >
                  <Icon className="h-6 w-6" />
                  <span className="text-sm">{label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Aperçu */}
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Aperçu</h4>
            <div className="p-4 rounded-lg bg-gradient-to-br from-green-100 to-green-200 dark:from-gray-800 dark:to-gray-900">
              <div className="flex items-center gap-3 mb-3">
                <div className="text-2xl">🌱</div>
                <div>
                  <div className="font-bold text-green-600 dark:text-green-400">Green GPT Battle</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Aperçu du thème sélectionné</div>
                </div>
              </div>
              <Button className="bg-green-600 hover:bg-green-700 text-white" size="sm">
                Bouton d'exemple
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
