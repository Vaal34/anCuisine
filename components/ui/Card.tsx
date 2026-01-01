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
        'bg-ios-bg-secondary rounded-3xl corner-squircle shadow-ios-md overflow-hidden',
        hoverable && 'cursor-pointer hover:shadow-ios-lg transition-shadow duration-ios-normal',
        onClick && 'cursor-pointer active:scale-98 transition-transform duration-ios-fast',
        className
      )}
      onClick={onClick}
    >
      {header && (
        <div className="px-4 py-3 border-b border-ios-separator">
          {typeof header === 'string' ? (
            <h3 className="text-lg font-semibold text-ios-label">{header}</h3>
          ) : (
            header
          )}
        </div>
      )}
      <div className="p-4">{children}</div>
      {footer && (
        <div className="px-4 py-3 border-t border-ios-separator bg-ios-bg-tertiary">
          {footer}
        </div>
      )}
    </div>
  )
}
