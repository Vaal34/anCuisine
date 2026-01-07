import React from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  helperText?: string
  containerClassName?: string
  children: React.ReactNode
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, containerClassName, className, children, ...props }, ref) => {
    return (
      <div className={cn('w-full', containerClassName)}>
        {label && (
          <label className="block text-ios-label text-sm font-semibold mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={cn(
              'w-full px-4 py-3 bg-ios-bg-tertiary rounded-3xl text-ios-label',
              'focus:bg-ios-bg-secondary focus:ring-2 focus:ring-ios-pink transition-all duration-ios-fast outline-none',
              'appearance-none cursor-pointer pr-10',
              'text-base', // Prevent zoom on iOS
              error && 'ring-2 ring-ios-red focus:ring-ios-red',
              className
            )}
            {...props}
          >
            {children}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ios-label-tertiary pointer-events-none" />
        </div>
        {error && <p className="text-ios-red text-xs mt-1">{error}</p>}
        {helperText && !error && <p className="text-ios-label-tertiary text-xs mt-1">{helperText}</p>}
      </div>
    )
  }
)

Select.displayName = 'Select'
