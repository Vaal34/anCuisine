import React from 'react'
import { cn } from '@/lib/utils'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
  containerClassName?: string
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, containerClassName, className, ...props }, ref) => {
    return (
      <div className={cn('w-full', containerClassName)}>
        {label && (
          <label className="block text-ios-label text-sm font-semibold mb-2">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn(
            'w-full px-4 py-3 bg-ios-bg-tertiary rounded-3xl text-ios-label placeholder:text-ios-label-tertiary',
            'focus:bg-ios-bg-secondary focus:ring-2 focus:ring-ios-pink transition-all duration-ios-fast outline-none resize-none',
            'text-base', // Prevent zoom on iOS
            error && 'ring-2 ring-ios-red focus:ring-ios-red',
            className
          )}
          {...props}
        />
        {error && <p className="text-ios-red text-xs mt-1">{error}</p>}
        {helperText && !error && <p className="text-ios-label-tertiary text-xs mt-1">{helperText}</p>}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
