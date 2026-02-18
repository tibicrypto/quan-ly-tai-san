import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { 
          error: 'Database not configured. Please set DATABASE_URL environment variable.',
          hint: 'See ENV_SETUP.md for instructions'
        },
        { status: 503 }
      )
    }

    const goals = await prisma.investmentGoal.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(goals)
  } catch (error) {
    console.error('Error fetching goals:', error)
    return NextResponse.json(
      { error: 'Failed to fetch goals', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
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
      notes
    } = body

    // Validation
    if (!name || !type || !targetAmount || !deadline || !priority) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const goal = await prisma.investmentGoal.create({
      data: {
        name,
        type,
        targetAmount: parseFloat(targetAmount),
        currentAmount: parseFloat(currentAmount) || 0,
        deadline: new Date(deadline),
        priority,
        monthlyContribution: monthlyContribution ? parseFloat(monthlyContribution) : null,
        notes: notes || null,
        isCompleted: false
      }
    })

    return NextResponse.json(goal, { status: 201 })
  } catch (error) {
    console.error('Error creating goal:', error)
    return NextResponse.json(
      { error: 'Failed to create goal', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
