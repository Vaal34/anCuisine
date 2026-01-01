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
      <header className="bg-ios-bg-secondary/80 backdrop-blur-lg border-b border-ios-separator sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/')}
            leftIcon={<ArrowLeft className="w-5 h-5" />}
          >
            Retour
          </Button>
          <h1 className="text-2xl font-bold text-ios-label">Nouvelle Recette</h1>
        </div>
      </header>

      <Container maxWidth="lg">
        {error && (
          <div className="mb-6 bg-ios-red/10 border border-ios-red rounded-3xl corner-squircle px-4 py-3">
            <p className="text-ios-red text-sm">{error}</p>
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
