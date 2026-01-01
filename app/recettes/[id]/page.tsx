'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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

export default function RecipePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params)
  const router = useRouter()
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
      <header className="bg-ios-bg-secondary/80 backdrop-blur-lg border-b border-ios-separator sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/')}
              leftIcon={<ArrowLeft className="w-5 h-5" />}
            >
              Retour
            </Button>
            <h1 className="text-xl sm:text-2xl font-bold text-ios-label truncate">
              {recipe.title}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/recettes/${resolvedParams.id}/edit`)}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDeleteModal(true)}
            >
              <Trash2 className="w-4 h-4 text-ios-red" />
            </Button>
          </div>
        </div>
      </header>

      <Container maxWidth="lg">
        <div className="space-y-6">
          {/* Image */}
          {recipe.image_url && (
            <div className="w-full h-64 sm:h-96 overflow-hidden rounded-3xl corner-squircle">
              <img
                src={recipe.image_url}
                alt={recipe.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Infos */}
          <RecipeInfo recipe={recipe} />

          {/* Bouton principal */}
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => setStepByStepMode(true)}
            leftIcon={<ChefHat className="w-6 h-6" />}
          >
            Commencer à cuisiner (mode étape par étape)
          </Button>

          {/* Ingrédients */}
          <Card header="Ingrédients">
            <IngredientsList ingredients={recipe.ingredients} />
          </Card>

          {/* Étapes */}
          <Card header="Préparation">
            <StepsList steps={recipe.steps} numbered />
          </Card>

          {/* Notes */}
          {recipe.notes && (
            <Card header="Notes personnelles">
              <p className="text-base text-ios-label whitespace-pre-wrap">{recipe.notes}</p>
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
              variant="destructive"
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
