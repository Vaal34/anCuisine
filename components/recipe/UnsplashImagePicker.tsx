'use client'

import React, { useState } from 'react'
import { Search, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Spinner } from '@/components/ui/Spinner'

interface UnsplashImage {
  id: string
  title: string
  description: string
  imageUrl: string
  thumbnailUrl: string
  link: string
  altText: string
  author: string
  authorUsername: string
}

interface UnsplashImagePickerProps {
  onSelect: (imageUrl: string) => void
  currentImageUrl?: string
}

export function UnsplashImagePicker({ onSelect }: UnsplashImagePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [images, setImages] = useState<UnsplashImage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null)

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/unsplash/search?q=${encodeURIComponent(searchQuery)}&limit=20`)

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
      e.preventDefault()
      e.stopPropagation()
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
        Rechercher sur Unsplash
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title="Rechercher sur Unsplash"
        size="lg"
        disableContentScroll
      >
        <div className="flex flex-col h-[70vh] sm:h-[75vh]">
          {/* Barre de recherche - sticky en haut */}
          <div className="flex-shrink-0 pb-3 sm:pb-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ex: tarte aux pommes..."
                  leftIcon={<Search className="w-4 h-4 text-ios-label-secondary" />}
                />
              </div>
              <Button
                variant="primary"
                onClick={handleSearch}
                isLoading={isLoading}
                disabled={!searchQuery.trim()}
                className="aspect-square w-auto px-0 sm:px-4 sm:aspect-auto flex items-center justify-center"
              >
                <Search className="w-4 h-4 sm:hidden" />
                <span className="hidden sm:inline">Rechercher</span>
              </Button>
            </div>

            {/* Message d'erreur */}
            {error && (
              <div className="p-3 sm:p-4 bg-red-50 border border-red-200 rounded-2xl mt-2 sm:mt-3">
                <p className="text-xs sm:text-sm text-red-600">{error}</p>
              </div>
            )}
          </div>

          {/* Zone scrollable du contenu */}
          <div className="flex-1 overflow-y-auto -mx-4 sm:-mx-6 px-4 sm:px-6 py-1">
            {/* Loader */}
            {isLoading && (
              <div className="flex justify-center py-8 sm:py-12">
                <Spinner size="lg" />
              </div>
            )}

            {/* Grille d'images */}
            {!isLoading && images.length > 0 && (
              <div className="grid grid-cols-2 gap-2 sm:gap-3 pb-4">
                {images.map((image) => (
                  <button
                    key={image.id}
                    type="button"
                    onClick={() => handleSelectImage(image.imageUrl)}
                    className={`
                      relative group overflow-hidden rounded-xl sm:rounded-2xl
                      transition-shadow duration-200
                      ${selectedImageUrl === image.imageUrl
                        ? 'ring-2 sm:ring-4 ring-ios-pink shadow-lg'
                        : 'hover:shadow-md active:scale-95'
                      }
                    `}
                  >
                    <div className="aspect-square relative">
                      <img
                        src={image.thumbnailUrl || image.imageUrl}
                        alt={image.altText}
                        className="w-full h-full object-cover"
                      />

                      {/* Overlay - toujours visible sur mobile si sélectionné, au survol sur desktop */}
                      <div className={`
                        absolute inset-0 bg-black/40 flex items-center justify-center
                        transition-opacity duration-150
                        ${selectedImageUrl === image.imageUrl ? 'opacity-100' : 'opacity-0 sm:group-hover:opacity-100'}
                      `}>
                        {selectedImageUrl === image.imageUrl ? (
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-ios-pink rounded-full flex items-center justify-center">
                            <Check className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                          </div>
                        ) : (
                          <div className="text-white text-center px-2 hidden sm:block">
                            <p className="text-xs font-medium line-clamp-2">{image.title}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Message initial */}
            {!isLoading && images.length === 0 && !error && (
              <div className="py-8 sm:py-12 text-center px-4">
                <Search className="w-10 h-10 sm:w-12 sm:h-12 text-ios-label-quaternary mx-auto mb-2 sm:mb-3" />
                <p className="text-xs sm:text-sm text-ios-label-secondary">
                  Recherchez des images culinaires gratuites
                </p>
                <p className="text-xs text-ios-label-tertiary mt-1">
                  Tapez un mot-clé et appuyez sur Entrée
                </p>
              </div>
            )}
          </div>

          {/* Boutons d'action - sticky en bas */}
          <div className="flex-shrink-0 pt-3 sm:pt-4 border-t border-ios-separator space-y-2 sm:space-y-3 bg-ios-bg-secondary">
            {/* Info */}
            <div className="p-2 sm:p-3 bg-ios-bg-tertiary rounded-xl sm:rounded-2xl">
              <p className="text-xs text-ios-label-secondary">
                📸 Images gratuites fournies par Unsplash
              </p>
            </div>

            {/* Boutons */}
            <div className="flex gap-2 sm:gap-3">
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
                leftIcon={<Check className="w-3 h-3 sm:w-4 sm:h-4" />}
              >
                <span className="sm:hidden">OK</span>
                <span className="hidden sm:inline">Utiliser</span>
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}
