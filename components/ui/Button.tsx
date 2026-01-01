import React from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  children: React.ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'font-semibold transition-all duration-ios-fast active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 inline-flex items-center justify-center gap-2'

  const variantStyles = {
    primary: 'bg-ios-pink text-white shadow-ios-md hover:opacity-90',
    secondary: 'bg-ios-bg-secondary text-ios-pink border border-ios-separator hover:bg-ios-bg-tertiary',
    destructive: 'bg-ios-red text-white shadow-ios-md hover:opacity-90',
    ghost: 'bg-transparent text-ios-pink hover:bg-ios-bg-tertiary',
  }

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm rounded-3xl corner-squircle',
    md: 'px-6 py-3 text-base rounded-3xl corner-squircle',
    lg: 'px-8 py-4 text-lg rounded-3xl corner-squircle',
  }

  return (
    <button
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-current border-t-transparent corner-round animate-spin" />
      ) : (
        <>
          {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  )
}
