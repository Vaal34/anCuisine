'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ChefHat, Eye, EyeOff } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Footer } from '@/components/layout/Footer'
import { useAuth } from '@/hooks/useAuth'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { updatePassword } = useAuth()

  useEffect(() => {
    // Vérifier si on a un hash dans l'URL (token de réinitialisation)
    const hash = window.location.hash
    if (!hash || !hash.includes('access_token')) {
      setError('Lien de réinitialisation invalide ou expiré.')
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.')
      return
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }

    setIsLoading(true)

    try {
      await updatePassword(password)
      setSuccess(true)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Une erreur est survenue. Veuillez réessayer.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ios-bg via-ios-bg-tertiary to-ios-bg-secondary">
      <div className="min-h-screen flex items-center justify-center p-4 w-full">
        <Card className="max-w-md w-full p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-recipe-primary rounded-3xl mb-4">
              <ChefHat className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-ios-label mb-2">
              {success ? 'Mot de passe modifié' : 'Nouveau mot de passe'}
            </h1>
            <p className="text-ios-label-secondary">
              {success
                ? 'Votre mot de passe a été mis à jour avec succès.'
                : 'Choisissez un nouveau mot de passe pour votre compte.'}
            </p>
          </div>

          {success ? (
            <div className="space-y-4">
              <div className="w-16 h-16 bg-ios-green/10 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-ios-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <Button
                variant="primary"
                fullWidth
                onClick={() => router.push('/login')}
              >
                Se connecter
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type={showPassword ? 'text' : 'password'}
                label="Nouveau mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                helperText="Au moins 6 caractères"
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="focus:outline-none hover:text-ios-label transition-colors flex items-center justify-center"
                    aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                }
              />

              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                label="Confirmer le mot de passe"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="focus:outline-none hover:text-ios-label transition-colors flex items-center justify-center"
                    aria-label={showConfirmPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                }
              />

              {error && (
                <div className="bg-ios-red/10 border border-ios-red rounded-3xl px-4 py-3">
                  <p className="text-ios-red text-sm">{error}</p>
                </div>
              )}

              <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
                Réinitialiser le mot de passe
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => router.push('/login')}
                  className="text-accent text-sm hover:underline"
                >
                  Retour à la connexion
                </button>
              </div>
            </form>
          )}
        </Card>
      </div>

      <div className="mt-8">
        <Footer />
      </div>
    </div>
  )
}
