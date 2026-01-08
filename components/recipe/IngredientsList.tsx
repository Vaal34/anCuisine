import React from 'react'
import type { RecipeIngredient } from '@/types'
import { formatQuantity } from '@/lib/format'

export interface IngredientsListProps {
  ingredients: RecipeIngredient[]
}

export function IngredientsList({ ingredients }: IngredientsListProps) {
  return (
    <div className="space-y-2">
      {ingredients.map((ingredient, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-3 sm:p-4 bg-ios-bg rounded-2xl transition-all duration-200"
        >
          <span className="text-sm sm:text-base font-medium text-ios-label">
            {ingredient.name}
          </span>
          {ingredient.quantity && (
            <span className="inline-flex items-center justify-center min-w-[80px] px-2.5 py-1 text-sm font-semibold text-ios-pink bg-ios-pink/10 rounded-lg tabular-nums whitespace-nowrap">
              {formatQuantity(ingredient.quantity)} {ingredient.unit}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
