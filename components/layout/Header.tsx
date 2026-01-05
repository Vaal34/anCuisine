'use client'

import React from 'react'
import { ChefHat, Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { UserMenu } from '@/components/layout/UserMenu'
import { useRouter } from 'next/navigation'
import type { User } from '@/types'

export interface HeaderProps {
  user: User | null
  onLogout?: () => void
}

export function Header({ user, onLogout }: HeaderProps) {
  const router = useRouter()

  return (
    <header className="bg-ios-bg-secondary flex justify-center items-center border-b border-ios-separator sticky top-0 z-40">
      <div className="container px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-3 sm:gap-4">
        {/* Logo and title */}
        <div
          className="flex items-center gap-2 sm:gap-3 cursor-pointer min-w-0 flex-shrink"
          onClick={() => router.push('/')}
        >
          {/* Logo - consistent size with action buttons */}
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-ios-pink rounded-2xl sm:rounded-3xl corner-squircle flex items-center justify-center flex-shrink-0">
            <ChefHat className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
          </div>

          {/* Title - responsive text sizing with smooth scaling */}
          <h1 className="text-base sm:text-xl md:text-2xl font-semibold sm:font-bold text-ios-label truncate">
            Mes Recettes
          </h1>
        </div>

        {/* Action buttons */}
        {user && (
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* New Recipe Button - Mobile: icon only */}
            <Button
              variant="primary"
              size="sm"
              onClick={() => router.push('/recettes/nouvelle')}
              className="sm:hidden w-10 h-10 p-0 rounded-2xl"
              aria-label="Nouvelle recette"
            >
              <Plus className="w-5 h-5" />
            </Button>
            {/* New Recipe Button - Desktop: icon + text */}
            <Button
              variant="primary"
              size="sm"
              onClick={() => router.push('/recettes/nouvelle')}
              leftIcon={<Plus className="w-4 h-4" />}
              className="hidden sm:flex h-12"
            >
              Nouvelle recette
            </Button>

            {/* User Menu with Avatar */}
            <UserMenu user={user} onLogout={onLogout} />
          </div>
        )}
      </div>
    </header>
  )
}
