'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Ingredient } from '@/types'

interface UseIngredientsReturn {
  ingredients: Ingredient[]
  loading: boolean
  error: Error | null
  searchIngredients: (query: string) => Ingredient[]
  getIngredientById: (id: string) => Ingredient | undefined
}

export function useIngredients(): UseIngredientsReturn {
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    fetchIngredients()
  }, [])

  const fetchIngredients = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('ingredients')
        .select('*')
        .order('name')

      if (error) throw error
      setIngredients(data || [])
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  const searchIngredients = (query: string): Ingredient[] => {
    if (!query) return []
    const lowerQuery = query.toLowerCase()
    return ingredients.filter((ing) =>
      ing.name.toLowerCase().includes(lowerQuery)
    )
  }

  const getIngredientById = (id: string): Ingredient | undefined => {
    return ingredients.find((ing) => ing.id === id)
  }

  return {
    ingredients,
    loading,
    error,
    searchIngredients,
    getIngredientById,
  }
}
