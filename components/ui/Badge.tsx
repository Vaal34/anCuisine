import React from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps {
  children: React.ReactNode
  variant?: 'recipe' | 'blue' | 'green' | 'orange' | 'red' | 'gray'
  className?: string
}

export function Badge({ children, variant = 'recipe', className }: BadgeProps) {
  const variantStyles = {
    recipe: 'bg-recipe-primary text-white',
    blue: 'bg-ios-pink text-white',
    green: 'bg-ios-green text-white',
    orange: 'bg-ios-orange text-white',
    red: 'bg-ios-red text-white',
    gray: 'bg-ios-bg-tertiary text-ios-label-secondary',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-1 rounded-xl corner-squircle text-xs font-semibold',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
