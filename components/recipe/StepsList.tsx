import React from 'react'
import { formatQuantity } from '@/lib/format'
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

  // Format MINIMAL-5 avec ingrédients en ios-pink
  return (
    <div className="relative space-y-5 sm:space-y-6">
      <div className="absolute left-1.5 sm:left-2 top-3 bottom-3 w-px bg-ios-separator" />
      {normalizedSteps.map((step, index) => {
        const stepIngredients = (step.ingredientIndices || [])
          .map(idx => ingredients[idx])
          .filter(Boolean)

        return (
          <div key={index} className="relative pl-5 sm:pl-6 pr-2 sm:pr-0">
            <div className="absolute left-0 sm:left-0 top-1 w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-white border-2 border-ios-pink" />
            <div className="min-w-0 space-y-3">
              <div>
                <div className="text-[10px] text-ios-label-secondary uppercase tracking-wider mb-1">
                  Étape {index + 1}
                </div>
                <p className="text-sm sm:text-base text-ios-label leading-relaxed mb-1.5 break-words">
                  {step.description}
                </p>
                {stepIngredients.length > 0 && (
                  <div className="text-xs sm:text-sm font-medium break-words text-ios-label-secondary">
                    Liste des ingrédients : {" "}
                    {stepIngredients.map((ingredient, idx) => (
                      <span key={idx} className='text-ios-pink'>
                        {ingredient.name}
                        {ingredient.quantity && ingredient.unit && ` ${formatQuantity(ingredient.quantity)}${ingredient.unit}`}
                        {idx < stepIngredients.length - 1 && ', '}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              {step.timerMinutes && (
                <div className="flex items-center gap-2 text-xs sm:text-sm text-ios-label-secondary">
                  <span>
                    {step.timerType === 'cook' ? 'Temps de cuisson' : 'Temps de préparation'} : <span className="text-ios-pink">{step.timerMinutes} min {step.timerLabel && ` (${step.timerLabel})`}</span>
                  </span>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
