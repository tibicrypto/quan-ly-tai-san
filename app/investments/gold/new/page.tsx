'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Coins, ArrowLeft, Save } from 'lucide-react'

export default function NewGoldAssetPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    type: 'SJC_GOLD_BAR',
    name: '',
    weight: '',
    unit: 'lượng',
    purchasePrice: '',
    vendor: 'SJC',
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
      const response = await fetch('/api/investments/gold', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      
      if (!response.ok) {
        throw new Error('Failed to create asset')
      }
      
      // Navigate back to gold page
      router.push('/investments/gold')
    } catch (error) {
      console.error('Error creating gold/silver asset:', error)
      alert('Có lỗi xảy ra khi tạo tài sản. Vui lòng thử lại.')
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
              href="/investments/gold"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Coins className="w-8 h-8 mr-3 text-yellow-600" />
                Thêm Tài sản Vàng/Bạc
              </h1>
              <p className="text-gray-600 mt-1">
                Nhập thông tin vàng hoặc bạc của bạn
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
              Loại tài sản *
            </label>
            <select
              name="type"
              required
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              <option value="SJC_GOLD_BAR">Vàng miếng SJC</option>
              <option value="JEWELRY_GOLD">Vàng nhẫn/Trang sức</option>
              <option value="SILVER">Bạc</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên tài sản *
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Vàng SJC 1 lượng"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trọng lượng *
              </label>
              <input
                type="number"
                name="weight"
                required
                step="0.001"
                value={formData.weight}
                onChange={handleChange}
                placeholder="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Đơn vị *
              </label>
              <select
                name="unit"
                required
                value={formData.unit}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                <option value="lượng">Lượng</option>
                <option value="chỉ">Chỉ</option>
                <option value="gram">Gram</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nhà cung cấp
            </label>
            <select
              name="vendor"
              value={formData.vendor}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              <option value="SJC">SJC</option>
              <option value="DOJI">DOJI</option>
              <option value="PNJ">PNJ</option>
              <option value="Other">Khác</option>
            </select>
          </div>
        </div>

        {/* Price Information */}
        <div className="space-y-4 border-t pt-6">
          <h2 className="text-xl font-semibold text-gray-900">Thông tin giá</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Giá mua (VND/đơn vị) *
            </label>
            <input
              type="number"
              name="purchasePrice"
              required
              step="1000"
              value={formData.purchasePrice}
              onChange={handleChange}
              placeholder="75500000"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Giá mua trên 1 {formData.unit}. Giá này sẽ được sử dụng làm giá hiện tại ban đầu.
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-4 border-t pt-6">
          <Link
            href="/investments/gold"
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Hủy
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSubmitting ? 'Đang lưu...' : 'Lưu tài sản'}
          </button>
        </div>
      </form>
    </div>
  )
}
