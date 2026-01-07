'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Timer, Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export interface StepTimerProps {
  durationMinutes: number
  label?: string
  type?: 'prep' | 'cook'
}

export function StepTimer({ durationMinutes, label, type = 'prep' }: StepTimerProps) {
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60) // en secondes
  const [isRunning, setIsRunning] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Créer un audio element pour le son de fin
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZSA0PVK3n77BdGAg+mejy2IY0Bx1rwO/mnkwPD1Gs6O+wXBgHPpnp8tiGNAcda8Dv5p5MDw9RrOjvsGwYBz6Z6fLYhjQHHWvA7+aeTBAPUa3o77BsGAc+meny2IY0Bx1rwO/mnkwQD1Gt6O+wbBgHPpnp8tiGNAcda8Dv5p5MEA9Rrejvs2wYBz6Z6fLYhjQHHWvA7+aeTBAPUa3o77NsGAc+meny2IY0Bx1rwO/mnkwQD1Gt6O+zbBgHPpnp8tiGNAcda8Dv5p5MEA9Rrejvs2wYBz6Z6fLYhjQHHWvA7+aeTBAPUa3o77NsGAc+meny2IY0Bx1rwO/mnkwQD1Gt6O+zbBgHPpnp8tiGNAcda8Dv5p5MEA9Rrejvs2wYBz6Z6fLYhjQHHWvA7+aeTBAPUa3o77NsGAc=')
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false)
            setIsComplete(true)
            if (soundEnabled && audioRef.current) {
              audioRef.current.play()
            }
            // Vibration sur mobile
            if ('vibrate' in navigator) {
              navigator.vibrate([200, 100, 200])
            }
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, timeLeft, soundEnabled])

  const toggleTimer = () => {
    setIsRunning(!isRunning)
    if (isComplete) {
      setIsComplete(false)
    }
  }

  const resetTimer = () => {
    setIsRunning(false)
    setIsComplete(false)
    setTimeLeft(durationMinutes * 60)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const progress = ((durationMinutes * 60 - timeLeft) / (durationMinutes * 60)) * 100

  // Couleurs selon le type de minuteur
  const colors = {
    prep: {
      bg: 'bg-ios-bg-tertiary',
      border: 'border-ios-separator',
      text: 'text-ios-label',
      icon: 'bg-ios-bg-secondary',
      progress: 'bg-ios-label-secondary'
    },
    cook: {
      bg: 'bg-ios-bg-tertiary',
      border: 'border-ios-separator',
      text: 'text-ios-label',
      icon: 'bg-ios-bg-secondary',
      progress: 'bg-ios-label-secondary'
    }
  }

  const color = colors[type]

  return (
    <div className={`relative p-4 rounded-3xl transition-all duration-ios-normal ${isComplete
        ? 'bg-ios-green/10 border-2 border-ios-green shadow-ios-md'
        : isRunning
          ? `${color.bg} border-2 ${color.border} shadow-ios-md`
          : 'bg-ios-bg-tertiary border-2 border-ios-separator'
      }`}>
      {/* Barre de progression */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-ios-separator rounded-t-3xl overflow-hidden">
        <div
          className={`h-full transition-all duration-1000 ${isComplete ? 'bg-ios-green' : color.progress
            }`}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center gap-3">
        {/* Icône */}
        <div className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center ${isComplete
            ? 'bg-ios-green text-white'
            : isRunning
              ? `${color.icon} text-white`
              : `bg-ios-bg-secondary ${color.text}`
          }`}>
          <Timer className="w-6 h-6" />
        </div>

        {/* Informations */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            {label && (
              <div className="text-xs sm:text-sm text-ios-label-secondary font-medium">
                {label}
              </div>
            )}
            <span className="text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full bg-ios-bg-secondary text-ios-label flex items-center gap-1">
              <span>{type === 'cook' ? '🔥' : '🥄'}</span>
              <span>{type === 'cook' ? 'Cuisson' : 'Préparation'}</span>
            </span>
          </div>
          <div className={`text-2xl sm:text-3xl font-bold tabular-nums ${isComplete
              ? 'text-ios-green'
              : isRunning
                ? color.text
                : 'text-ios-label'
            }`}>
            {formatTime(timeLeft)}
          </div>
          {isComplete && (
            <div className="text-xs sm:text-sm text-ios-green font-medium mt-0.5">
              Terminé !
            </div>
          )}
        </div>

        {/* Contrôles */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTimer}
            className={`p-3 rounded-2xl transition-all duration-ios-fast ${isComplete
                ? 'bg-ios-green text-white hover:bg-ios-green/90'
                : isRunning
                  ? `${color.icon} text-white hover:opacity-90`
                  : `${color.icon} text-white hover:opacity-90`
              }`}
          >
            {isRunning ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5" />
            )}
          </button>

          <button
            type="button"
            onClick={resetTimer}
            className="p-3 rounded-2xl bg-ios-bg-secondary text-ios-label-secondary hover:bg-ios-bg-tertiary transition-all duration-ios-fast"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-3 rounded-2xl bg-ios-bg-secondary text-ios-label-secondary hover:bg-ios-bg-tertiary transition-all duration-ios-fast"
          >
            {soundEnabled ? (
              <Volume2 className="w-5 h-5" />
            ) : (
              <VolumeX className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
