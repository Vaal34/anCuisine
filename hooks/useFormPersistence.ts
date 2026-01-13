'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

interface UseFormPersistenceOptions<T> {
  /** Clé unique pour identifier le brouillon dans localStorage */
  key: string
  /** Données initiales (ex: en mode édition) */
  initialData?: T
  /** Délai de debounce en ms avant sauvegarde (défaut: 1000ms) */
  debounceMs?: number
  /** Callback appelé quand un brouillon est restauré */
  onRestored?: () => void
}

interface UseFormPersistenceReturn<T> {
  /** Les données actuelles (restaurées ou initiales) */
  data: T | null
  /** Indique si le hook a fini de charger depuis localStorage */
  isReady: boolean
  /** Indique si un brouillon a été restauré */
  wasRestored: boolean
  /** Fonction pour sauvegarder les données */
  save: (data: T) => void
  /** Fonction pour effacer le brouillon */
  clear: () => void
  /** Fonction pour ignorer le brouillon restauré et utiliser les données initiales */
  discardRestored: () => void
}

export function useFormPersistence<T>({
  key,
  initialData,
  debounceMs = 1000,
  onRestored,
}: UseFormPersistenceOptions<T>): UseFormPersistenceReturn<T> {
  const storageKey = `draft_${key}`
  const [data, setData] = useState<T | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [wasRestored, setWasRestored] = useState(false)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const hasInitialized = useRef(false)

  // Charger le brouillon au montage
  useEffect(() => {
    if (hasInitialized.current) return
    hasInitialized.current = true

    try {
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        const parsed = JSON.parse(stored) as { data: T; savedAt: number }
        // Vérifier que le brouillon n'est pas trop ancien (24h max)
        const maxAge = 24 * 60 * 60 * 1000 // 24 heures
        if (Date.now() - parsed.savedAt < maxAge) {
          setData(parsed.data)
          setWasRestored(true)
          setIsReady(true)
          onRestored?.()
          return
        } else {
          // Brouillon expiré, le supprimer
          localStorage.removeItem(storageKey)
        }
      }
    } catch {
      // Erreur de parsing, ignorer
      localStorage.removeItem(storageKey)
    }

    // Pas de brouillon valide, utiliser les données initiales
    setData(initialData ?? null)
    setIsReady(true)
  }, [storageKey, initialData, onRestored])

  // Sauvegarder avec debounce
  const save = useCallback(
    (newData: T) => {
      setData(newData)

      // Annuler le timeout précédent
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }

      // Programmer la sauvegarde
      saveTimeoutRef.current = setTimeout(() => {
        try {
          const toStore = {
            data: newData,
            savedAt: Date.now(),
          }
          localStorage.setItem(storageKey, JSON.stringify(toStore))
        } catch {
          // Erreur de stockage (quota dépassé, etc.), ignorer
          console.warn('Impossible de sauvegarder le brouillon')
        }
      }, debounceMs)
    },
    [storageKey, debounceMs]
  )

  // Effacer le brouillon
  const clear = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }
    localStorage.removeItem(storageKey)
    setWasRestored(false)
  }, [storageKey])

  // Ignorer le brouillon restauré
  const discardRestored = useCallback(() => {
    clear()
    setData(initialData ?? null)
  }, [clear, initialData])

  // Nettoyer le timeout au démontage
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [])

  return {
    data,
    isReady,
    wasRestored,
    save,
    clear,
    discardRestored,
  }
}
