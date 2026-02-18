import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Fetch all real estate assets
export async function GET() {
  try {
    // Check if DATABASE_URL is configured
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: 'Database not configured. Please set DATABASE_URL environment variable.' },
        { status: 500 }
      )
    }

    const assets = await prisma.realEstateAsset.findMany({
      orderBy: {
        purchaseDate: 'desc',
      },
    })

    return NextResponse.json(assets, { status: 200 })
  } catch (error) {
    console.error('Error fetching real estate assets:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Failed to fetch real estate assets', details: errorMessage },
      { status: 500 }
    )
  }
}

// POST - Create new real estate asset
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      type,
      name,
      address,
      area,
      purchasePrice,
      currentPrice,
      purchaseDate,
      rentalIncome,
      ownership,
      notes,
    } = body

    if (!type || !name || !address || !area || !purchasePrice || !currentPrice || !purchaseDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const asset = await prisma.realEstateAsset.create({
      data: {
        type,
        name,
        address,
        area: parseFloat(area),
        purchasePrice: parseFloat(purchasePrice),
        currentPrice: parseFloat(currentPrice),
        purchaseDate: new Date(purchaseDate),
        rentalIncome: rentalIncome ? parseFloat(rentalIncome) : null,
        ownership: ownership || 'FULL',
        notes: notes || '',
      },
    })

    return NextResponse.json(asset, { status: 201 })
  } catch (error) {
    console.error('Error creating real estate asset:', error)
    return NextResponse.json(
      { error: 'Failed to create real estate asset' },
      { status: 500 }
    )
  }
}
