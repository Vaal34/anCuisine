import React, { useState } from 'react'
import { Badge } from '@/components/ui/Badge'
import { Check, ChevronDown, ChevronUp } from 'lucide-react'
import type { RecipeIngredient, RecipeStep } from '@/types'

export interface StepsListProps {
  steps: string[] | RecipeStep[]
  numbered?: boolean
  ingredients?: RecipeIngredient[]
  variant?:
    | 'minimal-1' | 'minimal-2' | 'minimal-3' | 'minimal-4' | 'minimal-5' | 'minimal-6'
    | 'compact-1' | 'compact-2' | 'compact-3' | 'compact-4' | 'compact-5' | 'compact-6'
}

export function StepsListVariants({ steps, numbered = true, ingredients = [], variant = 'minimal-1' }: StepsListProps) {
  // Normaliser les steps
  const normalizedSteps: RecipeStep[] = steps.map(step =>
    typeof step === 'string'
      ? { description: step, ingredientIndices: [] }
      : step
  )

  // ============================================
  // FORMATS MINIMAUX
  // ============================================

  // MINIMAL-1: Ultra épuré - Points simples avec numéros discrets
  if (variant === 'minimal-1') {
    return (
      <div className="space-y-5">
        {normalizedSteps.map((step, index) => {
          const stepIngredients = (step.ingredientIndices || [])
            .map(idx => ingredients[idx])
            .filter(Boolean)

          return (
            <div key={index} className="flex items-start gap-3">
              <span className="text-ios-label-secondary font-semibold text-sm mt-0.5 min-w-[1.5rem]">
                {index + 1}.
              </span>
              <div className="flex-1 space-y-1.5">
                <p className="text-sm text-ios-label leading-relaxed">
                  {step.description}
                </p>
                {stepIngredients.length > 0 && (
                  <div className="flex flex-wrap gap-2 text-xs text-ios-label-secondary">
                    {stepIngredients.map((ingredient, idx) => (
                      <span key={idx}>
                        {ingredient.name}
                        {ingredient.quantity && ingredient.unit && ` (${ingredient.quantity}${ingredient.unit})`}
                        {idx < stepIngredients.length - 1 && ' •'}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  // MINIMAL-2: Lignes fines avec séparateurs
  if (variant === 'minimal-2') {
    return (
      <div className="divide-y divide-ios-separator/30">
        {normalizedSteps.map((step, index) => {
          const stepIngredients = (step.ingredientIndices || [])
            .map(idx => ingredients[idx])
            .filter(Boolean)

          return (
            <div key={index} className="py-4 first:pt-0 last:pb-0">
              <div className="text-[10px] text-ios-pink font-semibold uppercase tracking-widest mb-2">
                Étape {index + 1}
              </div>
              <p className="text-sm text-ios-label leading-relaxed mb-2">
                {step.description}
              </p>
              {stepIngredients.length > 0 && (
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-ios-label-secondary">
                  {stepIngredients.map((ingredient, idx) => (
                    <span key={idx} className="flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-ios-pink/50" />
                      {ingredient.name} {ingredient.quantity && ingredient.unit && `${ingredient.quantity}${ingredient.unit}`}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  // MINIMAL-3: Numéros stylisés à gauche
  if (variant === 'minimal-3') {
    return (
      <div className="space-y-4">
        {normalizedSteps.map((step, index) => {
          const stepIngredients = (step.ingredientIndices || [])
            .map(idx => ingredients[idx])
            .filter(Boolean)

          return (
            <div key={index} className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-ios-pink/10 flex items-center justify-center">
                <span className="text-ios-pink font-bold text-xs">{index + 1}</span>
              </div>
              <div className="flex-1 pt-1">
                <p className="text-sm text-ios-label leading-relaxed mb-2">
                  {step.description}
                </p>
                {stepIngredients.length > 0 && (
                  <div className="text-xs text-ios-label-secondary space-y-0.5">
                    {stepIngredients.map((ingredient, idx) => (
                      <div key={idx}>
                        {ingredient.name} {ingredient.quantity && ingredient.unit && `— ${ingredient.quantity} ${ingredient.unit}`}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  // MINIMAL-4: Style liste propre avec bordure gauche
  if (variant === 'minimal-4') {
    return (
      <div className="space-y-3">
        {normalizedSteps.map((step, index) => {
          const stepIngredients = (step.ingredientIndices || [])
            .map(idx => ingredients[idx])
            .filter(Boolean)

          return (
            <div key={index} className="pl-4 border-l-2 border-ios-pink/30 py-1">
              <div className="flex items-baseline gap-2 mb-1.5">
                <span className="text-ios-pink font-semibold text-xs">#{index + 1}</span>
                <p className="text-sm text-ios-label leading-relaxed flex-1">
                  {step.description}
                </p>
              </div>
              {stepIngredients.length > 0 && (
                <div className="ml-6 flex flex-wrap gap-2 text-xs text-ios-label-secondary">
                  {stepIngredients.map((ingredient, idx) => (
                    <span key={idx} className="italic">
                      {ingredient.name}
                      {ingredient.quantity && ingredient.unit && ` ${ingredient.quantity}${ingredient.unit}`}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  // MINIMAL-5: Points de progression minimalistes
  if (variant === 'minimal-5') {
    return (
      <div className="relative space-y-6">
        <div className="absolute left-2 top-3 bottom-3 w-px bg-ios-separator" />
        {normalizedSteps.map((step, index) => {
          const stepIngredients = (step.ingredientIndices || [])
            .map(idx => ingredients[idx])
            .filter(Boolean)

          return (
            <div key={index} className="relative pl-6">
              <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-white border-2 border-ios-pink" />
              <div>
                <div className="text-[10px] text-ios-label-secondary uppercase tracking-wider mb-1">
                  Étape {index + 1}
                </div>
                <p className="text-sm text-ios-label leading-relaxed mb-1.5">
                  {step.description}
                </p>
                {stepIngredients.length > 0 && (
                  <div className="text-xs text-ios-label-secondary">
                    {stepIngredients.map((ingredient, idx) => (
                      <span key={idx}>
                        {ingredient.name}
                        {ingredient.quantity && ingredient.unit && ` ${ingredient.quantity}${ingredient.unit}`}
                        {idx < stepIngredients.length - 1 && ', '}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  // MINIMAL-6: Texte pur sans ornements
  if (variant === 'minimal-6') {
    return (
      <div className="space-y-5">
        {normalizedSteps.map((step, index) => {
          const stepIngredients = (step.ingredientIndices || [])
            .map(idx => ingredients[idx])
            .filter(Boolean)

          return (
            <div key={index}>
              <p className="text-sm text-ios-label leading-relaxed">
                <span className="text-ios-pink font-semibold">{index + 1}</span> {step.description}
              </p>
              {stepIngredients.length > 0 && (
                <div className="mt-1.5 ml-5 text-xs text-ios-label-secondary leading-relaxed">
                  {stepIngredients.map((ingredient, idx) => (
                    <React.Fragment key={idx}>
                      {ingredient.name}
                      {ingredient.quantity && ingredient.unit && ` (${ingredient.quantity} ${ingredient.unit})`}
                      {idx < stepIngredients.length - 1 && ', '}
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  // ============================================
  // FORMATS COMPACTS
  // ============================================

  // COMPACT-1: Lignes condensées avec séparateurs fins
  if (variant === 'compact-1') {
    return (
      <div className="divide-y divide-ios-separator">
        {normalizedSteps.map((step, index) => {
          const stepIngredients = (step.ingredientIndices || [])
            .map(idx => ingredients[idx])
            .filter(Boolean)

          return (
            <div key={index} className="py-2.5 first:pt-0 last:pb-0">
              <div className="flex items-start gap-2.5">
                <span className="flex-shrink-0 w-6 h-6 rounded-md bg-ios-pink/10 flex items-center justify-center text-ios-pink font-bold text-xs">
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-ios-label leading-snug">
                    {step.description}
                  </p>
                  {stepIngredients.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {stepIngredients.map((ingredient, idx) => (
                        <span key={idx} className="text-[10px] text-ios-label-secondary bg-ios-bg-tertiary px-2 py-0.5 rounded">
                          {ingredient.name} {ingredient.quantity}{ingredient.unit}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  // COMPACT-2: Badges numérotés inline
  if (variant === 'compact-2') {
    return (
      <div className="space-y-2">
        {normalizedSteps.map((step, index) => {
          const stepIngredients = (step.ingredientIndices || [])
            .map(idx => ingredients[idx])
            .filter(Boolean)

          return (
            <div key={index} className="bg-ios-bg-tertiary/30 rounded-xl p-3">
              <div className="flex items-start gap-2">
                <Badge variant="blue" className="flex-shrink-0 mt-0.5 text-xs">
                  {index + 1}
                </Badge>
                <div className="flex-1 text-sm text-ios-label leading-snug">
                  {step.description}
                  {stepIngredients.length > 0 && (
                    <span className="block mt-1.5 text-xs text-ios-label-secondary">
                      {stepIngredients.map((ing, idx) => (
                        <React.Fragment key={idx}>
                          {ing.name} {ing.quantity}{ing.unit}
                          {idx < stepIngredients.length - 1 && ' • '}
                        </React.Fragment>
                      ))}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  // COMPACT-3: Format dense deux colonnes sur desktop
  if (variant === 'compact-3') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
        {normalizedSteps.map((step, index) => {
          const stepIngredients = (step.ingredientIndices || [])
            .map(idx => ingredients[idx])
            .filter(Boolean)

          return (
            <div key={index} className="flex items-start gap-2 py-2 border-b border-ios-separator/50 last:border-b-0 md:last:border-b md:[&:nth-last-child(2)]:border-b-0">
              <span className="flex-shrink-0 text-ios-pink font-bold text-sm">{index + 1}</span>
              <div className="flex-1 text-xs text-ios-label leading-snug">
                <p>{step.description}</p>
                {stepIngredients.length > 0 && (
                  <div className="mt-1 text-[10px] text-ios-label-secondary">
                    {stepIngredients.map((ing, idx) => `${ing.name} ${ing.quantity}${ing.unit}`).join(', ')}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  // COMPACT-4: Liste numérotée serrée
  if (variant === 'compact-4') {
    return (
      <ol className="space-y-2.5">
        {normalizedSteps.map((step, index) => {
          const stepIngredients = (step.ingredientIndices || [])
            .map(idx => ingredients[idx])
            .filter(Boolean)

          return (
            <li key={index} className="flex items-start gap-2.5 text-sm text-ios-label leading-snug">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br from-ios-pink to-ios-pink/70 text-white flex items-center justify-center text-[10px] font-bold mt-0.5">
                {index + 1}
              </span>
              <div className="flex-1">
                {step.description}
                {stepIngredients.length > 0 && (
                  <div className="mt-1 text-[11px] text-ios-label-secondary italic">
                    ({stepIngredients.map((ing, idx) => `${ing.name} ${ing.quantity}${ing.unit}`).join(', ')})
                  </div>
                )}
              </div>
            </li>
          )
        })}
      </ol>
    )
  }

  // COMPACT-5: Blocs condensés avec bordure
  if (variant === 'compact-5') {
    return (
      <div className="space-y-2">
        {normalizedSteps.map((step, index) => {
          const stepIngredients = (step.ingredientIndices || [])
            .map(idx => ingredients[idx])
            .filter(Boolean)

          return (
            <div key={index} className="border border-ios-separator rounded-lg p-2.5">
              <div className="flex items-start gap-2">
                <div className="flex-shrink-0 w-6 h-6 rounded bg-ios-pink text-white flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </div>
                <div className="flex-1 text-sm text-ios-label leading-tight">
                  <p>{step.description}</p>
                  {stepIngredients.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {stepIngredients.map((ing, idx) => (
                        <span key={idx} className="text-[10px] px-1.5 py-0.5 bg-ios-pink/5 text-ios-pink rounded">
                          {ing.name} {ing.quantity}{ing.unit}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  // COMPACT-6: Ultra compact une ligne par étape
  if (variant === 'compact-6') {
    return (
      <div className="space-y-1.5">
        {normalizedSteps.map((step, index) => {
          const stepIngredients = (step.ingredientIndices || [])
            .map(idx => ingredients[idx])
            .filter(Boolean)

          return (
            <div key={index} className="flex items-center gap-2 py-1.5 px-2 hover:bg-ios-bg-tertiary/30 rounded-lg transition-colors">
              <span className="flex-shrink-0 text-xs font-bold text-white bg-ios-pink w-5 h-5 rounded flex items-center justify-center">
                {index + 1}
              </span>
              <p className="flex-1 text-xs text-ios-label leading-tight">
                {step.description}
              </p>
              {stepIngredients.length > 0 && (
                <div className="flex-shrink-0 text-[10px] text-ios-label-secondary">
                  {stepIngredients.length} ingr.
                </div>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  return null
}
