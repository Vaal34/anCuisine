import React from 'react'
import { Clock, ChefHat, Users, Flame, Zap, Wind, CookingPot, Droplets, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import type { Recipe } from '@/types'
import { CATEGORIES, COOKING_METHODS } from '@/types'

export interface RecipeInfoProps {
  recipe: Recipe
  hideCategory?: boolean
}

export function RecipeInfo({ recipe, hideCategory = false }: RecipeInfoProps) {
  const categoryLabel = CATEGORIES.find((c) => c.value === recipe.category)?.label || recipe.category

  const getCookingMethodIcon = (iconName: string) => {
    const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
      Flame,
      Zap,
      Wind,
      CookingPot,
      Droplets,
      Sparkles,
    }
    return iconMap[iconName] || Flame
  }

  // Récupérer la première méthode de cuisson
  const firstCookingMethod = recipe.cooking_methods?.[0]
  const cookingMethod = firstCookingMethod ? COOKING_METHODS.find((m) => m.value === firstCookingMethod) : null
  const CookingIcon = cookingMethod ? getCookingMethodIcon(cookingMethod.icon) : null

  return (
    <div className="space-y-4">
      {/* Catégorie */}
      {!hideCategory && (
        <div>
          <Badge variant="recipe" className="text-xs sm:text-sm px-2.5 sm:px-3 py-1 sm:py-1.5">
            {categoryLabel}
          </Badge>
        </div>
      )}

      {/* Infos en ligne compacte */}
      <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
        {/* Temps de préparation */}
        <div className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-ios-bg-tertiary rounded-2xl">
          <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-ios-pink flex-shrink-0" />
          <div className="flex items-baseline gap-1">
            <span className="text-base sm:text-lg font-bold text-ios-label">{recipe.prep_time}</span>
            <span className="text-xs sm:text-sm text-ios-label-secondary">min</span>
          </div>
        </div>

        {/* Temps de cuisson */}
        <div className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-ios-bg-tertiary rounded-2xl">
          <ChefHat className="w-4 h-4 sm:w-5 sm:h-5 text-ios-pink flex-shrink-0" />
          <div className="flex items-baseline gap-1">
            <span className="text-base sm:text-lg font-bold text-ios-label">{recipe.cook_time}</span>
            <span className="text-xs sm:text-sm text-ios-label-secondary">min</span>
          </div>
        </div>

        {/* Portions */}
        <div className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-ios-bg-tertiary rounded-2xl">
          <Users className="w-4 h-4 sm:w-5 sm:h-5 text-ios-pink flex-shrink-0" />
          <div className="flex items-baseline gap-1">
            <span className="text-base sm:text-lg font-bold text-ios-label">{recipe.servings}</span>
            <span className="text-xs sm:text-sm text-ios-label-secondary">
              {recipe.servings > 1 ? 'pers.' : 'pers.'}
            </span>
          </div>
        </div>

        {/* Méthode de cuisson */}
        {CookingIcon && cookingMethod && (
          <div className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-ios-pink/10 border border-ios-pink/30 rounded-2xl">
            <CookingIcon className="w-4 h-4 sm:w-5 sm:h-5 text-ios-pink flex-shrink-0" />
            <div className="flex items-baseline gap-1">
              <span className="text-base sm:text-lg font-bold text-ios-pink">
                {cookingMethod.label}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Autres méthodes de cuisson si plusieurs */}
      {recipe.cooking_methods && recipe.cooking_methods.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {recipe.cooking_methods.slice(1).map((methodValue) => {
            const method = COOKING_METHODS.find((m) => m.value === methodValue)
            if (!method) return null

            const IconComponent = getCookingMethodIcon(method.icon)

            return (
              <div
                key={methodValue}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-ios-bg-tertiary rounded-full border border-ios-separator"
              >
                <IconComponent className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-ios-pink" />
                <span className="text-xs sm:text-sm font-medium text-ios-label">
                  {method.label}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
