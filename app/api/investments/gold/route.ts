import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Fetch all gold/silver assets
export async function GET() {
  try {
    const assets = await prisma.goldSilverAsset.findMany({
      orderBy: {
        purchaseDate: 'desc'
      }
    })

    return NextResponse.json(assets)
  } catch (error) {
    console.error('Error fetching gold assets:', error)
    return NextResponse.json(
      { error: 'Failed to fetch gold assets' },
      { status: 500 }
    )
  }
}

// POST - Create new gold/silver asset
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      type,
      name,
      weight,
      unit,
      purchasePrice,
      vendor,
      purchaseDate,
      notes
    } = body

    // Validate required fields
    if (!type || !name || !weight || !unit || !purchasePrice || !purchaseDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const asset = await prisma.goldSilverAsset.create({
      data: {
        type,
        name,
        weight: parseFloat(weight),
        unit,
        purchasePrice: parseFloat(purchasePrice),
        currentPrice: parseFloat(purchasePrice), // Use purchase price as initial current price
        vendor: vendor || 'Unknown',
        purchaseDate: new Date(purchaseDate),
        notes: notes || null
      }
    })

    return NextResponse.json(asset, { status: 201 })
  } catch (error) {
    console.error('Error creating gold asset:', error)
    return NextResponse.json(
      { error: 'Failed to create gold asset' },
      { status: 500 }
    )
  }
}
