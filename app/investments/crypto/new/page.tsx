'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Bitcoin, ArrowLeft, Save } from 'lucide-react'

export default function NewCryptoAssetPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    exchange: 'Binance',
    balance: '',
    averagePrice: '',
    currentPrice: '',
    usdtVndRate: '24000',
    alertThreshold: '',
    stopLoss: '',
    takeProfit: '',
    notes: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // TODO: Implement API call to save crypto asset
      // const response = await fetch('/api/investments/crypto', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // })
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Navigate back to crypto page
      router.push('/investments/crypto')
    } catch (error) {
      console.error('Error creating crypto asset:', error)
      alert('Có lỗi xảy ra khi tạo tài sản')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3">
            <Link
              href="/investments/crypto"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Bitcoin className="w-8 h-8 mr-3 text-orange-600" />
                Thêm Tài sản Crypto
              </h1>
              <p className="text-gray-600 mt-1">
                Nhập thông tin tài sản tiền mã hóa của bạn
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Thông tin cơ bản</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên coin *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Bitcoin"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Symbol *
              </label>
              <input
                type="text"
                name="symbol"
                required
                value={formData.symbol}
                onChange={handleChange}
                placeholder="BTC"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sàn giao dịch *
            </label>
            <select
              name="exchange"
              required
              value={formData.exchange}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="Binance">Binance</option>
              <option value="OKX">OKX</option>
              <option value="Bybit">Bybit</option>
              <option value="Other">Khác</option>
            </select>
          </div>
        </div>

        {/* Holdings & Price */}
        <div className="space-y-4 border-t pt-6">
          <h2 className="text-xl font-semibold text-gray-900">Số dư & Giá</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số dư (Balance) *
              </label>
              <input
                type="number"
                name="balance"
                required
                step="0.00000001"
                value={formData.balance}
                onChange={handleChange}
                placeholder="0.05"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giá mua trung bình (USDT) *
              </label>
              <input
                type="number"
                name="averagePrice"
                required
                step="0.01"
                value={formData.averagePrice}
                onChange={handleChange}
                placeholder="45000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giá hiện tại (USDT)
              </label>
              <input
                type="number"
                name="currentPrice"
                step="0.01"
                value={formData.currentPrice}
                onChange={handleChange}
                placeholder="52000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tỷ giá USDT/VND *
              </label>
              <input
                type="number"
                name="usdtVndRate"
                required
                step="1"
                value={formData.usdtVndRate}
                onChange={handleChange}
                placeholder="24000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Alert Settings */}
        <div className="space-y-4 border-t pt-6">
          <h2 className="text-xl font-semibold text-gray-900">Cảnh báo (Tùy chọn)</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngưỡng cảnh báo (%)
              </label>
              <input
                type="number"
                name="alertThreshold"
                step="0.1"
                value={formData.alertThreshold}
                onChange={handleChange}
                placeholder="5"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cắt lỗ (USDT)
              </label>
              <input
                type="number"
                name="stopLoss"
                step="0.01"
                value={formData.stopLoss}
                onChange={handleChange}
                placeholder="40000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chốt lời (USDT)
              </label>
              <input
                type="number"
                name="takeProfit"
                step="0.01"
                value={formData.takeProfit}
                onChange={handleChange}
                placeholder="60000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-4 border-t pt-6">
          <h2 className="text-xl font-semibold text-gray-900">Ghi chú</h2>
          
          <div>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              placeholder="Thêm ghi chú về tài sản này..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-4 border-t pt-6">
          <Link
            href="/investments/crypto"
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Hủy
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSubmitting ? 'Đang lưu...' : 'Lưu tài sản'}
          </button>
        </div>
      </form>
    </div>
  )
}
