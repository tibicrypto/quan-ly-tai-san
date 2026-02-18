import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/credit-cards - Fetch all credit cards
export async function GET(request: NextRequest) {
  try {
    // Check if DATABASE_URL is configured
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { 
          error: 'Database not configured. Please set DATABASE_URL environment variable.',
          hint: 'See ENV_SETUP.md for instructions'
        },
        { status: 500 }
      )
    }

    const cards = await prisma.creditCard.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(cards, { status: 200 })
  } catch (error: any) {
    console.error('Error fetching credit cards:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch credit cards',
        details: error.message
      },
      { status: 500 }
    )
  }
}

// POST /api/credit-cards - Create new credit card
export async function POST(request: NextRequest) {
  try {
    // Check if DATABASE_URL is configured
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { 
          error: 'Database not configured. Please set DATABASE_URL environment variable.',
          hint: 'See ENV_SETUP.md for instructions'
        },
        { status: 500 }
      )
    }

    const body = await request.json()
    const {
      bankName,
      cardName,
      lastFourDigits,
      statementDay,
      interestFreeDays,
      paymentDueDays,
      creditLimit,
      notes,
    } = body

    // Validation
    if (!bankName || !cardName || !lastFourDigits || !statementDay || !interestFreeDays || !paymentDueDays) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create credit card in database
    const newCard = await prisma.creditCard.create({
      data: {
        bankName,
        cardName,
        lastFourDigits,
        statementDay: parseInt(statementDay),
        interestFreeDays: parseInt(interestFreeDays),
        paymentDueDays: parseInt(paymentDueDays),
        creditLimit: creditLimit ? parseFloat(creditLimit) : null,
        notes: notes || null,
      }
    })

    return NextResponse.json(newCard, { status: 201 })
  } catch (error: any) {
    console.error('Error creating credit card:', error)
    return NextResponse.json(
      { 
        error: 'Failed to create credit card',
        details: error.message
      },
      { status: 500 }
    )
  }
}
