'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Home, Plus, TrendingUp, Loader2 } from 'lucide-react'

interface RealEstateAsset {
  id: string
  type: string
  name: string
  address: string
  area: number
  purchasePrice: number
  currentPrice: number
  purchaseDate: string
  rentalIncome?: number | null
}

export default function RealEstatePage() {
  const [assets, setAssets] = useState<RealEstateAsset[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAssets()
  }, [])

  const fetchAssets = async () => {
    try {
      const response = await fetch('/api/investments/real-estate')
      if (response.ok) {
        const data = await response.json()
        setAssets(data)
      }
    } catch (error) {
      console.error('Error fetching real estate assets:', error)
    } finally {
      setLoading(false)
    }
  }

  const totalValue = assets.reduce((sum, asset) => sum + asset.currentPrice, 0)
  const totalPnL = assets.reduce((sum, asset) => sum + (asset.currentPrice - asset.purchasePrice), 0)
  const totalPnLPercent = assets.length > 0 ? (totalPnL / (totalValue - totalPnL)) * 100 : 0
  const totalRentalIncome = assets.reduce((sum, asset) => sum + (asset.rentalIncome || 0), 0)

  const getAssetTypeLabel = (type: string) => {
    switch (type) {
      case 'APARTMENT': return 'Căn hộ'
      case 'HOUSE': return 'Nhà phố'
      case 'LAND': return 'Đất nền'
      case 'COMMERCIAL': return 'Thương mại'
      default: return type
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Home className="w-8 h-8 mr-3 text-purple-600" />
            Bất động sản
          </h1>
          <p className="text-gray-600 mt-2">
            Quản lý danh mục bất động sản
          </p>
        </div>
        <Link
          href="/investments/real-estate/new"
          className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Thêm BĐS
        </Link>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-md p-6 text-white">
          <p className="text-sm opacity-90">Tổng giá trị</p>
          <p className="text-3xl font-bold mt-2">
            {(totalValue / 1000000000).toFixed(1)} tỷ
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-sm text-gray-600">Lãi/Lỗ</p>
          <p className={`text-2xl font-bold mt-2 ${totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {totalPnL >= 0 ? '+' : ''}{(totalPnL / 1000000).toFixed(0)} tr
          </p>
          <p className={`text-sm ${totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {totalPnL >= 0 ? '+' : ''}{totalPnLPercent.toFixed(2)}%
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-sm text-gray-600">Thu nhập thuê/tháng</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {(totalRentalIncome / 1000000).toFixed(1)} tr
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-sm text-gray-600">Số BĐS</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {assets.length}
          </p>
        </div>
      </div>

      {/* Assets List */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white rounded-lg shadow-md p-8 flex justify-center items-center">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          </div>
        ) : assets.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
            Chưa có bất động sản nào. Nhấn &quot;Thêm BĐS&quot; để bắt đầu.
          </div>
        ) : (
          assets.map((asset) => {
            const pnl = asset.currentPrice - asset.purchasePrice
            const pnlPercent = (pnl / asset.purchasePrice) * 100

            return (
              <div key={asset.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="bg-purple-100 p-3 rounded-lg">
                      <Home className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded">
                          {getAssetTypeLabel(asset.type)}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">{asset.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{asset.address}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Diện tích: {asset.area}m² • Mua: {new Date(asset.purchaseDate).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Giá trị hiện tại</p>
                    <p className="text-xl font-bold text-gray-900">
                      {(asset.currentPrice / 1000000000).toFixed(2)} tỷ
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-xs text-gray-600">Giá mua</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {(asset.purchasePrice / 1000000000).toFixed(2)} tỷ
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Lãi/Lỗ</p>
                    <p className={`text-sm font-semibold ${pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {pnl >= 0 ? '+' : ''}{(pnl / 1000000).toFixed(0)} tr
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">ROI</p>
                    <p className={`text-sm font-semibold ${pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {pnl >= 0 ? '+' : ''}{pnlPercent.toFixed(2)}%
                    </p>
                  </div>
                  {asset.rentalIncome && (
                    <div>
                      <p className="text-xs text-gray-600">Thu nhập/tháng</p>
                      <p className="text-sm font-semibold text-blue-600">
                        {(asset.rentalIncome / 1000000).toFixed(1)} tr
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-purple-900 mb-3">🏠 Lợi ích đầu tư BĐS</h3>
          <ul className="space-y-2 text-sm text-purple-800">
            <li>• Tài sản hữu hình, giá trị ổn định</li>
            <li>• Thu nhập thụ động từ cho thuê</li>
            <li>• Tiềm năng tăng giá dài hạn</li>
            <li>• Đa dạng hóa danh mục đầu tư</li>
          </ul>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-amber-900 mb-3">⚠️ Lưu ý</h3>
          <ul className="space-y-2 text-sm text-amber-800">
            <li>• Vốn đầu tư ban đầu lớn</li>
            <li>• Thanh khoản thấp</li>
            <li>• Chi phí bảo trì, thuế định kỳ</li>
            <li>• Rủi ro pháp lý, quy hoạch</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
