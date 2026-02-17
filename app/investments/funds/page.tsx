'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { TrendingUp, Plus, BarChart3, Loader2 } from 'lucide-react'

interface FundAsset {
  id: string
  name: string
  fundCode: string
  fundCompany: string
  type: 'OPEN_ENDED' | 'ETF'
  units: number
  avgNavPrice: number
  currentNav: number
  purchaseDate: string
}

export default function FundsPage() {
  const [assets, setAssets] = useState<FundAsset[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAssets()
  }, [])

  const fetchAssets = async () => {
    try {
      const response = await fetch('/api/investments/funds')
      if (response.ok) {
        const data = await response.json()
        setAssets(data)
      }
    } catch (error) {
      console.error('Error fetching fund assets:', error)
    } finally {
      setLoading(false)
    }
  }

  const totalValue = assets.reduce((sum, asset) => 
    sum + (asset.units * asset.currentNav), 0
  )
  
  const totalPnL = assets.reduce((sum, asset) => 
    sum + (asset.units * (asset.currentNav - asset.avgNavPrice)), 0
  )

  const totalPnLPercent = assets.length > 0 && totalValue > 0
    ? (totalPnL / (totalValue - totalPnL)) * 100
    : 0

  // Mock VN-Index performance for comparison
  const vnIndexReturn = 12.5

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/investments" className="text-sm text-blue-600 hover:text-blue-700 mb-2 inline-block">
            ← Quay lại Đầu tư
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Quỹ đầu tư</h1>
          <p className="text-gray-600 mt-2">
            Quản lý quỹ mở và ETF với so sánh hiệu suất với VN-Index
          </p>
        </div>
        <Link
          href="/investments/funds/new"
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm quỹ</span>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-green-100">Tổng giá trị</span>
            <BarChart3 className="w-5 h-5" />
          </div>
          <div className="text-2xl font-bold">
            {totalValue.toLocaleString('vi-VN')} ₫
          </div>
          <div className="text-sm text-green-100 mt-2">
            {assets.length} quỹ
          </div>
        </div>

        <div className={`rounded-lg shadow-lg p-6 text-white ${
          totalPnL >= 0 
            ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
            : 'bg-gradient-to-br from-red-500 to-red-600'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm opacity-90">Lãi/Lỗ</span>
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="text-2xl font-bold">
            {totalPnL >= 0 ? '+' : ''}{totalPnL.toLocaleString('vi-VN')} ₫
          </div>
          <div className="text-sm opacity-90 mt-2">
            {totalPnLPercent >= 0 ? '+' : ''}{totalPnLPercent.toFixed(2)}%
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-purple-100">So với VN-Index</span>
            <BarChart3 className="w-5 h-5" />
          </div>
          <div className="text-2xl font-bold">
            {totalPnLPercent > vnIndexReturn ? '🏆' : '📊'} 
            {totalPnLPercent >= 0 ? '+' : ''}{(totalPnLPercent - vnIndexReturn).toFixed(2)}%
          </div>
          <div className="text-sm text-purple-100 mt-2">
            {totalPnLPercent > vnIndexReturn ? 'Chiến thắng thị trường' : 'VN-Index tốt hơn'}
          </div>
        </div>
      </div>

      {/* Performance Comparison */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          So sánh Hiệu suất
        </h2>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Danh mục của bạn</span>
              <span className="text-sm font-semibold text-green-600">
                {totalPnLPercent >= 0 ? '+' : ''}{totalPnLPercent.toFixed(2)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-green-500 h-3 rounded-full transition-all"
                style={{ width: `${Math.min(Math.abs(totalPnLPercent) * 3, 100)}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">VN-Index</span>
              <span className="text-sm font-semibold text-blue-600">
                +{vnIndexReturn.toFixed(2)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-blue-500 h-3 rounded-full transition-all"
                style={{ width: `${Math.min(vnIndexReturn * 3, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {totalPnLPercent > vnIndexReturn ? (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-sm text-green-800">
              🎉 <strong>Xuất sắc!</strong> Danh mục của bạn đang chiến thắng thị trường với hiệu suất 
              vượt VN-Index {(totalPnLPercent - vnIndexReturn).toFixed(2)}%.
            </p>
          </div>
        ) : (
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              📊 VN-Index đang có hiệu suất tốt hơn {(vnIndexReturn - totalPnLPercent).toFixed(2)}%. 
              Có thể xem xét đầu tư vào ETF theo dõi VN-Index.
            </p>
          </div>
        )}
      </div>

      {/* Popular Funds */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Quỹ phổ biến tại Việt Nam
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded-lg p-4 hover:border-green-500 hover:shadow-md transition-all cursor-pointer">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-gray-900">DCDS</span>
              <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">Quỹ mở</span>
            </div>
            <div className="text-sm text-gray-600 mb-2">
              Dragon Capital Dividend Select
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-500">NAV hiện tại</div>
                <div className="font-semibold text-gray-900">16,800 ₫</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500">YTD</div>
                <div className="text-sm font-semibold text-green-600">+8.5%</div>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 hover:border-green-500 hover:shadow-md transition-all cursor-pointer">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-gray-900">VCBF-BCF</span>
              <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">Quỹ mở</span>
            </div>
            <div className="text-sm text-gray-600 mb-2">
              VinaCapital Balanced Fund
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-500">NAV hiện tại</div>
                <div className="font-semibold text-gray-900">12,450 ₫</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500">YTD</div>
                <div className="text-sm font-semibold text-green-600">+10.2%</div>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 hover:border-green-500 hover:shadow-md transition-all cursor-pointer">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-gray-900">SSIAM-VNX50</span>
              <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">ETF</span>
            </div>
            <div className="text-sm text-gray-600 mb-2">
              SSIAM VNX50 ETF
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-500">NAV hiện tại</div>
                <div className="font-semibold text-gray-900">28,900 ₫</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500">YTD</div>
                <div className="text-sm font-semibold text-green-600">+12.8%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Assets List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Danh sách Quỹ sở hữu
        </h2>
        
        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-16 h-16 text-green-600 mx-auto mb-4 animate-spin" />
            <p className="text-gray-600">Đang tải dữ liệu...</p>
          </div>
        ) : assets.length === 0 ? (
          <div className="text-center py-12">
            <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">Chưa có quỹ đầu tư nào</p>
            <Link
              href="/investments/funds/new"
              className="inline-block bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              Thêm quỹ đầu tiên
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {assets.map((asset) => {
              const pnl = asset.units * (asset.currentNav - asset.avgNavPrice)
              const pnlPercent = ((asset.currentNav - asset.avgNavPrice) / asset.avgNavPrice) * 100

              return (
                <div
                  key={asset.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-green-500 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-green-100 p-3 rounded-lg">
                        <BarChart3 className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-gray-900">{asset.fundCode}</h3>
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            {asset.type === 'OPEN_ENDED' ? 'Quỹ mở' : 'ETF'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-900">{asset.name}</p>
                        <p className="text-xs text-gray-500">
                          {asset.fundCompany} • {asset.units.toLocaleString()} CCQ
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-semibold text-gray-900">
                        {(asset.units * asset.currentNav).toLocaleString('vi-VN')} ₫
                      </div>
                      <div className={`text-sm ${
                        pnlPercent >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {pnlPercent >= 0 ? '+' : ''}{pnlPercent.toFixed(2)}% 
                        ({pnl >= 0 ? '+' : ''}{pnl.toLocaleString('vi-VN')} ₫)
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">NAV TB mua:</span>
                      <div className="font-medium">
                        {asset.avgNavPrice.toLocaleString('vi-VN')} ₫
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">NAV hiện tại:</span>
                      <div className="font-medium">
                        {asset.currentNav.toLocaleString('vi-VN')} ₫
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Ngày mua:</span>
                      <div className="font-medium">
                        {new Date(asset.purchaseDate).toLocaleDateString('vi-VN')}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex space-x-2">
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                      Chi tiết
                    </button>
                    <button className="text-sm text-green-600 hover:text-green-700 font-medium">
                      Cập nhật NAV
                    </button>
                    <button className="text-sm text-gray-600 hover:text-gray-700 font-medium">
                      Lịch sử giao dịch
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Features Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-900 mb-2">📊 Quỹ mở (Open-ended)</h3>
          <p className="text-sm text-green-800">
            Tự động cập nhật NAV cuối ngày giao dịch từ các công ty quỹ uy tín
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">📈 ETF</h3>
          <p className="text-sm text-blue-800">
            Giao dịch linh hoạt như cổ phiếu, theo dõi chỉ số thị trường
          </p>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h3 className="font-semibold text-purple-900 mb-2">🎯 So sánh VN-Index</h3>
          <p className="text-sm text-purple-800">
            Đánh giá hiệu suất danh mục so với thị trường chung
          </p>
        </div>
      </div>
    </div>
  )
}
