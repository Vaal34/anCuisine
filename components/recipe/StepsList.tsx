import React from 'react'
import { Badge } from '@/components/ui/Badge'
import type { RecipeIngredient, RecipeStep } from '@/types'

export interface StepsListProps {
  steps: string[] | RecipeStep[]
  numbered?: boolean
  ingredients?: RecipeIngredient[]
}

export function StepsList({ steps, numbered = true, ingredients = [] }: StepsListProps) {
  // Normaliser les steps
  const normalizedSteps: RecipeStep[] = steps.map(step =>
    typeof step === 'string'
      ? { description: step, ingredientIndices: [] }
      : step
  )

  return (
    <ol className="space-y-4 sm:space-y-5">
      {normalizedSteps.map((step, index) => {
        const stepIngredients = (step.ingredientIndices || [])
          .map(idx => ingredients[idx])
          .filter(Boolean)

        return (
          <li key={index} className="flex items-start gap-2.5 sm:gap-3">
            {numbered && (
              <Badge variant="blue" className="flex-shrink-0 mt-0.5 sm:mt-1 text-sm sm:text-base">
                {index + 1}
              </Badge>
            )}
            <div className="flex-1 space-y-2">
              <p className="text-sm sm:text-base text-ios-label leading-relaxed">
                {step.description}
              </p>
              {stepIngredients.length > 0 && (
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {stepIngredients.map((ingredient, idx) => (
                    <div
                      key={idx}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-ios-pink/10 text-ios-pink rounded-full text-xs sm:text-sm"
                    >
                      <span className="font-medium">{ingredient.name}</span>
                      {ingredient.quantity && ingredient.unit && (
                        <span className="text-ios-pink/70">
                          • {ingredient.quantity} {ingredient.unit}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
