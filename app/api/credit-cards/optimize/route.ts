import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { amount } = await request.json()

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Số tiền không hợp lệ' },
        { status: 400 }
      )
    }

    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { 
          error: 'Database not configured. Please set DATABASE_URL environment variable.',
          hint: 'See ENV_SETUP.md for instructions'
        },
        { status: 503 }
      )
    }

    // Fetch active credit cards from database
    const cards = await prisma.creditCard.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        interestFreeDays: 'desc' // Prioritize cards with longer interest-free periods
      }
    })

    if (cards.length === 0) {
      return NextResponse.json({
        message: 'Chưa có thẻ tín dụng nào',
        hint: 'Vui lòng thêm thẻ tín dụng để sử dụng Smart Swipe Optimizer'
      }, { status: 200 })
    }

    // Calculate optimal card based on statement dates and interest-free periods
    const today = new Date()
    const currentDay = today.getDate()

    const optimizations = cards.map(card => {
      // Calculate days until next statement
      let daysUntilStatement: number
      if (currentDay <= card.statementDay) {
        daysUntilStatement = card.statementDay - currentDay
      } else {
        // Next month's statement
        const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, card.statementDay)
        daysUntilStatement = Math.ceil((nextMonth.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      }

      // Total interest-free days from today
      const totalInterestFreeDays = daysUntilStatement + card.paymentDueDays

      return {
        cardId: card.id,
        bankName: card.bankName,
        cardName: card.cardName,
        lastFourDigits: card.lastFourDigits,
        interestFreeDays: totalInterestFreeDays,
        statementDate: card.statementDay,
        paymentDueDate: daysUntilStatement + card.paymentDueDays
      }
    })

    // Sort by interest-free days (descending)
    optimizations.sort((a, b) => b.interestFreeDays - a.interestFreeDays)

    const optimal = optimizations[0]

    return NextResponse.json({
      recommendedCard: {
        bankName: optimal.bankName,
        cardName: optimal.cardName,
        lastFourDigits: optimal.lastFourDigits,
        interestFreeDays: optimal.interestFreeDays
      },
      allCards: optimizations,
      amount,
      message: `Sử dụng thẻ ${optimal.bankName} ${optimal.cardName} (****${optimal.lastFourDigits}) để có ${optimal.interestFreeDays} ngày miễn lãi`
    })
  } catch (error) {
    console.error('Error calculating optimal card:', error)
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi khi tính toán', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
