'use client'

import React, { useEffect, useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Plus, X, Tag, Timer, Check, Mic, MicOff } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { useSpeechInput } from '@/hooks/useSpeechInput'
import type { RecipeIngredient, RecipeStep } from '@/types'

export interface StepsInputProps {
  steps: string[] | RecipeStep[]
  onChange: (steps: RecipeStep[]) => void
  disabled?: boolean
  ingredients?: RecipeIngredient[]
}

export function StepsInput({ steps, onChange, disabled, ingredients = [] }: StepsInputProps) {
  const [showIngredientPicker, setShowIngredientPicker] = useState<number | null>(null)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 })
  const [showTimerInput, setShowTimerInput] = useState<number | null>(null)
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([])
  const textareaRefs = useRef<(HTMLTextAreaElement | null)[]>([])
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [activeVoiceIndex, setActiveVoiceIndex] = useState<number | null>(null)

  // Normaliser les steps en RecipeStep[] (déplacé avant le hook)
  const normalizedSteps: RecipeStep[] = steps.map(step =>
    typeof step === 'string'
      ? { description: step, ingredientIndices: [] }
      : step
  )

  // Hook pour la reconnaissance vocale
  const {
    isListening,
    toggleListening,
    isSupported,
    isMicrophoneAvailable,
    resetTranscript
  } = useSpeechInput({
    appendMode: true,
    currentValue: activeVoiceIndex !== null ? normalizedSteps[activeVoiceIndex]?.description || '' : '',
    onTranscript: (text) => {
      if (activeVoiceIndex !== null) {
        updateStepDescription(activeVoiceIndex, text)
      }
    }
  })

  // Gérer le clic sur le bouton micro
  const handleMicClick = (index: number) => {
    if (isListening && activeVoiceIndex === index) {
      // Arrêter l'écoute
      toggleListening()
      setActiveVoiceIndex(null)
    } else {
      // Démarrer l'écoute pour cet index
      if (isListening) {
        toggleListening() // Arrêter l'écoute précédente
      }
      resetTranscript()
      setActiveVoiceIndex(index)
      toggleListening()
    }
  }

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
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showIngredientPicker])

  const addStep = () => {
    onChange([...normalizedSteps, { description: '', ingredientIndices: [] }])
  }

  const updateStepDescription = (index: number, description: string) => {
    const updated = [...normalizedSteps]
    updated[index] = { ...updated[index], description }
    onChange(updated)
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
                {/* Badge, bouton dicter et delete button row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="recipe">
                      Étape {index + 1}
                    </Badge>
                    {!disabled && isSupported && (
                      <button
                        type="button"
                        onClick={() => handleMicClick(index)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full transition-all ${
                          isListening && activeVoiceIndex === index
                            ? 'bg-ios-red text-white animate-pulse'
                            : 'bg-ios-bg-secondary text-ios-label-secondary hover:bg-ios-pink hover:text-white'
                        }`}
                      >
                        {isListening && activeVoiceIndex === index ? (
                          <MicOff className="w-3.5 h-3.5" />
                        ) : (
                          <Mic className="w-3.5 h-3.5" />
                        )}
                        <span>{isListening && activeVoiceIndex === index ? 'Arrêter' : 'Dicter l\'étape'}</span>
                      </button>
                    )}
                  </div>
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

                {/* Textarea */}
                <textarea
                  ref={(el) => { textareaRefs.current[index] = el }}
                  value={step.description}
                  onChange={(e) => updateStepDescription(index, e.target.value)}
                  placeholder={`Décrivez l'étape ${index + 1}...`}
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
                {/* Header avec badge et bouton dicter */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="recipe">
                      {index + 1}
                    </Badge>
                    {!disabled && isSupported && (
                      <button
                        type="button"
                        onClick={() => handleMicClick(index)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full transition-all ${
                          isListening && activeVoiceIndex === index
                            ? 'bg-ios-red text-white animate-pulse'
                            : 'bg-ios-bg-secondary text-ios-label-secondary hover:bg-ios-pink hover:text-white'
                        }`}
                      >
                        {isListening && activeVoiceIndex === index ? (
                          <MicOff className="w-3.5 h-3.5" />
                        ) : (
                          <Mic className="w-3.5 h-3.5" />
                        )}
                        <span>{isListening && activeVoiceIndex === index ? 'Arrêter' : 'Dicter l\'étape'}</span>
                      </button>
                    )}
                  </div>
                  {normalizedSteps.length > 1 && !disabled && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeStep(index)}
                      className="flex-shrink-0"
                      type="button"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                {/* Textarea */}
                <textarea
                  ref={(el) => { textareaRefs.current[index] = el }}
                  value={step.description}
                  onChange={(e) => updateStepDescription(index, e.target.value)}
                  placeholder={`Décrivez l'étape ${index + 1}...`}
                  rows={3}
                  disabled={disabled}
                  className="w-full px-4 py-3 bg-ios-bg-tertiary rounded-3xl text-ios-label placeholder:text-ios-label-tertiary focus:bg-ios-bg-secondary focus:ring-2 focus:ring-ios-pink transition-all duration-ios-fast outline-none resize-none"
                />

                {/* Boutons et badges regroupés */}
                <div className="space-y-2">
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
