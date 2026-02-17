'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Home, ArrowLeft, Save } from 'lucide-react'

export default function NewRealEstateAssetPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    type: 'APARTMENT',
    name: '',
    address: '',
    area: '',
    purchasePrice: '',
    currentPrice: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    ownership: 'FULL',
    rentalIncome: '',
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
      const response = await fetch('/api/investments/real-estate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          ownershipPercentage: formData.ownership === 'FULL' ? 100 : parseFloat(formData.ownership) || 100,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create real estate asset')
      }

      router.push('/investments/real-estate')
    } catch (error) {
      console.error('Error creating real estate asset:', error)
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
              href="/investments/real-estate"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Home className="w-8 h-8 mr-3 text-purple-600" />
                Thêm Bất động sản
              </h1>
              <p className="text-gray-600 mt-1">
                Nhập thông tin bất động sản của bạn
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
              Loại bất động sản *
            </label>
            <select
              name="type"
              required
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="APARTMENT">Căn hộ chung cư</option>
              <option value="HOUSE">Nhà phố/Biệt thự</option>
              <option value="LAND">Đất nền</option>
              <option value="COMMERCIAL">Thương mại/Văn phòng</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên bất động sản *
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Căn hộ Vinhomes Central Park"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Địa chỉ đầy đủ *
            </label>
            <input
              type="text"
              name="address"
              required
              value={formData.address}
              onChange={handleChange}
              placeholder="208 Nguyễn Hữu Cảnh, Bình Thạnh, TP.HCM"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Diện tích (m²) *
              </label>
              <input
                type="number"
                name="area"
                required
                step="0.01"
                value={formData.area}
                onChange={handleChange}
                placeholder="75"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quyền sở hữu *
              </label>
              <select
                name="ownership"
                required
                value={formData.ownership}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="FULL">Sở hữu toàn bộ (100%)</option>
                <option value="50">Sở hữu 50%</option>
                <option value="33">Sở hữu 33%</option>
                <option value="25">Sở hữu 25%</option>
              </select>
            </div>
          </div>
        </div>

        {/* Price Information */}
        <div className="space-y-4 border-t pt-6">
          <h2 className="text-xl font-semibold text-gray-900">Thông tin giá</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giá mua (VND) *
              </label>
              <input
                type="number"
                name="purchasePrice"
                required
                step="1000000"
                value={formData.purchasePrice}
                onChange={handleChange}
                placeholder="4500000000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Tổng giá mua (bao gồm các chi phí)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giá hiện tại (VND)
              </label>
              <input
                type="number"
                name="currentPrice"
                step="1000000"
                value={formData.currentPrice}
                onChange={handleChange}
                placeholder="5200000000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Giá thị trường hiện tại (ước tính)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thu nhập cho thuê/tháng (VND)
              </label>
              <input
                type="number"
                name="rentalIncome"
                step="1000000"
                value={formData.rentalIncome}
                onChange={handleChange}
                placeholder="25000000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Để trống nếu không cho thuê
              </p>
            </div>
          </div>

          {/* Investment Summary */}
          {formData.purchasePrice && formData.area && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-purple-900 mb-2">Thông tin đầu tư</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Giá/m²:</p>
                  <p className="text-lg font-bold text-purple-900">
                    {(parseFloat(formData.purchasePrice) / parseFloat(formData.area) / 1000000).toFixed(0)} triệu/m²
                  </p>
                </div>
                {formData.currentPrice && (
                  <div>
                    <p className="text-gray-600">Lãi/Lỗ ước tính:</p>
                    <p className="text-lg font-bold text-purple-900">
                      {((parseFloat(formData.currentPrice) - parseFloat(formData.purchasePrice)) / 1000000).toFixed(0)} triệu
                    </p>
                  </div>
                )}
                {formData.rentalIncome && (
                  <div className="col-span-2">
                    <p className="text-gray-600">Tỷ suất cho thuê (ước tính):</p>
                    <p className="text-lg font-bold text-purple-900">
                      {((parseFloat(formData.rentalIncome) * 12 / parseFloat(formData.purchasePrice)) * 100).toFixed(2)}% /năm
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
              placeholder="Thêm ghi chú về bất động sản này..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-4 border-t pt-6">
          <Link
            href="/investments/real-estate"
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Hủy
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSubmitting ? 'Đang lưu...' : 'Lưu tài sản'}
          </button>
        </div>
      </form>
    </div>
  )
}
