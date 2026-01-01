import React from 'react'
import type { RecipeIngredient } from '@/types'

export interface IngredientsListProps {
  ingredients: RecipeIngredient[]
  variant?: 'bullets' | 'simple'
}

export function IngredientsList({ ingredients, variant = 'bullets' }: IngredientsListProps) {
  return (
    <ul className="space-y-3">
      {ingredients.map((ingredient, index) => (
        <li key={index} className="flex items-start gap-3">
          {variant === 'bullets' && (
            <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-recipe-primary text-white rounded-3xl corner-squircle text-sm font-bold">
              •
            </span>
          )}
          <span className="text-base text-ios-label">
            {ingredient.quantity && ingredient.unit ? (
              <>
                <strong className="font-semibold">
                  {ingredient.quantity}
                  {ingredient.unit}
                </strong>{' '}
                {ingredient.name}
              </>
            ) : (
              ingredient.name
            )}
          </span>
        </li>
      ))}
    </ul>
  )
}
