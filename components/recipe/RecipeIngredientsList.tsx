import React from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatQuantity } from '@/lib/format'
import type { Recipe, RecipeStep } from '@/types'

export interface RecipeIngredientsListProps {
    recipe: Recipe
    stepObj: RecipeStep | null
    checkedIngredients: Set<number>
    onToggleIngredient: (index: number) => void
    variant?: 'default' | 'mobile'
    compact?: boolean
}

export function RecipeIngredientsList({
    recipe,
    stepObj,
    checkedIngredients,
    onToggleIngredient,
    variant = 'default',
    compact = false
}: RecipeIngredientsListProps) {
    if (!stepObj?.ingredientIndices || stepObj.ingredientIndices.length === 0) return null

    const content = (
        <div className="space-y-2">
            {variant === 'mobile' && (
                <h3 className="font-semibold text-ios-label text-sm mb-2 px-1">Ingrédients</h3>
            )}

            {stepObj.ingredientIndices.map((index) => {
                const ingredient = recipe.ingredients[index]
                if (!ingredient) return null
                const isChecked = checkedIngredients.has(index)

                return (
                    <button
                        key={index}
                        onClick={() => onToggleIngredient(index)}
                        className={cn(
                            "w-full flex items-center gap-3 p-3 rounded-2xl transition-all duration-200 text-left group",
                            isChecked
                                ? "bg-ios-bg-secondary"
                                : "bg-ios-bg hover:bg-ios-bg-secondary"
                        )}
                    >
                        {/* Checkbox circle */}
                        <div className={cn(
                            "flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                            isChecked
                                ? "bg-accent border-accent scale-110"
                                : "bg-transparent border-ios-label-quaternary group-hover:border-accent/50"
                        )}>
                            <Check className={cn(
                                "w-3.5 h-3.5 text-white transition-all duration-300",
                                isChecked ? "opacity-100 scale-100" : "opacity-0 scale-50"
                            )} strokeWidth={3} />
                        </div>

                        {/* Content */}
                        <div className={cn(
                            "flex-1 transition-all duration-300",
                            isChecked ? "opacity-40" : "opacity-100"
                        )}>
                            <div className="flex flex-wrap items-baseline gap-x-2">
                                {ingredient.quantity && (
                                    <span className={cn(
                                        "font-bold transition-colors",
                                        isChecked ? "text-ios-label" : "text-accent"
                                    )}>
                                        {formatQuantity(ingredient.quantity)}{ingredient.unit && ` ${ingredient.unit}`}
                                    </span>
                                )}
                                <span className={cn(
                                    "font-medium text-ios-label transition-all",
                                    isChecked && "line-through decoration-ios-label/50"
                                )}>
                                    {ingredient.name}
                                </span>
                            </div>
                        </div>
                    </button>
                )
            })}
        </div>
    )

    if (variant === 'mobile') {
        return <div className="mt-2">{content}</div>
    }

    // Desktop Widget Version
    return (
        <div className={cn(
            "bg-white rounded-3xl shadow-ios-md overflow-hidden flex flex-col h-full",
            compact ? "p-4" : "p-5"
        )}>
            {/* Header */}
            <div className="flex items-center gap-2 mb-4 flex-shrink-0">
                <div className={cn(
                    "flex items-center justify-center rounded-full bg-accent",
                    compact ? "w-8 h-8" : "w-9 h-9"
                )}>
                    <span className="text-white text-sm font-bold">
                        {stepObj.ingredientIndices.length}
                    </span>
                </div>
                <span className={cn(
                    "font-semibold text-ios-label",
                    compact ? "text-sm" : "text-base"
                )}>
                    {stepObj.ingredientIndices.length > 1 ? 'Ingrédients' : 'Ingrédient'}
                </span>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto scrollbar-subtle">
                {content}
            </div>
        </div>
    )
}
