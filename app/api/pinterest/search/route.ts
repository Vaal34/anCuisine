import { NextRequest, NextResponse } from 'next/server'

interface PinterestImage {
  '150x150': { url: string; width: number; height: number }
  '400x300': { url: string; width: number; height: number }
  '600x': { url: string; width: number; height: number }
  '1200x': { url: string; width: number; height: number }
}

interface PinterestPin {
  id: string
  title: string
  description: string
  link: string
  media: {
    media_type: string
    images?: PinterestImage
  }
  alt_text?: string
}

interface PinterestSearchResponse {
  items: PinterestPin[]
  bookmark?: string
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')
    const limit = searchParams.get('limit') || '20'

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter "q" is required' },
        { status: 400 }
      )
    }

    const accessToken = process.env.PINTEREST_ACCESS_TOKEN

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Pinterest API not configured. Please add PINTEREST_ACCESS_TOKEN to .env.local' },
        { status: 500 }
      )
    }

    // Appel à l'API Pinterest
    const pinterestUrl = new URL('https://api.pinterest.com/v5/search/partner/pins')
    pinterestUrl.searchParams.append('term', query)
    pinterestUrl.searchParams.append('country_code', 'US')
    pinterestUrl.searchParams.append('limit', limit)

    const response = await fetch(pinterestUrl.toString(), {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Pinterest API error:', errorText)
      return NextResponse.json(
        { error: `Pinterest API error: ${response.status}`, details: errorText },
        { status: response.status }
      )
    }

    const data: PinterestSearchResponse = await response.json()

    // Transformer les résultats pour extraire les URLs d'images
    const results = data.items
      .filter(pin => pin.media?.images)
      .map(pin => ({
        id: pin.id,
        title: pin.title || 'Sans titre',
        description: pin.description || '',
        // Utiliser l'image 1200x pour la meilleure qualité
        imageUrl: pin.media.images?.['1200x']?.url || pin.media.images?.['600x']?.url || '',
        thumbnailUrl: pin.media.images?.['400x300']?.url || '',
        link: pin.link,
        altText: pin.alt_text || pin.title,
      }))

    return NextResponse.json({
      results,
      total: results.length,
    })
  } catch (error) {
    console.error('Error searching Pinterest:', error)
    return NextResponse.json(
      { error: 'Failed to search Pinterest', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
