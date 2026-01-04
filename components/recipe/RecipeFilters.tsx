'use client'

import React from 'react'
import { Search, Flame, Zap, Wind, CookingPot, Droplets, Sparkles } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { CATEGORIES, COOKING_METHODS } from '@/types'

export interface RecipeFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  selectedCategory: string
  onCategoryChange: (value: string) => void
  selectedCookingMethod?: string
  onCookingMethodChange?: (value: string) => void
}

export function RecipeFilters({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedCookingMethod = 'all',
  onCookingMethodChange,
}: RecipeFiltersProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Recherche */}
      <div className="flex-1">
        <Input
          type="text"
          placeholder="Rechercher une recette ou un ingrédient..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          leftIcon={<Search className="w-5 h-5" />}
        />
      </div>

      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Filtre catégorie */}
        <div className="flex-1">
          <Select value={selectedCategory} onChange={(e) => onCategoryChange(e.target.value)}>
            <option value="all">Toutes les catégories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </Select>
        </div>

        {/* Filtre méthode de cuisson */}
        {onCookingMethodChange && (
          <div className="flex-1">
            <Select value={selectedCookingMethod} onChange={(e) => onCookingMethodChange(e.target.value)}>
              <option value="all">Toutes les méthodes</option>
              {COOKING_METHODS.map((method) => (
                <option key={method.value} value={method.value}>
                  {method.label}
                </option>
              ))}
            </Select>
          </div>
        )}
      </div>
    </div>
  )
}
