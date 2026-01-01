'use client'

import React from 'react'
import { Clock, Users } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import type { Recipe } from '@/types'
import { CATEGORIES } from '@/types'

export interface RecipeCardProps {
  recipe: Recipe
  onClick?: () => void
}

export function RecipeCard({ recipe, onClick }: RecipeCardProps) {
  const categoryLabel = CATEGORIES.find((c) => c.value === recipe.category)?.label || recipe.category

  return (
    <Card
      hoverable
      onClick={onClick}
      className="cursor-pointer overflow-hidden transition-all duration-ios-normal"
    >
      {/* Image */}
      {recipe.image_url && (
        <div className="h-48 overflow-hidden -m-4 mb-4">
          <img
            src={recipe.image_url}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Contenu */}
      <div className="space-y-3">
        {/* Catégorie */}
        <Badge variant="recipe">{categoryLabel}</Badge>

        {/* Titre */}
        <h3 className="text-xl font-bold text-ios-label line-clamp-2">
          {recipe.title}
        </h3>

        {/* Infos */}
        <div className="flex items-center gap-4 text-sm text-ios-label-secondary">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{recipe.prep_time + recipe.cook_time} min</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{recipe.servings} pers.</span>
          </div>
        </div>

        {/* Aperçu ingrédients */}
        <p className="text-sm text-ios-label-tertiary line-clamp-2">
          {recipe.ingredients.length} ingrédient{recipe.ingredients.length > 1 ? 's' : ''} • {recipe.steps.length} étape{recipe.steps.length > 1 ? 's' : ''}
        </p>
      </div>
    </Card>
  )
}
