'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Scale, TrendingUp, AlertCircle, Check, RefreshCw } from 'lucide-react'

interface AllocationTarget {
  assetClass: string
  name: string
  targetPercent: number
  currentPercent: number
  currentValue: number
  targetValue: number
  difference: number
  action: 'BUY' | 'SELL' | 'HOLD'
  color: string
}

export default function RebalancePage() {
  // TODO: Fetch allocations from database
  const [allocations, setAllocations] = useState<AllocationTarget[]>([])

  const totalPortfolioValue = allocations.reduce((sum, a) => sum + a.currentValue, 0)
  const isBalanced = allocations.every(a => Math.abs(a.currentPercent - a.targetPercent) < 2)

  const getPriorityColor = (diff: number, total: number) => {
    const diffPercent = Math.abs((diff / total) * 100)
    if (diffPercent >= 5) return 'text-red-600'
    if (diffPercent >= 2) return 'text-yellow-600'
    return 'text-green-600'
  }

  const handleRecalculate = () => {
    if (allocations.length === 0) {
      alert('Chưa có dữ liệu phân bổ danh mục. Vui lòng thêm tài sản trước.')
      return
    }
    
    // Recalculate allocations based on current portfolio values
    console.log('Recalculating portfolio allocations...')
    
    // Simulate fetching fresh data and recalculating
    const totalValue = allocations.reduce((sum, a) => sum + a.currentValue, 0)
    
    const updatedAllocations = allocations.map(allocation => {
      const currentPercent = (allocation.currentValue / totalValue) * 100
      const targetValue = (allocation.targetPercent / 100) * totalValue
      const difference = allocation.currentValue - targetValue
      const diffPercent = currentPercent - allocation.targetPercent
      
      let action: 'BUY' | 'SELL' | 'HOLD' = 'HOLD'
      if (Math.abs(diffPercent) < 2) {
        action = 'HOLD'
      } else if (diffPercent > 0) {
        action = 'SELL'
      } else {
        action = 'BUY'
      }
      
      return {
        ...allocation,
        currentPercent: Math.round(currentPercent * 10) / 10,
        targetValue: Math.round(targetValue),
        difference: Math.round(difference),
        action
      }
    })
    
    setAllocations(updatedAllocations)
    
    const needsRebalancing = updatedAllocations.some(a => a.action !== 'HOLD')
    alert(
      `Tính toán lại hoàn tất!\n\n` +
      `Tổng giá trị danh mục: ${(totalValue / 1000000000).toFixed(2)} tỷ\n` +
      `Trạng thái: ${needsRebalancing ? 'Cần tái cân bằng' : 'Đã cân bằng'}\n\n` +
      updatedAllocations
        .filter(a => a.action !== 'HOLD')
        .map(a => `${a.name}: ${a.action === 'BUY' ? 'Mua thêm' : 'Bán bớt'} ${(Math.abs(a.difference) / 1000000).toFixed(0)} triệu`)
        .join('\n')
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Scale className="w-8 h-8 mr-3 text-indigo-600" />
            Tái cân bằng Danh mục
          </h1>
          <p className="text-gray-600 mt-2">
            Điều chỉnh danh mục đầu tư theo mục tiêu phân bổ
          </p>
        </div>
        <button 
          onClick={handleRecalculate}
          className="bg-indigo-500 text-white px-6 py-3 rounded-lg hover:bg-indigo-600 transition-colors flex items-center"
        >
          <RefreshCw className="w-5 h-5 mr-2" />
          Tính toán lại
        </button>
      </div>

      {/* Status Summary */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90">Tổng giá trị danh mục</p>
            <p className="text-3xl font-bold mt-2">
              {(totalPortfolioValue / 1000000000).toFixed(2)} tỷ
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-90">Trạng thái</p>
            <div className="flex items-center mt-2">
              {isBalanced ? (
                <>
                  <Check className="w-6 h-6 mr-2" />
                  <span className="text-xl font-semibold">Đã cân bằng</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-6 h-6 mr-2" />
                  <span className="text-xl font-semibold">Cần điều chỉnh</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Current vs Target Allocation */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Phân bổ Hiện tại vs Mục tiêu</h2>
        
        {allocations.length === 0 ? (
          <div className="text-center py-12">
            <Scale className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">
              Chưa có dữ liệu phân bổ danh mục
            </p>
            <p className="text-sm text-gray-500">
              Vui lòng thêm tài sản vào danh mục để bắt đầu tái cân bằng
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {allocations.map((allocation) => {
            const diffPercent = allocation.currentPercent - allocation.targetPercent
            const isOverweight = diffPercent > 0
            
            return (
              <div key={allocation.assetClass} className="border-b pb-6 last:border-b-0">
                {/* Asset Class Header */}
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{allocation.name}</h3>
                    <p className="text-sm text-gray-600">
                      Giá trị hiện tại: {(allocation.currentValue / 1000000).toFixed(0)} triệu
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                      allocation.action === 'BUY' 
                        ? 'bg-green-100 text-green-800' 
                        : allocation.action === 'SELL'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {allocation.action === 'BUY' && 'Mua thêm'}
                      {allocation.action === 'SELL' && 'Bán bớt'}
                      {allocation.action === 'HOLD' && 'Giữ nguyên'}
                    </div>
                  </div>
                </div>

                {/* Progress Bars */}
                <div className="space-y-3">
                  {/* Current Allocation */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Hiện tại</span>
                      <span className="font-semibold text-gray-900">{allocation.currentPercent}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="h-3 rounded-full transition-all"
                        style={{ 
                          width: `${allocation.currentPercent}%`,
                          backgroundColor: allocation.color === 'orange' ? '#f97316' :
                                         allocation.color === 'yellow' ? '#eab308' :
                                         allocation.color === 'green' ? '#22c55e' :
                                         allocation.color === 'blue' ? '#3b82f6' :
                                         allocation.color === 'purple' ? '#a855f7' : '#6b7280'
                        }}
                      />
                    </div>
                  </div>

                  {/* Target Allocation */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Mục tiêu</span>
                      <span className="font-semibold text-gray-900">{allocation.targetPercent}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="h-3 rounded-full transition-all"
                        style={{ 
                          width: `${allocation.targetPercent}%`,
                          backgroundColor: allocation.color === 'orange' ? '#fdba74' :
                                         allocation.color === 'yellow' ? '#fde047' :
                                         allocation.color === 'green' ? '#86efac' :
                                         allocation.color === 'blue' ? '#93c5fd' :
                                         allocation.color === 'purple' ? '#d8b4fe' : '#d1d5db'
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Difference Display */}
                <div className="mt-3 flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <div>
                    <p className="text-sm text-gray-600">Chênh lệch</p>
                    <p className={`text-lg font-bold ${getPriorityColor(allocation.difference, totalPortfolioValue)}`}>
                      {diffPercent > 0 ? '+' : ''}{diffPercent.toFixed(1)}% 
                      <span className="text-sm ml-2">
                        ({allocation.difference > 0 ? '+' : ''}{(allocation.difference / 1000000).toFixed(0)} triệu)
                      </span>
                    </p>
                  </div>
                  {allocation.action !== 'HOLD' && (
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Hành động đề xuất</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {allocation.action === 'BUY' 
                          ? `Mua thêm ${(Math.abs(allocation.difference) / 1000000).toFixed(0)} triệu`
                          : `Bán bớt ${(Math.abs(allocation.difference) / 1000000).toFixed(0)} triệu`
                        }
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
          </div>
        )}
      </div>

      {/* Settings Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">⚙️ Cài đặt Tái cân bằng</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-blue-800">Ngưỡng tái cân bằng:</span>
              <span className="font-semibold text-blue-900">±2%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-800">Tần suất kiểm tra:</span>
              <span className="font-semibold text-blue-900">Hàng tháng</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-800">Tự động thông báo:</span>
              <span className="font-semibold text-blue-900">Bật</span>
            </div>
          </div>
          <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors">
            Chỉnh sửa cài đặt
          </button>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-900 mb-3">💡 Lợi ích Tái cân bằng</h3>
          <ul className="space-y-2 text-sm text-green-800">
            <li>• Duy trì mức độ rủi ro mong muốn</li>
            <li>• &quot;Mua thấp, bán cao&quot; tự động</li>
            <li>• Tối ưu hóa lợi nhuận dài hạn</li>
            <li>• Kỷ luật đầu tư, tránh cảm tính</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
