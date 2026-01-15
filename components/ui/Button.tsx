import React from 'react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
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
    primary: 'bg-accent text-white shadow-ios-md hover:opacity-90',
    secondary: 'bg-ios-bg-secondary text-accent border border-ios-separator hover:bg-ios-bg-tertiary',
    destructive: 'bg-ios-red text-white shadow-ios-md hover:opacity-90',
    ghost: 'bg-transparent text-accent hover:bg-ios-bg-tertiary',
  }

  const sizeStyles = {
    sm: 'px-4 py-2.5 text-sm rounded-3xl min-h-[44px]', // Ensure 44px minimum for iOS touch target
    md: 'px-6 py-3 text-base rounded-3xl min-h-[48px]',
    lg: 'px-8 py-4 text-lg rounded-3xl min-h-[52px]',
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
        <div className="w-6 h-6 flex items-center justify-center">
          <div className="scale-[4]">
            <DotLottieReact
              src="/loading.lottie"
              loop
              autoplay
            />
          </div>
        </div>
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
