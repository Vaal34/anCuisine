'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Recipe, RecipeFormData, RecipeIngredient } from '@/types'

interface UseRecipesReturn {
  recipes: Recipe[]
  loading: boolean
  error: Error | null
  fetchRecipes: () => Promise<void>
  getRecipe: (id: string) => Promise<Recipe | null>
  createRecipe: (data: RecipeFormData) => Promise<string>
  updateRecipe: (id: string, data: RecipeFormData) => Promise<void>
  deleteRecipe: (id: string) => Promise<void>
  searchRecipes: (query: string) => Recipe[]
  filterByCategory: (category: string) => Recipe[]
  filterByCookingMethod: (method: string) => Recipe[]
}

export function useRecipes(): UseRecipesReturn {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchRecipes = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      const recipesData = (data || []).map((recipe) => ({
        ...recipe,
        ingredients: recipe.ingredients as unknown as RecipeIngredient[],
        steps: recipe.steps as unknown as string[],
        cooking_methods: recipe.cooking_methods as unknown as string[] || [],
      }))

      setRecipes(recipesData)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRecipes()
  }, [fetchRecipes])

  const getRecipe = useCallback(async (id: string): Promise<Recipe | null> => {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      if (!data) return null

      const recipe: Recipe = {
        ...data,
        ingredients: (data.ingredients as any) || [],
        steps: (data.steps as any) || [],
        cooking_methods: (data.cooking_methods as any) || [],
      }

      return recipe
    } catch (err) {
      setError(err as Error)
      return null
    }
  }, [])

  const createRecipe = useCallback(async (formData: RecipeFormData): Promise<string> => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Utilisateur non authentifié')

      const { data, error } = await supabase
        .from('recipes')
        .insert({
          user_id: user.id,
          title: formData.title,
          category: formData.category,
          prep_time: formData.prepTime,
          cook_time: formData.cookTime,
          servings: formData.servings,
          ingredients: formData.ingredients as unknown as never,
          steps: formData.steps as unknown as never,
          cooking_methods: formData.cookingMethods,
          notes: formData.notes,
          image_url: formData.imageUrl || null,
          time_calculation_mode: formData.timeCalculationMode,
        })
        .select()
        .single()

      if (error) throw error

      await fetchRecipes()
      return data.id
    } catch (err) {
      setError(err as Error)
      throw err
    }
  }, [fetchRecipes])

  const updateRecipe = useCallback(async (id: string, formData: RecipeFormData): Promise<void> => {
    try {
      const { error } = await supabase
        .from('recipes')
        .update({
          title: formData.title,
          category: formData.category,
          prep_time: formData.prepTime,
          cook_time: formData.cookTime,
          servings: formData.servings,
          ingredients: formData.ingredients as unknown as never,
          steps: formData.steps as unknown as never,
          cooking_methods: formData.cookingMethods,
          notes: formData.notes,
          image_url: formData.imageUrl || null,
          time_calculation_mode: formData.timeCalculationMode,
        })
        .eq('id', id)

      if (error) throw error

      await fetchRecipes()
    } catch (err) {
      setError(err as Error)
      throw err
    }
  }, [fetchRecipes])

  const deleteRecipe = useCallback(async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', id)

      if (error) throw error

      await fetchRecipes()
    } catch (err) {
      setError(err as Error)
      throw err
    }
  }, [fetchRecipes])

  const searchRecipes = useCallback((query: string): Recipe[] => {
    if (!query) return recipes
    const lowerQuery = query.toLowerCase()
    return recipes.filter((recipe) => {
      const titleMatch = recipe.title.toLowerCase().includes(lowerQuery)
      const ingredientsMatch = recipe.ingredients.some((ing) =>
        ing.name.toLowerCase().includes(lowerQuery)
      )
      return titleMatch || ingredientsMatch
    })
  }, [recipes])

  const filterByCategory = useCallback((category: string): Recipe[] => {
    if (category === 'all') return recipes
    return recipes.filter((recipe) => recipe.category === category)
  }, [recipes])

  const filterByCookingMethod = useCallback((method: string): Recipe[] => {
    if (method === 'all') return recipes
    return recipes.filter((recipe) =>
      recipe.cooking_methods?.includes(method)
    )
  }, [recipes])

  return {
    recipes,
    loading,
    error,
    fetchRecipes,
    getRecipe,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    searchRecipes,
    filterByCategory,
    filterByCookingMethod,
  }
}
