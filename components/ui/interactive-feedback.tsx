"use client"

import { useState, useEffect, useCallback } from "react"
import { CheckCircle, XCircle, AlertCircle, Info } from "lucide-react"
import { cn } from "@/lib/utils"

interface ToastNotification {
  id: string
  type: "success" | "error" | "warning" | "info"
  title: string
  message?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface ToastManagerProps {
  toasts: ToastNotification[]
  onRemove: (id: string) => void
}

export function ToastManager({ toasts, onRemove }: ToastManagerProps) {
  // Utiliser useCallback pour éviter les re-créations de fonction
  const handleRemove = useCallback(onRemove, [onRemove])

  useEffect(() => {
    // Créer un seul timer par toast et le nettoyer correctement
    const timers: NodeJS.Timeout[] = []

    toasts.forEach((toast) => {
      if (toast.duration !== 0) {
        const timer = setTimeout(() => {
          handleRemove(toast.id)
        }, toast.duration || 5000)

        timers.push(timer)
      }
    })

    // Nettoyer tous les timers quand le composant se démonte ou que les toasts changent
    return () => {
      timers.forEach((timer) => clearTimeout(timer))
    }
  }, [toasts.length, handleRemove]) // Dépendance sur la longueur seulement, pas sur le tableau complet

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={handleRemove} />
      ))}
    </div>
  )
}

function ToastItem({ toast, onRemove }: { toast: ToastNotification; onRemove: (id: string) => void }) {
  const [isVisible, setIsVisible] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)

  useEffect(() => {
    // Délai pour l'animation d'entrée
    const timer = setTimeout(() => setIsVisible(true), 50)
    return () => clearTimeout(timer)
  }, [])

  const handleRemove = useCallback(() => {
    setIsLeaving(true)
    setTimeout(() => onRemove(toast.id), 300)
  }, [toast.id, onRemove])

  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
  }

  const colors = {
    success:
      "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200",
    error: "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200",
    warning:
      "bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200",
    info: "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200",
  }

  const iconColors = {
    success: "text-green-500 dark:text-green-400",
    error: "text-red-500 dark:text-red-400",
    warning: "text-yellow-500 dark:text-yellow-400",
    info: "text-blue-500 dark:text-blue-400",
  }

  const Icon = icons[toast.type]

  return (
    <div
      className={cn(
        "border rounded-lg p-4 shadow-lg backdrop-blur-sm transition-all duration-300 transform",
        colors[toast.type],
        isVisible && !isLeaving ? "translate-x-0 opacity-100" : "translate-x-full opacity-0",
        "hover:scale-105 cursor-pointer",
      )}
      onClick={handleRemove}
    >
      <div className="flex items-start gap-3">
        <Icon className={cn("w-5 h-5 flex-shrink-0 mt-0.5", iconColors[toast.type])} />
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm">{toast.title}</h4>
          {toast.message && <p className="text-sm opacity-90 mt-1">{toast.message}</p>}
          {toast.action && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                toast.action!.onClick()
                handleRemove()
              }}
              className="text-sm font-medium underline mt-2 hover:no-underline"
            >
              {toast.action.label}
            </button>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            handleRemove()
          }}
          className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  )
}

// Hook pour gérer les toasts - VERSION CORRIGÉE
export function useToast() {
  const [toasts, setToasts] = useState<ToastNotification[]>([])

  const addToast = useCallback((toast: Omit<ToastNotification, "id">) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    setToasts((prev) => {
      // Éviter les doublons en vérifiant le titre et le type
      const isDuplicate = prev.some(
        (existingToast) =>
          existingToast.title === toast.title &&
          existingToast.type === toast.type &&
          Date.now() - Number.parseInt(existingToast.id.split("-")[1]) < 1000, // Moins d'1 seconde
      )

      if (isDuplicate) {
        return prev
      }

      return [...prev, { ...toast, id }]
    })

    return id
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const success = useCallback(
    (title: string, message?: string) => addToast({ type: "success", title, message }),
    [addToast],
  )

  const error = useCallback(
    (title: string, message?: string) => addToast({ type: "error", title, message }),
    [addToast],
  )

  const warning = useCallback(
    (title: string, message?: string) => addToast({ type: "warning", title, message }),
    [addToast],
  )

  const info = useCallback((title: string, message?: string) => addToast({ type: "info", title, message }), [addToast])

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
  }
}
