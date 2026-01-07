import React from 'react'
import type { RecipeIngredient } from '@/types'
import { Check, Minus, Plus, ShoppingCart } from 'lucide-react'

export interface IngredientsListProps {
  ingredients: RecipeIngredient[]
  variant?:
  | 'cards' | 'list' | 'compact' | 'table' | 'checklist' | 'badges'
  | 'minimal' | 'grouped' | 'pills' | 'boxes' | 'modern' | 'elegant'
}

export function IngredientsListVariants({ ingredients, variant = 'cards' }: IngredientsListProps) {
  const [checkedItems, setCheckedItems] = React.useState<Set<number>>(new Set())

  const toggleCheck = (index: number) => {
    const newChecked = new Set(checkedItems)
    if (newChecked.has(index)) {
      newChecked.delete(index)
    } else {
      newChecked.add(index)
    }
    setCheckedItems(newChecked)
  }

  // VARIANT 1: CARDS - Cartes avec badge quantité (style actuel amélioré)
  if (variant === 'cards') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
        {ingredients.map((ingredient, index) => (
          <div
            key={index}
            className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 bg-ios-pink/10 border-2 border-ios-pink/30 rounded-3xl shadow-sm hover:shadow-md hover:border-ios-pink/50 transition-all duration-300"
          >
            <span className="text-sm sm:text-base font-medium text-ios-label truncate mr-2">
              {ingredient.name}
            </span>
            {ingredient.quantity && ingredient.unit && (
              <span className="px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-semibold bg-ios-pink text-white rounded-2xl whitespace-nowrap flex-shrink-0 shadow-sm">
                {ingredient.quantity} {ingredient.unit}
              </span>
            )}
          </div>
        ))}
      </div>
    )
  }

  // VARIANT 2: LIST - Liste simple avec puces
  if (variant === 'list') {
    return (
      <ul className="space-y-2 sm:space-y-2.5">
        {ingredients.map((ingredient, index) => (
          <li key={index} className="flex items-center gap-3 text-sm sm:text-base text-ios-label">
            <span className="w-1.5 h-1.5 rounded-full bg-ios-pink flex-shrink-0" />
            <span className="font-medium flex-1">{ingredient.name}</span>
            {ingredient.quantity && ingredient.unit && (
              <span className="text-ios-pink font-semibold whitespace-nowrap">
                {ingredient.quantity} {ingredient.unit}
              </span>
            )}
          </li>
        ))}
      </ul>
    )
  }

  // VARIANT 3: COMPACT - Format ultra compact
  if (variant === 'compact') {
    return (
      <div className="space-y-1.5">
        {ingredients.map((ingredient, index) => (
          <div key={index} className="flex items-center justify-between py-1.5 px-2 hover:bg-ios-bg-tertiary/30 rounded-lg transition-colors">
            <span className="text-sm text-ios-label font-medium">{ingredient.name}</span>
            {ingredient.quantity && ingredient.unit && (
              <span className="text-xs text-ios-pink font-semibold">
                {ingredient.quantity}{ingredient.unit}
              </span>
            )}
          </div>
        ))}
      </div>
    )
  }

  // VARIANT 4: TABLE - Format tableau épuré
  if (variant === 'table') {
    return (
      <div className="divide-y divide-ios-separator">
        {ingredients.map((ingredient, index) => (
          <div key={index} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
            <span className="text-sm sm:text-base text-ios-label font-medium">{ingredient.name}</span>
            {ingredient.quantity && ingredient.unit && (
              <span className="text-sm sm:text-base text-ios-pink font-bold">
                {ingredient.quantity} {ingredient.unit}
              </span>
            )}
          </div>
        ))}
      </div>
    )
  }

  // VARIANT 5: CHECKLIST - Liste avec cases à cocher
  if (variant === 'checklist') {
    return (
      <div className="space-y-2">
        {ingredients.map((ingredient, index) => {
          const isChecked = checkedItems.has(index)
          return (
            <button
              key={index}
              onClick={() => toggleCheck(index)}
              className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all ${isChecked
                ? 'bg-ios-green/10 border border-ios-green/30'
                : 'bg-ios-bg-tertiary/50 border border-transparent hover:border-ios-pink/30'
                }`}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${isChecked
                ? 'bg-ios-green border-ios-green'
                : 'border-ios-separator'
                }`}>
                {isChecked && <Check className="w-3 h-3 text-white" />}
              </div>
              <span className={`text-sm sm:text-base font-medium flex-1 text-left ${isChecked ? 'text-ios-label-secondary line-through' : 'text-ios-label'
                }`}>
                {ingredient.name}
              </span>
              {ingredient.quantity && ingredient.unit && !isChecked && (
                <span className="text-xs sm:text-sm text-ios-pink font-semibold whitespace-nowrap">
                  {ingredient.quantity} {ingredient.unit}
                </span>
              )}
            </button>
          )
        })}
      </div>
    )
  }

  // VARIANT 6: BADGES - Badges colorés inline
  if (variant === 'badges') {
    return (
      <div className="flex flex-wrap gap-2">
        {ingredients.map((ingredient, index) => (
          <div
            key={index}
            className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-br from-ios-pink/15 to-ios-pink/5 border border-ios-pink/30 rounded-full text-xs sm:text-sm font-medium text-ios-label shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300"
          >
            <span className="font-semibold">{ingredient.name}</span>
            {ingredient.quantity && ingredient.unit && (
              <>
                <span className="text-ios-pink/40">•</span>
                <span className="text-ios-pink font-bold">{ingredient.quantity}{ingredient.unit}</span>
              </>
            )}
          </div>
        ))}
      </div>
    )
  }

  // VARIANT 7: MINIMAL - Ultra minimaliste
  if (variant === 'minimal') {
    return (
      <div className="space-y-2.5">
        {ingredients.map((ingredient, index) => (
          <div key={index} className="text-sm sm:text-base text-ios-label">
            <span className="font-medium">{ingredient.name}</span>
            {ingredient.quantity && ingredient.unit && (
              <span className="text-ios-label-secondary ml-2">
                — {ingredient.quantity} {ingredient.unit}
              </span>
            )}
          </div>
        ))}
      </div>
    )
  }

  // VARIANT 8: GROUPED - Groupés par type avec séparateurs
  if (variant === 'grouped') {
    return (
      <div className="space-y-3">
        {ingredients.map((ingredient, index) => (
          <div key={index} className="relative">
            <div className="flex items-center gap-3 pb-3 border-b border-ios-separator/50 last:border-b-0 last:pb-0">
              <div className="w-2 h-2 rounded-full bg-ios-pink" />
              <div className="flex-1 flex items-baseline justify-between gap-2">
                <span className="text-sm sm:text-base font-medium text-ios-label">
                  {ingredient.name}
                </span>
                {ingredient.quantity && ingredient.unit && (
                  <span className="text-sm sm:text-base text-ios-pink font-bold whitespace-nowrap">
                    {ingredient.quantity} {ingredient.unit}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  // VARIANT 9: PILLS - Pilules avec fond coloré
  if (variant === 'pills') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {ingredients.map((ingredient, index) => (
          <div
            key={index}
            className="flex items-center justify-between px-4 py-2.5 bg-gradient-to-r from-ios-pink/10 to-transparent rounded-full border border-ios-pink/20"
          >
            <span className="text-sm font-medium text-ios-label">{ingredient.name}</span>
            {ingredient.quantity && ingredient.unit && (
              <span className="text-xs font-bold text-ios-pink bg-white px-2.5 py-1 rounded-full">
                {ingredient.quantity}{ingredient.unit}
              </span>
            )}
          </div>
        ))}
      </div>
    )
  }

  // VARIANT 10: BOXES - Boîtes individuelles
  if (variant === 'boxes') {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {ingredients.map((ingredient, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-ios-separator shadow-sm hover:shadow-md hover:border-ios-pink/30 transition-all duration-300"
          >
            <div className="text-center mb-2">
              <div className="text-sm sm:text-base font-semibold text-ios-label mb-1">
                {ingredient.name}
              </div>
              {ingredient.quantity && ingredient.unit && (
                <div className="text-xs sm:text-sm text-ios-pink font-bold">
                  {ingredient.quantity} {ingredient.unit}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    )
  }

  // VARIANT 11: MODERN - Style moderne avec icône
  if (variant === 'modern') {
    return (
      <div className="space-y-2">
        {ingredients.map((ingredient, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-ios-bg-tertiary/50 to-transparent hover:from-ios-pink/5 transition-all duration-300"
          >
            <div className="w-8 h-8 rounded-lg bg-ios-pink/10 flex items-center justify-center flex-shrink-0">
              <Minus className="w-4 h-4 text-ios-pink" />
            </div>
            <div className="flex-1 flex items-baseline justify-between gap-2">
              <span className="text-sm sm:text-base font-medium text-ios-label">
                {ingredient.name}
              </span>
              {ingredient.quantity && ingredient.unit && (
                <span className="text-sm text-ios-pink font-bold whitespace-nowrap">
                  {ingredient.quantity} {ingredient.unit}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    )
  }

  // VARIANT 12: ELEGANT - Style élégant premium
  if (variant === 'elegant') {
    return (
      <div className="space-y-3">
        {ingredients.map((ingredient, index) => (
          <div
            key={index}
            className="group relative rounded-2xl overflow-hidden bg-white/60 border border-white/50 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-ios-pink/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 rounded-full bg-ios-pink" />
                <span className="text-sm sm:text-base font-semibold text-ios-label">
                  {ingredient.name}
                </span>
              </div>
              {ingredient.quantity && ingredient.unit && (
                <div className="px-3 py-1.5 bg-ios-pink/10 rounded-full">
                  <span className="text-sm font-bold text-ios-pink">
                    {ingredient.quantity} {ingredient.unit}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return null
}
