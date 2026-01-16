import React from 'react'
import type { RecipeIngredient } from '@/types'
import { formatQuantity } from '@/lib/format'
import { Dot } from 'lucide-react'

export interface IngredientsListProps {
  ingredients: RecipeIngredient[]
}

export function IngredientsList({ ingredients }: IngredientsListProps) {
  return (
    <div className="space-y-2">
      {ingredients.map((ingredient, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-3 sm:p-4 border border-ios-separator bg-zinc-50 rounded-2xl transition-all duration-200"
        >
          <span className="flex items-center text-sm sm:text-base font-medium text-ios-label">
            <Dot className="w-5 h-5 text-accent" />
            {ingredient.name}
          </span>
          {ingredient.quantity && (
            <span className="inline-flex items-center justify-center min-w-[80px] px-2.5 py-1 text-sm font-semibold text-ios-black bg-ios-bg-secondary border border-ios-separator rounded-lg tabular-nums whitespace-nowrap">
              {formatQuantity(ingredient.quantity)} {ingredient.unit}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
