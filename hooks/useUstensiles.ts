'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

export interface Ustensile {
  id: string
  name: string
  created_at: string
}

interface UseUstensilesReturn {
  ustensiles: Ustensile[]
  loading: boolean
  error: Error | null
  searchUstensiles: (query: string) => Ustensile[]
  getUstensileById: (id: string) => Ustensile | undefined
  addUstensile: (name: string) => Promise<Ustensile | null>
}

export function useUstensiles(): UseUstensilesReturn {
  const [ustensiles, setUstensiles] = useState<Ustensile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchUstensiles = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('ustensiles')
        .select('*')
        .order('name')

      if (error) throw error
      setUstensiles(data || [])
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUstensiles()
  }, [fetchUstensiles])

  const searchUstensiles = useCallback((query: string): Ustensile[] => {
    if (!query) return []
    const lowerQuery = query.toLowerCase()
    return ustensiles.filter((ust) =>
      ust.name.toLowerCase().includes(lowerQuery)
    )
  }, [ustensiles])

  const getUstensileById = useCallback((id: string): Ustensile | undefined => {
    return ustensiles.find((ust) => ust.id === id)
  }, [ustensiles])

  const addUstensile = useCallback(async (name: string): Promise<Ustensile | null> => {
    try {
      const trimmedName = name.trim()
      if (!trimmedName) return null

      // Vérifier si l'ustensile existe déjà (insensible à la casse)
      const existing = ustensiles.find(
        (u) => u.name.toLowerCase() === trimmedName.toLowerCase()
      )
      if (existing) return existing

      const { data, error } = await supabase
        .from('ustensiles')
        .insert({ name: trimmedName })
        .select()
        .single()

      if (error) {
        // Si erreur de doublon, récupérer l'existant
        if (error.code === '23505') {
          const { data: existingData } = await supabase
            .from('ustensiles')
            .select('*')
            .ilike('name', trimmedName)
            .single()
          if (existingData) {
            return existingData
          }
        }
        throw error
      }

      // Mettre à jour la liste locale
      setUstensiles((prev) => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)))
      return data
    } catch (err) {
      setError(err as Error)
      return null
    }
  }, [ustensiles])

  return {
    ustensiles,
    loading,
    error,
    searchUstensiles,
    getUstensileById,
    addUstensile,
  }
}
