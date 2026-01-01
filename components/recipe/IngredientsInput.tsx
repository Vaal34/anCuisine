'use client'

import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Plus, X, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useIngredients } from '@/hooks/useIngredients'
import type { RecipeIngredient } from '@/types'
import { UNITS } from '@/types'

export interface IngredientsInputProps {
  ingredients: RecipeIngredient[]
  onChange: (ingredients: RecipeIngredient[]) => void
  disabled?: boolean
}

export function IngredientsInput({ ingredients, onChange, disabled }: IngredientsInputProps) {
  const { searchIngredients, ingredients: allIngredients } = useIngredients()
  const [showDropdown, setShowDropdown] = useState<number | null>(null)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 })
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Initialiser avec un ingrédient vide si nécessaire
  useEffect(() => {
    if (ingredients.length === 0) {
      onChange([{ ingredientId: null, name: '', quantity: null, unit: 'g' }])
    }
  }, [])

  // Calculer la position du dropdown
  useEffect(() => {
    if (showDropdown !== null && inputRefs.current[showDropdown]) {
      const inputElement = inputRefs.current[showDropdown]
      if (inputElement) {
        const rect = inputElement.getBoundingClientRect()
        setDropdownPosition({
          top: rect.bottom + window.scrollY + 4,
          left: rect.left + window.scrollX,
          width: rect.width
        })
      }
    }
  }, [showDropdown])

  // Fermer dropdown en cliquant à l'extérieur
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showDropdown !== null) {
        const input = inputRefs.current[showDropdown]
        const dropdown = dropdownRef.current
        if (
          input && !input.contains(e.target as Node) &&
          dropdown && !dropdown.contains(e.target as Node)
        ) {
          setShowDropdown(null)
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showDropdown])

  const addIngredient = () => {
    onChange([
      ...ingredients,
      {
        ingredientId: null,
        name: '',
        quantity: null,
        unit: 'g',
      },
    ])
  }

  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      onChange(ingredients.filter((_, i) => i !== index))
    }
  }

  const handleQuantityChange = (index: number, value: string) => {
    const updated = [...ingredients]
    updated[index] = {
      ...updated[index],
      quantity: value ? parseFloat(value) : null
    }
    onChange(updated)
  }

  const handleUnitChange = (index: number, value: string) => {
    const updated = [...ingredients]
    updated[index] = { ...updated[index], unit: value }
    onChange(updated)
  }

  const handleNameChange = (index: number, value: string) => {
    const updated = [...ingredients]
    updated[index] = {
      ...updated[index],
      name: value,
      ingredientId: null
    }
    onChange(updated)

    // Afficher dropdown si on tape et qu'il y a des résultats
    if (value.length > 0) {
      setShowDropdown(index)
    } else {
      setShowDropdown(null)
    }
  }

  const selectIngredient = (index: number, ingredientId: string) => {
    const ingredient = allIngredients.find(i => i.id === ingredientId)
    if (ingredient) {
      const updated = [...ingredients]
      updated[index] = {
        ...updated[index],
        ingredientId: ingredient.id,
        name: ingredient.name,
        unit: ingredient.default_unit || 'g'
      }
      onChange(updated)
      setShowDropdown(null)
    }
  }

  const getSuggestions = (index: number) => {
    const searchTerm = ingredients[index]?.name || ''
    if (searchTerm.length === 0) return []
    const results = searchIngredients(searchTerm)
    return results.slice(0, 8)
  }

  return (
    <>
      <div className="space-y-3">
        {ingredients.map((ingredient, index) => {
          const suggestions = getSuggestions(index)
          const isDropdownVisible = showDropdown === index && suggestions.length > 0

          return (
            <div key={index} className="flex gap-2 items-start">
              {/* Badge numéro */}
              <div className="mt-2 flex-shrink-0">
                <Badge variant="recipe">
                  {index + 1}
                </Badge>
              </div>

              {/* Quantité */}
              <div className="w-24 flex-shrink-0">
                <input
                  type="number"
                  value={ingredient.quantity || ''}
                  onChange={(e) => handleQuantityChange(index, e.target.value)}
                  placeholder="200"
                  min={0}
                  step={0.1}
                  disabled={disabled}
                  className="w-full px-4 py-3 bg-ios-bg-tertiary rounded-3xl corner-squircle text-ios-label placeholder:text-ios-label-tertiary focus:bg-ios-bg-secondary focus:ring-2 focus:ring-ios-blue transition-all duration-ios-fast outline-none"
                />
              </div>

              {/* Unité */}
              <div className="w-32 flex-shrink-0">
                <select
                  value={ingredient.unit || 'g'}
                  onChange={(e) => handleUnitChange(index, e.target.value)}
                  disabled={disabled}
                  className="w-full px-4 py-3 bg-ios-bg-tertiary rounded-3xl corner-squircle text-ios-label focus:bg-ios-bg-secondary focus:ring-2 focus:ring-ios-blue transition-all duration-ios-fast outline-none appearance-none cursor-pointer"
                >
                  {UNITS.map((unit) => (
                    <option key={unit.value} value={unit.value}>
                      {unit.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Nom de l'ingrédient */}
              <div className="flex-1 relative">
                <input
                  ref={(el) => { inputRefs.current[index] = el }}
                  type="text"
                  value={ingredient.name}
                  onChange={(e) => handleNameChange(index, e.target.value)}
                  onFocus={() => {
                    if (ingredient.name.length > 0 && suggestions.length > 0) {
                      setShowDropdown(index)
                    }
                  }}
                  placeholder="Ex: Farine, Œuf, Tomate..."
                  disabled={disabled}
                  className="w-full px-4 py-3 pr-10 bg-ios-bg-tertiary rounded-3xl corner-squircle text-ios-label placeholder:text-ios-label-tertiary focus:bg-ios-bg-secondary focus:ring-2 focus:ring-ios-blue transition-all duration-ios-fast outline-none"
                />
                {/* Bouton dropdown */}
                {ingredient.name.length > 0 && suggestions.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowDropdown(isDropdownVisible ? null : index)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-ios-label-tertiary hover:text-ios-label transition-colors"
                  >
                    <ChevronDown className={`w-5 h-5 transition-transform ${isDropdownVisible ? 'rotate-180' : ''}`} />
                  </button>
                )}
              </div>

              {/* Bouton supprimer */}
              {ingredients.length > 1 && !disabled && (
                <div className="mt-1 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    className="p-2 text-ios-label-secondary hover:text-ios-red transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          )
        })}

        {/* Bouton ajouter */}
        {!disabled && (
          <Button
            type="button"
            variant="secondary"
            onClick={addIngredient}
            leftIcon={<Plus className="w-5 h-5" />}
            fullWidth
          >
            Ajouter un ingrédient
          </Button>
        )}
      </div>

      {/* Dropdown Portal - Affiché en dehors de la hiérarchie */}
      {showDropdown !== null && getSuggestions(showDropdown).length > 0 && typeof window !== 'undefined' && createPortal(
        <div
          ref={dropdownRef}
          style={{
            position: 'absolute',
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
            width: `${dropdownPosition.width}px`,
            zIndex: 9999
          }}
          className="bg-white rounded-3xl corner-squircle shadow-ios-xl border border-ios-separator overflow-hidden max-h-64 overflow-y-auto"
        >
          {getSuggestions(showDropdown).map((sug) => (
            <button
              key={sug.id}
              type="button"
              onClick={() => selectIngredient(showDropdown, sug.id)}
              className="w-full text-left px-4 py-3 hover:bg-ios-blue hover:text-white transition-colors border-b border-ios-separator last:border-b-0 group"
            >
              <div className="font-semibold text-ios-label group-hover:text-white">
                {sug.name}
              </div>
              <div className="text-sm text-ios-label-secondary group-hover:text-white/80">
                {sug.category} • {sug.default_unit}
              </div>
            </button>
          ))}
        </div>,
        document.body
      )}
    </>
  )
}
