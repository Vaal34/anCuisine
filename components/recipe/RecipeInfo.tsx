import React from 'react'
import { Clock, ChefHat, Users } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import type { Recipe } from '@/types'
import { CATEGORIES } from '@/types'

export interface RecipeInfoProps {
  recipe: Recipe
}

export function RecipeInfo({ recipe }: RecipeInfoProps) {
  const categoryLabel = CATEGORIES.find((c) => c.value === recipe.category)?.label || recipe.category

  return (
    <div className="space-y-4">
      {/* Catégorie */}
      <div>
        <Badge variant="recipe" className="text-xs sm:text-sm px-2.5 sm:px-3 py-1 sm:py-1.5">
          {categoryLabel}
        </Badge>
      </div>

      {/* Infos en grille */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4">
        {/* Temps de préparation */}
        <div className="bg-ios-bg-tertiary rounded-2xl sm:rounded-3xl corner-squircle p-3 sm:p-4 flex flex-col items-center justify-center">
          <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-ios-pink mb-1.5 sm:mb-2" />
          <div className="text-lg sm:text-2xl font-bold text-ios-label">{recipe.prep_time}</div>
          <div className="text-[10px] sm:text-xs text-ios-label-secondary mt-0.5 sm:mt-1 text-center leading-tight">min prep</div>
        </div>

        {/* Temps de cuisson */}
        <div className="bg-ios-bg-tertiary rounded-2xl sm:rounded-3xl corner-squircle p-3 sm:p-4 flex flex-col items-center justify-center">
          <ChefHat className="w-5 h-5 sm:w-6 sm:h-6 text-recipe-primary mb-1.5 sm:mb-2" />
          <div className="text-lg sm:text-2xl font-bold text-ios-label">{recipe.cook_time}</div>
          <div className="text-[10px] sm:text-xs text-ios-label-secondary mt-0.5 sm:mt-1 text-center leading-tight">min cuisson</div>
        </div>

        {/* Portions */}
        <div className="bg-ios-bg-tertiary rounded-2xl sm:rounded-3xl corner-squircle p-3 sm:p-4 flex flex-col items-center justify-center">
          <Users className="w-5 h-5 sm:w-6 sm:h-6 text-ios-pink mb-1.5 sm:mb-2" />
          <div className="text-lg sm:text-2xl font-bold text-ios-label">{recipe.servings}</div>
          <div className="text-[10px] sm:text-xs text-ios-label-secondary mt-0.5 sm:mt-1 text-center leading-tight">
            {recipe.servings > 1 ? 'personnes' : 'personne'}
          </div>
        </div>
      </div>
    </div>
  )
}
