import { NextRequest, NextResponse } from 'next/server'
import { createApi } from 'unsplash-js'

interface UnsplashImage {
  id: string
  description: string | null
  alt_description: string | null
  urls: {
    raw: string
    full: string
    regular: string
    small: string
    thumb: string
  }
  user: {
    name: string
    username: string
  }
  links: {
    html: string
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')
    const perPage = parseInt(searchParams.get('limit') || '20')

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter "q" is required' },
        { status: 400 }
      )
    }

    const accessKey = process.env.UNSPLASH_ACCESS_KEY

    if (!accessKey) {
      return NextResponse.json(
        { error: 'Unsplash API not configured. Please add UNSPLASH_ACCESS_KEY to .env.local' },
        { status: 500 }
      )
    }

    // Initialiser l'API Unsplash
    const unsplash = createApi({
      accessKey,
    })

    // Rechercher des photos
    const result = await unsplash.search.getPhotos({
      query,
      perPage,
      orientation: 'landscape', // Préférer les images paysage pour les recettes
    })

    if (result.errors) {
      console.error('Unsplash API error:', result.errors)
      return NextResponse.json(
        { error: 'Unsplash API error', details: result.errors },
        { status: 500 }
      )
    }

    // Transformer les résultats
    const results = result.response?.results.map((photo: UnsplashImage) => ({
      id: photo.id,
      title: photo.description || photo.alt_description || 'Sans titre',
      description: photo.alt_description || '',
      imageUrl: photo.urls.regular,
      thumbnailUrl: photo.urls.small,
      link: photo.links.html,
      altText: photo.alt_description || photo.description || 'Photo culinaire',
      author: photo.user.name,
      authorUsername: photo.user.username,
    })) || []

    return NextResponse.json({
      results,
      total: result.response?.total || 0,
    })
  } catch (error) {
    console.error('Error searching Unsplash:', error)
    return NextResponse.json(
      { error: 'Failed to search Unsplash', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
