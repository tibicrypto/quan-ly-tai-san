'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { TrendingUp, ArrowLeft, Save } from 'lucide-react'

export default function NewFundAssetPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    fundCode: '',
    fundCompany: 'Dragon Capital',
    type: 'OPEN_ENDED',
    units: '',
    avgNavPrice: '',
    currentNav: '',
    purchaseDate: new Date().toISOString().split('T')[0],
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
      const response = await fetch('/api/investments/funds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      
      if (!response.ok) {
        throw new Error('Failed to create fund asset')
      }
      
      router.push('/investments/funds')
    } catch (error) {
      console.error('Error creating fund asset:', error)
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
              href="/investments/funds"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <TrendingUp className="w-8 h-8 mr-3 text-green-600" />
                Thêm Quỹ đầu tư
              </h1>
              <p className="text-gray-600 mt-1">
                Nhập thông tin quỹ đầu tư của bạn
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
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên quỹ *
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="DCDS - Dragon Capital Dividend Select"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mã quỹ *
              </label>
              <input
                type="text"
                name="fundCode"
                required
                value={formData.fundCode}
                onChange={handleChange}
                placeholder="DCDS"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Công ty quản lý *
              </label>
              <select
                name="fundCompany"
                required
                value={formData.fundCompany}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="Dragon Capital">Dragon Capital</option>
                <option value="VinaCapital">VinaCapital</option>
                <option value="SSIAM">SSIAM</option>
                <option value="Manulife">Manulife</option>
                <option value="VFM">VFM</option>
                <option value="Other">Khác</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loại quỹ *
            </label>
            <select
              name="type"
              required
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="OPEN_ENDED">Quỹ mở (Open-ended)</option>
              <option value="ETF">ETF</option>
            </select>
          </div>
        </div>

        {/* Investment Details */}
        <div className="space-y-4 border-t pt-6">
          <h2 className="text-xl font-semibold text-gray-900">Chi tiết đầu tư</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số lượng chứng chỉ quỹ *
              </label>
              <input
                type="number"
                name="units"
                required
                step="0.01"
                value={formData.units}
                onChange={handleChange}
                placeholder="1000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Số lượng CCQ đang nắm giữ
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                NAV trung bình (VND) *
              </label>
              <input
                type="number"
                name="avgNavPrice"
                required
                step="1"
                value={formData.avgNavPrice}
                onChange={handleChange}
                placeholder="15250"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Giá NAV trung bình lúc mua
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                NAV hiện tại (VND)
              </label>
              <input
                type="number"
                name="currentNav"
                step="1"
                value={formData.currentNav}
                onChange={handleChange}
                placeholder="16800"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Giá NAV hiện tại trên thị trường
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày mua *
              </label>
              <input
                type="date"
                name="purchaseDate"
                required
                value={formData.purchaseDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Investment Summary */}
          {formData.units && formData.avgNavPrice && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-green-900 mb-2">Tổng kết đầu tư</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Tổng vốn đầu tư:</p>
                  <p className="text-lg font-bold text-green-900">
                    {(parseFloat(formData.units) * parseFloat(formData.avgNavPrice)).toLocaleString('vi-VN')} ₫
                  </p>
                </div>
                {formData.currentNav && (
                  <div>
                    <p className="text-gray-600">Giá trị hiện tại:</p>
                    <p className="text-lg font-bold text-green-900">
                      {(parseFloat(formData.units) * parseFloat(formData.currentNav)).toLocaleString('vi-VN')} ₫
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
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
              placeholder="Thêm ghi chú về quỹ đầu tư này..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-4 border-t pt-6">
          <Link
            href="/investments/funds"
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Hủy
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSubmitting ? 'Đang lưu...' : 'Lưu quỹ đầu tư'}
          </button>
        </div>
      </form>
    </div>
  )
}
