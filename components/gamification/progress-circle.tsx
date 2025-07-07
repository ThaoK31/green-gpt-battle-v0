"use client"

interface ProgressCircleProps {
  progress: number
  size?: number
  strokeWidth?: number
  level: number
}

export function ProgressCircle({ progress, size = 80, strokeWidth = 8, level }: ProgressCircleProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Cercle de fond */}
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="#e5e7eb" strokeWidth={strokeWidth} fill="transparent" />
        {/* Cercle de progression */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#10b981"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="progress-circle transition-all duration-1000 ease-out"
          style={{ "--progress-offset": offset } as any}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-3xl font-bold text-green-600">{level}</div>
      </div>
    </div>
  )
}
