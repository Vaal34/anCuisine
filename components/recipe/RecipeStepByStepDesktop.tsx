import React from 'react'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/utils'
import type { Recipe, RecipeStep } from '@/types'
import { RecipeTimer, type TimerState } from './RecipeTimer'
import { RecipeIngredientsList } from './RecipeIngredientsList'

interface RecipeStepByStepDesktopProps {
    recipe: Recipe
    currentStep: number
    totalSteps: number
    isFirstStep: boolean
    isLastStep: boolean
    stepObj: RecipeStep | null
    currentStepData: string | RecipeStep
    timer: TimerState
    checkedIngredients: Set<number>
    onStepChange: (step: number) => void
    onExit: () => void
    onToggleTimer: () => void
    onResetTimer: () => void
    onToggleIngredient: (index: number) => void
    formatTime: (seconds: number) => string
}

export function RecipeStepByStepDesktop({
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
    onToggleTimer,
    onResetTimer,
    onToggleIngredient,
    formatTime
}: RecipeStepByStepDesktopProps) {
    const hasTimer = stepObj?.timerMinutes && stepObj.timerMinutes > 0

    return (
        <div className="hidden lg:flex h-screen w-full">
            {/* Sidebar Timeline */}
            <aside className="w-64 bg-white border-r border-ios-separator flex flex-col h-full flex-shrink-0">
                {/* Header Sidebar */}
                <div className="p-4 border-b border-ios-separator">
                    <button
                        onClick={onExit}
                        className="flex items-center gap-2 text-accent font-medium text-sm hover:opacity-80 transition-opacity"
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
                                                    ? "bg-accent/10"
                                                    : "hover:bg-ios-bg-tertiary"
                                            )}
                                        >
                                            {/* Circle indicator */}
                                            <div className={cn(
                                                "relative z-10 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all",
                                                isCompleted
                                                    ? "bg-accent text-white"
                                                    : isCurrent
                                                        ? "bg-white border-2 border-accent"
                                                        : "bg-white border-2 border-ios-separator"
                                            )}>
                                                {isCompleted ? (
                                                    <Check className="w-3.5 h-3.5" />
                                                ) : (
                                                    <span className={cn(
                                                        "text-xs font-bold",
                                                        isCurrent ? "text-accent" : "text-ios-label-secondary"
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
                                                        ? "font-semibold text-accent"
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
                        <span className="font-semibold text-accent">
                            {Math.round(((currentStep + 1) / totalSteps) * 100)}%
                        </span>
                    </div>
                    <div className="w-full bg-ios-separator/30 rounded-full h-2 overflow-hidden">
                        <div
                            className="h-full bg-accent transition-all duration-300"
                            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                        />
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col bg-ios-bg h-full overflow-hidden">
                {/* Header Desktop */}
                <header className="bg-white/80 border-b border-ios-separator px-8 py-4 flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="inline-flex items-center gap-1 bg-accent/10 px-4 py-2 rounded-2xl">
                                <span className="text-accent font-bold">Étape {currentStep + 1}</span>
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
                            <div className="h-full bg-white rounded-2xl shadow-ios-md p-6 flex flex-col min-h-0">
                                {/* Instruction - scrollable */}
                                <div className="flex-1 overflow-y-auto min-h-0">
                                    <p className="text-lg text-ios-label leading-relaxed">
                                        {typeof currentStepData === 'string'
                                            ? currentStepData
                                            : currentStepData.description}
                                    </p>
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
                        <div className="flex-[2] flex flex-col min-w-0 min-h-0 gap-6">
                            {/* Timer - taille fixe */}
                            <div className="flex-shrink-0">
                                <RecipeTimer
                                    timer={timer}
                                    stepObj={stepObj}
                                    onToggle={onToggleTimer}
                                    onReset={onResetTimer}
                                    formatTime={formatTime}
                                />
                            </div>

                            {/* Ingrédients - avec scroll interne */}
                            <div className="flex-1 min-h-0">
                                <RecipeIngredientsList
                                    recipe={recipe}
                                    stepObj={stepObj}
                                    checkedIngredients={checkedIngredients}
                                    onToggleIngredient={onToggleIngredient}
                                />

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
    )
}
