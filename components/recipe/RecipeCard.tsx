'use client'

import React from 'react'

import { Clock, UtensilsCrossed, Users2, Flame, Zap, Wind, CookingPot, Droplets, Sparkles } from 'lucide-react'
import type { Recipe } from '@/types'
import { CATEGORIES, COOKING_METHODS } from '@/types'

export interface RecipeCardProps {
  recipe: Recipe
  onClick?: () => void
  onStartCooking?: () => void
  variant?: 'default' | 'overlay' | 'compact' | 'horizontal' | 'minimal' | 'premium'
}

export function RecipeCard({ recipe, onClick, onStartCooking, variant = 'premium' }: RecipeCardProps) {
  const categoryLabel = CATEGORIES.find((c) => c.value === recipe.category)?.label || recipe.category
  const totalTime = recipe.prep_time + recipe.cook_time

  const handleStartCooking = (e: React.MouseEvent) => {
    e.stopPropagation()
    onStartCooking?.()
  }

  // Mapping des icônes de cuisson
  const cookingIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    'Flame': Flame,
    'Zap': Zap,
    'Wind': Wind,
    'CookingPot': CookingPot,
    'Droplets': Droplets,
    'Sparkles': Sparkles,
  }

  // Obtenir l'icône de la première méthode de cuisson
  const firstCookingMethod = recipe.cooking_methods?.[0]
  const cookingMethodInfo = COOKING_METHODS.find(m => m.value === firstCookingMethod)
  const CookingIcon = cookingMethodInfo ? cookingIconMap[cookingMethodInfo.icon] : null

  // Premium Card - Style luxueux et élégant avec iOS Pink
  return (
    <div
      onClick={onClick}
      className="relative h-64 sm:h-72 md:h-80 lg:h-96 rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden group cursor-pointer shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.2)] transition-shadow duration-300 w-full"
    >
      {/* Background Image */}
      {recipe.image_url && (
        <img
          src={recipe.image_url}
          alt={recipe.title}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 group-hover:brightness-125 transition-all duration-700 ease-out"
        />
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />

      {/* Content */}
      <div className="absolute inset-0 p-4 sm:p-5 md:p-6 flex flex-col justify-end">
        {/* Category Badge - iOS Pink */}
        <span className="text-[#FF2D55] text-[10px] sm:text-xs font-semibold uppercase tracking-widest mb-1 sm:mb-2">
          {categoryLabel}
        </span>

        {/* Title */}
        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-3 sm:mb-4 leading-tight line-clamp-2">
          {recipe.title}
        </h3>

        {/* Bottom Row - Info & Play Button */}
        <div className="flex items-center justify-between gap-2">
          {/* Time & Servings Info */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 text-white/70 text-xs sm:text-sm">
            <div className="flex items-center gap-1 sm:gap-1.5">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="whitespace-nowrap">{totalTime} min</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-1.5">
              <Users2 className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="whitespace-nowrap">{recipe.servings} pers.</span>
            </div>
            {CookingIcon && cookingMethodInfo && (
              <div className="flex items-center gap-1 sm:gap-1.5">
                <CookingIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="whitespace-nowrap">{cookingMethodInfo.label}</span>
              </div>
            )}
          </div>

          {/* Play Button - iOS Pink */}
          {onStartCooking && (
            <button
              onClick={handleStartCooking}
              className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-ios-pink/40 border border-ios-pink rounded-full flex items-center justify-center hover:bg-ios-pink/50 hover:scale-105 active:scale-95 transition-all duration-500 shadow-lg shadow-ios-pink/30"
            >
              <UtensilsCrossed className="w-4 h-4 sm:w-5 sm:h-5 text-ios-pink" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
