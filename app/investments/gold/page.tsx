'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Coins, Plus, TrendingUp, RefreshCw } from 'lucide-react'

interface GoldSilverAsset {
  id: string
  type: 'SJC_GOLD_BAR' | 'JEWELRY_GOLD' | 'SILVER'
  name: string
  weight: number
  unit: string
  purchasePrice: number
  currentPrice: number
  vendor: string
  purchaseDate: string
}

interface PNJGoldPrices {
  date: string
  pnj: { type: string; buyPrice: number; sellPrice: number }
  sjc: { type: string; buyPrice: number; sellPrice: number }
  timestamp: string
}

export default function GoldPage() {
  const [assets, setAssets] = useState<GoldSilverAsset[]>([])
  const [isLoadingAssets, setIsLoadingAssets] = useState(true)
  const [pnjPrices, setPnjPrices] = useState<PNJGoldPrices | null>(null)
  const [isLoadingPrices, setIsLoadingPrices] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<string | null>(null)

  // Fetch assets from database
  useEffect(() => {
    fetchAssets()
  }, [])

  const fetchAssets = async () => {
    setIsLoadingAssets(true)
    try {
      const response = await fetch('/api/investments/gold')
      if (response.ok) {
        const data = await response.json()
        setAssets(data)
      } else {
        console.error('Failed to fetch gold assets')
      }
    } catch (error) {
      console.error('Error fetching gold assets:', error)
    } finally {
      setIsLoadingAssets(false)
    }
  }

  const fetchPNJPrices = async () => {
    setIsLoadingPrices(true)
    try {
      // First fetch the prices from PNJ
      const fetchResponse = await fetch('/api/gold-prices/pnj')
      if (!fetchResponse.ok) {
        const errorData = await fetchResponse.json()
        console.error('PNJ fetch error:', errorData)
        alert(`Không thể lấy giá vàng từ PNJ: ${errorData.error || 'Unknown error'}. Vui lòng thử lại.`)
        return
      }
      
      const data = await fetchResponse.json()
      setPnjPrices(data)
      setLastUpdate(new Date().toLocaleTimeString('vi-VN'))
      
      // Then save to database and update assets
      const saveResponse = await fetch('/api/gold-prices/pnj', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      if (saveResponse.ok) {
        const saveResult = await saveResponse.json()
        console.log('Prices saved to database:', saveResult)
        
        // Refresh assets to show updated prices
        await fetchAssets()
        
        // Show success message
        alert(`Đã cập nhật giá vàng vào database!\n- Vàng trang sức: ${saveResult.assetsUpdated.jewelryGold} tài sản\n- Vàng miếng SJC: ${saveResult.assetsUpdated.sjcGoldBars} tài sản`)
      } else {
        const saveError = await saveResponse.json()
        console.error('Save error:', saveError)
        alert(`Không thể lưu giá vào database: ${saveError.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error fetching PNJ prices:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      alert(`Lỗi khi lấy giá vàng: ${errorMessage}. Vui lòng kiểm tra kết nối internet.`)
    } finally {
      setIsLoadingPrices(false)
    }
  }

  const totalValue = assets.reduce((sum, asset) => 
    sum + (asset.weight * asset.currentPrice), 0
  )
  
  const totalPnL = assets.reduce((sum, asset) => 
    sum + (asset.weight * (asset.currentPrice - asset.purchasePrice)), 0
  )

  const totalPnLPercent = assets.length > 0 && totalValue > 0
    ? (totalPnL / (totalValue - totalPnL)) * 100
    : 0

  const getAssetTypeLabel = (type: string) => {
    switch (type) {
      case 'SJC_GOLD_BAR': return 'Vàng miếng SJC'
      case 'JEWELRY_GOLD': return 'Vàng nhẫn/Trang sức'
      case 'SILVER': return 'Bạc'
      default: return type
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/investments" className="text-sm text-blue-600 hover:text-blue-700 mb-2 inline-block">
            ← Quay lại Đầu tư
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Vàng & Bạc</h1>
          <p className="text-gray-600 mt-2">
            Quản lý tài sản vàng bạc với giá cập nhật từ các đơn vị uy tín
          </p>
        </div>
        <Link
          href="/investments/gold/new"
          className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm tài sản</span>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-yellow-100">Tổng giá trị</span>
            <Coins className="w-5 h-5" />
          </div>
          <div className="text-2xl font-bold">
            {totalValue.toLocaleString('vi-VN')} ₫
          </div>
          <div className="text-sm text-yellow-100 mt-2">
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
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="text-2xl font-bold">
            {totalPnL >= 0 ? '+' : ''}{totalPnL.toLocaleString('vi-VN')} ₫
          </div>
          <div className="text-sm opacity-90 mt-2">
            {totalPnLPercent >= 0 ? '+' : ''}{totalPnLPercent.toFixed(2)}%
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-amber-100">Giá PNJ hôm nay</span>
            <button
              onClick={fetchPNJPrices}
              disabled={isLoadingPrices}
              className="text-white hover:bg-amber-700 p-1 rounded transition-colors disabled:opacity-50"
              title="Cập nhật giá từ PNJ"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingPrices ? 'animate-spin' : ''}`} />
            </button>
          </div>
          <div className="text-xl font-bold">
            {pnjPrices ? `${pnjPrices.pnj.sellPrice} tr/lượng` : '78.2 tr/lượng'}
          </div>
          <div className="text-sm text-amber-100 mt-2">
            {pnjPrices 
              ? `Mua: ${pnjPrices.pnj.buyPrice} tr • Bán: ${pnjPrices.pnj.sellPrice} tr`
              : 'Mua: 76.8 tr • Bán: 78.2 tr'
            }
          </div>
          {lastUpdate && (
            <div className="text-xs text-amber-100 mt-1">
              Cập nhật: {lastUpdate}
            </div>
          )}
        </div>
      </div>

      {/* Price Sources */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Nguồn giá cập nhật
          </h2>
          <button
            onClick={fetchPNJPrices}
            disabled={isLoadingPrices}
            className="flex items-center space-x-2 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoadingPrices ? 'animate-spin' : ''}`} />
            <span>{isLoadingPrices ? 'Đang cập nhật...' : 'Cập nhật từ PNJ'}</span>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-yellow-300 rounded-lg p-4 bg-yellow-50">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-gray-900">PNJ - Vàng trang sức</span>
              <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                {pnjPrices ? 'Đã cập nhật' : 'Chưa cập nhật'}
              </span>
            </div>
            <div className="text-sm text-gray-600 mb-2">
              Giá vàng 24K tại PNJ
            </div>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div>
                <div className="text-xs text-gray-500">Mua vào</div>
                <div className="text-lg font-bold text-green-600">
                  {pnjPrices ? `${pnjPrices.pnj.buyPrice.toFixed(2)}` : '76.80'} tr
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Bán ra</div>
                <div className="text-lg font-bold text-red-600">
                  {pnjPrices ? `${pnjPrices.pnj.sellPrice.toFixed(2)}` : '78.20'} tr
                </div>
              </div>
            </div>
            {pnjPrices && (
              <div className="text-xs text-gray-500">
                Ngày: {pnjPrices.date} • {new Date(pnjPrices.timestamp).toLocaleTimeString('vi-VN')}
              </div>
            )}
          </div>

          <div className="border border-yellow-300 rounded-lg p-4 bg-yellow-50">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-gray-900">SJC - Vàng miếng</span>
              <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                {pnjPrices ? 'Đã cập nhật' : 'Chưa cập nhật'}
              </span>
            </div>
            <div className="text-sm text-gray-600 mb-2">
              Vàng miếng SJC 1 lượng
            </div>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div>
                <div className="text-xs text-gray-500">Mua vào</div>
                <div className="text-lg font-bold text-green-600">
                  {pnjPrices ? `${pnjPrices.sjc.buyPrice.toFixed(2)}` : '78.00'} tr
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Bán ra</div>
                <div className="text-lg font-bold text-red-600">
                  {pnjPrices ? `${pnjPrices.sjc.sellPrice.toFixed(2)}` : '80.50'} tr
                </div>
              </div>
            </div>
            {pnjPrices && (
              <div className="text-xs text-gray-500">
                Nguồn: PNJ • Cập nhật tự động
              </div>
            )}
          </div>
        </div>
        
        {!pnjPrices && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 <strong>Mẹo:</strong> Nhấn nút &quot;Cập nhật từ PNJ&quot; để lấy giá vàng mới nhất từ trang web PNJ.
              Giá được cập nhật tự động từ nguồn chính thức.
            </p>
          </div>
        )}
      </div>

      {/* Assets List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Danh sách Tài sản
        </h2>
        
        {isLoadingAssets ? (
          <div className="text-center py-12">
            <RefreshCw className="w-16 h-16 text-gray-400 mx-auto mb-4 animate-spin" />
            <p className="text-gray-600">Đang tải dữ liệu...</p>
          </div>
        ) : assets.length === 0 ? (
          <div className="text-center py-12">
            <Coins className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">Chưa có tài sản vàng bạc nào</p>
            <Link
              href="/investments/gold/new"
              className="inline-block bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
            >
              Thêm tài sản đầu tiên
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {assets.map((asset) => {
              const pnl = asset.weight * (asset.currentPrice - asset.purchasePrice)
              const pnlPercent = ((asset.currentPrice - asset.purchasePrice) / asset.purchasePrice) * 100

              return (
                <div
                  key={asset.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-yellow-500 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-yellow-100 p-3 rounded-lg">
                        <Coins className="w-6 h-6 text-yellow-600" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-gray-900">{asset.name}</h3>
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                            {getAssetTypeLabel(asset.type)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">
                          {asset.vendor} • {asset.weight} {asset.unit}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-semibold text-gray-900">
                        {(asset.weight * asset.currentPrice).toLocaleString('vi-VN')} ₫
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
                      <span className="text-gray-500">Giá mua:</span>
                      <div className="font-medium">
                        {asset.purchasePrice.toLocaleString('vi-VN')} ₫/{asset.unit}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Giá hiện tại:</span>
                      <div className="font-medium">
                        {asset.currentPrice.toLocaleString('vi-VN')} ₫/{asset.unit}
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
                    <button className="text-sm text-yellow-600 hover:text-yellow-700 font-medium">
                      Cập nhật giá
                    </button>
                    <button className="text-sm text-gray-600 hover:text-gray-700 font-medium">
                      Lịch sử
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Asset Types Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-900 mb-2">🪙 Vàng miếng SJC</h3>
          <p className="text-sm text-yellow-800">
            Giá biến động theo chính sách nhà nước, chênh lệch mua-bán thường cao hơn
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h3 className="font-semibold text-amber-900 mb-2">💍 Vàng nhẫn/Trang sức</h3>
          <p className="text-sm text-amber-800">
            Bám sát giá vàng thế giới hơn, phù hợp cho đầu tư và sử dụng
          </p>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-2">⚪ Bạc</h3>
          <p className="text-sm text-gray-800">
            Biến động giá thấp hơn vàng, thích hợp để đa dạng hóa danh mục
          </p>
        </div>
      </div>
    </div>
  )
}
