'use client'

import React, { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

export interface AutocompleteOption {
  id: string
  name: string
  category?: string | null
  default_unit?: string
}

export interface AutocompleteProps {
  value: string
  onChange: (value: string) => void
  onSelect: (item: AutocompleteOption) => void
  suggestions: AutocompleteOption[]
  placeholder?: string
  className?: string
  label?: string
  error?: string
}

export function Autocomplete({
  value,
  onChange,
  onSelect,
  suggestions,
  placeholder,
  className,
  label,
  error,
}: AutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (suggestions.length > 0 && value.length > 0) {
      setIsOpen(true)
      setHighlightedIndex(0)
    } else {
      setIsOpen(false)
    }
  }, [suggestions.length, value.length])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex((prev) => Math.min(prev + 1, suggestions.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex((prev) => Math.max(prev - 1, 0))
        break
      case 'Enter':
        e.preventDefault()
        if (suggestions[highlightedIndex]) {
          handleSelect(suggestions[highlightedIndex])
        }
        break
      case 'Escape':
        setIsOpen(false)
        break
    }
  }

  const handleSelect = (item: AutocompleteOption) => {
    onChange(item.name)
    onSelect(item)
    setIsOpen(false)
  }

  return (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      {label && (
        <label className="block text-ios-label text-sm font-semibold mb-2">
          {label}
        </label>
      )}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (suggestions.length > 0 && value.length > 0) {
            setIsOpen(true)
          }
        }}
        placeholder={placeholder}
        className={cn(
          'w-full px-4 py-3 bg-ios-bg-tertiary rounded-3xl text-ios-label placeholder:text-ios-label-tertiary',
          'focus:bg-ios-bg-secondary focus:ring-2 focus-accent transition-all duration-ios-fast outline-none',
          error && 'ring-2 ring-ios-red focus:ring-ios-red'
        )}
      />

      {isOpen && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-ios-bg-secondary rounded-3xl shadow-ios-lg border border-ios-separator max-h-60 overflow-auto">
          {suggestions.map((item, index) => (
            <div
              key={item.id}
              className={cn(
                'px-4 py-3 cursor-pointer transition-colors',
                index === highlightedIndex ? 'bg-accent text-white' : 'hover:bg-ios-bg-tertiary',
                index !== suggestions.length - 1 && 'border-b border-ios-separator'
              )}
              onClick={() => handleSelect(item)}
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              <div className="font-semibold">{item.name}</div>
              {item.category && (
                <div className={cn(
                  'text-sm mt-1',
                  index === highlightedIndex ? 'text-white/80' : 'text-ios-label-secondary'
                )}>
                  {item.category} • {item.default_unit}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-ios-red text-xs mt-1">{error}</p>}
    </div>
  )
}
