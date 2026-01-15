'use client'

import React from 'react'
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-ios-bg-secondary border-t border-ios-separator mt-auto w-full">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="text-center space-y-2">
          {/* Liens */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs">
            <Link
              href="/privacy"
              className="text-ios-label-secondary hover:text-accent transition-colors"
            >
              Politique de confidentialité
            </Link>
            <Link
              href="/terms"
              className="text-ios-label-secondary hover:text-accent transition-colors"
            >
              Conditions d'utilisation
            </Link>
          </div>

          {/* Copyright */}
          <div className="text-xs text-ios-label-tertiary">
            © {new Date().getFullYear()} anCuisine
          </div>
        </div>
      </div>
    </footer>
  )
}
