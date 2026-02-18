'use client'

import Link from 'next/link'
import { Bitcoin, Coins, TrendingUp, Plus, Wallet, Home, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'

interface PortfolioSummary {
  totalValue: number
  totalCost: number
  pnl: number
  pnlPercent: number
  crypto: { value: number; count: number }
  goldAndFunds: { value: number; count: number }
  cash: { value: number; count: number }
  realEstate: { value: number; count: number }
}

export default function InvestmentsPage() {
  const [summary, setSummary] = useState<PortfolioSummary>({
    totalValue: 0,
    totalCost: 0,
    pnl: 0,
    pnlPercent: 0,
    crypto: { value: 0, count: 0 },
    goldAndFunds: { value: 0, count: 0 },
    cash: { value: 0, count: 0 },
    realEstate: { value: 0, count: 0 }
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchPortfolioData() {
      try {
        // Fetch all asset types in parallel
        const [cryptoRes, goldRes, cashRes, fundsRes, realEstateRes] = await Promise.all([
          fetch('/api/investments/crypto'),
          fetch('/api/investments/gold'),
          fetch('/api/investments/cash'),
          fetch('/api/investments/funds'),
          fetch('/api/investments/real-estate')
        ])

        const crypto = cryptoRes.ok ? await cryptoRes.json() : []
        const gold = goldRes.ok ? await goldRes.json() : []
        const cash = cashRes.ok ? await cashRes.json() : []
        const funds = fundsRes.ok ? await fundsRes.json() : []
        const realEstate = realEstateRes.ok ? await realEstateRes.json() : []

        // Calculate crypto value and cost
        const cryptoValue = crypto.reduce((sum: number, asset: any) => {
          const currentValue = asset.quantity * asset.currentPrice
          return sum + currentValue
        }, 0)
        const cryptoCost = crypto.reduce((sum: number, asset: any) => {
          return sum + (asset.purchasePrice * asset.quantity)
        }, 0)

        // Calculate gold value and cost
        const goldValue = gold.reduce((sum: number, asset: any) => {
          const currentValue = asset.quantity * asset.currentPrice
          return sum + currentValue
        }, 0)
        const goldCost = gold.reduce((sum: number, asset: any) => {
          return sum + (asset.purchasePrice * asset.quantity)
        }, 0)

        // Calculate funds value and cost
        const fundsValue = funds.reduce((sum: number, asset: any) => {
          const currentValue = asset.units * asset.currentNav
          return sum + currentValue
        }, 0)
        const fundsCost = funds.reduce((sum: number, asset: any) => {
          return sum + (asset.purchaseNav * asset.units)
        }, 0)

        // Calculate cash value (cash is always at face value)
        const cashValue = cash.reduce((sum: number, asset: any) => {
          return sum + asset.amount
        }, 0)

        // Calculate real estate value and cost
        const realEstateValue = realEstate.reduce((sum: number, asset: any) => {
          return sum + asset.currentValue
        }, 0)
        const realEstateCost = realEstate.reduce((sum: number, asset: any) => {
          return sum + asset.purchasePrice
        }, 0)

        // Calculate totals
        const totalValue = cryptoValue + goldValue + fundsValue + cashValue + realEstateValue
        const totalCost = cryptoCost + goldCost + fundsCost + cashValue + realEstateCost
        const pnl = totalValue - totalCost
        const pnlPercent = totalCost > 0 ? (pnl / totalCost) * 100 : 0

        setSummary({
          totalValue,
          totalCost,
          pnl,
          pnlPercent,
          crypto: { value: cryptoValue, count: crypto.length },
          goldAndFunds: { value: goldValue + fundsValue, count: gold.length + funds.length },
          cash: { value: cashValue, count: cash.length },
          realEstate: { value: realEstateValue, count: realEstate.length }
        })
      } catch (error) {
        console.error('Error fetching portfolio data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPortfolioData()
  }, [])

  const formatCurrency = (value: number) => {
    return value.toLocaleString('vi-VN') + ' ₫'
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Danh mục Đầu tư</h1>
          <p className="text-gray-600 mt-2">
            Quản lý Crypto, Vàng/Bạc, Quỹ đầu tư, Tiền mặt, và Bất động sản
          </p>
        </div>
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tổng giá trị</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.totalValue)}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className={`mt-2 text-sm ${summary.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {summary.pnl >= 0 ? '+' : ''}{summary.pnlPercent.toFixed(2)}% ({formatCurrency(summary.pnl)})
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Crypto</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.crypto.value)}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <Bitcoin className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-500">{summary.crypto.count} tài sản</div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Vàng & Quỹ</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.goldAndFunds.value)}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Coins className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-500">{summary.goldAndFunds.count} tài sản</div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tiền mặt</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.cash.value)}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Wallet className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-500">{summary.cash.count} tài sản</div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">BĐS</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.realEstate.value)}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Home className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-500">{summary.realEstate.count} tài sản</div>
        </div>
      </div>

      {/* Asset Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Crypto Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Bitcoin className="w-5 h-5 mr-2 text-orange-600" />
              Tiền mã hóa
            </h2>
            <Link
              href="/investments/crypto/new"
              className="bg-orange-500 text-white p-2 rounded-lg hover:bg-orange-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            <div className="text-sm text-gray-600">
              • Kết nối API sàn (Binance, OKX, Bybit)
            </div>
            <div className="text-sm text-gray-600">
              • Theo dõi USDT/VND tùy chỉnh
            </div>
            <div className="text-sm text-gray-600">
              • Cảnh báo cắt lỗ/chốt lời
            </div>
          </div>
          <Link
            href="/investments/crypto"
            className="mt-4 block text-center text-orange-600 hover:text-orange-700 font-medium"
          >
            Xem chi tiết →
          </Link>
        </div>

        {/* Gold/Silver Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Coins className="w-5 h-5 mr-2 text-yellow-600" />
              Vàng & Bạc
            </h2>
            <Link
              href="/investments/gold/new"
              className="bg-yellow-500 text-white p-2 rounded-lg hover:bg-yellow-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            <div className="text-sm text-gray-600">
              • Vàng SJC miếng
            </div>
            <div className="text-sm text-gray-600">
              • Vàng nhẫn/Trang sức
            </div>
            <div className="text-sm text-gray-600">
              • Bạc
            </div>
            <div className="text-sm text-gray-600">
              • Giá từ SJC, Doji, PNJ
            </div>
          </div>
          <Link
            href="/investments/gold"
            className="mt-4 block text-center text-yellow-600 hover:text-yellow-700 font-medium"
          >
            Xem chi tiết →
          </Link>
        </div>

        {/* Funds Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
              Quỹ đầu tư
            </h2>
            <Link
              href="/investments/funds/new"
              className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            <div className="text-sm text-gray-600">
              • Quỹ mở (Open-ended)
            </div>
            <div className="text-sm text-gray-600">
              • ETF
            </div>
            <div className="text-sm text-gray-600">
              • Cập nhật NAV tự động
            </div>
            <div className="text-sm text-gray-600">
              • So sánh với VN-Index
            </div>
          </div>
          <Link
            href="/investments/funds"
            className="mt-4 block text-center text-green-600 hover:text-green-700 font-medium"
          >
            Xem chi tiết →
          </Link>
        </div>

        {/* Cash Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Wallet className="w-5 h-5 mr-2 text-blue-600" />
              Tiền mặt
            </h2>
            <Link
              href="/investments/cash/new"
              className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            <div className="text-sm text-gray-600">
              • Tiền mặt VND, USD, EUR
            </div>
            <div className="text-sm text-gray-600">
              • Theo dõi vị trí lưu trữ
            </div>
            <div className="text-sm text-gray-600">
              • Quy đổi tỷ giá ngoại tệ
            </div>
          </div>
          <Link
            href="/investments/cash"
            className="mt-4 block text-center text-blue-600 hover:text-blue-700 font-medium"
          >
            Xem chi tiết →
          </Link>
        </div>

        {/* Real Estate Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Home className="w-5 h-5 mr-2 text-purple-600" />
              Bất động sản
            </h2>
            <Link
              href="/investments/real-estate/new"
              className="bg-purple-500 text-white p-2 rounded-lg hover:bg-purple-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            <div className="text-sm text-gray-600">
              • Căn hộ, nhà phố, đất nền
            </div>
            <div className="text-sm text-gray-600">
              • Theo dõi giá trị & lãi/lỗ
            </div>
            <div className="text-sm text-gray-600">
              • Thu nhập cho thuê
            </div>
          </div>
          <Link
            href="/investments/real-estate"
            className="mt-4 block text-center text-purple-600 hover:text-purple-700 font-medium"
          >
            Xem chi tiết →
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg shadow-lg p-6 text-white">
        <h2 className="text-xl font-semibold mb-4">Hiệu suất Đầu tư</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-blue-100">Tổng vốn đầu tư</p>
            <p className="text-2xl font-bold">{formatCurrency(summary.totalCost)}</p>
          </div>
          <div>
            <p className="text-sm text-blue-100">Giá trị hiện tại</p>
            <p className="text-2xl font-bold">{formatCurrency(summary.totalValue)}</p>
          </div>
          <div>
            <p className="text-sm text-blue-100">Lãi/Lỗ</p>
            <p className="text-2xl font-bold">{formatCurrency(summary.pnl)}</p>
          </div>
          <div>
            <p className="text-sm text-blue-100">ROI</p>
            <p className="text-2xl font-bold">{summary.pnlPercent.toFixed(2)}%</p>
          </div>
        </div>
      </div>
    </div>
  )
}
