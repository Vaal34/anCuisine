'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ChefHat, Eye, EyeOff } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Footer } from '@/components/layout/Footer'
import { useAuth } from '@/hooks/useAuth'

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('')
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false)
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false)
  const [forgotPasswordError, setForgotPasswordError] = useState('')
  const router = useRouter()
  const { signIn, signUp, resetPassword, user } = useAuth()

  useEffect(() => {
    if (user) {
      router.push('/')
    }
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      if (mode === 'login') {
        await signIn(email, password)
      } else {
        await signUp(email, password)
      }
      router.push('/')
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

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setForgotPasswordError('')
    setForgotPasswordLoading(true)

    try {
      await resetPassword(forgotPasswordEmail)
      setForgotPasswordSuccess(true)
    } catch (err) {
      setForgotPasswordError(
        err instanceof Error
          ? err.message
          : 'Une erreur est survenue. Veuillez réessayer.'
      )
    } finally {
      setForgotPasswordLoading(false)
    }
  }

  const closeForgotPasswordModal = () => {
    setShowForgotPassword(false)
    setForgotPasswordEmail('')
    setForgotPasswordError('')
    setForgotPasswordSuccess(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ios-bg via-ios-bg-tertiary to-ios-bg-secondary">
      <div className="min-h-screen flex items-center justify-center p-4 w-full">
        <Card className="max-w-md w-full p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-recipe-primary rounded-3xl mb-4">
              <ChefHat className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-ios-label mb-2">anCuisine</h1>
            <p className="text-ios-label-secondary">Votre carnet de cuisine personnel</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              required
            />

            <Input
              type={showPassword ? 'text' : 'password'}
              label="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              helperText={mode === 'signup' ? 'Au moins 6 caractères' : undefined}
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

            {error && (
              <div className="bg-ios-red/10 border border-ios-red rounded-3xl px-4 py-3">
                <p className="text-ios-red text-sm">{error}</p>
              </div>
            )}

            <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
              {mode === 'login' ? 'Se connecter' : "S'inscrire"}
            </Button>

            <div className="text-center space-y-2">
              {mode === 'login' && (
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-ios-label-secondary text-sm hover:underline block w-full"
                >
                  Mot de passe oublié ?
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setMode(mode === 'login' ? 'signup' : 'login')
                  setError('')
                }}
                className="text-accent text-sm hover:underline"
              >
                {mode === 'login'
                  ? "Pas encore de compte ? S'inscrire"
                  : 'Déjà un compte ? Se connecter'}
              </button>
            </div>
          </form>
        </Card>
      </div>

      <div className="mt-8">
        <Footer />
      </div>

      {/* Modal Mot de passe oublié */}
      <Modal
        isOpen={showForgotPassword}
        onClose={closeForgotPasswordModal}
        title="Mot de passe oublié"
        description="Entrez votre adresse email pour recevoir un lien de réinitialisation."
        size="sm"
      >
        {forgotPasswordSuccess ? (
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-ios-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-ios-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-ios-label mb-2">Email envoyé !</p>
            <p className="text-ios-label-secondary text-sm">
              Vérifiez votre boîte de réception et suivez les instructions pour réinitialiser votre mot de passe.
            </p>
            <Button
              variant="secondary"
              fullWidth
              className="mt-6"
              onClick={closeForgotPasswordModal}
            >
              Fermer
            </Button>
          </div>
        ) : (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <Input
              type="email"
              label="Email"
              value={forgotPasswordEmail}
              onChange={(e) => setForgotPasswordEmail(e.target.value)}
              placeholder="votre@email.com"
              required
            />

            {forgotPasswordError && (
              <div className="bg-ios-red/10 border border-ios-red rounded-3xl px-4 py-3">
                <p className="text-ios-red text-sm">{forgotPasswordError}</p>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={forgotPasswordLoading}
            >
              Envoyer le lien
            </Button>
          </form>
        )}
      </Modal>
    </div>
  )
}
