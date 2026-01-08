import React from 'react'
import type { RecipeIngredient } from '@/types'
import { formatQuantity } from '@/lib/format'

export interface IngredientsListProps {
  ingredients: RecipeIngredient[]
}

export function IngredientsListVariant3({ ingredients }: IngredientsListProps) {
  return (
    <div className="space-y-3">
      {ingredients.map((ingredient, index) => (
        <div
          key={index}
          className="group relative overflow-hidden rounded-2xl border border-ios-separator bg-gradient-to-br from-white to-zinc-50/50 p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300"
        >
          <div className="flex items-start gap-4">
            {/* Icon Circle */}
            <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-ios-pink/10 flex items-center justify-center border-2 border-ios-pink/20">
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-ios-pink"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h4 className="text-base sm:text-lg font-semibold text-ios-label mb-1">
                {ingredient.name}
              </h4>
              {ingredient.quantity && (
                <div className="flex items-center gap-2">
                  <div className="h-px flex-1 bg-gradient-to-r from-ios-separator to-transparent" />
                  <span className="text-sm sm:text-base font-bold text-ios-pink tabular-nums">
                    {formatQuantity(ingredient.quantity)} {ingredient.unit}
                  </span>
                </div>
              )}
            </div>

            {/* Decorative element */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-ios-pink/5 rounded-bl-full transform translate-x-8 -translate-y-8 group-hover:translate-x-6 group-hover:-translate-y-6 transition-transform duration-300" />
          </div>
        </div>
      ))}
    </div>
  )
}
