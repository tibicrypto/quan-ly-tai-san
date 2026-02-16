import { type ClassValue, clsx } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

// Format currency in VND
export function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount)
}

// Format percentage
export function formatPercent(value: number): string {
  return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`
}

// Calculate days between two dates
export function daysBetween(date1: Date, date2: Date): number {
  const oneDay = 24 * 60 * 60 * 1000
  return Math.round(Math.abs((date1.getTime() - date2.getTime()) / oneDay))
}

// Calculate PnL (Profit and Loss)
export function calculatePnL(
  currentPrice: number,
  averagePrice: number,
  quantity: number
): { pnl: number; pnlPercent: number } {
  const pnl = (currentPrice - averagePrice) * quantity
  const pnlPercent = ((currentPrice - averagePrice) / averagePrice) * 100
  return { pnl, pnlPercent }
}
