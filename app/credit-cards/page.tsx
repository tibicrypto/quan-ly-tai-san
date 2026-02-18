'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CreditCard, Plus, Zap, TrendingUp, Calendar, Loader2 } from 'lucide-react'

export default function CreditCardsPage() {
  const [showOptimizer, setShowOptimizer] = useState(false)
  const [amount, setAmount] = useState('')
  const [cards, setCards] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch cards from database
  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await fetch('/api/credit-cards')
        if (response.ok) {
          const data = await response.json()
          setCards(data)
        }
      } catch (error) {
        console.error('Error fetching credit cards:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCards()
  }, [])

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Quản lý Thẻ Tín dụng
          </h1>
          <p className="text-gray-600 mt-2">
            Tối ưu dòng tiền với Credit Card Arbitrage
          </p>
        </div>
        <Link
          href="/credit-cards/new"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm thẻ</span>
        </Link>
      </div>

      {/* Smart Swipe Optimizer */}
      {cards.length > 0 && (
        <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <Zap className="w-8 h-8" />
          <div>
            <h2 className="text-2xl font-bold">Smart Swipe Optimizer</h2>
            <p className="text-sm text-green-100">
              Gợi ý thẻ tối ưu để tận dụng tối đa thời gian miễn lãi
            </p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mt-4">
          <label className="block text-sm font-medium mb-2">
            Số tiền dự định chi tiêu:
          </label>
          <div className="flex space-x-2">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Ví dụ: 30000000"
              className="flex-1 px-4 py-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-300"
            />
            <button
              onClick={() => setShowOptimizer(true)}
              className="bg-white text-green-600 px-6 py-2 rounded-lg hover:bg-green-50 transition-colors font-semibold"
            >
              Tính toán
            </button>
          </div>
        </div>

        {showOptimizer && amount && (
          <div className="mt-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 text-center">
              <p className="text-lg font-semibold mb-2">
                Chức năng đang được phát triển
              </p>
              <p className="text-sm text-green-100">
                Tính năng Smart Swipe Optimizer sẽ phân tích các thẻ của bạn và gợi ý thẻ tối ưu nhất để thanh toán.
              </p>
              <p className="text-xs text-green-50 mt-2">
                Vui lòng thêm thẻ tín dụng để sử dụng tính năng này.
              </p>
            </div>
          </div>
        )}
      </div>
      )}

      {/* Cards List */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Danh sách Thẻ ({cards.length})
        </h2>
        
        {isLoading ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <Loader2 className="w-16 h-16 text-blue-500 mx-auto mb-4 animate-spin" />
            <p className="text-gray-600">Đang tải danh sách thẻ...</p>
          </div>
        ) : cards.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              Chưa có thẻ tín dụng nào. Thêm thẻ để bắt đầu tối ưu!
            </p>
            <Link
              href="/credit-cards/new"
              className="inline-block bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Thêm thẻ đầu tiên
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cards.map((card) => (
              <div
                key={card.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {card.bankName} {card.cardName}
                    </h3>
                    <p className="text-sm text-gray-500">****{card.lastFourDigits}</p>
                  </div>
                  <CreditCard className="w-8 h-8 text-blue-500" />
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Ngày sao kê:</span>
                    <span className="font-semibold">Ngày {card.statementDay}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Chu kỳ miễn lãi:</span>
                    <span className="font-semibold">{card.interestFreeDays} ngày</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Hạn thanh toán:</span>
                    <span className="font-semibold">
                      +{card.paymentDueDays} ngày sau sao kê
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <Link
                    href={`/credit-cards/${card.id}`}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Xem chi tiết →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Features Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <Zap className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Smart Swipe</h3>
          </div>
          <p className="text-sm text-gray-600">
            Tự động gợi ý thẻ tối ưu dựa trên ngày sao kê để tận dụng tối đa thời gian miễn lãi
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Cash-to-Savings</h3>
          </div>
          <p className="text-sm text-gray-600">
            Đề xuất gửi tiết kiệm thay vì trả ngay, tận dụng vốn ngân hàng để sinh lời
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Auto Reminder</h3>
          </div>
          <p className="text-sm text-gray-600">
            Nhắc nhở tự động trước hạn thanh toán, tránh phí phạt và lãi suất cao
          </p>
        </div>
      </div>
    </div>
  )
}
