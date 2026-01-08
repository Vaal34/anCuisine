'use client'

import React, { useEffect } from 'react'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  children?: React.ReactNode
  footer?: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
  disableContentScroll?: boolean
}

export function Modal({ isOpen, onClose, title, description, children, footer, size = 'md', disableContentScroll = false }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  const sizeStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-2xl',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={cn(
          'relative bg-ios-bg-secondary rounded-3xl shadow-ios-xl w-full overflow-hidden',
          sizeStyles[size]
        )}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-ios-separator flex items-center justify-between">
          <div>
            <h2 id="modal-title" className="text-xl font-bold text-ios-label">{title}</h2>
            {description && (
              <p className="text-sm text-ios-label-secondary mt-1">{description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-xl hover:bg-ios-bg-tertiary transition-colors"
          >
            <X className="w-5 h-5 text-ios-label-secondary" />
          </button>
        </div>

        {/* Content */}
        {children && (
          <div className={cn(
            "px-6 py-4",
            !disableContentScroll && "max-h-[60vh] overflow-y-auto"
          )}>
            {children}
          </div>
        )}

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-ios-separator bg-ios-bg-tertiary">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
