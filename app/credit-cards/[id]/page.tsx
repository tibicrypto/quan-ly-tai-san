'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { CreditCard, Save, ArrowLeft, Trash2, Loader2 } from 'lucide-react'

export default function CreditCardDetailPage() {
  const router = useRouter()
  const params = useParams()
  const cardId = params.id as string

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  
  const [formData, setFormData] = useState({
    bankName: '',
    cardName: '',
    lastFourDigits: '',
    statementDay: '',
    interestFreeDays: '',
    paymentDueDays: '',
    creditLimit: '',
    notes: '',
  })

  // Fetch card details
  useEffect(() => {
    const fetchCard = async () => {
      try {
        const response = await fetch(`/api/credit-cards/${cardId}`)
        if (response.ok) {
          const data = await response.json()
          setFormData({
            bankName: data.bankName,
            cardName: data.cardName,
            lastFourDigits: data.lastFourDigits,
            statementDay: data.statementDay.toString(),
            interestFreeDays: data.interestFreeDays.toString(),
            paymentDueDays: data.paymentDueDays.toString(),
            creditLimit: data.creditLimit ? data.creditLimit.toString() : '',
            notes: data.notes || '',
          })
        } else {
          alert('Không tìm thấy thẻ tín dụng')
          router.push('/credit-cards')
        }
      } catch (error) {
        console.error('Error fetching card:', error)
        alert('Có lỗi xảy ra khi tải thông tin thẻ')
      } finally {
        setIsLoading(false)
      }
    }

    fetchCard()
  }, [cardId, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const response = await fetch(`/api/credit-cards/${cardId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        alert('Cập nhật thông tin thẻ thành công!')
        setIsEditing(false)
      } else {
        const error = await response.json()
        alert(`Có lỗi xảy ra: ${error.error || 'Vui lòng thử lại'}`)
      }
    } catch (error) {
      console.error('Error updating card:', error)
      alert('Có lỗi xảy ra khi cập nhật thẻ')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Bạn có chắc muốn xóa thẻ này?')) {
      return
    }

    try {
      const response = await fetch(`/api/credit-cards/${cardId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        alert('Đã xóa thẻ thành công!')
        router.push('/credit-cards')
      } else {
        const error = await response.json()
        alert(`Có lỗi xảy ra: ${error.error || 'Vui lòng thử lại'}`)
      }
    } catch (error) {
      console.error('Error deleting card:', error)
      alert('Có lỗi xảy ra khi xóa thẻ')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/credit-cards"
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Chi tiết Thẻ Tín dụng
            </h1>
            <p className="text-gray-600 mt-1">
              {formData.bankName} {formData.cardName}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {!isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Chỉnh sửa
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Xóa</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSaving}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2 disabled:opacity-50"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Card Info */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-3 mb-6">
          <CreditCard className="w-8 h-8 text-blue-500" />
          <h2 className="text-xl font-semibold text-gray-900">
            Thông tin Thẻ
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Bank Name & Card Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngân hàng <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.bankName}
                onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên thẻ <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.cardName}
                onChange={(e) => setFormData({ ...formData, cardName: e.target.value })}
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                required
              />
            </div>
          </div>

          {/* Last Four Digits */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              4 số cuối <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.lastFourDigits}
              onChange={(e) => setFormData({ ...formData, lastFourDigits: e.target.value })}
              disabled={!isEditing}
              maxLength={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              required
            />
          </div>

          {/* Payment Cycle */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Chu kỳ thanh toán
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày sao kê <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.statementDay}
                  onChange={(e) => setFormData({ ...formData, statementDay: e.target.value })}
                  disabled={!isEditing}
                  min="1"
                  max="31"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Ngày trong tháng (1-31)</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số ngày miễn lãi <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.interestFreeDays}
                  onChange={(e) => setFormData({ ...formData, interestFreeDays: e.target.value })}
                  disabled={!isEditing}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Ví dụ: 45, 55 ngày</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kỳ thanh toán <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.paymentDueDays}
                  onChange={(e) => setFormData({ ...formData, paymentDueDays: e.target.value })}
                  disabled={!isEditing}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Số ngày sau sao kê</p>
              </div>
            </div>
          </div>

          {/* Optional Fields */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Thông tin bổ sung (Tùy chọn)
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hạn mức tín dụng
                </label>
                <input
                  type="number"
                  value={formData.creditLimit}
                  onChange={(e) => setFormData({ ...formData, creditLimit: e.target.value })}
                  disabled={!isEditing}
                  placeholder="Ví dụ: 50000000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ghi chú
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  disabled={!isEditing}
                  rows={3}
                  placeholder="Ghi chú về thẻ..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Credit Card Arbitrage Strategy Info */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-md p-6 text-white">
        <h3 className="text-xl font-semibold mb-3">💡 Credit Card Arbitrage Strategy</h3>
        <div className="space-y-2 text-sm">
          <p>
            <strong>Chu kỳ miễn lãi:</strong> {formData.interestFreeDays} ngày
          </p>
          <p>
            <strong>Cách tối ưu:</strong> Chi tiêu ngay sau ngày sao kê để tận dụng tối đa thời gian miễn lãi
          </p>
          <p>
            <strong>Lợi ích:</strong> Gửi tiết kiệm số tiền tương đương thay vì trả ngay, kiếm lãi từ vốn của ngân hàng
          </p>
        </div>
      </div>
    </div>
  )
}
