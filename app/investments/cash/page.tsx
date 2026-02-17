'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Wallet, Plus, TrendingUp, TrendingDown } from 'lucide-react'

interface CashAsset {
  id: string
  name: string
  currency: string
  amount: number
  location: string
}

export default function CashPage() {
  const [assets] = useState<CashAsset[]>([
    {
      id: '1',
      name: 'Tiền mặt VND',
      currency: 'VND',
      amount: 50000000,
      location: 'Nhà',
    },
    {
      id: '2',
      name: 'Tiền mặt USD',
      currency: 'USD',
      amount: 1000,
      location: 'Két sắt',
    },
  ])

  const totalValueVND = assets.reduce((sum, asset) => {
    if (asset.currency === 'VND') {
      return sum + asset.amount
    } else if (asset.currency === 'USD') {
      return sum + (asset.amount * 24000) // Simplified conversion
    }
    return sum
  }, 0)

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Wallet className="w-8 h-8 mr-3 text-blue-600" />
            Tiền mặt
          </h1>
          <p className="text-gray-600 mt-2">
            Quản lý tiền mặt các loại tiền tệ
          </p>
        </div>
        <Link
          href="/investments/cash/new"
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Thêm tiền mặt
        </Link>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-md p-6 text-white">
          <p className="text-sm opacity-90">Tổng giá trị (VND)</p>
          <p className="text-3xl font-bold mt-2">
            {totalValueVND.toLocaleString('vi-VN')} ₫
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-sm text-gray-600">Số loại tiền tệ</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {new Set(assets.map(a => a.currency)).size}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-sm text-gray-600">Tổng số tài khoản</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {assets.length}
          </p>
        </div>
      </div>

      {/* Assets List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Danh sách tiền mặt</h2>
        </div>
        <div className="divide-y">
          {assets.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Chưa có tài sản nào. Nhấn &quot;Thêm tiền mặt&quot; để bắt đầu.
            </div>
          ) : (
            assets.map((asset) => (
              <div key={asset.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <Wallet className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{asset.name}</h3>
                      <p className="text-sm text-gray-600">
                        {asset.location} • {asset.currency}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      {asset.amount.toLocaleString('vi-VN')} {asset.currency}
                    </p>
                    {asset.currency === 'USD' && (
                      <p className="text-sm text-gray-500">
                        ≈ {(asset.amount * 24000).toLocaleString('vi-VN')} ₫
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">💡 Mẹo quản lý</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• Giữ một lượng tiền mặt hợp lý cho chi tiêu khẩn cấp</li>
            <li>• Cân nhắc gửi tiết kiệm nếu số tiền lớn</li>
            <li>• Theo dõi tỷ giá ngoại tệ để tối ưu hóa</li>
          </ul>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-900 mb-3">📊 Thống kê</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-green-800">VND:</span>
              <span className="font-semibold text-green-900">
                {assets.filter(a => a.currency === 'VND')
                  .reduce((sum, a) => sum + a.amount, 0)
                  .toLocaleString('vi-VN')} ₫
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-800">USD:</span>
              <span className="font-semibold text-green-900">
                {assets.filter(a => a.currency === 'USD')
                  .reduce((sum, a) => sum + a.amount, 0)
                  .toLocaleString('vi-VN')} $
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
