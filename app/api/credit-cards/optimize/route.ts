import { NextResponse } from 'next/server'
import { calculateOptimalCard, calculateSavingsRecommendation } from '@/lib/credit-card-optimizer'

// Mock data for demo - in production, fetch from database
const MOCK_CARDS = [
  {
    id: '1',
    cardName: 'Online Plus',
    bankName: 'VIB',
    lastFourDigits: '1234',
    statementDay: 20,
    interestFreeDays: 55,
    paymentDueDays: 15,
    isActive: true,
  },
  {
    id: '2',
    cardName: 'Cash Back',
    bankName: 'Techcombank',
    lastFourDigits: '5678',
    statementDay: 25,
    interestFreeDays: 45,
    paymentDueDays: 15,
    isActive: true,
  },
  {
    id: '3',
    cardName: 'Platinum',
    bankName: 'HSBC',
    lastFourDigits: '9012',
    statementDay: 15,
    interestFreeDays: 50,
    paymentDueDays: 20,
    isActive: true,
  },
]

export async function POST(request: Request) {
  try {
    const { amount, transactionDate } = await request.json()

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Số tiền không hợp lệ' },
        { status: 400 }
      )
    }

    const txDate = transactionDate ? new Date(transactionDate) : new Date()

    // Calculate optimal cards
    const cardOptions = calculateOptimalCard(MOCK_CARDS, txDate)

    if (cardOptions.length === 0) {
      return NextResponse.json(
        { error: 'Không tìm thấy thẻ nào khả dụng' },
        { status: 404 }
      )
    }

    // Get best card
    const bestCard = cardOptions[0]

    // Calculate savings recommendation for the best card
    const savingsRecommendation = calculateSavingsRecommendation(
      amount,
      txDate,
      bestCard.dueDate
    )

    return NextResponse.json({
      bestCard,
      allOptions: cardOptions,
      savingsRecommendation,
      amount,
      transactionDate: txDate.toISOString(),
    })
  } catch (error) {
    console.error('Error calculating optimal card:', error)
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi khi tính toán' },
      { status: 500 }
    )
  }
}
