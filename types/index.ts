/**
 * Types TypeScript pour l'application de recettes
 */

export interface User {
  id: string
  email: string
}

export interface Ingredient {
  id: string
  name: string
  category: string | null
  default_unit: string
  created_at: string
}

export interface RecipeIngredient {
  ingredientId: string | null  // null si ingrédient personnalisé
  name: string
  quantity: number | null
  unit: string | null  // 'g', 'kg', 'l', 'ml', 'unité', 'c. à soupe', 'c. à café', etc.
}

export interface RecipeStep {
  description: string
  ingredientIndices?: number[]  // Indices des ingrédients utilisés dans cette étape
}

export interface Recipe {
  id: string
  user_id: string
  title: string
  image_url: string | null
  prep_time: number
  cook_time: number
  servings: number
  ingredients: RecipeIngredient[]
  steps: string[] | RecipeStep[]
  category: string
  notes: string | null
  created_at: string
  updated_at: string
}

export interface RecipeFormData {
  title: string
  category: string
  prepTime: number
  cookTime: number
  servings: number
  ingredients: RecipeIngredient[]
  steps: string[] | RecipeStep[]
  notes: string
  imageUrl: string
}

export type Unit = {
  value: string
  label: string
}

export const UNITS: readonly Unit[] = [
  { value: 'g', label: 'g (grammes)' },
  { value: 'kg', label: 'kg (kilogrammes)' },
  { value: 'l', label: 'l (litres)' },
  { value: 'ml', label: 'ml (millilitres)' },
  { value: 'unité', label: 'unité(s)' },
  { value: 'c. à soupe', label: 'cuillère(s) à soupe' },
  { value: 'c. à café', label: 'cuillère(s) à café' },
  { value: 'pincée', label: 'pincée(s)' },
  { value: 'gousse', label: 'gousse(s)' },
  { value: 'tranche', label: 'tranche(s)' },
  { value: 'sachet', label: 'sachet(s)' },
] as const

export const CATEGORIES = [
  { value: 'entrée', label: 'Entrée' },
  { value: 'plat', label: 'Plat' },
  { value: 'dessert', label: 'Dessert' },
  { value: 'accompagnement', label: 'Accompagnement' },
  { value: 'boisson', label: 'Boisson' },
  { value: 'autre', label: 'Autre' },
] as const
