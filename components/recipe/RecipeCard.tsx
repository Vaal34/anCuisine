'use client'

import React from 'react'
import { Clock, Users, ChefHat } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import type { Recipe } from '@/types'
import { CATEGORIES } from '@/types'

export interface RecipeCardProps {
  recipe: Recipe
  onClick?: () => void
  onStartCooking?: () => void
  variant?: 'default' | 'overlay' | 'compact' | 'horizontal' | 'minimal' | 'liquid-glass'
}

export function RecipeCard({ recipe, onClick, onStartCooking, variant = 'overlay' }: RecipeCardProps) {
  const categoryLabel = CATEGORIES.find((c) => c.value === recipe.category)?.label || recipe.category
  const totalTime = recipe.prep_time + recipe.cook_time

  const handleStartCooking = (e: React.MouseEvent) => {
    e.stopPropagation()
    onStartCooking?.()
  }

  // Variant: Liquid Glass (Performance Optimized)
  if (variant === 'liquid-glass') {
    return (
      <div
        onClick={onClick}
        className="relative h-[340px] cursor-pointer group overflow-hidden rounded-[2.5rem] corner-squircle shadow-lg will-change-transform"
      >
        {/* Background image */}
        {recipe.image_url && (
          <img
            src={recipe.image_url}
            alt={recipe.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {/* Single optimized gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/70" />

        {/* Subtle animated gradient - single layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-ios-pink/15 via-transparent to-purple-500/10 opacity-50 group-hover:opacity-70 transition-opacity duration-500" />

        {/* Single backdrop-blur layer */}
        <div className="absolute inset-0 backdrop-blur-[0.3px] group-hover:backdrop-blur-[0.5px] transition-[backdrop-filter] duration-500" />

        {/* Content */}
        <div className="absolute inset-0 p-5 flex flex-col justify-between">
          {/* Top section */}
          <div className="flex items-start justify-between">
            <Badge
              variant="recipe"
              className="bg-white/20 backdrop-blur-md border border-white/30 text-white shadow-lg"
            >
              {categoryLabel}
            </Badge>

            {/* Glass button */}
            {onStartCooking && (
              <button
                onClick={handleStartCooking}
                className="w-11 h-11 rounded-xl corner-squircle bg-white/10 backdrop-blur-md border border-white/20 shadow-lg flex items-center justify-center transition-colors duration-200 hover:bg-white/20 hover:border-white/30"
              >
                <ChefHat className="w-5 h-5 text-white" />
              </button>
            )}
          </div>

          {/* Bottom section */}
          <div className="space-y-3">
            {/* Title container */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl corner-squircle border border-white/20 shadow-lg px-5 py-4">
              <h3 className="text-3xl font-bold text-white drop-shadow-lg tracking-tight line-clamp-2">
                {recipe.title}
              </h3>
            </div>

            {/* Info pills */}
            <div className="flex items-center gap-2">
              <div className="flex-1 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center gap-2 shadow-md transition-colors duration-200 hover:bg-white/15 hover:border-white/30">
                <Clock className="w-4 h-4 text-white/90" />
                <span className="text-sm font-semibold text-white">{totalTime} min</span>
              </div>

              <div className="flex-1 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center gap-2 shadow-md transition-colors duration-200 hover:bg-white/15 hover:border-white/30">
                <Users className="w-4 h-4 text-white/90" />
                <span className="text-sm font-semibold text-white">{recipe.servings} pers.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Variant 1: Image avec overlay (DEFAULT)
  if (variant === 'overlay') {
    return (
      <div
        onClick={onClick}
        className="relative h-80 cursor-pointer group"
      >
        <div className="absolute inset-0 rounded-3xl corner-squircle overflow-hidden shadow-ios-md group-hover:shadow-ios-lg transition-shadow duration-ios-normal">
          {recipe.image_url && (
            <img
              src={recipe.image_url}
              alt={recipe.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-ios-normal"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-ios-pink/0 group-hover:bg-ios-pink/10 transition-colors duration-ios-normal pointer-events-none" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-5 space-y-3 z-10">
          <Badge variant="recipe" className="bg-ios-pink/90 backdrop-blur-sm border-ios-pink text-white">
            {categoryLabel}
          </Badge>
          <h3 className="text-2xl font-bold text-white line-clamp-2">
            {recipe.title}
          </h3>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 text-xs font-semibold bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-full flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {totalTime} min
            </span>
            <span className="px-3 py-1 text-xs font-semibold bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-full flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {recipe.servings} pers.
            </span>
          </div>
        </div>
        {onStartCooking && (
          <button
            onClick={handleStartCooking}
            className="absolute bottom-5 right-5 z-20 w-12 h-12 rounded-2xl corner-squircle bg-ios-pink hover:bg-ios-pink-dark shadow-ios-lg hover:shadow-ios-xl transition-all duration-ios-normal flex items-center justify-center text-white"
          >
            <ChefHat className="w-6 h-6" />
          </button>
        )}
      </div>
    )
  }

  // Variant 2: Image compacte
  if (variant === 'compact') {
    return (
      <Card
        hoverable
        onClick={onClick}
        className="cursor-pointer overflow-hidden transition-all duration-ios-normal"
      >
        {recipe.image_url && (
          <div className="h-32 overflow-hidden -m-4 sm:-m-5 md:-m-6 mb-4 sm:mb-5 md:mb-6">
            <img
              src={recipe.image_url}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="space-y-2 relative">
          <Badge variant="recipe">{categoryLabel}</Badge>
          <h3 className="text-lg font-bold text-ios-label line-clamp-2">
            {recipe.title}
          </h3>
          <div className="flex items-center gap-3 text-xs text-ios-label-secondary">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{totalTime} min</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              <span>{recipe.servings} pers.</span>
            </div>
          </div>
          <p className="text-xs text-ios-label-tertiary">
            {recipe.ingredients.length} ingrédients • {recipe.steps.length} étapes
          </p>
          {onStartCooking && (
            <button
              onClick={handleStartCooking}
              className="absolute bottom-0 right-0 w-10 h-10 rounded-xl corner-squircle bg-ios-pink hover:bg-ios-pink-dark shadow-ios-md hover:shadow-ios-lg transition-all duration-ios-normal flex items-center justify-center text-white"
            >
              <ChefHat className="w-5 h-5" />
            </button>
          )}
        </div>
      </Card>
    )
  }

  // Variant 3: Layout horizontal
  if (variant === 'horizontal') {
    return (
      <Card
        hoverable
        onClick={onClick}
        className="cursor-pointer overflow-hidden transition-all duration-ios-normal"
      >
        <div className="flex gap-4 -m-4 sm:-m-5 md:-m-6">
          {recipe.image_url && (
            <div className="w-32 h-32 flex-shrink-0 overflow-hidden">
              <img
                src={recipe.image_url}
                alt={recipe.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="flex-1 p-4 sm:p-5 md:p-6 space-y-2 relative">
            <Badge variant="recipe">{categoryLabel}</Badge>
            <h3 className="text-lg font-bold text-ios-label line-clamp-2">
              {recipe.title}
            </h3>
            <div className="flex items-center gap-3 text-xs text-ios-label-secondary">
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{totalTime} min</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                <span>{recipe.servings} pers.</span>
              </div>
            </div>
            <p className="text-xs text-ios-label-tertiary">
              {recipe.ingredients.length} ingrédients • {recipe.steps.length} étapes
            </p>
            {onStartCooking && (
              <button
                onClick={handleStartCooking}
                className="absolute bottom-4 right-4 w-10 h-10 rounded-xl corner-squircle bg-ios-pink hover:bg-ios-pink-dark shadow-ios-md hover:shadow-ios-lg transition-all duration-ios-normal flex items-center justify-center text-white"
              >
                <ChefHat className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </Card>
    )
  }

  // Variant 4: Minimal
  if (variant === 'minimal') {
    return (
      <div
        onClick={onClick}
        className="cursor-pointer group space-y-3"
      >
        {recipe.image_url && (
          <div className="h-48 rounded-3xl corner-squircle overflow-hidden shadow-ios-md group-hover:shadow-ios-lg transition-all duration-ios-normal">
            <img
              src={recipe.image_url}
              alt={recipe.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-ios-normal"
            />
          </div>
        )}
        <div className="space-y-2 relative">
          <h3 className="text-lg font-bold text-ios-label line-clamp-2">
            {recipe.title}
          </h3>
          <div className="flex items-center gap-3 text-sm text-ios-label-secondary">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{totalTime} min</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{recipe.servings} pers.</span>
            </div>
          </div>
          {onStartCooking && (
            <button
              onClick={handleStartCooking}
              className="absolute bottom-0 right-0 w-10 h-10 rounded-xl corner-squircle bg-ios-pink hover:bg-ios-pink-dark shadow-ios-md hover:shadow-ios-lg transition-all duration-ios-normal flex items-center justify-center text-white"
            >
              <ChefHat className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    )
  }

  // Default variant (original)
  return (
    <Card
      hoverable
      onClick={onClick}
      className="cursor-pointer overflow-hidden transition-all duration-ios-normal"
    >
      {recipe.image_url && (
        <div className="h-48 overflow-hidden -m-4 sm:-m-5 md:-m-6 mb-4 sm:mb-5 md:mb-6">
          <img
            src={recipe.image_url}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="space-y-3 relative">
        <Badge variant="recipe">{categoryLabel}</Badge>
        <h3 className="text-xl font-bold text-ios-label line-clamp-2">
          {recipe.title}
        </h3>
        <div className="flex items-center gap-4 text-sm text-ios-label-secondary">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{totalTime} min</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{recipe.servings} pers.</span>
          </div>
        </div>
        <p className="text-sm text-ios-label-tertiary line-clamp-2">
          {recipe.ingredients.length} ingrédient{recipe.ingredients.length > 1 ? 's' : ''} • {recipe.steps.length} étape{recipe.steps.length > 1 ? 's' : ''}
        </p>
        {onStartCooking && (
          <button
            onClick={handleStartCooking}
            className="absolute bottom-0 right-0 w-10 h-10 rounded-xl corner-squircle bg-ios-pink hover:bg-ios-pink-dark shadow-ios-md hover:shadow-ios-lg transition-all duration-ios-normal flex items-center justify-center text-white"
          >
            <ChefHat className="w-5 h-5" />
          </button>
        )}
      </div>
    </Card>
  )
}
