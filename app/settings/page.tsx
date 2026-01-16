'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Trash2, AlertTriangle, Check } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { Footer } from '@/components/layout/Footer'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Spinner } from '@/components/ui/Spinner'
import { useAuth } from '@/hooks/useAuth'
import { useTheme, IOS_COLORS, IosColorKey } from '@/contexts/ThemeContext'

export default function SettingsPage() {
  const router = useRouter()
  const { user, loading: authLoading, deleteAccount, signOut } = useAuth()
  const { accentColor, setAccentColor } = useTheme()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [confirmEmail, setConfirmEmail] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  const handleDeleteAccount = async () => {
    if (confirmEmail !== user?.email) {
      setDeleteError('L\'adresse e-mail ne correspond pas')
      return
    }

    setIsDeleting(true)
    setDeleteError('')

    try {
      await deleteAccount()
      router.push('/login')
    } catch (err) {
      setDeleteError(
        err instanceof Error ? err.message : 'Erreur lors de la suppression du compte'
      )
    } finally {
      setIsDeleting(false)
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
    <div className="min-h-screen bg-ios-bg flex flex-col">
      {/* Header */}
      <header className="bg-ios-bg-secondary/80 border-b border-ios-separator sticky top-0 z-40">
        <div className="container px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/')}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Retour
          </Button>
          <h1 className="text-xl sm:text-2xl font-bold text-ios-label">
            Paramètres
          </h1>
        </div>
      </header>

      <div className="flex-1">
        <Container maxWidth="lg">
          <div className="space-y-6">
            {/* Account Info */}
            <Card header="Informations du compte">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-ios-label-secondary">
                    Adresse e-mail
                  </label>
                  <p className="mt-1 text-base text-ios-label">{user.email}</p>
                </div>
              </div>
            </Card>

            {/* Appearance */}
            <Card header="Apparence">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-ios-label-secondary">
                    Couleur d'accentuation
                  </label>
                  <p className="text-xs text-ios-label-tertiary mt-1 mb-3">
                    Personnalisez l'apparence de l'application
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {(Object.keys(IOS_COLORS) as IosColorKey[]).map((colorKey) => {
                      const color = IOS_COLORS[colorKey]
                      const isSelected = accentColor === colorKey
                      return (
                        <button
                          key={colorKey}
                          onClick={() => setAccentColor(colorKey)}
                          className="flex flex-col items-center gap-1.5 group"
                          aria-label={`Sélectionner la couleur ${color.name}`}
                        >
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                              isSelected
                                ? 'ring-2 ring-offset-2 ring-offset-ios-bg-secondary'
                                : 'hover:scale-110'
                            }`}
                            style={{
                              backgroundColor: color.value,
                              ringColor: isSelected ? color.value : undefined,
                            }}
                          >
                            {isSelected && (
                              <Check className="w-5 h-5 text-white" />
                            )}
                          </div>
                          <span
                            className={`text-xs ${
                              isSelected
                                ? 'font-medium text-ios-label'
                                : 'text-ios-label-secondary'
                            }`}
                          >
                            {color.name}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </Card>

            {/* Privacy Links */}
            <Card header="Confidentialité et conditions">
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/privacy')}
                  className="w-full text-left px-4 py-3 rounded-2xl hover:bg-ios-bg-tertiary transition-colors"
                >
                  <p className="text-sm font-medium text-ios-label">
                    Politique de confidentialité
                  </p>
                  <p className="text-xs text-ios-label-secondary mt-1">
                    Consulter notre politique de confidentialité
                  </p>
                </button>
                <button
                  onClick={() => router.push('/terms')}
                  className="w-full text-left px-4 py-3 rounded-2xl hover:bg-ios-bg-tertiary transition-colors"
                >
                  <p className="text-sm font-medium text-ios-label">
                    Conditions d'utilisation
                  </p>
                  <p className="text-xs text-ios-label-secondary mt-1">
                    Consulter nos conditions d'utilisation
                  </p>
                </button>
              </div>
            </Card>

            {/* Danger Zone */}
            <Card>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-ios-red/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-5 h-5 text-ios-red" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-ios-label mb-1">
                      Zone dangereuse
                    </h3>
                    <p className="text-sm text-ios-label-secondary">
                      La suppression de votre compte est définitive et irréversible.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-ios-red/5 border border-ios-red/20 rounded-2xl">
                  <h4 className="text-sm font-semibold text-ios-label mb-2">
                    Que se passe-t-il quand vous supprimez votre compte ?
                  </h4>
                  <ul className="text-sm text-ios-label-secondary space-y-1 list-disc list-inside">
                    <li>Toutes vos recettes seront supprimées</li>
                    <li>Vos données personnelles seront effacées</li>
                    <li>Cette action est irréversible</li>
                    <li>Vous serez immédiatement déconnecté</li>
                  </ul>
                </div>

                <Button
                  variant="primary"
                  onClick={() => setShowDeleteModal(true)}
                  leftIcon={<Trash2 className="w-4 h-4" />}
                  className="bg-ios-red hover:bg-ios-red/90 rounded-2xl"
                  fullWidth
                >
                  Supprimer mon compte
                </Button>
              </div>
            </Card>
          </div>
        </Container>
      </div>

      <Footer />

      {/* Modal de confirmation de suppression */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setConfirmEmail('')
          setDeleteError('')
        }}
        title="Supprimer votre compte ?"
        description="Cette action est irréversible. Toutes vos données seront définitivement supprimées."
      >
        <div className="space-y-4">
          <div className="p-4 bg-ios-yellow/10 border border-ios-yellow/30 rounded-2xl">
            <p className="text-sm text-ios-label">
              Pour confirmer, veuillez saisir votre adresse e-mail :{' '}
              <span className="font-semibold">{user.email}</span>
            </p>
          </div>

          <input
            type="email"
            value={confirmEmail}
            onChange={(e) => setConfirmEmail(e.target.value)}
            placeholder="Votre adresse e-mail"
            className="w-full px-4 py-3 bg-ios-bg-tertiary border border-ios-separator rounded-2xl text-ios-label placeholder:text-ios-label-tertiary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          />

          {deleteError && (
            <div className="p-3 bg-ios-red/10 border border-ios-red/30 rounded-2xl">
              <p className="text-sm text-ios-red">{deleteError}</p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              variant="secondary"
              onClick={() => {
                setShowDeleteModal(false)
                setConfirmEmail('')
                setDeleteError('')
              }}
              fullWidth
            >
              Annuler
            </Button>
            <Button
              variant="primary"
              onClick={handleDeleteAccount}
              isLoading={isDeleting}
              disabled={confirmEmail !== user.email}
              className="bg-ios-red hover:bg-ios-red/90"
              fullWidth
            >
              Supprimer définitivement
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
