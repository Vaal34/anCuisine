import React from 'react'
import { Timer, RotateCcw, Play, Pause } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { RecipeStep } from '@/types'

export interface TimerState {
    remainingSeconds: number
    isRunning: boolean
    hasStarted: boolean
}

interface RecipeTimerProps {
    timer: TimerState
    stepObj: RecipeStep | null
    onToggle: () => void
    onReset: () => void
    formatTime: (seconds: number) => string
    compact?: boolean | 'mini' | 'sidebar'
}

export function RecipeTimer({
    timer,
    stepObj,
    onToggle,
    onReset,
    formatTime,
    compact = false
}: RecipeTimerProps) {
    const hasTimer = stepObj?.timerMinutes && stepObj.timerMinutes > 0
    if (!hasTimer) return null

    const isComplete = timer.remainingSeconds === 0
    const totalSeconds = (stepObj?.timerMinutes ?? 0) * 60
    const progress = totalSeconds > 0 ? ((totalSeconds - timer.remainingSeconds) / totalSeconds) * 100 : 0

    // Variante Sidebar (Desktop)
    if (compact === 'sidebar') {
        return (
            <div className="bg-white rounded-3xl shadow-ios-md p-5">
                {/* Header */}
                <div className="flex items-center gap-2 mb-4">
                    <div className={cn(
                        "flex items-center justify-center rounded-full w-9 h-9 flex-shrink-0",
                        isComplete ? "bg-ios-green" : "bg-accent"
                    )}>
                        <Timer className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-semibold text-ios-label">
                        {stepObj?.timerLabel || 'Minuteur'}
                    </span>

                    {/* Reset button in header */}
                    {timer.hasStarted && !isComplete && (
                        <button
                            onClick={onReset}
                            className="ml-auto p-2 rounded-xl hover:bg-ios-bg text-ios-label-secondary transition-colors"
                            aria-label="Réinitialiser"
                        >
                            <RotateCcw className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Timer row */}
                <div className="flex items-center gap-4">
                    <div className={cn(
                        "text-3xl font-bold tabular-nums flex-1",
                        isComplete ? "text-ios-green" : "text-ios-label"
                    )}>
                        {formatTime(timer.remainingSeconds)}
                    </div>

                    {/* Contrôle */}
                    {isComplete ? (
                        <button
                            onClick={onReset}
                            className="p-3 rounded-xl bg-ios-green text-white"
                            aria-label="Recommencer"
                        >
                            <RotateCcw className="w-5 h-5" />
                        </button>
                    ) : (
                        <button
                            onClick={onToggle}
                            className={cn(
                                "p-3 rounded-xl text-white transition-colors",
                                timer.isRunning ? "bg-accent/70" : "bg-accent"
                            )}
                            aria-label={timer.isRunning ? "Pause" : "Démarrer"}
                        >
                            {timer.isRunning ? (
                                <Pause className="w-5 h-5 fill-current" />
                            ) : (
                                <Play className="w-5 h-5 fill-current" />
                            )}
                        </button>
                    )}
                </div>

                {/* Barre de progression */}
                <div className="w-full h-1.5 bg-ios-bg rounded-full overflow-hidden mt-4">
                    <div
                        className={cn(
                            "h-full rounded-full transition-all duration-1000",
                            isComplete ? "bg-ios-green" : "bg-accent"
                        )}
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>
        )
    }

    // Variante Mini (Header Mobile)
    if (compact === 'mini') {
        return (
            <div className={cn(
                "flex items-center gap-2 pl-3 pr-1 py-1 rounded-full border transition-all",
                isComplete
                    ? "bg-ios-green border-ios-green text-white"
                    : "bg-ios-bg border-ios-separator text-ios-label"
            )}>
                {stepObj?.timerLabel && (
                    <span className="text-[10px] uppercase tracking-wider font-semibold opacity-70 mr-1.5 max-w-[80px] truncate">
                        {stepObj.timerLabel}
                    </span>
                )}
                <span className="text-xs font-bold tabular-nums min-w-[32px] text-center">
                    {formatTime(timer.remainingSeconds)}
                </span>

                {/* Bouton Reset - visible si le timer a démarré et n'est pas terminé */}
                {timer.hasStarted && !isComplete && (
                    <button
                        onClick={onReset}
                        className="p-1 rounded-full hover:bg-ios-separator/50 text-ios-label-tertiary"
                        aria-label="Réinitialiser le minuteur"
                    >
                        <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                )}

                {isComplete ? (
                    <button
                        onClick={onReset}
                        className="p-1 rounded-full hover:bg-white/20"
                        aria-label="Recommencer le minuteur"
                    >
                        <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                ) : (
                    <button
                        onClick={onToggle}
                        className={cn(
                            "p-1 rounded-full text-white",
                            timer.isRunning ? "bg-accent" : "bg-ios-label-secondary"
                        )}
                        aria-label={timer.isRunning ? "Pause" : "Démarrer"}
                    >
                        {timer.isRunning ? (
                            <Pause className="w-3 h-3 fill-current" />
                        ) : (
                            <Play className="w-3 h-3 fill-current" />
                        )}
                    </button>
                )}
            </div>
        )
    }

    return (
        <div className={cn(
            "bg-white rounded-3xl shadow-ios-md overflow-hidden",
            compact ? "p-4" : "p-5"
        )}>
            {/* Header avec label */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className={cn(
                        "flex items-center justify-center rounded-2xl",
                        isComplete ? "bg-ios-green" : "bg-accent",
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
                        onClick={onReset}
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
                        isComplete ? "bg-ios-green" : "bg-accent"
                    )}
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Controls */}
            <div className="flex gap-3">
                {isComplete ? (
                    <button
                        onClick={onReset}
                        className={cn(
                            "flex-1 flex items-center justify-center gap-2 rounded-2xl",
                            "bg-ios-green text-white font-semibold transition-all active:scale-[0.98]",
                            compact ? "py-3 text-base" : "py-4 text-lg"
                        )}
                    >
                        <RotateCcw className="w-5 h-5" />
                        Recommencer
                    </button>
                ) : (
                    <button
                        onClick={onToggle}
                        className={cn(
                            "flex-1 flex items-center justify-center gap-2 rounded-2xl",
                            "font-semibold transition-all active:scale-[0.98]",
                            timer.isRunning
                                ? "bg-accent/50 text-white"
                                : "bg-accent text-white",
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
