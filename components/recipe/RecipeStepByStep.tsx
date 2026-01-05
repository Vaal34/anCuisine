'use client'

import React, { useState, useEffect, useCallback } from 'react'
import type { Recipe, RecipeStep } from '@/types'
import { RecipeStepByStepMobile } from './RecipeStepByStepMobile'
import { RecipeStepByStepDesktop } from './RecipeStepByStepDesktop'
import type { TimerState } from './RecipeTimer'

export interface RecipeStepByStepProps {
  recipe: Recipe
  currentStep: number
  onStepChange: (step: number) => void
  onExit: () => void
}

export function RecipeStepByStep({ recipe, currentStep, onStepChange, onExit }: RecipeStepByStepProps) {
  const totalSteps = recipe.steps.length
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === totalSteps - 1

  const currentStepData = recipe.steps[currentStep]
  const stepObj = typeof currentStepData === 'string' ? null : currentStepData as RecipeStep
  const hasTimer = stepObj?.timerMinutes && stepObj.timerMinutes > 0

  // État du minuteur
  const [timer, setTimer] = useState<TimerState>({
    remainingSeconds: hasTimer ? (stepObj?.timerMinutes ?? 0) * 60 : 0,
    isRunning: false,
    hasStarted: false,
  })

  // State pour les ingrédients cochés
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set())

  // Swipe state pour mobile
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const minSwipeDistance = 50

  // Réinitialiser le minuteur et ingrédients quand on change d'étape
  useEffect(() => {
    const newStepData = recipe.steps[currentStep]
    const newStepObj = typeof newStepData === 'string' ? null : newStepData as RecipeStep
    const newHasTimer = newStepObj?.timerMinutes && newStepObj.timerMinutes > 0

    setTimer({
      remainingSeconds: newHasTimer ? (newStepObj?.timerMinutes ?? 0) * 60 : 0,
      isRunning: false,
      hasStarted: false,
    })

    // Reset checked ingredients
    setCheckedIngredients(new Set())
  }, [currentStep, recipe.steps])

  // Gestion du minuteur
  useEffect(() => {
    if (!timer.isRunning || timer.remainingSeconds <= 0) return

    const interval = setInterval(() => {
      setTimer(prev => {
        const newRemaining = prev.remainingSeconds - 1

        // Notification sonore quand le minuteur se termine
        if (newRemaining === 0) {
          if (typeof window !== 'undefined' && 'Notification' in window) {
            if (Notification.permission === 'granted') {
              new Notification('Minuteur terminé !', {
                body: stepObj?.timerLabel || `Étape ${currentStep + 1} terminée`,
                icon: '/icon.png'
              })
            }
          }
          // Vibration sur mobile
          if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate([200, 100, 200])
          }
        }

        return {
          ...prev,
          remainingSeconds: Math.max(0, newRemaining),
          isRunning: newRemaining > 0,
        }
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [timer.isRunning, timer.remainingSeconds, stepObj?.timerLabel, currentStep])

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const toggleTimer = useCallback(() => {
    setTimer(prev => ({
      ...prev,
      isRunning: !prev.isRunning,
      hasStarted: true,
    }))
  }, [])

  const resetTimer = useCallback(() => {
    setTimer({
      remainingSeconds: hasTimer ? (stepObj?.timerMinutes ?? 0) * 60 : 0,
      isRunning: false,
      hasStarted: false,
    })
  }, [hasTimer, stepObj?.timerMinutes])

  const toggleIngredient = useCallback((index: number) => {
    setCheckedIngredients(prev => {
      const newSet = new Set(prev)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        newSet.add(index)
      }
      return newSet
    })
  }, [])

  // Swipe handlers pour mobile
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe && !isLastStep) {
      onStepChange(currentStep + 1)
    }
    if (isRightSwipe && !isFirstStep) {
      onStepChange(currentStep - 1)
    }
  }

  // Navigation clavier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && !isLastStep) {
        onStepChange(currentStep + 1)
      } else if (e.key === 'ArrowLeft' && !isFirstStep) {
        onStepChange(currentStep - 1)
      } else if (e.key === 'Escape') {
        onExit()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentStep, isFirstStep, isLastStep, onStepChange, onExit])

  const viewProps = {
    recipe,
    currentStep,
    totalSteps,
    isFirstStep,
    isLastStep,
    stepObj,
    currentStepData,
    timer,
    checkedIngredients,
    onStepChange,
    onExit,
    onToggleTimer: toggleTimer,
    onResetTimer: resetTimer,
    onToggleIngredient: toggleIngredient,
    formatTime,
  }

  return (
    <div className="lg:h-screen flex flex-col bg-ios-bg">
      <RecipeStepByStepMobile
        {...viewProps}
        swipeHandlers={{ onTouchStart, onTouchMove, onTouchEnd }}
      />
      <RecipeStepByStepDesktop
        {...viewProps}
      />
    </div>
  )
}
