import React from 'react'
import type { RecipeIngredient } from '@/types'
import { formatQuantity } from '@/lib/format'

export interface IngredientsListProps {
  ingredients: RecipeIngredient[]
}

export function IngredientsListVariant4({ ingredients }: IngredientsListProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-ios-separator bg-white shadow-sm">
      {/* Table Header */}
      <div className="grid grid-cols-[1fr_auto] gap-4 px-4 sm:px-6 py-3 bg-gradient-to-r from-ios-pink/10 to-ios-pink/5 border-b border-ios-separator">
        <div className="text-xs sm:text-sm font-bold text-ios-label uppercase tracking-wide">
          Ingrédient
        </div>
        <div className="text-xs sm:text-sm font-bold text-ios-label uppercase tracking-wide text-right">
          Quantité
        </div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-ios-separator">
        {ingredients.map((ingredient, index) => (
          <div
            key={index}
            className="grid grid-cols-[1fr_auto] gap-4 px-4 sm:px-6 py-3.5 sm:py-4 hover:bg-zinc-50/50 transition-colors duration-150"
          >
            {/* Ingredient Name */}
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-2 h-2 rounded-full bg-ios-pink" />
              <span className="text-sm sm:text-base font-medium text-ios-label">
                {ingredient.name}
              </span>
            </div>

            {/* Quantity */}
            {ingredient.quantity ? (
              <div className="flex items-center justify-end">
                <span className="inline-flex items-center px-3 py-1.5 text-sm sm:text-base font-semibold text-ios-pink bg-ios-pink/10 rounded-lg tabular-nums border border-ios-pink/20">
                  {formatQuantity(ingredient.quantity)} {ingredient.unit}
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-end">
                <span className="text-sm text-ios-tertiaryLabel italic">
                  —
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Table Footer */}
      <div className="px-4 sm:px-6 py-2.5 bg-zinc-50/50 border-t border-ios-separator">
        <p className="text-xs sm:text-sm text-ios-tertiaryLabel text-center">
          Total: {ingredients.length} ingrédient{ingredients.length > 1 ? 's' : ''}
        </p>
      </div>
    </div>
  )
}
