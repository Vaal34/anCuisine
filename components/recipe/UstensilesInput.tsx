'use client'

import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Plus, X, ChevronDown } from 'lucide-react'
import { useUstensiles } from '@/hooks/useUstensiles'

export interface UstensilesInputProps {
  ustensiles: string[]
  onChange: (ustensiles: string[]) => void
  disabled?: boolean
}

export function UstensilesInput({ ustensiles, onChange, disabled }: UstensilesInputProps) {
  const { searchUstensiles, ustensiles: allUstensiles, addUstensile } = useUstensiles()
  const [inputValue, setInputValue] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 })
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Calculer la position du dropdown
  useEffect(() => {
    const updatePosition = () => {
      if (showDropdown && inputRef.current) {
        const rect = inputRef.current.getBoundingClientRect()
        const dropdownHeight = 256
        const viewportHeight = window.visualViewport?.height || window.innerHeight
        const viewportOffsetTop = window.visualViewport?.offsetTop || 0
        const spaceBelow = viewportHeight - (rect.bottom - viewportOffsetTop)
        const spaceAbove = rect.top - viewportOffsetTop

        const shouldShowAbove = spaceBelow < dropdownHeight && spaceAbove > spaceBelow

        setDropdownPosition({
          top: shouldShowAbove
            ? rect.top - Math.min(dropdownHeight, spaceAbove) - 4
            : rect.bottom + 4,
          left: rect.left,
          width: rect.width
        })
      }
    }

    updatePosition()

    window.addEventListener('scroll', updatePosition, true)
    window.addEventListener('resize', updatePosition)
    window.visualViewport?.addEventListener('resize', updatePosition)
    window.visualViewport?.addEventListener('scroll', updatePosition)

    return () => {
      window.removeEventListener('scroll', updatePosition, true)
      window.removeEventListener('resize', updatePosition)
      window.visualViewport?.removeEventListener('resize', updatePosition)
      window.visualViewport?.removeEventListener('scroll', updatePosition)
    }
  }, [showDropdown])

  // Fermer dropdown en cliquant à l'extérieur
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showDropdown) {
        const clickedInsideInput = inputRef.current?.contains(e.target as Node)
        const clickedInsideDropdown = dropdownRef.current?.contains(e.target as Node)

        if (!clickedInsideInput && !clickedInsideDropdown) {
          setShowDropdown(false)
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showDropdown])

  const getSuggestions = () => {
    // Si pas de texte, montrer tous les ustensiles non sélectionnés
    const results = inputValue.length === 0
      ? allUstensiles
      : searchUstensiles(inputValue)
    // Filtrer ceux déjà sélectionnés (pas de limite, le dropdown scroll)
    return results.filter((u) => !ustensiles.includes(u.name))
  }

  const suggestions = getSuggestions()

  const handleInputChange = (value: string) => {
    setInputValue(value)
    setShowDropdown(true)
  }

  const handleSelectUstensile = (name: string) => {
    if (!ustensiles.includes(name)) {
      onChange([...ustensiles, name])
    }
    setInputValue('')
    setShowDropdown(false)
    inputRef.current?.focus()
  }

  const handleAddNew = async () => {
    const trimmed = inputValue.trim()
    if (!trimmed) return

    // Vérifier si déjà dans la liste
    if (ustensiles.some((u) => u.toLowerCase() === trimmed.toLowerCase())) {
      setInputValue('')
      return
    }

    // Ajouter à la base de données si nouveau
    const result = await addUstensile(trimmed)
    if (result) {
      onChange([...ustensiles, result.name])
    } else {
      // Si erreur, ajouter quand même localement avec le nom saisi
      onChange([...ustensiles, trimmed])
    }
    setInputValue('')
    setShowDropdown(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (suggestions.length > 0) {
        // Sélectionner la première suggestion
        handleSelectUstensile(suggestions[0].name)
      } else if (inputValue.trim()) {
        // Ajouter comme nouveau
        handleAddNew()
      }
    }
  }

  const handleRemove = (name: string) => {
    onChange(ustensiles.filter((u) => u !== name))
  }

  return (
    <>
      <div className="space-y-3">
        {/* Liste des ustensiles sélectionnés */}
        {ustensiles.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {ustensiles.map((name) => (
              <div
                key={name}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent/10 border border-accent/30 rounded-full"
              >
                <span className="text-sm font-medium text-accent">{name}</span>
                {!disabled && (
                  <button
                    type="button"
                    onClick={() => handleRemove(name)}
                    className="w-5 h-5 flex items-center justify-center text-accent hover:bg-accent/20 rounded-full transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Input pour ajouter */}
        {!disabled && (
          <div className="flex gap-2">
            <div className="flex-1 relative min-w-0">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => handleInputChange(e.target.value)}
                onFocus={() => {
                  setShowDropdown(true)
                }}
                onKeyDown={handleKeyDown}
                placeholder="Rechercher ou ajouter..."
                className="w-full px-3 sm:px-4 py-3 pr-10 bg-ios-bg-tertiary rounded-3xl text-ios-label placeholder:text-ios-label-tertiary focus:bg-ios-bg-secondary focus:ring-2 focus:ring-accent transition-all duration-ios-fast outline-none text-sm sm:text-base"
              />
              <button
                type="button"
                onClick={() => setShowDropdown(!showDropdown)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-ios-label-tertiary hover:text-ios-label transition-colors"
              >
                <ChevronDown className={`w-5 h-5 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
              </button>
            </div>
            <button
              type="button"
              onClick={handleAddNew}
              disabled={!inputValue.trim()}
              className="flex-shrink-0 flex items-center justify-center gap-2 px-3 sm:px-4 py-3 bg-ios-bg-secondary text-accent border border-ios-separator rounded-3xl font-semibold transition-all duration-ios-fast active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-ios-bg-tertiary"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline text-sm">Ajouter</span>
            </button>
          </div>
        )}

        {ustensiles.length === 0 && !inputValue && (
          <p className="text-sm text-ios-label-tertiary">
            Aucun ustensile sélectionné
          </p>
        )}
      </div>

      {/* Dropdown Portal */}
      {showDropdown && suggestions.length > 0 && typeof window !== 'undefined' && createPortal(
        <div
          ref={dropdownRef}
          style={{
            position: 'fixed',
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
            width: `${dropdownPosition.width}px`,
            zIndex: 9999
          }}
          className="bg-white rounded-3xl shadow-ios-xl border border-ios-separator overflow-hidden max-h-64 overflow-y-auto"
        >
          {suggestions.map((ust) => (
            <button
              key={ust.id}
              type="button"
              onClick={() => handleSelectUstensile(ust.name)}
              className="w-full text-left px-4 py-3 hover:bg-accent hover:text-white transition-colors border-b border-ios-separator last:border-b-0 group"
            >
              <div className="font-semibold text-ios-label group-hover:text-white">
                {ust.name}
              </div>
            </button>
          ))}
        </div>,
        document.body
      )}
    </>
  )
}
