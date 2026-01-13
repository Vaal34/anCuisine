'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { IngredientsInput } from './IngredientsInput'
import { StepsInput } from './StepsInput'
import { UnsplashImagePicker } from './UnsplashImagePicker'
import { useFormPersistence } from '@/hooks/useFormPersistence'
import type { Recipe, RecipeFormData, RecipeStep } from '@/types'
import { CATEGORIES, COOKING_METHODS } from '@/types'

/** Type pour les données persistées du formulaire */
interface PersistedFormData {
  title: string
  category: string
  prepTime: number
  cookTime: number
  servings: number
  imageUrl: string
  ingredients: RecipeFormData['ingredients']
  steps: RecipeStep[]
  cookingMethods: string[]
  notes: string
  timeCalculationMode: 'manual' | 'auto-timers'
}

export interface RecipeFormProps {
  mode: 'create' | 'edit'
  initialData?: Recipe
  onSubmit: (data: RecipeFormData) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export function RecipeForm({ mode, initialData, onSubmit, onCancel, isLoading }: RecipeFormProps) {
  // Clé unique pour la persistance (différente pour création vs édition)
  const persistenceKey = mode === 'edit' && initialData?.id
    ? `recipe-edit-${initialData.id}`
    : 'recipe-create'

  // Hook de persistance du brouillon
  const {
    data: persistedData,
    isReady: persistenceReady,
    wasRestored,
    save: saveDraft,
    clear: clearDraft,
    discardRestored,
  } = useFormPersistence<PersistedFormData>({
    key: persistenceKey,
  })

  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('autre')
  const [prepTime, setPrepTime] = useState(0)
  const [cookTime, setCookTime] = useState(0)
  const [servings, setServings] = useState(4)
  const [imageUrl, setImageUrl] = useState('')
  const [ingredients, setIngredients] = useState<RecipeFormData['ingredients']>([])
  const [steps, setSteps] = useState<RecipeStep[]>([])
  const [cookingMethods, setCookingMethods] = useState<string[]>([])
  const [notes, setNotes] = useState('')
  const [timeCalculationMode, setTimeCalculationMode] = useState<'manual' | 'auto-timers'>('manual')
  const [showRestoredBanner, setShowRestoredBanner] = useState(false)

  // Initialiser le formulaire avec les données existantes en mode édition
  // On utilise un ref pour ne charger les données qu'une seule fois au montage
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialisation : attendre que le hook soit prêt, puis charger les données
  useEffect(() => {
    // Attendre que le hook de persistance soit prêt
    if (!persistenceReady || isInitialized) return

    // Si un brouillon a été restauré, l'utiliser
    if (wasRestored && persistedData) {
      setTitle(persistedData.title)
      setCategory(persistedData.category)
      setPrepTime(persistedData.prepTime)
      setCookTime(persistedData.cookTime)
      setServings(persistedData.servings)
      setImageUrl(persistedData.imageUrl)
      setIngredients(persistedData.ingredients)
      setSteps(persistedData.steps)
      setCookingMethods(persistedData.cookingMethods)
      setNotes(persistedData.notes)
      setTimeCalculationMode(persistedData.timeCalculationMode)
      setShowRestoredBanner(true)
      setIsInitialized(true)
      return
    }

    // Sinon, en mode édition, utiliser les données initiales
    if (mode === 'edit' && initialData) {
      setTitle(initialData.title)
      setCategory(initialData.category)
      setPrepTime(initialData.prep_time)
      setCookTime(initialData.cook_time)
      setServings(initialData.servings)
      setImageUrl(initialData.image_url || '')
      setIngredients(initialData.ingredients)
      setSteps(initialData.steps as RecipeStep[])
      setCookingMethods(initialData.cooking_methods || [])
      setNotes(initialData.notes || '')
      setTimeCalculationMode(initialData.time_calculation_mode || 'manual')
      setIsInitialized(true)
    } else if (mode === 'create') {
      // Mode création sans brouillon
      setIsInitialized(true)
    }
  }, [mode, initialData, isInitialized, persistenceReady, wasRestored, persistedData])

  // Sauvegarder le brouillon à chaque modification
  const saveCurrentDraft = useCallback(() => {
    if (!isInitialized) return

    saveDraft({
      title,
      category,
      prepTime,
      cookTime,
      servings,
      imageUrl,
      ingredients,
      steps,
      cookingMethods,
      notes,
      timeCalculationMode,
    })
  }, [
    isInitialized,
    saveDraft,
    title,
    category,
    prepTime,
    cookTime,
    servings,
    imageUrl,
    ingredients,
    steps,
    cookingMethods,
    notes,
    timeCalculationMode,
  ])

  // Déclencher la sauvegarde à chaque changement
  useEffect(() => {
    saveCurrentDraft()
  }, [saveCurrentDraft])

  // Fonction pour ignorer le brouillon et repartir de zéro
  const handleDiscardDraft = () => {
    discardRestored()
    setShowRestoredBanner(false)

    // Réinitialiser avec les données initiales ou les valeurs par défaut
    if (mode === 'edit' && initialData) {
      setTitle(initialData.title)
      setCategory(initialData.category)
      setPrepTime(initialData.prep_time)
      setCookTime(initialData.cook_time)
      setServings(initialData.servings)
      setImageUrl(initialData.image_url || '')
      setIngredients(initialData.ingredients)
      setSteps(initialData.steps as RecipeStep[])
      setCookingMethods(initialData.cooking_methods || [])
      setNotes(initialData.notes || '')
      setTimeCalculationMode(initialData.time_calculation_mode || 'manual')
    } else {
      setTitle('')
      setCategory('autre')
      setPrepTime(0)
      setCookTime(0)
      setServings(4)
      setImageUrl('')
      setIngredients([])
      setSteps([])
      setCookingMethods([])
      setNotes('')
      setTimeCalculationMode('manual')
    }
  }

  // Calculer automatiquement le temps basé sur les minuteurs
  useEffect(() => {
    if (timeCalculationMode === 'auto-timers') {
      const normalizedSteps = steps.map(step =>
        typeof step === 'string' ? { description: step } : step
      )

      // Calculer séparément prep et cook
      let totalPrepMinutes = 0
      let totalCookMinutes = 0

      normalizedSteps.forEach(step => {
        if (step.timerMinutes) {
          if (step.timerType === 'cook') {
            totalCookMinutes += step.timerMinutes
          } else {
            // Par défaut, on considère que c'est de la préparation
            totalPrepMinutes += step.timerMinutes
          }
        }
      })

      setPrepTime(totalPrepMinutes)
      setCookTime(totalCookMinutes)
    }
  }, [timeCalculationMode, steps])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation: au moins une méthode de cuisson doit être sélectionnée
    if (cookingMethods.length === 0) {
      alert('Veuillez sélectionner au moins une méthode de cuisson')
      return
    }

    const formData: RecipeFormData = {
      title,
      category,
      prepTime,
      cookTime,
      servings,
      ingredients,
      steps,
      cookingMethods,
      notes,
      imageUrl,
      timeCalculationMode,
    }

    await onSubmit(formData)

    // Effacer le brouillon après soumission réussie
    clearDraft()
  }

