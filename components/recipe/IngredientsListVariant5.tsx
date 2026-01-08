import React from 'react'
import type { RecipeIngredient } from '@/types'
import { formatQuantity } from '@/lib/format'

export interface IngredientsListProps {
  ingredients: RecipeIngredient[]
}

export function IngredientsListVariant5({ ingredients }: IngredientsListProps) {
  return (
    <div className="space-y-2">
      {ingredients.map((ingredient, index) => (
        <div
          key={index}
          className="flex items-center gap-3 p-3 sm:p-4 border border-ios-separator bg-zinc-50 rounded-2xl transition-all duration-200 hover:bg-zinc-100/50"
        >
          {/* Dot à gauche */}
          <div className="flex-shrink-0 w-2 h-2 rounded-full bg-ios-pink" />

          {/* Nom de l'ingrédient */}
          <span className="flex-1 text-sm sm:text-base font-medium text-ios-label">
            {ingredient.name}
          </span>

          {/* Badge de quantité (style variante 4) */}
          {ingredient.quantity && (
            <span className="inline-flex items-center px-3 py-1.5 text-sm sm:text-base font-semibold text-ios-pink bg-ios-pink/10 rounded-lg tabular-nums border border-ios-pink/20">
              {formatQuantity(ingredient.quantity)} {ingredient.unit}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
