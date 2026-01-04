'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Edit, Trash2, ChefHat } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Modal } from '@/components/ui/Modal'
import { Spinner } from '@/components/ui/Spinner'
import { RecipeInfo } from '@/components/recipe/RecipeInfo'
import { IngredientsList } from '@/components/recipe/IngredientsList'
import { StepsList } from '@/components/recipe/StepsList'
import { RecipeStepByStep } from '@/components/recipe/RecipeStepByStep'
import { useAuth } from '@/hooks/useAuth'
import { useRecipes } from '@/hooks/useRecipes'
import type { Recipe } from '@/types'
import { CATEGORIES } from '@/types'

export default function RecipePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading: authLoading } = useAuth()
  const { getRecipe, deleteRecipe } = useRecipes()
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(true)
  const [stepByStepMode, setStepByStepMode] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    const loadRecipe = async () => {
      setLoading(true)
      const data = await getRecipe(resolvedParams.id)
      setRecipe(data)
      setLoading(false)
    }

    if (user) {
      loadRecipe()
    }
  }, [resolvedParams.id, user, getRecipe])

  // Démarrer en mode étape par étape si le paramètre mode=stepbystep est présent
  useEffect(() => {
    const mode = searchParams.get('mode')
    if (mode === 'stepbystep' && !loading && recipe) {
      setStepByStepMode(true)
    }
  }, [searchParams, loading, recipe])

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteRecipe(resolvedParams.id)
      router.push('/')
    } catch (err) {
      console.error('Erreur lors de la suppression:', err)
    } finally {
      setIsDeleting(false)
      setShowDeleteModal(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!user || !recipe) {
    return null
  }

  if (stepByStepMode) {
    return (
      <RecipeStepByStep
        recipe={recipe}
        currentStep={currentStep}
        onStepChange={setCurrentStep}
        onExit={() => {
          setStepByStepMode(false)
          setCurrentStep(0)
        }}
      />
    )
  }

  return (
    <div className="min-h-screen bg-ios-bg">
      {/* Header */}
      <header className="bg-ios-bg-secondary/80 flex justify-center items-center backdrop-blur-lg border-b border-ios-separator sticky top-0 z-40">
        <div className="container px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-3 sm:gap-4">
          {/* Back button and title */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-shrink">
            {/* Back Button - Mobile: icon only */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/')}
              className="sm:hidden w-10 h-10 p-0 rounded-2xl flex-shrink-0"
              aria-label="Retour"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            {/* Back Button - Desktop: icon + text */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/')}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
              className="hidden sm:flex flex-shrink-0"
            >
              Retour
            </Button>

            {/* Title - responsive text sizing */}
            <h1 className="text-base sm:text-xl md:text-2xl font-semibold sm:font-bold text-ios-label truncate">
              {recipe.title}
            </h1>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => router.push(`/recettes/${resolvedParams.id}/edit`)}
              className="w-10 h-10 p-0 sm:p-2 rounded-2xl"
              aria-label="Modifier"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowDeleteModal(true)}
              className="w-10 h-10 p-0 sm:p-2 rounded-2xl"
              aria-label="Supprimer"
            >
              <Trash2 className="w-4 h-4 text-white" />
            </Button>
          </div>
        </div>
      </header>

      <Container maxWidth="lg">
        <div className="space-y-4 sm:space-y-5 md:space-y-6">
          {/* Image avec catégorie */}
          {recipe.image_url && (
            <div className="relative w-full h-48 sm:h-64 md:h-80 lg:h-96 overflow-hidden rounded-2xl sm:rounded-3xl corner-squircle">
              <img
                src={recipe.image_url}
                alt={recipe.title}
                className="w-full h-full object-cover"
              />
              {/* Gradient overlay pour meilleure lisibilité */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              {/* Catégorie en bas à gauche */}
              <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6">
                <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-white bg-ios-pink rounded-lg shadow-lg">
                  {CATEGORIES.find((c) => c.value === recipe.category)?.label || recipe.category}
                </span>
              </div>
            </div>
          )}

          {/* Infos */}
          <RecipeInfo recipe={recipe} hideCategory />

          {/* Bouton principal */}
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => setStepByStepMode(true)}
            leftIcon={<ChefHat className="w-5 h-5 sm:w-6 sm:h-6" />}
            className="text-sm sm:text-base"
          >
            <span className="hidden sm:inline">Commencer à cuisiner</span>
            <span className="sm:hidden">Commencer à cuisiner</span>
          </Button>

          {/* Ingrédients */}
          <Card header="Ingrédients">
            <IngredientsList ingredients={recipe.ingredients} />
          </Card>

          {/* Étapes */}
          <Card header="Préparation">
            <StepsList steps={recipe.steps} numbered ingredients={recipe.ingredients} />
          </Card>

          {/* Notes */}
          {recipe.notes && (
            <Card header="Notes personnelles">
              <p className="text-sm sm:text-base text-ios-label whitespace-pre-wrap leading-relaxed">{recipe.notes}</p>
            </Card>
          )}
        </div>
      </Container>

      {/* Modal de confirmation de suppression */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Supprimer cette recette ?"
        description="Cette action est irréversible."
        footer={
          <div className="flex gap-4">
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)} fullWidth>
              Annuler
            </Button>
            <Button
              variant="primary"
              onClick={handleDelete}
              isLoading={isDeleting}
              fullWidth
            >
              Supprimer
            </Button>
          </div>
        }
      />
    </div>
  )
}
