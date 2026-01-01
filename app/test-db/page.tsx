'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Container } from '@/components/layout/Container'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

export default function TestDBPage() {
  const [status, setStatus] = useState<string>('Testing...')
  const [ingredients, setIngredients] = useState<any[]>([])
  const [recipes, setRecipes] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  const testConnection = async () => {
    setStatus('Testing connection...')
    setError(null)

    try {
      // Test 1: Connection
      setStatus('✓ Connexion à Supabase OK')

      // Test 2: Table ingredients
      const { data: ingredientsData, error: ingredientsError } = await supabase
        .from('ingredients')
        .select('*')
        .limit(10)

      if (ingredientsError) {
        setError(`Erreur ingredients: ${ingredientsError.message}`)
        setStatus('✗ Table ingredients non trouvée')
        return
      }

      setIngredients(ingredientsData || [])
      setStatus(`✓ Table ingredients OK (${ingredientsData?.length || 0} ingrédients trouvés)`)

      // Test 3: Table recipes
      const { data: recipesData, error: recipesError } = await supabase
        .from('recipes')
        .select('*')
        .limit(10)

      if (recipesError) {
        setError(`Erreur recipes: ${recipesError.message}`)
        setStatus('✗ Table recipes non trouvée')
        return
      }

      setRecipes(recipesData || [])
      setStatus(`✓ Toutes les tables OK ! (${ingredientsData?.length || 0} ingrédients, ${recipesData?.length || 0} recettes)`)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      setStatus('✗ Erreur de connexion')
    }
  }

  useEffect(() => {
    testConnection()
  }, [])

  return (
    <div className="min-h-screen bg-ios-bg">
      <Container>
        <h1 className="text-4xl font-bold text-ios-label mb-8">Test Base de Données</h1>

        <div className="space-y-6">
          {/* Status */}
          <Card>
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-ios-label">Statut de la connexion</h2>
              <p className={`text-lg font-semibold ${error ? 'text-ios-red' : 'text-ios-green'}`}>
                {status}
              </p>
              {error && (
                <div className="bg-ios-red/10 border border-ios-red rounded-3xl corner-squircle p-4">
                  <p className="text-ios-red font-mono text-sm">{error}</p>
                </div>
              )}
              <Button onClick={testConnection}>Retester</Button>
            </div>
          </Card>

          {/* Instructions si erreur */}
          {error && (
            <Card>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-ios-red">❌ Les tables n'existent pas encore</h2>
                <div className="bg-ios-bg-tertiary rounded-3xl corner-squircle p-6 space-y-4">
                  <h3 className="text-xl font-bold text-ios-label">📋 Étapes pour créer la base de données :</h3>
                  <ol className="list-decimal list-inside space-y-2 text-ios-label">
                    <li>Ouvrez votre projet Supabase : <a href="https://supabase.com" target="_blank" className="text-ios-pink underline">supabase.com</a></li>
                    <li>Cliquez sur <strong>"SQL Editor"</strong> dans le menu de gauche</li>
                    <li>Cliquez sur <strong>"New Query"</strong></li>
                    <li>Copiez le contenu du fichier <code className="bg-ios-label text-white px-2 py-1 rounded">supabase-setup.sql</code></li>
                    <li>Collez-le dans l'éditeur SQL</li>
                    <li>Cliquez sur <strong>"Run"</strong> ou appuyez sur Ctrl+Enter</li>
                    <li>Revenez ici et cliquez sur "Retester"</li>
                  </ol>
                </div>
              </div>
            </Card>
          )}

          {/* Ingrédients */}
          {ingredients.length > 0 && (
            <Card>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-ios-label">
                  ✅ Ingrédients trouvés ({ingredients.length})
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {ingredients.slice(0, 20).map((ing) => (
                    <div key={ing.id} className="bg-ios-bg-tertiary rounded-3xl corner-squircle p-2">
                      <p className="font-semibold text-sm">{ing.name}</p>
                      <p className="text-xs text-ios-label-secondary">{ing.category}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {/* Recettes */}
          {recipes.length > 0 && (
            <Card>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-ios-label">
                  ✅ Recettes trouvées ({recipes.length})
                </h2>
                <div className="space-y-2">
                  {recipes.map((recipe) => (
                    <div key={recipe.id} className="bg-ios-bg-tertiary rounded-3xl corner-squircle p-3">
                      <p className="font-semibold">{recipe.title}</p>
                      <p className="text-sm text-ios-label-secondary">{recipe.category}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </div>
      </Container>
    </div>
  )
}
