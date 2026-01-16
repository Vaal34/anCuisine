'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

// Couleurs iOS disponibles
export const IOS_COLORS = {
  pink: { name: 'Rose', value: '#FF2D55' },
  blue: { name: 'Bleu', value: '#007AFF' },
  green: { name: 'Vert', value: '#34C759' },
  orange: { name: 'Orange', value: '#FF9500' },
  purple: { name: 'Violet', value: '#AF52DE' },
  red: { name: 'Rouge', value: '#FF3B30' },
  teal: { name: 'Turquoise', value: '#5AC8FA' },
  indigo: { name: 'Indigo', value: '#5856D6' },
} as const

export type IosColorKey = keyof typeof IOS_COLORS

interface ThemeContextType {
  accentColor: IosColorKey
  setAccentColor: (color: IosColorKey) => void
  accentColorValue: string
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const STORAGE_KEY = 'ancuisine_accent_color'

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [accentColor, setAccentColorState] = useState<IosColorKey>('pink')
  const [mounted, setMounted] = useState(false)

  // Charger la couleur depuis localStorage au montage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored && stored in IOS_COLORS) {
      setAccentColorState(stored as IosColorKey)
    }
    setMounted(true)
  }, [])

  // Appliquer les variables CSS quand la couleur change
  useEffect(() => {
    if (!mounted) return

    const colorValue = IOS_COLORS[accentColor].value
    document.documentElement.style.setProperty('--color-accent', colorValue)
    document.documentElement.style.setProperty('--color-accent-rgb', hexToRgb(colorValue))
  }, [accentColor, mounted])

  const setAccentColor = (color: IosColorKey) => {
    setAccentColorState(color)
    localStorage.setItem(STORAGE_KEY, color)
  }

  const accentColorValue = IOS_COLORS[accentColor].value

  return (
    <ThemeContext.Provider
      value={{
        accentColor,
        setAccentColor,
        accentColorValue,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

// Utilitaire pour convertir hex en RGB (format avec espaces pour Tailwind)
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return '255 45 85'
  return `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}`
}
