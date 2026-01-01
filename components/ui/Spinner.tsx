import React from 'react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { cn } from '@/lib/utils'

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  const sizeStyles = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  }

  return (
    <div className="flex items-center justify-center">
      <div className={cn(sizeStyles[size], className)}>
        <DotLottieReact
          src="/loading.lottie"
          loop
          autoplay
        />
      </div>
    </div>
  )
}
