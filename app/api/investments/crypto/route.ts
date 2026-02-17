import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Fetch all crypto assets
export async function GET() {
  try {
    const assets = await prisma.cryptoAsset.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(assets, { status: 200 })
  } catch (error) {
    console.error('Error fetching crypto assets:', error)
    return NextResponse.json(
      { error: 'Failed to fetch crypto assets' },
      { status: 500 }
    )
  }
}

// POST - Create new crypto asset
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      name,
      symbol,
      exchange,
      balance,
      averagePrice,
      currentPrice,
      usdtVndRate,
      alertThreshold,
      notes,
    } = body

    if (!name || !symbol || !exchange || !balance || !averagePrice) {
      return NextResponse.json(
        { error: 'Missing required fields: name, symbol, exchange, balance, averagePrice' },
        { status: 400 }
      )
    }

    const asset = await prisma.cryptoAsset.create({
      data: {
        name,
        symbol,
        exchange,
        balance: parseFloat(balance),
        averagePrice: parseFloat(averagePrice),
        currentPrice: currentPrice ? parseFloat(currentPrice) : parseFloat(averagePrice),
        usdtVndRate: usdtVndRate ? parseFloat(usdtVndRate) : 24500,
        alertThreshold: alertThreshold ? parseFloat(alertThreshold) : null,
        notes: notes || '',
      },
    })

    return NextResponse.json(asset, { status: 201 })
  } catch (error) {
    console.error('Error creating crypto asset:', error)
    return NextResponse.json(
      { error: 'Failed to create crypto asset' },
      { status: 500 }
    )
  }
}
