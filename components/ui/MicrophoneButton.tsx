'use client'

import React from 'react'
import { Mic, MicOff } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface MicrophoneButtonProps {
  /** Est-ce que le micro écoute */
  isListening: boolean
  /** Callback pour démarrer/arrêter l'écoute */
  onClick: () => void
  /** Le navigateur supporte-t-il la reconnaissance vocale */
  isSupported?: boolean
  /** Le micro est-il disponible */
  isMicrophoneAvailable?: boolean
  /** Désactivé */
  disabled?: boolean
  /** Taille du bouton */
  size?: 'sm' | 'md'
  /** Classes additionnelles */
  className?: string
}

export function MicrophoneButton({
  isListening,
  onClick,
  isSupported = true,
  isMicrophoneAvailable = true,
  disabled = false,
  size = 'md',
  className
}: MicrophoneButtonProps) {
  // Ne pas afficher si non supporté
  if (!isSupported) {
    return null
  }

  const sizeStyles = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10'
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5'
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || !isMicrophoneAvailable}
      title={
        !isMicrophoneAvailable
          ? 'Microphone non disponible'
          : isListening
            ? 'Arrêter la dictée'
            : 'Dicter avec le micro'
      }
      className={cn(
        'flex items-center justify-center rounded-full transition-all duration-ios-fast',
        'focus:outline-none focus:ring-2 focus-accent focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        sizeStyles[size],
        isListening
          ? 'bg-ios-red text-white animate-pulse shadow-ios-md'
          : 'bg-ios-bg-tertiary text-ios-label-secondary hover:bg-accent hover:text-white',
        className
      )}
    >
      {isListening ? (
        <MicOff className={iconSizes[size]} />
      ) : (
        <Mic className={iconSizes[size]} />
      )}
    </button>
  )
}
