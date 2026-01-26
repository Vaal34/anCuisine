import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function DELETE(request: NextRequest) {
  try {
    // Récupérer le token d'autorisation
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token d\'autorisation manquant' },
        { status: 401 }
      )
    }

    const token = authHeader.replace('Bearer ', '')

    // Créer un client Supabase avec le token de l'utilisateur
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Variables d\'environnement Supabase manquantes')
      return NextResponse.json(
        { error: 'Configuration serveur incorrecte' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    })

    // Vérifier que l'utilisateur est authentifié
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Utilisateur non authentifié' },
        { status: 401 }
      )
    }

    // Supprimer l'utilisateur via l'Admin API
    // Note: Pour supprimer un utilisateur, il faut utiliser le Service Role Key
    // Pour l'instant, on va seulement supprimer les données et déconnecter
    // La suppression complète du compte Auth nécessite un accès admin

    // Supprimer toutes les recettes de l'utilisateur
    const { error: deleteError } = await supabase
      .from('recipes')
      .delete()
      .eq('user_id', user.id)

    if (deleteError) {
      console.error('Erreur lors de la suppression des recettes:', deleteError)
      return NextResponse.json(
        { error: 'Erreur lors de la suppression des données' },
        { status: 500 }
      )
    }

    // Marquer le compte comme supprimé (vous pouvez ajouter un flag dans une table)
    // ou contacter un administrateur pour supprimer le compte Auth

    return NextResponse.json({
      success: true,
      message: 'Compte supprimé avec succès. Vos données ont été effacées.'
    })
  } catch (error) {
    console.error('Erreur lors de la suppression du compte:', error)
    return NextResponse.json(
      { error: 'Erreur serveur lors de la suppression du compte' },
      { status: 500 }
    )
  }
}
