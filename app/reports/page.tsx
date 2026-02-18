'use client'

import { useState } from 'react'
import { BarChart3, TrendingUp, TrendingDown, DollarSign, PieChart, Activity } from 'lucide-react'

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('THIS_MONTH')
  const [hasData, setHasData] = useState(false)
  // TODO: Fetch report data from database

  const cashflowData = null
  const performanceData = null
  const categoryBreakdown: any[] = []

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <BarChart3 className="w-8 h-8 mr-3 text-indigo-600" />
            Báo cáo & Phân tích
          </h1>
          <p className="text-gray-600 mt-2">
            Phân tích dòng tiền và hiệu suất đầu tư
          </p>
        </div>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="THIS_MONTH">Tháng này</option>
          <option value="LAST_MONTH">Tháng trước</option>
          <option value="THIS_QUARTER">Quý này</option>
          <option value="THIS_YEAR">Năm này</option>
        </select>
      </div>

      {/* Empty State */}
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <BarChart3 className="w-20 h-20 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Chưa có dữ liệu báo cáo
        </h2>
        <p className="text-gray-600 mb-6">
          Hệ thống sẽ tự động tạo báo cáo dòng tiền và hiệu suất đầu tư khi bạn có giao dịch và tài sản.
        </p>
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6 max-w-2xl mx-auto">
          <h3 className="text-sm font-semibold text-indigo-900 mb-3">📊 Báo cáo sẽ bao gồm:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left text-sm text-indigo-800">
            <div>
              <p className="font-semibold mb-1">Dòng tiền:</p>
              <ul className="space-y-1 text-xs">
                <li>• Thu nhập, chi tiêu, đầu tư</li>
                <li>• Tỷ lệ tiết kiệm</li>
                <li>• Phân loại chi tiêu</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold mb-1">Hiệu suất đầu tư:</p>
              <ul className="space-y-1 text-xs">
                <li>• TWRR &amp; MWRR</li>
                <li>• So sánh với VN-Index</li>
                <li>• Sharpe Ratio &amp; Volatility</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
