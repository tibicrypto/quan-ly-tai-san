'use client'

import { useState } from 'react'
import { BarChart3, TrendingUp, TrendingDown, DollarSign, PieChart, Activity } from 'lucide-react'

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('THIS_MONTH')

  // Mock data - would be fetched from API
  const cashflowData = {
    month: 'Tháng 2/2026',
    totalIncome: 50000000,
    totalExpenses: 30000000,
    totalInvestment: 15000000,
    savingsRate: 40,
    netCashflow: 5000000,
  }

  const performanceData = {
    portfolioValue: 500000000,
    twrr: 12.5,
    mwrr: 11.8,
    benchmarkReturn: 10.2,
    sharpeRatio: 1.35,
    volatility: 8.5,
  }

  const categoryBreakdown = [
    { category: 'Ăn uống', amount: 8000000, percent: 26.7, color: 'bg-red-500' },
    { category: 'Di chuyển', amount: 5000000, percent: 16.7, color: 'bg-blue-500' },
    { category: 'Nhà cửa', amount: 10000000, percent: 33.3, color: 'bg-green-500' },
    { category: 'Giải trí', amount: 4000000, percent: 13.3, color: 'bg-yellow-500' },
    { category: 'Khác', amount: 3000000, percent: 10.0, color: 'bg-gray-500' },
  ]

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

      {/* Cashflow Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
          <Activity className="w-6 h-6 mr-2 text-blue-600" />
          Biểu đồ Dòng tiền - {cashflowData.month}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-green-800 font-medium">Thu nhập</p>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-green-900">
              {(cashflowData.totalIncome / 1000000).toFixed(0)} tr
            </p>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-red-800 font-medium">Chi tiêu</p>
              <TrendingDown className="w-5 h-5 text-red-600" />
            </div>
            <p className="text-2xl font-bold text-red-900">
              {(cashflowData.totalExpenses / 1000000).toFixed(0)} tr
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-blue-800 font-medium">Đầu tư</p>
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-blue-900">
              {(cashflowData.totalInvestment / 1000000).toFixed(0)} tr
            </p>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-purple-800 font-medium">Tỷ lệ tiết kiệm</p>
              <PieChart className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-purple-900">
              {cashflowData.savingsRate}%
            </p>
          </div>
        </div>

        {/* Cashflow Visualization */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Thu nhập</span>
                <span className="font-semibold text-green-600">
                  +{(cashflowData.totalIncome / 1000000).toFixed(0)} triệu
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-8">
                <div className="bg-green-500 h-8 rounded-full flex items-center justify-end pr-4" style={{ width: '100%' }}>
                  <span className="text-sm text-white font-semibold">100%</span>
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Chi tiêu</span>
                <span className="font-semibold text-red-600">
                  -{(cashflowData.totalExpenses / 1000000).toFixed(0)} triệu
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-8">
                <div 
                  className="bg-red-500 h-8 rounded-full flex items-center justify-end pr-4" 
                  style={{ width: `${(cashflowData.totalExpenses / cashflowData.totalIncome) * 100}%` }}
                >
                  <span className="text-sm text-white font-semibold">
                    {((cashflowData.totalExpenses / cashflowData.totalIncome) * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Đầu tư</span>
                <span className="font-semibold text-blue-600">
                  -{(cashflowData.totalInvestment / 1000000).toFixed(0)} triệu
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-8">
                <div 
                  className="bg-blue-500 h-8 rounded-full flex items-center justify-end pr-4" 
                  style={{ width: `${(cashflowData.totalInvestment / cashflowData.totalIncome) * 100}%` }}
                >
                  <span className="text-sm text-white font-semibold">
                    {((cashflowData.totalInvestment / cashflowData.totalIncome) * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-900 font-semibold">Dòng tiền ròng</span>
                <span className={`text-xl font-bold ${cashflowData.netCashflow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {cashflowData.netCashflow >= 0 ? '+' : ''}
                  {(cashflowData.netCashflow / 1000000).toFixed(0)} triệu
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expense Breakdown */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Phân loại Chi tiêu</h2>
        <div className="space-y-4">
          {categoryBreakdown.map((item) => (
            <div key={item.category}>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">{item.category}</span>
                <span className="font-semibold text-gray-900">
                  {(item.amount / 1000000).toFixed(1)} tr ({item.percent}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`${item.color} h-3 rounded-full`}
                  style={{ width: `${item.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
          <TrendingUp className="w-6 h-6 mr-2 text-green-600" />
          Hiệu suất Đầu tư
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-2">TWRR (Time-Weighted)</p>
            <p className="text-3xl font-bold text-green-600">+{performanceData.twrr}%</p>
            <p className="text-xs text-gray-500 mt-1">Tỷ suất sinh lời theo thời gian</p>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-2">MWRR (Money-Weighted)</p>
            <p className="text-3xl font-bold text-green-600">+{performanceData.mwrr}%</p>
            <p className="text-xs text-gray-500 mt-1">Tỷ suất sinh lời theo vốn</p>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-2">So với VN-Index</p>
            <p className="text-3xl font-bold text-blue-600">+{performanceData.benchmarkReturn}%</p>
            <p className="text-xs text-gray-500 mt-1">Benchmark comparison</p>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-2">Sharpe Ratio</p>
            <p className="text-3xl font-bold text-purple-600">{performanceData.sharpeRatio}</p>
            <p className="text-xs text-gray-500 mt-1">Lợi nhuận điều chỉnh rủi ro</p>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-2">Volatility</p>
            <p className="text-3xl font-bold text-orange-600">{performanceData.volatility}%</p>
            <p className="text-xs text-gray-500 mt-1">Độ biến động danh mục</p>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-2">Portfolio Value</p>
            <p className="text-3xl font-bold text-gray-900">
              {(performanceData.portfolioValue / 1000000000).toFixed(2)} tỷ
            </p>
            <p className="text-xs text-gray-500 mt-1">Tổng giá trị danh mục</p>
          </div>
        </div>

        {/* Performance Explanation */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">📊 Giải thích chỉ số:</h3>
          <ul className="space-y-1 text-sm text-blue-800">
            <li>• <strong>TWRR</strong>: Đo lường hiệu quả chiến lược đầu tư, không bị ảnh hưởng bởi dòng tiền vào/ra</li>
            <li>• <strong>MWRR</strong>: Phản ánh lợi nhuận thực tế của nhà đầu tư, tính cả timing của dòng tiền</li>
            <li>• <strong>Sharpe Ratio</strong>: Cao hơn = Lợi nhuận tốt hơn so với rủi ro đã chấp nhận</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
