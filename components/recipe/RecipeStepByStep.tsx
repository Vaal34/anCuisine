'use client'

import React from 'react'
import { ArrowLeft, ArrowRight, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import type { Recipe } from '@/types'

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

  return (
    <div className="min-h-screen flex flex-col bg-ios-bg">
      {/* Header sticky */}
      <header className="bg-ios-bg-secondary/80 backdrop-blur-lg border-b border-ios-separator sticky top-0 z-10 shadow-ios-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-4xl">
          <Button variant="ghost" onClick={onExit} leftIcon={<X className="w-5 h-5" />} size="sm">
            Quitter
          </Button>
          <h1 className="text-lg font-semibold text-ios-label truncate mx-4">{recipe.title}</h1>
          <div className="text-ios-label-secondary font-semibold text-sm whitespace-nowrap">
            {currentStep + 1} / {totalSteps}
          </div>
        </div>
      </header>

      {/* Étape actuelle (grand texte, centré) */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <Card className="max-w-3xl w-full p-8 sm:p-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-ios-pink text-white rounded-3xl corner-squircle text-2xl font-bold mb-4">
              {currentStep + 1}
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-ios-label mb-4">
              Étape {currentStep + 1}
            </h2>
          </div>

          <p className="text-xl sm:text-2xl text-ios-label text-center leading-relaxed">
            {typeof recipe.steps[currentStep] === 'string'
              ? recipe.steps[currentStep]
              : recipe.steps[currentStep].description}
          </p>
        </Card>
      </div>

      {/* Footer sticky avec gros boutons */}
      <footer className="bg-ios-bg-secondary border-t border-ios-separator sticky bottom-0 shadow-ios-md">
        <div className="container mx-auto px-4 py-4 sm:py-6 flex gap-4 max-w-4xl">
          <Button
            variant="secondary"
            size="lg"
            fullWidth
            disabled={isFirstStep}
            onClick={() => onStepChange(currentStep - 1)}
            leftIcon={<ArrowLeft className="w-5 h-5" />}
          >
            Précédent
          </Button>

          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => {
              if (isLastStep) {
                onExit()
              } else {
                onStepChange(currentStep + 1)
              }
            }}
            rightIcon={!isLastStep ? <ArrowRight className="w-5 h-5" /> : undefined}
          >
            {isLastStep ? 'Terminer' : 'Suivant'}
          </Button>
        </div>
      </footer>
    </div>
  )
}
