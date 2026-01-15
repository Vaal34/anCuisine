import React, { useRef } from 'react'
import { X, ChevronLeft, ChevronRight, Clock } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import type { Recipe, RecipeStep } from '@/types'
import { RecipeTimer, type TimerState } from './RecipeTimer'
import { RecipeIngredientsList } from './RecipeIngredientsList'

interface RecipeStepByStepMobileProps {
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
    swipeHandlers: {
        onTouchStart: (e: React.TouchEvent) => void
        onTouchMove: (e: React.TouchEvent) => void
        onTouchEnd: () => void
    }
}

export function RecipeStepByStepMobile({
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
    formatTime,
    swipeHandlers
}: RecipeStepByStepMobileProps) {
    const containerRef = useRef<HTMLDivElement>(null)

    return (
        <div className="lg:hidden flex flex-col h-full bg-white text-ios-label">
            {/* Header Mobile - Stories Progress Bar + Top Controls */}
            <header className="sticky top-0 z-20 flex-shrink-0 pt- bezpeč-top bg-white border-b border-ios-separator">
                {/* Progress Bar Container */}
                <div className="px-2 pt-2 pb-4">
                    <div className="flex gap-1 h-1">
                        {recipe.steps.map((_, index) => (
                            <div
                                key={index}
                                className={cn(
                                    "flex-1 rounded-full transition-all duration-300",
                                    index < currentStep
                                        ? "bg-accent"
                                        : index === currentStep
                                            ? "bg-accent"
                                            : "bg-ios-separator"
                                )}
                            />
                        ))}
                    </div>
                </div>

                {/* Top Controls Row */}
                <div className="px-4 pb-2 flex items-center justify-between">
                    <button
                        onClick={onExit}
                        className="p-2 -ml-2 rounded-full hover:bg-ios-bg-secondary transition-colors text-ios-label-secondary"
                        aria-label="Quitter"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <div className="text-sm font-semibold tracking-wide text-ios-label-secondary uppercase">
                        Étape {currentStep + 1}/{totalSteps}
                    </div>

                    {/* Timer Mini */}
                    {stepObj?.timerMinutes && stepObj?.timerMinutes > 0 ? (
                        <div className="animate-in slide-in-from-right-4 fade-in duration-500">
                            <RecipeTimer
                                timer={timer}
                                stepObj={stepObj}
                                onToggle={onToggleTimer}
                                onReset={onResetTimer}
                                formatTime={formatTime}
                                compact="mini"
                            />
                        </div>
                    ) : (
                        <div className="w-10" />
                    )}
                </div>
            </header>

            {/* Main Content Area - Scrollable */}
            <div
                ref={containerRef}
                className="flex-1 overflow-y-auto px-6 py-4 flex flex-col"
                onTouchStart={swipeHandlers.onTouchStart}
                onTouchMove={swipeHandlers.onTouchMove}
                onTouchEnd={swipeHandlers.onTouchEnd}
            >


                {/* Instructions */}
                <div className="flex-1 flex flex-col justify-center min-h-[40vh]">
                    <h2 className="text-xl md:text-2xl font-medium leading-relaxed text-ios-label tracking-tight">
                        {typeof currentStepData === 'string'
                            ? currentStepData
                            : currentStepData.description}
                    </h2>
                </div>

                {/* Ingrédients - Section séparée en bas */}
                <div className="mt-8 pt-8 border-t border-dash border-ios-separator">
                    <RecipeIngredientsList
                        recipe={recipe}
                        stepObj={stepObj}
                        checkedIngredients={checkedIngredients}
                        onToggleIngredient={onToggleIngredient}
                        variant="mobile"
                    />
                </div>

                {/* Bottom Spacer for safe scroll */}
                <div className="h-4" />
            </div>

            {/* Footer Controls - Fixed Bottom */}
            <footer className="sticky bottom-0 z-20 flex-shrink-0 p-4 bg-white border-t border-ios-separator">
                <div className="flex items-stretch gap-4 h-14">
                    {/* Previous Button - Smaller */}
                    <Button
                        variant="secondary"
                        // size="lg" remove size to use custom classes
                        onClick={() => onStepChange(currentStep - 1)}
                        disabled={isFirstStep}
                        className={cn(
                            "w-14 px-0 flex items-center justify-center rounded-2xl",
                            isFirstStep ? "opacity-0 pointer-events-none" : "opacity-100"
                        )}
                        aria-label="Étape précédente"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </Button>

                    {/* Next/Finish Button - Prominent */}
                    <Button
                        variant="primary"
                        // size="lg"
                        onClick={() => {
                            if (isLastStep) {
                                onExit()
                            } else {
                                onStepChange(currentStep + 1)
                            }
                        }}
                        className="flex-1 rounded-2xl text-lg font-bold shadow-ios-lg active:scale-[0.98] transition-transform"
                    >
                        {isLastStep ? (
                            <span className="flex items-center gap-2">
                                <Check className="w-6 h-6" /> Terminer
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                Suivant <ChevronRight className="w-6 h-6" />
                            </span>
                        )}
                    </Button>
                </div>
            </footer>
        </div>
    )
}

// Icon helper
function Check(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M20 6 9 17l-5-5" />
        </svg>
    )
}
