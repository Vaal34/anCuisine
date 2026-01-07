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
    compact?: boolean | 'mini'
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

                {isComplete ? (
                    <button
                        onClick={onReset}
                        className="p-1 rounded-full hover:bg-white/20"
                    >
                        <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                ) : (
                    <button
                        onClick={onToggle}
                        className={cn(
                            "p-1 rounded-full text-white",
                            timer.isRunning ? "bg-ios-pink" : "bg-ios-label-secondary"
                        )}
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
                        isComplete ? "bg-ios-green" : "bg-ios-pink"
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
