'use client'

import React, { useEffect, useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Plus, X, Tag, Timer, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import type { RecipeIngredient, RecipeStep } from '@/types'

export interface StepsInputProps {
  steps: string[] | RecipeStep[]
  onChange: (steps: RecipeStep[]) => void
  disabled?: boolean
  ingredients?: RecipeIngredient[]
}

export function StepsInput({ steps, onChange, disabled, ingredients = [] }: StepsInputProps) {
  const [showIngredientPicker, setShowIngredientPicker] = useState<number | null>(null)
  const [showAutocomplete, setShowAutocomplete] = useState<number | null>(null)
  const [autocompleteSearch, setAutocompleteSearch] = useState('')
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 })
  const [autocompletePosition, setAutocompletePosition] = useState({ top: 0, left: 0 })
  const [showTimerInput, setShowTimerInput] = useState<number | null>(null)
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([])
  const textareaRefs = useRef<(HTMLTextAreaElement | null)[]>([])
  const dropdownRef = useRef<HTMLDivElement>(null)
  const autocompleteRef = useRef<HTMLDivElement>(null)

  // Normaliser les steps en RecipeStep[]
  const normalizedSteps: RecipeStep[] = steps.map(step =>
    typeof step === 'string'
      ? { description: step, ingredientIndices: [] }
      : step
  )

  useEffect(() => {
    if (normalizedSteps.length === 0) {
      onChange([{ description: '', ingredientIndices: [] }])
    }
  }, [])

  // Calculer la position du dropdown
  useEffect(() => {
    const updatePosition = () => {
      if (showIngredientPicker !== null) {
        const button = buttonRefs.current[showIngredientPicker]
        if (button) {
          const rect = button.getBoundingClientRect()
          const isMobile = window.innerWidth < 640

          if (isMobile) {
            // Sur mobile, centrer le dropdown
            setDropdownPosition({
              top: rect.bottom + window.scrollY + 4,
              left: 16 // padding de 16px sur les côtés
            })
          } else {
            setDropdownPosition({
              top: rect.bottom + window.scrollY + 4,
              left: rect.left + window.scrollX
            })
          }
        }
      }
    }

    updatePosition()
    window.addEventListener('scroll', updatePosition, true)
    window.addEventListener('resize', updatePosition)

    return () => {
      window.removeEventListener('scroll', updatePosition, true)
      window.removeEventListener('resize', updatePosition)
    }
  }, [showIngredientPicker])

  // Calculer la position de l'autocomplete
  useEffect(() => {
    const updatePosition = () => {
      if (showAutocomplete !== null) {
        const textarea = textareaRefs.current[showAutocomplete]
        if (textarea) {
          const rect = textarea.getBoundingClientRect()
          const isMobile = window.innerWidth < 640

          if (isMobile) {
            // Sur mobile, centrer l'autocomplete
            setAutocompletePosition({
              top: rect.bottom + window.scrollY + 4,
              left: 16 // padding de 16px sur les côtés
            })
          } else {
            setAutocompletePosition({
              top: rect.bottom + window.scrollY + 4,
              left: rect.left + window.scrollX
            })
          }
        }
      }
    }

    updatePosition()
    window.addEventListener('scroll', updatePosition, true)
    window.addEventListener('resize', updatePosition)

    return () => {
      window.removeEventListener('scroll', updatePosition, true)
      window.removeEventListener('resize', updatePosition)
    }
  }, [showAutocomplete])

  // Fermer dropdown en cliquant à l'extérieur
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showIngredientPicker !== null) {
        const button = buttonRefs.current[showIngredientPicker]
        const dropdown = dropdownRef.current

        const clickedInsideButton = button && button.contains(e.target as Node)
        const clickedInsideDropdown = dropdown && dropdown.contains(e.target as Node)

        if (!clickedInsideButton && !clickedInsideDropdown) {
          setShowIngredientPicker(null)
        }
      }

      if (showAutocomplete !== null) {
        const textarea = textareaRefs.current[showAutocomplete]
        const autocomplete = autocompleteRef.current

        const clickedInsideTextarea = textarea && textarea.contains(e.target as Node)
        const clickedInsideAutocomplete = autocomplete && autocomplete.contains(e.target as Node)

        if (!clickedInsideTextarea && !clickedInsideAutocomplete) {
          setShowAutocomplete(null)
          setAutocompleteSearch('')
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showIngredientPicker, showAutocomplete])

  const addStep = () => {
    onChange([...normalizedSteps, { description: '', ingredientIndices: [] }])
  }

  const updateStepDescription = (index: number, description: string, cursorPos?: number) => {
    const updated = [...normalizedSteps]
    updated[index] = { ...updated[index], description }
    onChange(updated)

    // Détecter si on tape "@" pour l'autocomplétion
    if (cursorPos !== undefined) {
      const textBeforeCursor = description.slice(0, cursorPos)
      const lastAtIndex = textBeforeCursor.lastIndexOf('@')

      if (lastAtIndex !== -1) {
        const searchTerm = textBeforeCursor.slice(lastAtIndex + 1)
        // Vérifier qu'il n'y a pas d'espace après @
        if (!searchTerm.includes(' ') && !searchTerm.includes('\n')) {
          setAutocompleteSearch(searchTerm)
          setShowAutocomplete(index)
          return
        }
      }

      // Fermer l'autocomplete si on n'est plus en train de taper une mention
      setShowAutocomplete(null)
      setAutocompleteSearch('')
    }
  }

  const removeStep = (index: number) => {
    if (normalizedSteps.length > 1) {
      onChange(normalizedSteps.filter((_, i) => i !== index))
    }
  }

  const toggleIngredient = (stepIndex: number, ingredientIndex: number) => {
    const updated = [...normalizedSteps]
    const currentIndices = updated[stepIndex].ingredientIndices || []

    if (currentIndices.includes(ingredientIndex)) {
      // Retirer l'ingrédient
      updated[stepIndex] = {
        ...updated[stepIndex],
        ingredientIndices: currentIndices.filter(i => i !== ingredientIndex)
      }
    } else {
      // Ajouter l'ingrédient
      updated[stepIndex] = {
        ...updated[stepIndex],
        ingredientIndices: [...currentIndices, ingredientIndex]
      }
    }

    onChange(updated)
  }

  const removeIngredientFromStep = (stepIndex: number, ingredientIndex: number) => {
    const updated = [...normalizedSteps]
    const currentIndices = updated[stepIndex].ingredientIndices || []
    updated[stepIndex] = {
      ...updated[stepIndex],
      ingredientIndices: currentIndices.filter(i => i !== ingredientIndex)
    }
    onChange(updated)
  }

  const insertIngredientFromAutocomplete = (stepIndex: number, ingredientName: string) => {
    const textarea = textareaRefs.current[stepIndex]
    if (!textarea) return

    const currentValue = normalizedSteps[stepIndex].description
    const cursorPos = textarea.selectionStart

    // Trouver le début de la mention (@)
    const textBeforeCursor = currentValue.slice(0, cursorPos)
    const lastAtIndex = textBeforeCursor.lastIndexOf('@')

    if (lastAtIndex !== -1) {
      // Remplacer "@search" par "ingredientName " (sans le @)
      const before = currentValue.slice(0, lastAtIndex)
      const after = currentValue.slice(cursorPos)
      const newValue = before + ingredientName + ' ' + after

      updateStepDescription(stepIndex, newValue)

      // Repositionner le curseur après l'insertion
      setTimeout(() => {
        const newCursorPos = lastAtIndex + ingredientName.length + 1
        textarea.setSelectionRange(newCursorPos, newCursorPos)
        textarea.focus()
      }, 0)
    }

    setShowAutocomplete(null)
    setAutocompleteSearch('')
  }

  const getAutocompleteIngredients = (stepIndex: number) => {
    // Ne montrer que les ingrédients sélectionnés pour cette étape
    const selectedIndices = normalizedSteps[stepIndex]?.ingredientIndices || []
    const selectedIngredients = selectedIndices
      .map(idx => ({ ...ingredients[idx], originalIndex: idx }))
      .filter(ing => ing && ing.name)

    // Filtrer par la recherche
    const search = autocompleteSearch.toLowerCase()
    return selectedIngredients.filter(ing =>
      ing.name.toLowerCase().includes(search)
    )
  }

  const updateTimer = (stepIndex: number, minutes?: number, label?: string, type?: 'prep' | 'cook') => {
    const updated = [...normalizedSteps]
    updated[stepIndex] = {
      ...updated[stepIndex],
      timerMinutes: minutes,
      timerLabel: label,
      timerType: type
    }
    onChange(updated)
  }

  const removeTimer = (stepIndex: number) => {
    const updated = [...normalizedSteps]
    const { timerMinutes, timerLabel, timerType, ...rest } = updated[stepIndex]
    updated[stepIndex] = rest
    onChange(updated)
  }

  return (
    <>
      <div className="space-y-3 sm:space-y-4">
        {normalizedSteps.map((step, index) => {
          const selectedIngredientIndices = step.ingredientIndices || []

          return (
            <div key={index} className="space-y-2 pb-4 sm:pb-0 border-b sm:border-b-0 border-ios-separator last:border-b-0 last:pb-0">
              {/* Mobile Layout */}
              <div className="sm:hidden space-y-2">
                {/* Badge and delete button row */}
                <div className="flex items-center justify-between">
                  <Badge variant="recipe">
                    Étape {index + 1}
                  </Badge>
                  {normalizedSteps.length > 1 && !disabled && (
                    <button
                      type="button"
                      onClick={() => removeStep(index)}
                      className="p-2 text-ios-label-secondary hover:text-ios-red transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {/* Textarea full width */}
                <textarea
                  ref={(el) => { textareaRefs.current[index] = el }}
                  value={step.description}
                  onChange={(e) => updateStepDescription(index, e.target.value, e.target.selectionStart)}
                  placeholder={`Décrivez l'étape ${index + 1}... (utilisez @ pour mentionner un ingrédient)`}
                  rows={3}
                  disabled={disabled}
                  className="w-full px-4 py-3 bg-ios-bg-tertiary rounded-3xl text-ios-label placeholder:text-ios-label-tertiary focus:bg-ios-bg-secondary focus:ring-2 focus:ring-ios-pink transition-all duration-ios-fast outline-none resize-none"
                />

                {/* Boutons Ingrédients et Minuteur sur la même ligne */}
                {!disabled && (
                  <div className="flex flex-wrap gap-2">
                    {ingredients.length > 0 && (
                      <button
                        ref={(el) => { buttonRefs.current[index] = el }}
                        type="button"
                        onClick={() => setShowIngredientPicker(showIngredientPicker === index ? null : index)}
                        className={`flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm rounded-full transition-colors flex-shrink-0 ${selectedIngredientIndices.length > 0
                            ? 'text-white bg-black'
                            : 'text-ios-label-secondary bg-ios-bg-secondary hover:bg-ios-bg-tertiary'
                          }`}
                      >
                        <Tag className="w-4 h-4 flex-shrink-0" />
                        <span className="whitespace-nowrap">Ingrédients</span>
                        {selectedIngredientIndices.length > 0 && (
                          <span className="px-1.5 py-0.5 bg-white/20 rounded-full text-xs font-semibold flex-shrink-0">
                            {selectedIngredientIndices.length}
                          </span>
                        )}
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setShowTimerInput(showTimerInput === index ? null : index)}
                      className={`flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm rounded-full transition-colors flex-shrink-0 ${step.timerMinutes
                          ? 'text-white bg-black'
                          : 'text-ios-label-secondary bg-ios-bg-secondary hover:bg-ios-bg-tertiary'
                        }`}
                    >
                      <Timer className="w-4 h-4 flex-shrink-0" />
                      {step.timerMinutes ? (
                        <>
                          <span>{step.timerType === 'cook' ? '🔥' : '🥄'}</span>
                          <span className="whitespace-nowrap">{step.timerMinutes} min</span>
                        </>
                      ) : (
                        <span className="whitespace-nowrap">Minuteur</span>
                      )}
                    </button>
                  </div>
                )}

                {/* Badges des ingrédients sélectionnés */}
                {selectedIngredientIndices.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedIngredientIndices.map(ingredientIdx => {
                      const ingredient = ingredients[ingredientIdx]
                      if (!ingredient) return null

                      return (
                        <div
                          key={ingredientIdx}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-ios-bg-tertiary text-ios-label rounded-full text-sm"
                        >
                          <span className="font-medium">{ingredient.name}</span>
                          {!disabled && (
                            <button
                              type="button"
                              onClick={() => removeIngredientFromStep(index, ingredientIdx)}
                              className="hover:text-ios-red transition-colors"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* Configuration du minuteur */}
                {showTimerInput === index && !disabled && (
                  <div className="space-y-3 p-4 bg-zinc-50 border border-ios-separator rounded-3xl">
                    {/* Type de minuteur */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-ios-label-secondary">Type de minuteur</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => updateTimer(index, step.timerMinutes, step.timerLabel, 'prep')}
                          className={`px-3 py-2 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-1.5 ${step.timerType === 'prep' || !step.timerType
                              ? 'bg-ios-label text-white'
                              : 'bg-ios-bg-tertiary text-ios-label-secondary hover:bg-ios-bg-secondary'
                            }`}
                        >
                          <span>🥄</span>
                          <span>Préparation</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => updateTimer(index, step.timerMinutes, step.timerLabel, 'cook')}
                          className={`px-3 py-2 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-1.5 ${step.timerType === 'cook'
                              ? 'bg-ios-label text-white'
                              : 'bg-ios-bg-tertiary text-ios-label-secondary hover:bg-ios-bg-secondary'
                            }`}
                        >
                          <span>🔥</span>
                          <span>Cuisson</span>
                        </button>
                      </div>
                    </div>

                    {/* Durée et label */}
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="number"
                        label="Durée (min)"
                        value={step.timerMinutes || ''}
                        onChange={(e) => updateTimer(index, parseInt(e.target.value) || undefined, step.timerLabel, step.timerType)}
                        min={1}
                        placeholder="30"
                        className="!bg-white"
                      />
                      <Input
                        type="text"
                        label="Label (optionnel)"
                        value={step.timerLabel || ''}
                        onChange={(e) => updateTimer(index, step.timerMinutes, e.target.value || undefined, step.timerType)}
                        placeholder="Au frigo"
                        className="!bg-white"
                      />
                    </div>

                    {/* Boutons d'action */}
                    <div className="flex gap-2">
                      {step.timerMinutes && (
                        <button
                          type="button"
                          onClick={() => {
                            removeTimer(index)
                            setShowTimerInput(null)
                          }}
                          className="text-sm text-ios-red hover:underline"
                        >
                          Supprimer
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setShowTimerInput(null)}
                        className="ml-auto px-4 py-2 bg-ios-pink text-white rounded-full text-sm font-medium hover:bg-ios-pink/90 transition-colors"
                      >
                        Terminé
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Desktop/Tablet Layout - horizontal */}
              <div className="hidden sm:block space-y-2">
                <div className="flex gap-2 items-start">
                  {/* Numéro */}
                  <Badge variant="recipe" className="mt-2 flex-shrink-0">
                    {index + 1}
                  </Badge>

                  {/* Textarea */}
                  <textarea
                    ref={(el) => { textareaRefs.current[index] = el }}
                    value={step.description}
                    onChange={(e) => updateStepDescription(index, e.target.value, e.target.selectionStart)}
                    placeholder={`Décrivez l'étape ${index + 1}... (utilisez @ pour mentionner un ingrédient)`}
                    rows={3}
                    disabled={disabled}
                    className="flex-1 w-full px-4 py-3 bg-ios-bg-tertiary rounded-3xl text-ios-label placeholder:text-ios-label-tertiary focus:bg-ios-bg-secondary focus:ring-2 focus:ring-ios-pink transition-all duration-ios-fast outline-none resize-none"
                  />

                  {/* Supprimer */}
                  {normalizedSteps.length > 1 && !disabled && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeStep(index)}
                      className="mt-2 flex-shrink-0"
                      type="button"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                {/* Boutons et badges regroupés */}
                <div className="ml-10 space-y-2">
                  {/* Boutons Ingrédients et Minuteur sur la même ligne */}
                  {!disabled && (
                    <div className="flex flex-wrap gap-2">
                      {ingredients.length > 0 && (
                        <button
                          ref={(el) => { buttonRefs.current[index] = el }}
                          type="button"
                          onClick={() => setShowIngredientPicker(showIngredientPicker === index ? null : index)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full transition-colors flex-shrink-0 ${selectedIngredientIndices.length > 0
                              ? 'text-white bg-black'
                              : 'text-ios-label-secondary bg-ios-bg-secondary hover:bg-ios-bg-tertiary'
                            }`}
                        >
                          <Tag className="w-4 h-4 flex-shrink-0" />
                          <span className="whitespace-nowrap">Ingrédients</span>
                          {selectedIngredientIndices.length > 0 && (
                            <span className="px-1.5 py-0.5 bg-white/20 rounded-full text-xs font-semibold flex-shrink-0">
                              {selectedIngredientIndices.length}
                            </span>
                          )}
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => setShowTimerInput(showTimerInput === index ? null : index)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full transition-colors flex-shrink-0 ${step.timerMinutes
                            ? 'text-white bg-black'
                            : 'text-ios-label-secondary bg-ios-bg-secondary hover:bg-ios-bg-tertiary'
                          }`}
                      >
                        <Timer className="w-4 h-4 flex-shrink-0" />
                        {step.timerMinutes ? (
                          <>
                            <span>{step.timerType === 'cook' ? '🔥' : '🥄'}</span>
                            <span className="whitespace-nowrap">{step.timerMinutes} min</span>
                          </>
                        ) : (
                          <span className="whitespace-nowrap">Minuteur</span>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Badges des ingrédients sélectionnés */}
                  {selectedIngredientIndices.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedIngredientIndices.map(ingredientIdx => {
                        const ingredient = ingredients[ingredientIdx]
                        if (!ingredient) return null

                        return (
                          <div
                            key={ingredientIdx}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-ios-bg-tertiary text-ios-label rounded-full text-sm"
                          >
                            <span className="font-medium">{ingredient.name}</span>
                            {!disabled && (
                              <button
                                type="button"
                                onClick={() => removeIngredientFromStep(index, ingredientIdx)}
                                className="hover:text-ios-red transition-colors"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

                {/* Configuration du minuteur */}
                <div className="ml-10 space-y-2">
                  {showTimerInput === index && !disabled && (
                    <div className="space-y-3 p-4 bg-zinc-50 border border-ios-separator rounded-3xl">
                      {/* Type de minuteur */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-ios-label-secondary">Type de minuteur</label>
                        <div className="grid grid-cols-2 gap-2 max-w-xs">
                          <button
                            type="button"
                            onClick={() => updateTimer(index, step.timerMinutes, step.timerLabel, 'prep')}
                            className={`px-3 py-2 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-1.5 ${step.timerType === 'prep' || !step.timerType
                                ? 'bg-ios-label text-white'
                                : 'bg-ios-bg-tertiary text-ios-label-secondary hover:bg-ios-bg-secondary'
                              }`}
                          >
                            <span>🥄</span>
                            <span>Préparation</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => updateTimer(index, step.timerMinutes, step.timerLabel, 'cook')}
                            className={`px-3 py-2 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-1.5 ${step.timerType === 'cook'
                                ? 'bg-ios-label text-white'
                                : 'bg-ios-bg-tertiary text-ios-label-secondary hover:bg-ios-bg-secondary'
                              }`}
                          >
                            <span>🔥</span>
                            <span>Cuisson</span>
                          </button>
                        </div>
                      </div>

                      {/* Durée et label */}
                      <div className="grid grid-cols-2 gap-3 max-w-md">
                        <Input
                          type="number"
                          label="Durée (min)"
                          value={step.timerMinutes || ''}
                          onChange={(e) => updateTimer(index, parseInt(e.target.value) || undefined, step.timerLabel, step.timerType)}
                          min={1}
                          placeholder="30"
                          className="!bg-white"
                        />
                        <Input
                          type="text"
                          label="Label (optionnel)"
                          value={step.timerLabel || ''}
                          onChange={(e) => updateTimer(index, step.timerMinutes, e.target.value || undefined, step.timerType)}
                          placeholder="Au frigo"
                          className="!bg-white"
                        />
                      </div>

                      {/* Boutons d'action */}
                      <div className="flex gap-2">
                        {step.timerMinutes && (
                          <button
                            type="button"
                            onClick={() => {
                              removeTimer(index)
                              setShowTimerInput(null)
                            }}
                            className="text-sm text-ios-red hover:underline"
                          >
                            Supprimer
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setShowTimerInput(null)}
                          className="ml-auto px-4 py-2 bg-ios-pink text-white rounded-full text-sm font-medium hover:bg-ios-pink/90 transition-colors"
                        >
                          Terminé
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}

        {!disabled && (
          <Button
            variant="secondary"
            onClick={addStep}
            leftIcon={<Plus className="w-5 h-5" />}
            fullWidth
            type="button"
          >
            Ajouter une étape
          </Button>
        )}
      </div>

      {/* Autocomplete Portal pour mentionner les ingrédients */}
      {showAutocomplete !== null && typeof window !== 'undefined' && createPortal(
        <div
          ref={autocompleteRef}
          style={{
            position: 'absolute',
            top: `${autocompletePosition.top}px`,
            left: `${autocompletePosition.left}px`,
            right: window.innerWidth < 640 ? '16px' : 'auto',
            minWidth: window.innerWidth < 640 ? 'auto' : '250px',
            zIndex: 10000
          }}
          className="bg-white rounded-3xl shadow-ios-xl border border-ios-separator overflow-hidden max-h-60 overflow-y-auto"
        >
          {(() => {
            const autocompleteIngredients = getAutocompleteIngredients(showAutocomplete)

            if (autocompleteIngredients.length === 0) {
              return (
                <div className="px-4 py-3 text-center text-ios-label-secondary text-sm">
                  {autocompleteSearch.length > 0
                    ? 'Aucun ingrédient sélectionné ne correspond'
                    : 'Sélectionnez d\'abord des ingrédients pour cette étape'}
                </div>
              )
            }

            return (
              <>
                <div className="px-3 py-2 bg-ios-bg-secondary border-b border-ios-separator">
                  <p className="text-xs text-ios-label-secondary font-medium">
                    Ingrédients de cette étape
                  </p>
                </div>
                {autocompleteIngredients.map((ing) => (
                  <button
                    key={ing.originalIndex}
                    type="button"
                    onClick={() => insertIngredientFromAutocomplete(showAutocomplete, ing.name)}
                    className="w-full text-left px-4 py-2.5 hover:bg-ios-pink hover:text-white transition-colors border-b border-ios-separator last:border-b-0 group"
                  >
                    <div className="font-semibold text-ios-label group-hover:text-white">
                      {ing.name}
                    </div>
                    {ing.quantity && ing.unit && (
                      <div className="text-xs text-ios-label-secondary group-hover:text-white/80">
                        {ing.quantity} {ing.unit}
                      </div>
                    )}
                  </button>
                ))}
              </>
            )
          })()}
        </div>,
        document.body
      )}

      {/* Dropdown Portal pour sélectionner les ingrédients */}
      {showIngredientPicker !== null && ingredients.length > 0 && typeof window !== 'undefined' && createPortal(
        <div
          ref={dropdownRef}
          style={{
            position: 'absolute',
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
            right: window.innerWidth < 640 ? '16px' : 'auto',
            minWidth: window.innerWidth < 640 ? 'auto' : '280px',
            maxWidth: window.innerWidth < 640 ? 'auto' : '400px',
            zIndex: 9999
          }}
          className="bg-white rounded-3xl shadow-ios-xl border border-ios-separator overflow-hidden max-h-80 overflow-y-auto"
        >
          <div className="px-4 py-3 bg-ios-bg-secondary border-b border-ios-separator sticky top-0">
            <p className="text-sm text-ios-label font-semibold">
              Sélectionner les ingrédients
            </p>
          </div>
          <div className="p-2">
            {ingredients.map((ingredient, idx) => {
              const isSelected = normalizedSteps[showIngredientPicker]?.ingredientIndices?.includes(idx)

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => toggleIngredient(showIngredientPicker, idx)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl transition-all mb-1 last:mb-0 ${isSelected
                      ? 'bg-ios-pink text-white'
                      : 'hover:bg-ios-bg-secondary text-ios-label'
                    }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className={`font-semibold truncate ${isSelected ? 'text-white' : 'text-ios-label'}`}>
                        {ingredient.name}
                      </div>
                      {ingredient.quantity && ingredient.unit && (
                        <div className={`text-sm ${isSelected ? 'text-white/80' : 'text-ios-label-secondary'}`}>
                          {ingredient.quantity} {ingredient.unit}
                        </div>
                      )}
                    </div>
                    {isSelected && (
                      <Check className="flex-shrink-0 w-5 h-5 text-white" strokeWidth={3} />
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
