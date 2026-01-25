import React from 'react'
import { UtensilsCrossed } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Recipe, RecipeStep } from '@/types'

export interface RecipeUstensilesListProps {
    recipe: Recipe
    stepObj: RecipeStep | null
    variant?: 'default' | 'mobile'
    compact?: boolean
}

export function RecipeUstensilesList({
    recipe,
    stepObj,
    variant = 'default',
    compact = false
}: RecipeUstensilesListProps) {
    if (!stepObj?.ustensileIndices || stepObj.ustensileIndices.length === 0) return null
    if (!recipe.ustensiles || recipe.ustensiles.length === 0) return null

    const ustensiles = stepObj.ustensileIndices
        .map((index) => recipe.ustensiles?.[index])
        .filter((u): u is string => !!u)

    if (ustensiles.length === 0) return null

    const content = (
        <div className="flex flex-wrap gap-2">
            {ustensiles.map((ustensile, index) => (
                <div
                    key={index}
                    className={cn(
                        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full transition-all",
                        "bg-ios-bg-secondary text-ios-label border border-ios-separator"
                    )}
                >
                    <UtensilsCrossed className="w-3.5 h-3.5 text-ios-label-secondary" />
                    <span className="text-sm font-medium">{ustensile}</span>
                </div>
            ))}
        </div>
    )

    if (variant === 'mobile') {
        return (
            <div className="mt-4">
                <h3 className="font-semibold text-ios-label text-sm mb-2 px-1">Ustensiles</h3>
                {content}
            </div>
        )
    }

    // Desktop Widget Version
    return (
        <div className={cn(
            "bg-white rounded-3xl shadow-ios-md overflow-hidden",
            compact ? "p-4" : "p-5"
        )}>
            {/* Header */}
            <div className="flex items-center gap-2 mb-3">
                <div className={cn(
                    "flex items-center justify-center rounded-2xl bg-ios-label-secondary",
                    compact ? "w-8 h-8" : "w-9 h-9"
                )}>
                    <UtensilsCrossed className="w-4 h-4 text-white" />
                </div>
                <span className={cn(
                    "font-semibold text-ios-label",
                    compact ? "text-sm" : "text-base"
                )}>
                    {ustensiles.length > 1 ? 'Ustensiles' : 'Ustensile'}
                </span>
            </div>

            {content}
        </div>
    )
}
