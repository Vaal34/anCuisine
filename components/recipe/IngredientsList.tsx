import React from 'react'
import type { RecipeIngredient } from '@/types'
import { Dot } from 'lucide-react'

export interface IngredientsListProps {
  ingredients: RecipeIngredient[]
}

export function IngredientsList({ ingredients }: IngredientsListProps) {

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
      {ingredients.map((ingredient, index) => (
        <div
          key={index}
          className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 bg-ios-pink/10 border-2 border-ios-pink rounded-3xl corner-squircle shadow-sm"
        >
          <span className="text-sm sm:text-base font-medium text-ios-label truncate mr-2">
            {ingredient.name}
          </span>
          {ingredient.quantity && ingredient.unit && (
            <span className="px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-semibold bg-ios-pink text-white rounded-2xl corner-squircle whitespace-nowrap flex-shrink-0">
              {ingredient.quantity} {ingredient.unit}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
