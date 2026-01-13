'use client'

import { useCallback, useEffect, useRef } from 'react'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'

export interface UseSpeechInputOptions {
  /** Callback appelé quand le texte change */
  onTranscript?: (text: string) => void
  /** Ajouter au texte existant plutôt que remplacer */
  appendMode?: boolean
  /** Texte existant (utilisé en mode append) */
  currentValue?: string
  /** Langue pour la reconnaissance (défaut: fr-FR) */
  language?: string
}

export interface UseSpeechInputReturn {
  /** Démarre l'écoute */
  startListening: () => void
  /** Arrête l'écoute */
  stopListening: () => void
  /** Bascule l'écoute */
  toggleListening: () => void
  /** Est-ce que le micro écoute */
  isListening: boolean
  /** Le texte transcrit */
  transcript: string
  /** Réinitialise le transcript */
  resetTranscript: () => void
  /** Le navigateur supporte-t-il la reconnaissance vocale */
  isSupported: boolean
  /** Le micro est-il disponible */
  isMicrophoneAvailable: boolean
}

export function useSpeechInput(options: UseSpeechInputOptions = {}): UseSpeechInputReturn {
  const {
    onTranscript,
    appendMode = false,
    currentValue = '',
    language = 'fr-FR'
  } = options

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable
  } = useSpeechRecognition()

  // Garder le texte initial au moment du démarrage
  const initialValueRef = useRef('')
  // Garder trace du dernier transcript envoyé pour éviter les doublons
  const lastSentRef = useRef('')

  // Mettre à jour le champ seulement avec le transcript complet de la bibliothèque
  // Le transcript contient déjà finalTranscript + interimTranscript correctement
  useEffect(() => {
    if (listening && onTranscript && transcript) {
      // Normaliser le texte : minuscules avec majuscule en début de phrase
      let normalized = transcript.toLowerCase()
      normalized = normalized.charAt(0).toUpperCase() + normalized.slice(1)
      normalized = normalized.replace(/([.!?]\s*)([a-zàâäéèêëïîôùûüç])/g, (_, punctuation, letter) =>
        punctuation + letter.toUpperCase()
      )

      const fullText = appendMode
        ? initialValueRef.current + (initialValueRef.current && !initialValueRef.current.endsWith(' ') ? ' ' : '') + normalized
        : normalized

      // Éviter les mises à jour en boucle si le texte n'a pas changé
      if (fullText !== lastSentRef.current) {
        lastSentRef.current = fullText
        onTranscript(fullText)
      }
    }
  }, [transcript, listening, onTranscript, appendMode])

  // Réinitialiser
  const handleReset = useCallback(() => {
    resetTranscript()
  }, [resetTranscript])

  const startListening = useCallback(() => {
    // Capturer la valeur actuelle au démarrage
    initialValueRef.current = currentValue
    lastSentRef.current = ''
    handleReset()
    SpeechRecognition.startListening({
      continuous: true,
      language
    })
  }, [handleReset, language, currentValue])

  const stopListening = useCallback(() => {
    SpeechRecognition.stopListening()
  }, [])

  const toggleListening = useCallback(() => {
    if (listening) {
      stopListening()
    } else {
      startListening()
    }
  }, [listening, startListening, stopListening])

  return {
    startListening,
    stopListening,
    toggleListening,
    isListening: listening,
    transcript,
    resetTranscript: handleReset,
    isSupported: browserSupportsSpeechRecognition,
    isMicrophoneAvailable
  }
}
