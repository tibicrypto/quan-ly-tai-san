import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Fetch all cash assets
export async function GET() {
  try {
    const assets = await prisma.cashAsset.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(assets, { status: 200 })
  } catch (error) {
    console.error('Error fetching cash assets:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cash assets' },
      { status: 500 }
    )
  }
}

// POST - Create new cash asset
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { name, currency, amount, location, notes } = body

    if (!name || !currency || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields: name, currency, amount' },
        { status: 400 }
      )
    }

    const asset = await prisma.cashAsset.create({
      data: {
        name,
        currency,
        amount: parseFloat(amount),
        location: location || '',
        notes: notes || '',
      },
    })

    return NextResponse.json(asset, { status: 201 })
  } catch (error) {
    console.error('Error creating cash asset:', error)
    return NextResponse.json(
      { error: 'Failed to create cash asset' },
      { status: 500 }
    )
  }
}
