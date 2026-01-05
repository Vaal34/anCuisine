'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@/types'

interface UseAuthReturn {
  user: User | null
  loading: boolean
  signUp: (email: string, password: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  deleteAccount: () => Promise<void>
  isAuthenticated: boolean
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Vérifier la session actuelle
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ? { id: session.user.id, email: session.user.email! } : null)
      setLoading(false)
    })

    // Écouter les changements d'authentification
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? { id: session.user.id, email: session.user.email! } : null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) throw error
    if (data.user) {
      setUser({ id: data.user.id, email: data.user.email! })
    }
  }

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    if (data.user) {
      setUser({ id: data.user.id, email: data.user.email! })
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    setUser(null)
  }

  const deleteAccount = async () => {
    if (!user) throw new Error('Aucun utilisateur connecté')

    // 1. Supprimer toutes les recettes de l'utilisateur
    const { error: deleteRecipesError } = await supabase
      .from('recipes')
      .delete()
      .eq('user_id', user.id)

    if (deleteRecipesError) throw deleteRecipesError

    // 2. Supprimer le compte utilisateur (via l'API Admin de Supabase)
    // Note: La suppression du compte Auth doit être faite via un endpoint API
    // car le client ne peut pas supprimer son propre compte directement
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) throw new Error('Session expirée')

    const response = await fetch('/api/auth/delete-account', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      }
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Erreur lors de la suppression du compte')
    }

    // 3. Déconnecter l'utilisateur
    await signOut()
  }

  return {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    deleteAccount,
    isAuthenticated: !!user,
  }
}
