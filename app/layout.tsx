import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Mes Recettes - Carnet de cuisine personnel',
  description: 'Gérez vos recettes de cuisine avec un carnet numérique simple et intuitif',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
