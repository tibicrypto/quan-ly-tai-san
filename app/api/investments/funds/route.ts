import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Fetch all fund assets
export async function GET() {
  try {
    const assets = await prisma.fundAsset.findMany({
      orderBy: {
        purchaseDate: 'desc',
      },
    })

    return NextResponse.json(assets, { status: 200 })
  } catch (error) {
    console.error('Error fetching fund assets:', error)
    return NextResponse.json(
      { error: 'Failed to fetch fund assets' },
      { status: 500 }
    )
  }
}

// POST - Create new fund asset
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      name,
      fundCode,
      fundCompany,
      type,
      units,
      avgNavPrice,
      currentNav,
      purchaseDate,
      notes,
    } = body

    if (!name || !fundCode || !fundCompany || !type || !units || !avgNavPrice || !purchaseDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const asset = await prisma.fundAsset.create({
      data: {
        name,
        fundCode,
        fundCompany,
        type,
        units: parseFloat(units),
        avgNavPrice: parseFloat(avgNavPrice),
        currentNav: currentNav ? parseFloat(currentNav) : parseFloat(avgNavPrice),
        purchaseDate: new Date(purchaseDate),
        notes: notes || '',
      },
    })

    return NextResponse.json(asset, { status: 201 })
  } catch (error) {
    console.error('Error creating fund asset:', error)
    return NextResponse.json(
      { error: 'Failed to create fund asset' },
      { status: 500 }
    )
  }
}
