import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { 
          error: 'Database not configured. Please set DATABASE_URL environment variable.',
          hint: 'See ENV_SETUP.md for instructions'
        },
        { status: 503 }
      )
    }

    const goal = await prisma.investmentGoal.findUnique({
      where: { id: id }
    })

    if (!goal) {
      return NextResponse.json(
        { error: 'Goal not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(goal)
  } catch (error) {
    console.error('Error fetching goal:', error)
    return NextResponse.json(
      { error: 'Failed to fetch goal', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { 
          error: 'Database not configured. Please set DATABASE_URL environment variable.',
          hint: 'See ENV_SETUP.md for instructions'
        },
        { status: 503 }
      )
    }

    const body = await request.json()
    const {
      name,
      type,
      targetAmount,
      currentAmount,
      deadline,
      priority,
      monthlyContribution,
      notes,
      isCompleted
    } = body

    // Validation
    if (!name || !type || !targetAmount || !deadline || !priority) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const goal = await prisma.investmentGoal.update({
      where: { id: id },
      data: {
        name,
        type,
        targetAmount: parseFloat(targetAmount),
        currentAmount: parseFloat(currentAmount) || 0,
        deadline: new Date(deadline),
        priority,
        monthlyContribution: monthlyContribution ? parseFloat(monthlyContribution) : null,
        notes: notes || null,
        isCompleted: Boolean(isCompleted)
      }
    })

    return NextResponse.json(goal)
  } catch (error) {
    console.error('Error updating goal:', error)
    return NextResponse.json(
      { error: 'Failed to update goal', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { 
          error: 'Database not configured. Please set DATABASE_URL environment variable.',
          hint: 'See ENV_SETUP.md for instructions'
        },
        { status: 503 }
      )
    }

    await prisma.investmentGoal.delete({
      where: { id: id }
    })

    return NextResponse.json({ success: true, message: 'Goal deleted successfully' })
  } catch (error) {
    console.error('Error deleting goal:', error)
    return NextResponse.json(
      { error: 'Failed to delete goal', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
