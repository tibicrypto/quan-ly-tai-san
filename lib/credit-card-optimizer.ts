import { addMonths, addDays, isAfter, isBefore } from 'date-fns'

/**
 * Calculate the optimal credit card to use based on statement dates
 * to maximize the interest-free period
 */
export interface CreditCardOption {
  cardId: string
  cardName: string
  bankName: string
  lastFourDigits: string
  statementDay: number
  interestFreeDays: number
  paymentDueDays: number
  nextStatementDate: Date
  dueDate: Date
  interestFreePeriod: number
  recommendation: string
}

export function calculateOptimalCard(
  cards: Array<{
    id: string
    cardName: string
    bankName: string
    lastFourDigits: string
    statementDay: number
    interestFreeDays: number
    paymentDueDays: number
    isActive: boolean
  }>,
  transactionDate: Date = new Date()
): CreditCardOption[] {
  const options: CreditCardOption[] = []

  for (const card of cards) {
    if (!card.isActive) continue

    const currentMonth = transactionDate.getMonth()
    const currentYear = transactionDate.getFullYear()
    const currentDay = transactionDate.getDate()

    // Calculate next statement date
    let nextStatementDate = new Date(currentYear, currentMonth, card.statementDay)
    
    if (currentDay >= card.statementDay) {
      // Transaction is after this month's statement day, use next month
      nextStatementDate = addMonths(nextStatementDate, 1)
    }

    // Calculate due date (payment due days after statement)
    const dueDate = addDays(nextStatementDate, card.paymentDueDays)

    // Calculate actual interest-free period from transaction date
    const interestFreePeriod = Math.floor(
      (dueDate.getTime() - transactionDate.getTime()) / (1000 * 60 * 60 * 24)
    )

    let recommendation = ''
    if (interestFreePeriod >= 50) {
      recommendation = 'Tối ưu nhất! Tận dụng tối đa thời gian miễn lãi.'
    } else if (interestFreePeriod >= 35) {
      recommendation = 'Tốt. Đủ thời gian để gửi tiết kiệm 1 tháng.'
    } else if (interestFreePeriod >= 20) {
      recommendation = 'Trung bình. Nên gửi tiết kiệm linh hoạt.'
    } else {
      recommendation = 'Không khuyến nghị. Thời gian miễn lãi quá ngắn.'
    }

    options.push({
      cardId: card.id,
      cardName: card.cardName,
      bankName: card.bankName,
      lastFourDigits: card.lastFourDigits,
      statementDay: card.statementDay,
      interestFreeDays: card.interestFreeDays,
      paymentDueDays: card.paymentDueDays,
      nextStatementDate,
      dueDate,
      interestFreePeriod,
      recommendation,
    })
  }

  // Sort by interest-free period (longest first)
  return options.sort((a, b) => b.interestFreePeriod - a.interestFreePeriod)
}

/**
 * Calculate savings recommendation based on days until due date
 */
export interface SavingsRecommendation {
  type: 'TERM_DEPOSIT_1M' | 'FLEXIBLE_SAVINGS' | 'MMF' | 'NO_RECOMMENDATION'
  amount: number
  estimatedInterest: number
  interestRate: number
  bankName?: string
  productName?: string
  message: string
  daysAvailable: number
}

export function calculateSavingsRecommendation(
  amount: number,
  transactionDate: Date,
  dueDate: Date
): SavingsRecommendation {
  const daysAvailable = Math.floor(
    (dueDate.getTime() - transactionDate.getTime()) / (1000 * 60 * 60 * 24)
  )

  // Interest rates (approximate Vietnamese bank rates)
  const TERM_1M_RATE = 4.5 / 100 / 365 // 4.5% annual rate, daily calculation
  const FLEXIBLE_RATE = 3.5 / 100 / 365 // 3.5% annual rate for flexible savings
  const MMF_RATE = 3.0 / 100 / 365 // 3.0% for money market funds

  if (daysAvailable >= 35) {
    // Recommend 1-month term deposit
    const estimatedInterest = amount * TERM_1M_RATE * 30
    return {
      type: 'TERM_DEPOSIT_1M',
      amount,
      estimatedInterest,
      interestRate: 4.5,
      bankName: 'VPBank/HDBank',
      productName: 'Tiết kiệm Online 1 tháng',
      message: `Với ${formatVND(amount)}, nếu gửi tiết kiệm kỳ hạn 1 tháng (lãi suất 4.5%/năm), bạn sẽ kiếm được khoảng ${formatVND(estimatedInterest)} thay vì trả ngay cho ngân hàng.`,
      daysAvailable,
    }
  } else if (daysAvailable >= 20) {
    // Recommend flexible savings
    const estimatedInterest = amount * FLEXIBLE_RATE * daysAvailable
    return {
      type: 'FLEXIBLE_SAVINGS',
      amount,
      estimatedInterest,
      interestRate: 3.5,
      bankName: 'Tikop/Finhay/iSave',
      productName: 'Tích lũy linh hoạt',
      message: `Với ${formatVND(amount)}, gửi tích lũy linh hoạt (lãi suất 3.5%/năm) trong ${daysAvailable} ngày, bạn sẽ kiếm được khoảng ${formatVND(estimatedInterest)}. Có thể rút bất cứ lúc nào.`,
      daysAvailable,
    }
  } else if (daysAvailable >= 10) {
    // Recommend MMF
    const estimatedInterest = amount * MMF_RATE * daysAvailable
    return {
      type: 'MMF',
      amount,
      estimatedInterest,
      interestRate: 3.0,
      productName: 'Quỹ trái phiếu ngắn hạn',
      message: `Với ${formatVND(amount)}, đầu tư vào quỹ trái phiếu ngắn hạn (khoảng 3%/năm) trong ${daysAvailable} ngày, bạn sẽ kiếm được khoảng ${formatVND(estimatedInterest)}.`,
      daysAvailable,
    }
  } else {
    return {
      type: 'NO_RECOMMENDATION',
      amount,
      estimatedInterest: 0,
      interestRate: 0,
      message: `Chỉ còn ${daysAvailable} ngày đến hạn thanh toán. Thời gian quá ngắn để tối ưu lãi suất. Nên giữ tiền mặt để thanh toán đúng hạn.`,
      daysAvailable,
    }
  }
}

function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount)
}