  // Empêcher la soumission du formulaire lors de l'appui sur Entrée
  // Exception: permettre l'Entrée dans les champs à l'intérieur des modals
  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter' && e.target instanceof HTMLElement && e.target.tagName !== 'TEXTAREA') {
      // Vérifier si le champ est à l'intérieur d'un modal
      const isInModal = e.target.closest('[role="dialog"]') !== null
      if (!isInModal) {
        e.preventDefault()
      }
    }
  }

  const handleCookingMethodToggle = (methodValue: string) => {
    setCookingMethods((prev) =>
      prev.includes(methodValue)
        ? prev.filter((m) => m !== methodValue)
        : [...prev, methodValue]
    )
  }

  return (
    <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="space-y-4 sm:space-y-5 md:space-y-6">
      {/* Bannière de brouillon restauré */}
      {showRestoredBanner && (
        <div className="flex items-center justify-between gap-3 p-3 sm:p-4 bg-ios-blue/10 border border-ios-blue/30 rounded-2xl">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-lg sm:text-xl shrink-0">📝</span>
            <p className="text-sm text-ios-label truncate">
              Brouillon restauré
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowRestoredBanner(false)}
              className="px-3 py-1.5 text-xs sm:text-sm font-medium text-ios-blue hover:bg-ios-blue/10 rounded-xl transition-colors"
            >
              OK
            </button>
            <button
              type="button"
              onClick={handleDiscardDraft}
              className="px-3 py-1.5 text-xs sm:text-sm font-medium text-ios-label-secondary hover:bg-ios-bg-tertiary rounded-xl transition-colors"
            >
              Ignorer
            </button>
          </div>
        </div>
      )}

      {/* Section 1: Informations générales */}
      <Card header="Informations générales">
        <div className="space-y-3 sm:space-y-4">
          <Input
            label="Titre de la recette"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Tarte aux pommes"
            required
          />

          <Select
            label="Catégorie"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </Select>

          {/* Mode de calcul du temps */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-ios-label">
              Calcul du temps
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setTimeCalculationMode('manual')}
                className={`p-3 rounded-2xl border-2 transition-all duration-ios-normal ${timeCalculationMode === 'manual'
                  ? 'border-ios-pink bg-ios-pink/10 shadow-ios-sm'
                  : 'border-ios-separator bg-ios-bg-tertiary hover:border-ios-pink/30'
                  }`}
              >
                <div className="text-sm font-semibold text-ios-label mb-1">Manuel</div>
                <div className="text-xs text-ios-label-secondary">Vous définissez les temps</div>
              </button>
              <button
                type="button"
                onClick={() => setTimeCalculationMode('auto-timers')}
                className={`p-3 rounded-2xl border-2 transition-all duration-ios-normal ${timeCalculationMode === 'auto-timers'
                  ? 'border-ios-pink bg-ios-pink/10 shadow-ios-sm'
                  : 'border-ios-separator bg-ios-bg-tertiary hover:border-ios-pink/30'
                  }`}
              >
                <div className="text-sm font-semibold text-ios-label mb-1">Automatique</div>
                <div className="text-xs text-ios-label-secondary">Basé sur les minuteurs</div>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <Input
              type="number"
              label="Préparation (min)"
              value={prepTime || ''}
              onChange={(e) => setPrepTime(parseInt(e.target.value) || 0)}
              placeholder="0"
              min={0}
              disabled={timeCalculationMode === 'auto-timers'}
            />
            <Input
              type="number"
              label="Cuisson (min)"
              value={cookTime || ''}
              onChange={(e) => setCookTime(parseInt(e.target.value) || 0)}
              placeholder="0"
              min={0}
              disabled={timeCalculationMode === 'auto-timers'}
            />
            <Input
              type="number"
              label="Portions"
              value={servings || ''}
              onChange={(e) => setServings(parseInt(e.target.value) || 1)}
              placeholder="4"
              min={1}
            />
          </div>

          {timeCalculationMode === 'auto-timers' && (
            <div className="p-3 bg-ios-yellow/10 border border-ios-yellow/30 rounded-2xl">
              <p className="text-xs sm:text-sm text-ios-label">
                💡 Les temps seront calculés automatiquement en additionnant les minuteurs de chaque type :
                <br />• Minuteurs <span className="text-ios-green font-semibold">Préparation</span> → Temps de préparation
                <br />• Minuteurs <span className="text-ios-pink font-semibold">Cuisson</span> → Temps de cuisson
              </p>
            </div>
          )}

          <div className="space-y-3">
            <Input
              type="url"
              label="URL de l'image (optionnel)"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
            />

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-ios-separator" />
              <span className="text-xs text-ios-label-tertiary">ou</span>
              <div className="flex-1 h-px bg-ios-separator" />
            </div>

            <UnsplashImagePicker
              onSelect={setImageUrl}
              currentImageUrl={imageUrl}
            />

            {imageUrl && (
              <div className="relative w-full h-48 rounded-2xl overflow-hidden border-2 border-ios-separator">
                <img
                  src={imageUrl}
                  alt="Aperçu"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <button
                    type="button"
                    onClick={() => setImageUrl('')}
                    className="w-8 h-8 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                  >
                    <span className="text-white text-xl">×</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Section 2: Méthodes de cuisson */}
      <Card header="Méthodes de cuisson">
        <div className="mb-2 sm:mb-3">
          <p className="text-xs sm:text-sm text-ios-label-secondary">
            Sélectionnez au moins une méthode <span className="text-ios-pink">*</span>
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
          {COOKING_METHODS.map((method) => (
            <label
              key={method.value}
              className={`
                relative flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl border-2 cursor-pointer transition-all duration-ios-normal
                ${cookingMethods.includes(method.value)
                  ? 'border-ios-pink bg-ios-pink/10 shadow-ios-sm'
                  : 'border-ios-separator bg-ios-bg-tertiary hover:border-ios-pink/30 hover:bg-ios-pink/5'
                }
              `}
            >
              <input
                type="checkbox"
                checked={cookingMethods.includes(method.value)}
                onChange={() => handleCookingMethodToggle(method.value)}
                className="sr-only"
                aria-label={method.label}
              />
              <span className="text-2xl sm:text-3xl mb-1 sm:mb-2">
                {/* Icon placeholder - we'll render the actual icon based on method.icon */}
                {method.icon === 'Flame' && '🔥'}
                {method.icon === 'Zap' && '⚡'}
                {method.icon === 'Wind' && '💨'}
                {method.icon === 'CookingPot' && '🍲'}
                {method.icon === 'Droplets' && '💧'}
                {method.icon === 'Sparkles' && '✨'}
              </span>
              <span className={`text-xs sm:text-sm font-medium text-center ${cookingMethods.includes(method.value) ? 'text-ios-pink' : 'text-ios-label-secondary'
                }`}>
                {method.label}
              </span>
            </label>
          ))}
        </div>
      </Card>

      {/* Section 3: Ingrédients */}
      <Card header="Ingrédients">
        <IngredientsInput ingredients={ingredients} onChange={setIngredients} />
      </Card>

      {/* Section 4: Étapes */}
      <Card header="Étapes de préparation">
        <StepsInput steps={steps} onChange={setSteps} ingredients={ingredients} />
      </Card>

      {/* Section 5: Notes */}
      <Card header="Notes personnelles">
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          placeholder="Ajoutez vos notes, astuces ou variantes..."
        />
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <Button variant="secondary" onClick={onCancel} fullWidth type="button">
          Annuler
        </Button>
        <Button type="submit" variant="primary" isLoading={isLoading} fullWidth>
          {mode === 'create' ? 'Créer la recette' : 'Enregistrer les modifications'}
        </Button>
      </div>
    </form>
  )
}
