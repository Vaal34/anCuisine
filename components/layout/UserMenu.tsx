'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Settings, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { User as UserType } from '@/types'

export interface UserMenuProps {
  user: UserType
  onLogout?: () => void
}

export function UserMenu({ user, onLogout }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Fermer le menu si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleSettings = () => {
    setIsOpen(false)
    router.push('/settings')
  }

  const handleLogout = () => {
    setIsOpen(false)
    onLogout?.()
  }

  // Générer les initiales de l'utilisateur
  const getInitials = (email: string) => {
    const name = email.split('@')[0]
    return name.slice(0, 2).toUpperCase()
  }

  return (
    <div className="relative" ref={menuRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 sm:w-12 sm:h-12 rounded-3xl corner-squircle bg-ios-pink/90 flex items-center justify-center text-white font-semibold text-sm sm:text-base hover:bg-ios-pink hover:scale-105 active:scale-95 transition-all duration-200 border border-ios-separator"
        aria-label="Menu utilisateur"
      >
        {getInitials(user.email)}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-ios-bg-secondary rounded-3xl corner-squircle shadow-ios-lg border border-ios-separator overflow-hidden z-50">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-ios-separator">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-3xl corner-squircle bg-ios-pink/90 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 border border-ios-separator">
                {getInitials(user.email)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-ios-label truncate">
                  {user.email.split('@')[0]}
                </p>
                <p className="text-xs text-ios-label-secondary truncate">
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <button
              onClick={handleSettings}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-ios-label hover:bg-ios-bg-tertiary transition-colors"
            >
              <Settings className="w-4 h-4 text-ios-label-secondary" />
              <span>Paramètres</span>
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-ios-red hover:bg-ios-red/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
