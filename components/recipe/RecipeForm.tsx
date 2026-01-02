'use client'

import React, { useState, useEffect } from 'react'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { IngredientsInput } from './IngredientsInput'
import { StepsInput } from './StepsInput'
import type { Recipe, RecipeFormData } from '@/types'
import { CATEGORIES } from '@/types'

export interface RecipeFormProps {
  mode: 'create' | 'edit'
  initialData?: Recipe
  onSubmit: (data: RecipeFormData) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export function RecipeForm({ mode, initialData, onSubmit, onCancel, isLoading }: RecipeFormProps) {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('autre')
  const [prepTime, setPrepTime] = useState(0)
  const [cookTime, setCookTime] = useState(0)
  const [servings, setServings] = useState(4)
  const [imageUrl, setImageUrl] = useState('')
  const [ingredients, setIngredients] = useState<RecipeFormData['ingredients']>([])
  const [steps, setSteps] = useState<string[]>([])
  const [notes, setNotes] = useState('')

  // Initialiser le formulaire avec les données existantes en mode édition
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setTitle(initialData.title)
      setCategory(initialData.category)
      setPrepTime(initialData.prep_time)
      setCookTime(initialData.cook_time)
      setServings(initialData.servings)
      setImageUrl(initialData.image_url || '')
      setIngredients(initialData.ingredients)
      setSteps(initialData.steps)
      setNotes(initialData.notes || '')
    }
  }, [mode, initialData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const formData: RecipeFormData = {
      title,
      category,
      prepTime,
      cookTime,
      servings,
      ingredients,
      steps,
      notes,
      imageUrl,
    }

    await onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 md:space-y-6">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <Input
              type="number"
              label="Préparation (min)"
              value={prepTime}
              onChange={(e) => setPrepTime(parseInt(e.target.value) || 0)}
              min={0}
            />
            <Input
              type="number"
              label="Cuisson (min)"
              value={cookTime}
              onChange={(e) => setCookTime(parseInt(e.target.value) || 0)}
              min={0}
            />
            <Input
              type="number"
              label="Portions"
              value={servings}
              onChange={(e) => setServings(parseInt(e.target.value) || 1)}
              min={1}
            />
          </div>

          <Input
            type="url"
            label="URL de l'image (optionnel)"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://..."
          />
        </div>
      </Card>

      {/* Section 2: Ingrédients */}
      <Card header="Ingrédients">
        <IngredientsInput ingredients={ingredients} onChange={setIngredients} />
      </Card>

      {/* Section 3: Étapes */}
      <Card header="Étapes de préparation">
        <StepsInput steps={steps} onChange={setSteps} ingredients={ingredients} />
      </Card>

      {/* Section 4: Notes */}
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
