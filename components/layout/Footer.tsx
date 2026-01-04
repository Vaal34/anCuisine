'use client'

import React from 'react'
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-ios-bg-secondary border-t border-ios-separator mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="text-center space-y-4">
          {/* Logo/Nom de l'app */}
          <div className="text-lg sm:text-xl font-bold text-ios-label">
            anCuisine
          </div>

          {/* Liens */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm">
            <Link
              href="/privacy"
              className="text-ios-label-secondary hover:text-ios-pink transition-colors"
            >
              Politique de confidentialité
            </Link>
            <Link
              href="/terms"
              className="text-ios-label-secondary hover:text-ios-pink transition-colors"
            >
              Conditions d'utilisation
            </Link>
          </div>

          {/* Copyright */}
          <div className="text-xs sm:text-sm text-ios-label-tertiary">
            © {new Date().getFullYear()} anCuisine - Tous droits réservés
          </div>

          {/* Info */}
          <div className="text-xs text-ios-label-quaternary">
            Application de gestion de recettes personnelles
          </div>
        </div>
      </div>
    </footer>
  )
}
