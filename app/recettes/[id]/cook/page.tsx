'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Spinner } from '@/components/ui/Spinner'
import { RecipeStepByStep } from '@/components/recipe/RecipeStepByStep'
import { useAuth } from '@/hooks/useAuth'
import { useRecipes } from '@/hooks/useRecipes'
import type { Recipe } from '@/types'

export default function CookPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading: authLoading } = useAuth()
  const { getRecipe } = useRecipes()
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(true)

  const [currentStep, setCurrentStep] = useState(0)

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

      // Initialiser l'étape depuis l'URL après le chargement
      const stepParam = searchParams.get('step')
      if (stepParam) {
        const step = parseInt(stepParam, 10)
        if (!isNaN(step) && step >= 0 && data && step < data.steps.length) {
          setCurrentStep(step)
        }
      }
    }

    if (user) {
      loadRecipe()
    }
  }, [resolvedParams.id, user, getRecipe, searchParams])

  const handleStepChange = (step: number) => {
    if (!recipe || step < 0 || step >= recipe.steps.length) return
    setCurrentStep(step)
  }

  const handleExit = () => {
    router.push(`/recettes/${resolvedParams.id}`)
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ios-bg">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!user || !recipe) {
    return null
  }

  return (
    <RecipeStepByStep
      recipe={recipe}
      currentStep={currentStep}
      onStepChange={handleStepChange}
      onExit={handleExit}
    />
  )
}
