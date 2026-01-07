import React from 'react'
import { cn } from '@/lib/utils'

export interface CardProps {
  children: React.ReactNode
  className?: string
  hoverable?: boolean
  onClick?: () => void
  header?: React.ReactNode
  footer?: React.ReactNode
}

export function Card({ children, className, hoverable = false, onClick, header, footer }: CardProps) {
  return (
    <div
      className={cn(
        'bg-ios-bg-secondary rounded-3xl shadow-ios-md overflow-hidden',
        hoverable && 'cursor-pointer hover:shadow-ios-lg transition-shadow duration-ios-normal',
        onClick && 'cursor-pointer active:scale-98 transition-transform duration-ios-fast',
        className
      )}
      onClick={onClick}
    >
      {header && (
        <div className="px-4 sm:px-5 md:px-6 py-3 sm:py-3.5 md:py-4 border-b border-ios-separator">
          {typeof header === 'string' ? (
            <h3 className="text-base sm:text-lg font-semibold text-ios-label">{header}</h3>
          ) : (
            header
          )}
        </div>
      )}
      <div className="p-4 sm:p-5 md:p-6">{children}</div>
      {footer && (
        <div className="px-4 sm:px-5 md:px-6 py-3 sm:py-3.5 md:py-4 border-t border-ios-separator bg-ios-bg-tertiary">
          {footer}
        </div>
      )}
    </div>
  )
}
