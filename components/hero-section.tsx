"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { EcoSlogan } from "./eco-slogan"
import { Sparkles, TreePine, Recycle } from "lucide-react"

interface HeroSectionProps {
  totalPlayers?: number
  totalQuestions?: number
}

export function HeroSection({ totalPlayers = 1247, totalQuestions = 15832 }: HeroSectionProps) {
  return (
    <div className="relative mb-12">
      {/* Particules décoratives */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="floating-particle floating-particle-adaptive absolute w-1 h-1 rounded-full opacity-40"
            style={{
              left: `${5 + i * 8}%`,
              top: `${10 + (i % 3) * 30}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + (i % 3)}s`,
            }}
          />
        ))}
      </div>

      <Card className="card-adaptive-translucent border-2 border-green-200 dark:border-green-800 relative overflow-hidden">
        {/* Gradient de fond */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 via-emerald-50/30 to-teal-50/50 dark:from-green-900/20 dark:via-emerald-900/10 dark:to-teal-900/20" />

        <CardContent className="relative z-10 py-12 px-8">
          {/* Titre principal avec effet */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Image
                src="/logo.png"
                alt="Green GPT Battle Logo"
                width={80}
                height={80}
                className="animate-bounce"
                style={{ animationDuration: "2s" }}
              />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 dark:from-green-400 dark:via-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
              Green GPT Battle
            </h1>

            <p className="text-xl text-muted-foreground mt-4 mb-6 max-w-2xl mx-auto leading-relaxed">
              Le quiz écologique qui transforme vos connaissances en actions pour la planète. Défiez-vous, apprenez et
              contribuez à un avenir plus vert !
            </p>
          </div>

          {/* Slogan rotatif - ÉLÉMENT PRINCIPAL */}
          <EcoSlogan className="mb-8" />

          {/* Statistiques engageantes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="flex justify-center items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-yellow-500" />
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {totalPlayers.toLocaleString()}
                </div>
              </div>
              <div className="text-sm text-muted-foreground">Éco-warriors actifs</div>
            </div>

            <div className="text-center">
              <div className="flex justify-center items-center gap-2 mb-2">
                <TreePine className="h-5 w-5 text-green-500" />
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {totalQuestions.toLocaleString()}
                </div>
              </div>
              <div className="text-sm text-muted-foreground">Questions écologiques</div>
            </div>

            <div className="text-center">
              <div className="flex justify-center items-center gap-2 mb-2">
                <Recycle className="h-5 w-5 text-blue-500" />
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {Math.floor(totalQuestions * 0.73).toLocaleString()}
                </div>
              </div>
              <div className="text-sm text-muted-foreground">Connaissances partagées</div>
            </div>
          </div>

          {/* Badges de mission */}
          <div className="flex flex-wrap justify-center gap-3">
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-4 py-2">
              🌱 Éducation environnementale
            </Badge>
            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-4 py-2">
              🌍 Action collective
            </Badge>
            <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 px-4 py-2">
              ♻️ Avenir durable
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
