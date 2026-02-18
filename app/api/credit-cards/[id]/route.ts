import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/credit-cards/[id] - Fetch single credit card
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params
    const card = await prisma.creditCard.findUnique({
      where: {
        id: id
      }
    })

    if (!card) {
      return NextResponse.json(
        { error: 'Credit card not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(card, { status: 200 })
  } catch (error: any) {
    console.error('Error fetching credit card:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch credit card',
        details: error.message
      },
      { status: 500 }
    )
  }
}

// PUT /api/credit-cards/[id] - Update credit card
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params
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
      isActive
    } = body

    // Validation
    if (!bankName || !cardName || !lastFourDigits || !statementDay || !interestFreeDays || !paymentDueDays) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Update credit card in database
    const updatedCard = await prisma.creditCard.update({
      where: {
        id: id
      },
      data: {
        bankName,
        cardName,
        lastFourDigits,
        statementDay: parseInt(statementDay),
        interestFreeDays: parseInt(interestFreeDays),
        paymentDueDays: parseInt(paymentDueDays),
        creditLimit: creditLimit ? parseFloat(creditLimit) : null,
        notes: notes || null,
        isActive: isActive !== undefined ? isActive : true,
      }
    })

    return NextResponse.json(updatedCard, { status: 200 })
  } catch (error: any) {
    console.error('Error updating credit card:', error)
    return NextResponse.json(
      { 
        error: 'Failed to update credit card',
        details: error.message
      },
      { status: 500 }
    )
  }
}

// DELETE /api/credit-cards/[id] - Delete (deactivate) credit card
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params
    // Soft delete by setting isActive to false
    const deletedCard = await prisma.creditCard.update({
      where: {
        id: id
      },
      data: {
        isActive: false
      }
    })

    return NextResponse.json({ 
      message: 'Credit card deleted successfully',
      card: deletedCard 
    }, { status: 200 })
  } catch (error: any) {
    console.error('Error deleting credit card:', error)
    return NextResponse.json(
      { 
        error: 'Failed to delete credit card',
        details: error.message
      },
      { status: 500 }
    )
  }
}
