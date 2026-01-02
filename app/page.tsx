'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { BookOpen } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Container } from '@/components/layout/Container'
import { EmptyState } from '@/components/layout/EmptyState'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { RecipeCard } from '@/components/recipe/RecipeCard'
import { RecipeFilters } from '@/components/recipe/RecipeFilters'
import { useAuth } from '@/hooks/useAuth'
import { useRecipes } from '@/hooks/useRecipes'
import { useDebounce } from '@/hooks/useDebounce'

export default function HomePage() {
  const router = useRouter()
  const { user, loading: authLoading, signOut } = useAuth()
  const { recipes, loading: recipesLoading } = useRecipes()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  // Redirection si non authentifié
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  // Filtrage des recettes
  const filteredRecipes = useMemo(() => {
    let filtered = recipes

    // Filtre par catégorie
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((recipe) => recipe.category === selectedCategory)
    }

    // Filtre par recherche
    if (debouncedSearchTerm) {
      const lowerQuery = debouncedSearchTerm.toLowerCase()
      filtered = filtered.filter((recipe) => {
        const titleMatch = recipe.title.toLowerCase().includes(lowerQuery)
        const ingredientsMatch = recipe.ingredients.some((ing) =>
          ing.name.toLowerCase().includes(lowerQuery)
        )
        return titleMatch || ingredientsMatch
      })
    }

    return filtered
  }, [recipes, selectedCategory, debouncedSearchTerm])

  const handleLogout = async () => {
    await signOut()
    router.push('/login')
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
      <Header user={user} onLogout={handleLogout} />

      <Container>
        <div className="space-y-6">
          {/* Filtres */}
          <RecipeFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />

          {/* Contenu */}
          {recipesLoading ? (
            <div className="flex justify-center py-16">
              <Spinner size="lg" />
            </div>
          ) : filteredRecipes.length === 0 ? (
            <EmptyState
              icon={<BookOpen className="w-12 h-12" />}
              title={recipes.length === 0 ? 'Aucune recette' : 'Aucun résultat'}
              description={
                recipes.length === 0
                  ? 'Commencez par créer votre première recette !'
                  : 'Aucune recette ne correspond à votre recherche.'
              }
              action={
                recipes.length === 0 ? (
                  <Button
                    variant="primary"
                    onClick={() => router.push('/recettes/nouvelle')}
                  >
                    Créer ma première recette
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onClick={() => router.push(`/recettes/${recipe.id}`)}
                  onStartCooking={() => router.push(`/recettes/${recipe.id}?mode=stepbystep`)}
                />
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  )
}
