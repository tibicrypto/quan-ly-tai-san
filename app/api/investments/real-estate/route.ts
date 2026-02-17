import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Fetch all real estate assets
export async function GET() {
  try {
    const assets = await prisma.realEstateAsset.findMany({
      orderBy: {
        purchaseDate: 'desc',
      },
    })

    return NextResponse.json(assets, { status: 200 })
  } catch (error) {
    console.error('Error fetching real estate assets:', error)
    return NextResponse.json(
      { error: 'Failed to fetch real estate assets' },
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
      ownershipPercentage,
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
        ownershipPercentage: ownershipPercentage ? parseFloat(ownershipPercentage) : 100,
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
