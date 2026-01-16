'use client'

import React, { useEffect, useState } from 'react'
import Lottie from 'lottie-react'
import { cn } from '@/lib/utils'
import { useTheme } from '@/contexts/ThemeContext'

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

// Fonction pour convertir hex en RGB normalisé [0-1]
function hexToRgbNormalized(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return [1, 0, 0.333] // Rose par défaut
  return [
    parseInt(result[1], 16) / 255,
    parseInt(result[2], 16) / 255,
    parseInt(result[3], 16) / 255,
  ]
}

// Fonction pour modifier les couleurs dans l'animation Lottie
function colorizeAnimation(animationData: unknown, colorHex: string): unknown {
  const [r, g, b] = hexToRgbNormalized(colorHex)
  const data = JSON.parse(JSON.stringify(animationData))

  // Couleur de stroke originale (bleu): [0, 0.4, 0.945, 1]
  // Couleur de fill claire originale: [0.796, 0.882, 1, 1]

  function replaceColors(obj: unknown): void {
    if (!obj || typeof obj !== 'object') return

    if (Array.isArray(obj)) {
      obj.forEach(replaceColors)
      return
    }

    const record = obj as Record<string, unknown>

    // Remplacer les couleurs de stroke (ty: "st")
    if (record.ty === 'st' && record.c) {
      const c = record.c as Record<string, unknown>
      if (c.k && Array.isArray(c.k) && c.k.length >= 3) {
        c.k = [r, g, b, 1]
      }
    }

    // Remplacer les couleurs de fill claire (ty: "fl") - version plus claire de l'accent
    if (record.ty === 'fl' && record.c) {
      const c = record.c as Record<string, unknown>
      if (c.k && Array.isArray(c.k) && c.k.length >= 3) {
        const k = c.k as number[]
        // Si c'est la couleur claire (bleu clair), la remplacer par une version claire de l'accent
        if (k[0] > 0.7 && k[1] > 0.8 && k[2] > 0.9) {
          // Version très claire de la couleur d'accent (mélange avec blanc)
          c.k = [
            0.8 + r * 0.2,
            0.8 + g * 0.2,
            0.8 + b * 0.2,
            1
          ]
        }
        // Si c'est blanc pur, le laisser
      }
    }

    // Parcourir récursivement
    Object.values(record).forEach(replaceColors)
  }

  replaceColors(data)
  return data
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  const { accentColorValue } = useTheme()
  const [animationData, setAnimationData] = useState<unknown>(null)

  useEffect(() => {
    fetch('/loading.json')
      .then((res) => res.json())
      .then((data) => {
        const colorized = colorizeAnimation(data, accentColorValue)
        setAnimationData(colorized)
      })
      .catch(console.error)
  }, [accentColorValue])

  const sizeStyles = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  }

  if (!animationData) {
    return (
      <div className="flex items-center justify-center">
        <div className={cn(sizeStyles[size], className, 'animate-pulse bg-gray-200 rounded-full')} />
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center">
      <div className={cn(sizeStyles[size], className)}>
        <Lottie
          animationData={animationData}
          loop
          autoplay
        />
      </div>
    </div>
  )
}
