import React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  containerClassName?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, containerClassName, className, ...props }, ref) => {
    return (
      <div className={cn('w-full', containerClassName)}>
        {label && (
          <label className="block text-ios-label text-sm font-semibold mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-ios-label-tertiary">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full px-4 py-3 sm:py-3 bg-ios-bg-tertiary rounded-3xl text-ios-label placeholder:text-ios-label-tertiary',
              'focus:bg-ios-bg-secondary focus:ring-2 focus:ring-ios-pink transition-all duration-ios-fast outline-none',
              'text-base', // Prevent zoom on iOS
              error && 'ring-2 ring-ios-red focus:ring-ios-red',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-ios-label-tertiary">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="text-ios-red text-xs mt-1">{error}</p>}
        {helperText && !error && <p className="text-ios-label-tertiary text-xs mt-1">{helperText}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
