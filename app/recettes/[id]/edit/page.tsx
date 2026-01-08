'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/Button'
import { RecipeForm } from '@/components/recipe/RecipeForm'
import { Spinner } from '@/components/ui/Spinner'
import { useAuth } from '@/hooks/useAuth'
import { useRecipes } from '@/hooks/useRecipes'
import type { Recipe, RecipeFormData } from '@/types'

export default function EditRecipePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params)
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { getRecipe, updateRecipe } = useRecipes()
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const hasLoadedRecipe = useRef(false)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    const loadRecipe = async () => {
      if (hasLoadedRecipe.current) return

      setLoading(true)
      const data = await getRecipe(resolvedParams.id)
      setRecipe(data)
      setLoading(false)
      hasLoadedRecipe.current = true
    }

    if (user && !hasLoadedRecipe.current) {
      loadRecipe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedParams.id, user])

  const handleUpdate = async (data: RecipeFormData) => {
    setIsLoading(true)
    setError('')

    try {
      await updateRecipe(resolvedParams.id, data)
      router.push(`/recettes/${resolvedParams.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la modification de la recette')
    } finally {
      setIsLoading(false)
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

  return (
    <div className="min-h-screen bg-ios-bg">
      {/* Header */}
      <header className="bg-ios-bg-secondary flex justify-center items-center border-b border-ios-separator sticky top-0 z-40">
        <div className="container px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-3 sm:gap-4">
          {/* Back button and title */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-shrink">
            {/* Back Button - Mobile: icon only */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/recettes/${resolvedParams.id}`)}
              className="sm:hidden w-10 h-10 p-0 rounded-3xl flex-shrink-0 min-h-0"
              aria-label="Retour"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            {/* Back Button - Desktop: icon + text */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/recettes/${resolvedParams.id}`)}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
              className="hidden sm:flex flex-shrink-0"
            >
              Retour
            </Button>

            {/* Title - responsive text sizing */}
            <h1 className="text-base sm:text-xl md:text-2xl font-semibold sm:font-bold text-ios-label truncate">
              Modifier la recette
            </h1>
          </div>
        </div>
      </header>

      <Container maxWidth="lg">
        {error && (
          <div className="mb-6 bg-ios-red/10 border border-ios-red rounded-3xl px-4 py-3">
            <p className="text-ios-red text-sm">{error}</p>
          </div>
        )}

        <RecipeForm
          mode="edit"
          initialData={recipe}
          onSubmit={handleUpdate}
          onCancel={() => router.push(`/recettes/${resolvedParams.id}`)}
          isLoading={isLoading}
        />
      </Container>
    </div>
  )
}
