'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Bitcoin, TrendingUp, TrendingDown, AlertTriangle, Plus, RefreshCw } from 'lucide-react'

interface CryptoAsset {
  id: string
  name: string
  symbol: string
  exchange: string
  balance: number
  averagePrice: number
  currentPrice: number
  usdtVndRate: number
  pnl: number
  pnlPercent: number
}

export default function CryptoPage() {
  const [assets, setAssets] = useState<CryptoAsset[]>([
    {
      id: '1',
      name: 'Bitcoin',
      symbol: 'BTC',
      exchange: 'Binance',
      balance: 0.05,
      averagePrice: 45000,
      currentPrice: 52000,
      usdtVndRate: 24500,
      pnl: 350,
      pnlPercent: 15.56,
    },
  ])

  const totalValue = assets.reduce((sum, asset) => 
    sum + (asset.balance * asset.currentPrice * asset.usdtVndRate), 0
  )
  
  const totalPnL = assets.reduce((sum, asset) => 
    sum + (asset.pnl * asset.usdtVndRate), 0
  )

  const totalPnLPercent = assets.length > 0
    ? (totalPnL / (totalValue - totalPnL)) * 100
    : 0

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/investments" className="text-sm text-blue-600 hover:text-blue-700 mb-2 inline-block">
            ← Quay lại Đầu tư
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Tiền mã hóa (Crypto)</h1>
          <p className="text-gray-600 mt-2">
            Quản lý danh mục crypto với API tự động và cảnh báo thông minh
          </p>
        </div>
        <Link
          href="/investments/crypto/new"
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Crypto</span>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-orange-100">Tổng giá trị</span>
            <Bitcoin className="w-5 h-5" />
          </div>
          <div className="text-2xl font-bold">
            {totalValue.toLocaleString('vi-VN')} ₫
          </div>
          <div className="text-sm text-orange-100 mt-2">
            {assets.length} tài sản
          </div>
        </div>

        <div className={`rounded-lg shadow-lg p-6 text-white ${
          totalPnL >= 0 
            ? 'bg-gradient-to-br from-green-500 to-green-600' 
            : 'bg-gradient-to-br from-red-500 to-red-600'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm opacity-90">Lãi/Lỗ</span>
            {totalPnL >= 0 ? (
              <TrendingUp className="w-5 h-5" />
            ) : (
              <TrendingDown className="w-5 h-5" />
            )}
          </div>
          <div className="text-2xl font-bold">
            {totalPnL >= 0 ? '+' : ''}{totalPnL.toLocaleString('vi-VN')} ₫
          </div>
          <div className="text-sm opacity-90 mt-2">
            {totalPnLPercent >= 0 ? '+' : ''}{totalPnLPercent.toFixed(2)}%
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-blue-100">USDT/VND</span>
            <RefreshCw className="w-5 h-5" />
          </div>
          <div className="text-2xl font-bold">
            24,500 ₫
          </div>
          <div className="text-sm text-blue-100 mt-2">
            Tỷ giá P2P hiện tại
          </div>
        </div>
      </div>

      {/* Exchange Connections */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Kết nối Sàn giao dịch
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-orange-500 hover:bg-orange-50 transition-colors cursor-pointer">
            <div className="text-4xl mb-2">🟡</div>
            <div className="font-semibold text-gray-900">Binance</div>
            <div className="text-sm text-gray-500 mt-1">Chưa kết nối</div>
            <button className="mt-2 text-sm text-orange-600 hover:text-orange-700 font-medium">
              + Kết nối API
            </button>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-orange-500 hover:bg-orange-50 transition-colors cursor-pointer">
            <div className="text-4xl mb-2">⚫</div>
            <div className="font-semibold text-gray-900">OKX</div>
            <div className="text-sm text-gray-500 mt-1">Chưa kết nối</div>
            <button className="mt-2 text-sm text-orange-600 hover:text-orange-700 font-medium">
              + Kết nối API
            </button>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-orange-500 hover:bg-orange-50 transition-colors cursor-pointer">
            <div className="text-4xl mb-2">🟠</div>
            <div className="font-semibold text-gray-900">Bybit</div>
            <div className="text-sm text-gray-500 mt-1">Chưa kết nối</div>
            <button className="mt-2 text-sm text-orange-600 hover:text-orange-700 font-medium">
              + Kết nối API
            </button>
          </div>
        </div>
        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <strong>Lưu ý bảo mật:</strong> Chỉ sử dụng API Key ở chế độ Read-only. 
              Không bao giờ cấp quyền rút tiền hoặc giao dịch cho API Key.
            </div>
          </div>
        </div>
      </div>

      {/* Assets List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Danh sách Tài sản
        </h2>
        
        {assets.length === 0 ? (
          <div className="text-center py-12">
            <Bitcoin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">Chưa có tài sản crypto nào</p>
            <Link
              href="/investments/crypto/new"
              className="inline-block bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Thêm tài sản đầu tiên
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {assets.map((asset) => (
              <div
                key={asset.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-orange-500 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-orange-100 p-3 rounded-lg">
                      <Bitcoin className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {asset.name} ({asset.symbol})
                      </h3>
                      <p className="text-sm text-gray-500">
                        {asset.exchange} • {asset.balance} {asset.symbol}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      {(asset.balance * asset.currentPrice * asset.usdtVndRate).toLocaleString('vi-VN')} ₫
                    </div>
                    <div className={`text-sm ${
                      asset.pnlPercent >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {asset.pnlPercent >= 0 ? '+' : ''}{asset.pnlPercent.toFixed(2)}% 
                      ({asset.pnl >= 0 ? '+' : ''}{(asset.pnl * asset.usdtVndRate).toLocaleString('vi-VN')} ₫)
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Giá TB mua:</span>
                    <div className="font-medium">{asset.averagePrice.toLocaleString()} USDT</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Giá hiện tại:</span>
                    <div className="font-medium">{asset.currentPrice.toLocaleString()} USDT</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Tỷ giá USDT/VND:</span>
                    <div className="font-medium">{asset.usdtVndRate.toLocaleString()} ₫</div>
                  </div>
                </div>

                <div className="mt-4 flex space-x-2">
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    Chi tiết
                  </button>
                  <button className="text-sm text-orange-600 hover:text-orange-700 font-medium">
                    Cài đặt cảnh báo
                  </button>
                  <button className="text-sm text-gray-600 hover:text-gray-700 font-medium">
                    Lịch sử giao dịch
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Features Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">🔗 Tự động cập nhật</h3>
          <p className="text-sm text-blue-800">
            Kết nối API Read-only để tự động cập nhật số dư và giá theo thời gian thực
          </p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-900 mb-2">💱 Tỷ giá tùy chỉnh</h3>
          <p className="text-sm text-green-800">
            Nhập tỷ giá USDT/VND theo P2P để tính toán chính xác giá trị VND
          </p>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <h3 className="font-semibold text-orange-900 mb-2">⚠️ Cảnh báo thông minh</h3>
          <p className="text-sm text-orange-800">
            Cài đặt ngưỡng Stop Loss và Take Profit để nhận cảnh báo kịp thời
          </p>
        </div>
      </div>
    </div>
  )
}
