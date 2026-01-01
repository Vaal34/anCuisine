'use client'

import React from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { CATEGORIES } from '@/types'

export interface RecipeFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  selectedCategory: string
  onCategoryChange: (value: string) => void
}

export function RecipeFilters({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
}: RecipeFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
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

      {/* Filtre catégorie */}
      <div className="w-full sm:w-64">
        <Select value={selectedCategory} onChange={(e) => onCategoryChange(e.target.value)}>
          <option value="all">Toutes les catégories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </Select>
      </div>
    </div>
  )
}
