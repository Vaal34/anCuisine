'use client'

import React from 'react'
import { ChefHat, LogOut, Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useRouter } from 'next/navigation'
import type { User } from '@/types'

export interface HeaderProps {
  user: User | null
  onLogout?: () => void
}

export function Header({ user, onLogout }: HeaderProps) {
  const router = useRouter()

  return (
    <header className="bg-ios-bg-secondary/80 backdrop-blur-lg border-b border-ios-separator sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo et titre */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/')}>
          <div className="w-10 h-10 bg-recipe-primary rounded-3xl corner-squircle flex items-center justify-center">
            <ChefHat className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-ios-label">Mes Recettes</h1>
        </div>

        {/* Actions */}
        {user && (
          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              size="sm"
              onClick={() => router.push('/recettes/nouvelle')}
              leftIcon={<Plus className="w-4 h-4" />}
              className="hidden sm:flex"
            >
              Nouvelle recette
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => router.push('/recettes/nouvelle')}
              className="sm:hidden"
            >
              <Plus className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onLogout}>
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Déconnexion</span>
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}
