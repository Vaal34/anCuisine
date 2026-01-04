/**
 * Utilities for working with cooking methods
 */

import { COOKING_METHODS } from '@/types'

export type CookingMethodValue =
  | 'four'
  | 'micro-onde'
  | 'air-fryer'
  | 'plaque'
  | 'casserole'
  | 'vapeur'
  | 'barbecue'
  | 'sans-cuisson'

/**
 * Validate if a string is a valid cooking method
 */
export function isValidCookingMethod(method: string): method is CookingMethodValue {
  const validMethods: string[] = [
    'four',
    'micro-onde',
    'air-fryer',
    'plaque',
    'casserole',
    'vapeur',
    'barbecue',
    'sans-cuisson',
  ]
  return validMethods.includes(method)
}

/**
 * Validate an array of cooking methods
 * Returns only valid methods, filtering out invalid ones
 */
export function validateCookingMethods(methods: string[]): CookingMethodValue[] {
  return methods.filter(isValidCookingMethod)
}

/**
 * Get display information for a cooking method
 */
export function getCookingMethodInfo(method: CookingMethodValue) {
  return COOKING_METHODS.find((m) => m.value === method)
}

/**
 * Get all cooking method values as array
 */
export function getAllCookingMethodValues(): CookingMethodValue[] {
  return COOKING_METHODS.map((m) => m.value as CookingMethodValue)
}

/**
 * Format cooking methods for display
 * Example: ['four', 'air-fryer'] -> 'Four, Air Fryer'
 */
export function formatCookingMethods(methods: CookingMethodValue[]): string {
  return methods
    .map((method) => getCookingMethodInfo(method)?.label || method)
    .join(', ')
}

/**
 * Get icon name for a cooking method
 */
export function getCookingMethodIcon(method: CookingMethodValue): string {
  return getCookingMethodInfo(method)?.icon || 'Flame'
}

/**
 * Check if a recipe has a specific cooking method
 */
export function hasMethod(
  recipeMethods: CookingMethodValue[],
  method: CookingMethodValue
): boolean {
  return recipeMethods.includes(method)
}

/**
 * Check if a recipe has any of the specified cooking methods
 */
export function hasAnyMethod(
  recipeMethods: CookingMethodValue[],
  methods: CookingMethodValue[]
): boolean {
  return methods.some((method) => recipeMethods.includes(method))
}

/**
 * Check if a recipe has all of the specified cooking methods
 */
export function hasAllMethods(
  recipeMethods: CookingMethodValue[],
  methods: CookingMethodValue[]
): boolean {
  return methods.every((method) => recipeMethods.includes(method))
}

/**
 * Get cooking methods that are common between two recipes
 */
export function getCommonMethods(
  methods1: CookingMethodValue[],
  methods2: CookingMethodValue[]
): CookingMethodValue[] {
  return methods1.filter((method) => methods2.includes(method))
}

/**
 * Supabase query helpers
 */
export const CookingMethodQueries = {
  /**
   * Generate Supabase filter for recipes with specific cooking method
   * Usage: supabase.from('recipes').select('*').contains('cooking_methods', [...])
   */
  hasMethod: (method: CookingMethodValue) => [method],

  /**
   * Check if cooking methods array contains any of the specified methods
   * Note: Supabase doesn't have a direct "contains any" operator for JSONB arrays
   * You'll need to use multiple queries or raw SQL for OR conditions
   */
  hasAnyMethod: (methods: CookingMethodValue[]) => methods,
}

/**
 * Statistics helpers
 */
export const CookingMethodStats = {
  /**
   * Count recipes by cooking method
   */
  countByMethod: (recipes: { cooking_methods?: string[] }[]) => {
    const counts: Record<string, number> = {}

    recipes.forEach((recipe) => {
      const methods = recipe.cooking_methods || []
      methods.forEach((method) => {
        counts[method] = (counts[method] || 0) + 1
      })
    })

    return counts
  },

  /**
   * Get most popular cooking methods
   */
  getMostPopular: (
    recipes: { cooking_methods?: string[] }[],
    limit = 3
  ): Array<{ method: CookingMethodValue; count: number }> => {
    const counts = CookingMethodStats.countByMethod(recipes)

    return Object.entries(counts)
      .filter(([method]) => isValidCookingMethod(method))
      .map(([method, count]) => ({
        method: method as CookingMethodValue,
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit)
  },

  /**
   * Get percentage of recipes using each method
   */
  getMethodPercentages: (recipes: { cooking_methods?: string[] }[]) => {
    const counts = CookingMethodStats.countByMethod(recipes)
    const total = recipes.length

    return Object.entries(counts).reduce(
      (acc, [method, count]) => {
        acc[method] = Math.round((count / total) * 100)
        return acc
      },
      {} as Record<string, number>
    )
  },
}
