"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Leaf, Users, Globe } from "lucide-react"

export function FooterSection() {
  return (
    <footer className="mt-16 mb-8">
      <Card className="card-adaptive-translucent border-2 border-green-200 dark:border-green-800 relative overflow-hidden">
        {/* Gradient de fond */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 via-emerald-50/30 to-teal-50/50 dark:from-green-900/20 dark:via-emerald-900/10 dark:to-teal-900/20" />

        <CardContent className="relative z-10 py-8 px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Illustration */}
            <div className="order-2 lg:order-1">
              <Image
                src="/footer-illustration.jpg"
                alt="Illustration écologique - Personnes utilisant la technologie dans un environnement naturel"
                width={600}
                height={400}
                className="rounded-lg shadow-lg w-full h-auto"
                priority={false}
              />
            </div>

            {/* Contenu textuel */}
            <div className="order-1 lg:order-2 space-y-6">
              <div className="text-center lg:text-left">
                <h3 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-3">Ensemble pour la planète</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Green GPT Battle unit technologie et écologie pour créer une communauté d'apprentissage engagée.
                  Chaque question répondue contribue à sensibiliser sur les enjeux environnementaux de notre époque.
                </p>
              </div>

              {/* Statistiques d'impact */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Users className="h-5 w-5 text-blue-500" />
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">1.2K+</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Éco-warriors</p>
                </div>

                <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Globe className="h-5 w-5 text-green-500" />
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">15K+</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Questions posées</p>
                </div>
              </div>

              {/* Badges de mission */}
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  <Leaf className="h-3 w-3 mr-1" />
                  Éducation verte
                </Badge>
                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  <Globe className="h-3 w-3 mr-1" />
                  Impact global
                </Badge>
                <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                  <Heart className="h-3 w-3 mr-1" />
                  Communauté
                </Badge>
              </div>

              {/* Message inspirant */}
              <div className="text-center lg:text-left">
                <p className="text-sm text-muted-foreground italic">
                  "Chaque réponse compte, chaque geste compte, chaque joueur compte pour notre planète."
                </p>
              </div>
            </div>
          </div>

          {/* Ligne de séparation et copyright */}
          <div className="mt-8 pt-6 border-t border-green-200 dark:border-green-800">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <Image src="/logo.png" alt="Green GPT Battle Logo" width={24} height={24} />
                <span className="text-sm text-muted-foreground">
                  © 2024 Green GPT Battle - Fait avec 💚 pour la planète
                </span>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>🌱 Éco-responsable</span>
                <span>🤖 Alimenté par l'IA</span>
                <span>🌍 Open Source</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </footer>
  )
}
