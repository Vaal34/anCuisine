'use client'

import React, { useState } from 'react'
import { Search, X, Check, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Spinner } from '@/components/ui/Spinner'

interface PinterestImage {
  id: string
  title: string
  description: string
  imageUrl: string
  thumbnailUrl: string
  link: string
  altText: string
}

interface PinterestImagePickerProps {
  onSelect: (imageUrl: string) => void
  currentImageUrl?: string
}

export function PinterestImagePicker({ onSelect, currentImageUrl }: PinterestImagePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [images, setImages] = useState<PinterestImage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null)

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/pinterest/search?q=${encodeURIComponent(searchQuery)}&limit=20`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la recherche')
      }

      const data = await response.json()
      setImages(data.results || [])

      if (data.results.length === 0) {
        setError('Aucune image trouvée pour cette recherche')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la recherche')
      setImages([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleSelectImage = (imageUrl: string) => {
    setSelectedImageUrl(imageUrl)
  }

  const handleConfirm = () => {
    if (selectedImageUrl) {
      onSelect(selectedImageUrl)
      setIsOpen(false)
      setSelectedImageUrl(null)
      setImages([])
      setSearchQuery('')
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    setSelectedImageUrl(null)
    setError(null)
  }

  return (
    <>
      <Button
        type="button"
        variant="secondary"
        onClick={() => setIsOpen(true)}
        leftIcon={<Search className="w-4 h-4" />}
        fullWidth
      >
        Rechercher sur Pinterest
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title="Rechercher une image sur Pinterest"
        size="lg"
      >
        <div className="space-y-4">
          {/* Barre de recherche */}
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ex: tarte aux pommes, poulet rôti..."
                leftIcon={<Search className="w-4 h-4 text-ios-label-secondary" />}
              />
            </div>
            <Button
              variant="primary"
              onClick={handleSearch}
              isLoading={isLoading}
              disabled={!searchQuery.trim()}
            >
              Rechercher
            </Button>
          </div>

          {/* Message d'erreur */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Loader */}
          {isLoading && (
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          )}

          {/* Grille d'images */}
          {!isLoading && images.length > 0 && (
            <div className="max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {images.map((image) => (
                  <button
                    key={image.id}
                    type="button"
                    onClick={() => handleSelectImage(image.imageUrl)}
                    className={`
                      relative group overflow-hidden rounded-2xl corner-squircle
                      transition-all duration-ios-normal
                      ${selectedImageUrl === image.imageUrl
                        ? 'ring-4 ring-ios-pink shadow-ios-lg scale-95'
                        : 'hover:scale-95 hover:shadow-ios-md'
                      }
                    `}
                  >
                    <div className="aspect-square relative">
                      <img
                        src={image.thumbnailUrl || image.imageUrl}
                        alt={image.altText}
                        className="w-full h-full object-cover"
                      />

                      {/* Overlay au survol */}
                      <div className={`
                        absolute inset-0 bg-black/40 flex items-center justify-center
                        transition-opacity duration-ios-normal
                        ${selectedImageUrl === image.imageUrl ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
                      `}>
                        {selectedImageUrl === image.imageUrl ? (
                          <div className="w-12 h-12 bg-ios-pink rounded-full flex items-center justify-center">
                            <Check className="w-6 h-6 text-white" />
                          </div>
                        ) : (
                          <div className="text-white text-center px-2">
                            <p className="text-xs font-medium line-clamp-2">{image.title}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Message initial */}
          {!isLoading && images.length === 0 && !error && (
            <div className="py-12 text-center">
              <Search className="w-12 h-12 text-ios-label-quaternary mx-auto mb-3" />
              <p className="text-sm text-ios-label-secondary">
                Recherchez des images culinaires sur Pinterest
              </p>
              <p className="text-xs text-ios-label-tertiary mt-1">
                Tapez un mot-clé et appuyez sur Entrée
              </p>
            </div>
          )}

          {/* Boutons d'action */}
          {images.length > 0 && (
            <div className="flex gap-3 pt-2 border-t border-ios-separator">
              <Button
                variant="secondary"
                onClick={handleClose}
                fullWidth
              >
                Annuler
              </Button>
              <Button
                variant="primary"
                onClick={handleConfirm}
                disabled={!selectedImageUrl}
                fullWidth
                leftIcon={<Check className="w-4 h-4" />}
              >
                Utiliser cette image
              </Button>
            </div>
          )}

          {/* Info */}
          <div className="p-3 bg-ios-bg-tertiary rounded-2xl">
            <p className="text-xs text-ios-label-secondary">
              💡 Les images sont au format haute résolution (1200px) pour une meilleure qualité
            </p>
          </div>
        </div>
      </Modal>
    </>
  )
}
