'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/Button'
import { RecipeForm } from '@/components/recipe/RecipeForm'
import { useAuth } from '@/hooks/useAuth'
import { useRecipes } from '@/hooks/useRecipes'
import { Spinner } from '@/components/ui/Spinner'
import type { RecipeFormData } from '@/types'

export default function NewRecipePage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { createRecipe } = useRecipes()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  const handleCreate = async (data: RecipeFormData) => {
    setIsLoading(true)
    setError('')

    try {
      const id = await createRecipe(data)
      router.push(`/recettes/${id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création de la recette')
    } finally {
      setIsLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!user) {
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
              onClick={() => router.push('/')}
              className="sm:hidden w-10 h-10 p-0 rounded-2xl flex-shrink-0 min-h-0"
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
              Nouvelle Recette
            </h1>
          </div>
        </div>
      </header>

      <Container maxWidth="lg">
        {error && (
          <div className="mb-4 sm:mb-5 md:mb-6 bg-ios-red/10 border border-ios-red rounded-3xl px-4 py-3">
            <p className="text-ios-red text-sm sm:text-base">{error}</p>
          </div>
        )}

        <RecipeForm
          mode="create"
          onSubmit={handleCreate}
          onCancel={() => router.push('/')}
          isLoading={isLoading}
        />
      </Container>
    </div>
  )
}
