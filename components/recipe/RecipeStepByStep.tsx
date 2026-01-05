'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { ArrowLeft, ArrowRight, X, Play, Pause, RotateCcw, Check, ChevronLeft, ChevronRight, Timer } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import type { Recipe, RecipeStep } from '@/types'
import { cn } from '@/lib/utils'

export interface RecipeStepByStepProps {
  recipe: Recipe
  currentStep: number
  onStepChange: (step: number) => void
  onExit: () => void
}

interface TimerState {
  remainingSeconds: number
  isRunning: boolean
  hasStarted: boolean
}

export function RecipeStepByStep({ recipe, currentStep, onStepChange, onExit }: RecipeStepByStepProps) {
  const totalSteps = recipe.steps.length
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === totalSteps - 1
  const containerRef = useRef<HTMLDivElement>(null)

  const currentStepData = recipe.steps[currentStep]
  const stepObj = typeof currentStepData === 'string' ? null : currentStepData as RecipeStep
  const hasTimer = stepObj?.timerMinutes && stepObj.timerMinutes > 0

  // État du minuteur
  const [timer, setTimer] = useState<TimerState>({
    remainingSeconds: hasTimer ? (stepObj?.timerMinutes ?? 0) * 60 : 0,
    isRunning: false,
    hasStarted: false,
  })

  // Swipe state pour mobile
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const minSwipeDistance = 50

  // Réinitialiser le minuteur quand on change d'étape
  useEffect(() => {
    const newStepData = recipe.steps[currentStep]
    const newStepObj = typeof newStepData === 'string' ? null : newStepData as RecipeStep
    const newHasTimer = newStepObj?.timerMinutes && newStepObj.timerMinutes > 0

    setTimer({
      remainingSeconds: newHasTimer ? (newStepObj?.timerMinutes ?? 0) * 60 : 0,
      isRunning: false,
      hasStarted: false,
    })
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

  // Composant Timer - Style Widget iOS
  const TimerComponent = ({ compact = false }: { compact?: boolean }) => {
    if (!hasTimer) return null

    const isComplete = timer.remainingSeconds === 0
    const totalSeconds = (stepObj?.timerMinutes ?? 0) * 60
    const progress = totalSeconds > 0 ? ((totalSeconds - timer.remainingSeconds) / totalSeconds) * 100 : 0

    return (
      <div className={cn(
        "bg-white rounded-3xl corner-squircle shadow-ios-md overflow-hidden",
        compact ? "p-4" : "p-5"
      )}>
        {/* Header avec label */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className={cn(
              "flex items-center justify-center rounded-full",
              isComplete ? "bg-ios-green" : "bg-ios-pink",
              compact ? "w-8 h-8" : "w-9 h-9"
            )}>
              <Timer className={cn("text-white", compact ? "w-4 h-4" : "w-5 h-5")} />
            </div>
            <span className={cn(
              "font-semibold text-ios-label",
              compact ? "text-sm" : "text-base"
            )}>
              {stepObj?.timerLabel || 'Minuteur'}
            </span>
          </div>

          {/* Reset button */}
          {timer.hasStarted && (
            <button
              onClick={resetTimer}
              className="text-ios-label-secondary hover:text-ios-label transition-colors p-1"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Timer display - centré et grand */}
        <div className="text-center mb-5">
          <div className={cn(
            "font-bold tabular-nums tracking-tight",
            compact ? "text-6xl" : "text-7xl",
            isComplete ? "text-ios-green" : "text-ios-label"
          )}>
            {formatTime(timer.remainingSeconds)}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-ios-bg rounded-full overflow-hidden mb-5">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-1000",
              isComplete ? "bg-ios-green" : "bg-ios-pink"
            )}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Controls */}
        <div className="flex gap-3">
          {isComplete ? (
            <button
              onClick={resetTimer}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 rounded-2xl corner-squircle",
                "bg-ios-green text-white font-semibold transition-all active:scale-[0.98]",
                compact ? "py-3 text-base" : "py-4 text-lg"
              )}
            >
              <RotateCcw className="w-5 h-5" />
              Recommencer
            </button>
          ) : (
            <button
              onClick={toggleTimer}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 rounded-2xl corner-squircle",
                "font-semibold transition-all active:scale-[0.98]",
                timer.isRunning
                  ? "bg-ios-pink/50 text-white"
                  : "bg-ios-pink text-white",
                compact ? "py-3 text-base" : "py-4 text-lg"
              )}
            >
              {timer.isRunning ? (
                <>
                  <Pause fill='#fff' className="w-5 h-5" />
                  Pause
                </>
              ) : (
                <>
                  <Play fill='#fff' className="w-5 h-5" />
                  Démarrer
                </>
              )}
            </button>
          )}
        </div>
      </div>
    )
  }

  // Composant Ingrédients - Style Widget iOS
  const IngredientsComponent = ({ inline = false, compact = false }: { inline?: boolean, compact?: boolean }) => {
    if (!stepObj?.ingredientIndices || stepObj.ingredientIndices.length === 0) return null

    // Version inline pour mobile
    if (inline) {
      return (
        <div className="flex flex-wrap items-center gap-2">
          {stepObj.ingredientIndices.map((index) => {
            const ingredient = recipe.ingredients[index]
            if (!ingredient) return null
            return (
              <span
                key={index}
                className="inline-flex items-center gap-1.5 bg-ios-pink/10 text-ios-pink px-3 py-1.5 rounded-full text-sm font-medium"
              >
                {ingredient.quantity && (
                  <span className="font-semibold">
                    {ingredient.quantity}{ingredient.unit && ` ${ingredient.unit}`}
                  </span>
                )}
                <span>{ingredient.name}</span>
              </span>
            )
          })}
        </div>
      )
    }

    // Version card widget iOS
    return (
      <div className={cn(
        "bg-white rounded-3xl corner-squircle shadow-ios-md overflow-hidden",
        compact ? "p-4" : "p-5"
      )}>
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <div className={cn(
            "flex items-center justify-center rounded-full bg-ios-pink",
            compact ? "w-8 h-8" : "w-9 h-9"
          )}>
            <span className="text-white text-sm font-bold">
              {stepObj.ingredientIndices.length}
            </span>
          </div>
          <span className={cn(
            "font-semibold text-ios-label",
            compact ? "text-sm" : "text-base"
          )}>
            {stepObj.ingredientIndices.length > 1 ? 'Ingrédients' : 'Ingrédient'}
          </span>
        </div>

        {/* Liste des ingrédients */}
        <div className="space-y-2.5">
          {stepObj.ingredientIndices.map((index) => {
            const ingredient = recipe.ingredients[index]
            if (!ingredient) return null
            return (
              <div
                key={index}
                className="flex items-center justify-between gap-3 py-2"
              >
                {/* Nom */}
                <span className="text-ios-label font-medium">
                  {ingredient.name}
                </span>
                {/* Badge quantité */}
                {ingredient.quantity && (
                  <span className="flex-shrink-0 bg-ios-pink/10 text-ios-pink font-semibold px-3 py-1.5 rounded-full text-sm">
                    {ingredient.quantity}{ingredient.unit && ` ${ingredient.unit}`}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-ios-bg">
      {/* ========== MOBILE VIEW (< lg) ========== */}
      <div className="lg:hidden flex flex-col">
        {/* Header Mobile - Barre de progression style stories */}
        <header className="bg-white/80 backdrop-blur-lg border-b border-ios-separator sticky top-0 z-10">
          <div className="px-4 pt-4 pb-3">
            {/* Progress dots */}
            <div className="flex gap-1 mb-3">
              {recipe.steps.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "h-1 flex-1 rounded-full transition-all duration-300",
                    index < currentStep
                      ? "bg-ios-pink"
                      : index === currentStep
                        ? "bg-ios-pink"
                        : "bg-ios-separator"
                  )}
                />
              ))}
            </div>

            {/* Header row */}
            <div className="flex items-center justify-between">
              <button
                onClick={onExit}
                className="flex items-center gap-1.5 text-ios-pink font-medium text-sm"
              >
                <X className="w-5 h-5" />
                <span>Quitter</span>
              </button>
              <span className="text-sm font-semibold text-ios-label">
                {currentStep + 1} / {totalSteps}
              </span>
            </div>
          </div>
        </header>

        {/* Main Content - Swipeable Widgets */}
        <div
          ref={containerRef}
          className="flex-1 px-4 py-4 overflow-y-auto"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div className="space-y-4">
            {/* Widget 1: Instruction principale */}
            <Card className="!p-5">
              {/* Step badge */}
              <div className="inline-flex self-start items-center gap-2 bg-ios-pink/10 px-3 py-1.5 rounded-full mb-4">
                <span className="text-ios-pink font-bold text-sm">Étape {currentStep + 1}</span>
              </div>

              {/* Instruction */}
              <h2 className="text-xl font-bold text-ios-label leading-relaxed">
                {typeof currentStepData === 'string'
                  ? currentStepData
                  : currentStepData.description}
              </h2>
            </Card>

            {/* Widget 2: Timer (si présent) */}
            {hasTimer && (
              <TimerComponent compact />
            )}

            {/* Widget 3: Ingrédients (si présents) */}
            {stepObj?.ingredientIndices && stepObj.ingredientIndices.length > 0 && (
              <IngredientsComponent compact />
            )}
          </div>

          {/* Swipe hint */}
          <div className="text-center mt-4 text-xs text-ios-label-tertiary pb-2">
            ← Swipez pour naviguer →
          </div>
        </div>

        {/* Footer Mobile - Navigation */}
        <footer className="bg-white/80 backdrop-blur-lg border-t border-ios-separator p-4">
          <div className="flex gap-3">
            <Button
              variant="secondary"
              size="md"
              onClick={() => onStepChange(currentStep - 1)}
              disabled={isFirstStep}
              className="flex-1"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                if (isLastStep) {
                  onExit()
                } else {
                  onStepChange(currentStep + 1)
                }
              }}
              className="flex-[2]"
            >
              {isLastStep ? 'Terminer' : 'Suivant'}
              {!isLastStep && <ChevronRight className="w-5 h-5" />}
            </Button>
          </div>
        </footer>
      </div>

      {/* ========== DESKTOP VIEW (>= lg) ========== */}
      <div className="hidden lg:flex h-screen">
        {/* Sidebar Timeline */}
        <aside className="w-64 bg-white border-r border-ios-separator flex flex-col h-full">
          {/* Header Sidebar */}
          <div className="p-4 border-b border-ios-separator">
            <button
              onClick={onExit}
              className="flex items-center gap-2 text-ios-pink font-medium text-sm hover:opacity-80 transition-opacity"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quitter</span>
            </button>
          </div>

          {/* Recipe title */}
          <div className="p-4 border-b border-ios-separator">
            <h1 className="font-bold text-ios-label text-sm line-clamp-2">{recipe.title}</h1>
            <p className="text-xs text-ios-label-secondary mt-1">
              {totalSteps} étapes
            </p>
          </div>

          {/* Steps Timeline */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-3 top-3 bottom-3 w-px bg-ios-separator" />

              <ul className="space-y-1">
                {recipe.steps.map((step, index) => {
                  const isCompleted = index < currentStep
                  const isCurrent = index === currentStep
                  const stepData = typeof step === 'string' ? step : step.description

                  return (
                    <li key={index}>
                      <button
                        onClick={() => onStepChange(index)}
                        className={cn(
                          "w-full flex items-start gap-3 p-2 rounded-xl transition-all text-left",
                          isCurrent
                            ? "bg-ios-pink/10"
                            : "hover:bg-ios-bg-tertiary"
                        )}
                      >
                        {/* Circle indicator */}
                        <div className={cn(
                          "relative z-10 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all",
                          isCompleted
                            ? "bg-ios-pink text-white"
                            : isCurrent
                              ? "bg-white border-2 border-ios-pink"
                              : "bg-white border-2 border-ios-separator"
                        )}>
                          {isCompleted ? (
                            <Check className="w-3.5 h-3.5" />
                          ) : (
                            <span className={cn(
                              "text-xs font-bold",
                              isCurrent ? "text-ios-pink" : "text-ios-label-secondary"
                            )}>
                              {index + 1}
                            </span>
                          )}
                        </div>

                        {/* Step text */}
                        <div className="flex-1 min-w-0 pt-0.5">
                          <p className={cn(
                            "text-sm line-clamp-2",
                            isCurrent
                              ? "font-semibold text-ios-pink"
                              : isCompleted
                                ? "text-ios-label-secondary"
                                : "text-ios-label"
                          )}>
                            {stepData}
                          </p>
                        </div>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          </nav>

          {/* Progress footer */}
          <div className="p-4 border-t border-ios-separator bg-ios-bg">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-ios-label-secondary">Progression</span>
              <span className="font-semibold text-ios-pink">
                {Math.round(((currentStep + 1) / totalSteps) * 100)}%
              </span>
            </div>
            <div className="w-full bg-ios-separator/30 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-ios-pink transition-all duration-300"
                style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col bg-ios-bg h-full overflow-hidden">
          {/* Header Desktop */}
          <header className="bg-white/80 backdrop-blur-lg border-b border-ios-separator px-8 py-4 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center gap-2 bg-ios-pink/10 px-4 py-2 rounded-full">
                  <span className="text-ios-pink font-bold">Étape {currentStep + 1}</span>
                  <span className="text-ios-label-secondary">sur {totalSteps}</span>
                </div>
              </div>

              {/* Navigation buttons */}
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onStepChange(currentStep - 1)}
                  disabled={isFirstStep}
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                >
                  Précédent
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    if (isLastStep) {
                      onExit()
                    } else {
                      onStepChange(currentStep + 1)
                    }
                  }}
                  rightIcon={!isLastStep ? <ArrowRight className="w-4 h-4" /> : undefined}
                >
                  {isLastStep ? 'Terminer' : 'Suivant'}
                </Button>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="flex-1 p-8 flex flex-col min-h-0">
            <div className="max-w-4xl w-full h-full mx-auto flex gap-8 min-h-0">
              {/* Main instruction - gauche */}
              <div className="flex-[3] flex flex-col min-w-0 min-h-0">
                <div className="h-full bg-white rounded-3xl corner-squircle shadow-ios-md p-6 flex flex-col min-h-0">
                  {/* Instruction - scrollable */}
                  <div className="flex-1 overflow-y-auto min-h-0">
                    <h2 className="text-2xl font-bold text-ios-label leading-relaxed">
                      {typeof currentStepData === 'string'
                        ? currentStepData
                        : currentStepData.description}
                    </h2>
                  </div>

                  {/* Keyboard hint - collé en bas */}
                  <div className="flex items-center gap-4 text-xs text-ios-label-tertiary pt-4 border-t border-ios-separator flex-shrink-0">
                    <span className="flex items-center gap-1.5">
                      <kbd className="px-2 py-1 bg-ios-bg rounded text-[10px] font-mono">←</kbd>
                      <kbd className="px-2 py-1 bg-ios-bg rounded text-[10px] font-mono">→</kbd>
                      <span>Navigation</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <kbd className="px-2 py-1 bg-ios-bg rounded text-[10px] font-mono">Esc</kbd>
                      <span>Quitter</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Sidebar - droite - avec scroll interne */}
              <div className="flex-[2] flex flex-col min-w-0 min-h-0">
                <div className="h-full overflow-y-auto flex flex-col gap-6">
                  {/* Timer */}
                  {hasTimer && (
                    <TimerComponent />
                  )}

                  {/* Ingrédients */}
                  {stepObj?.ingredientIndices && stepObj.ingredientIndices.length > 0 && (
                    <IngredientsComponent />
                  )}

                  {/* Placeholder si pas de timer ni ingrédients */}
                  {!hasTimer && (!stepObj?.ingredientIndices || stepObj.ingredientIndices.length === 0) && (
                    <Card>
                      <div className="text-center py-8 text-ios-label-tertiary">
                        <p className="text-sm">Pas d&apos;ingrédients spécifiques</p>
                        <p className="text-xs mt-1">pour cette étape</p>
                      </div>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
