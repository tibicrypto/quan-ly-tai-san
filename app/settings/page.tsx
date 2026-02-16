'use client'

import { useState } from 'react'
import { Settings as SettingsIcon, Bell, DollarSign, Key } from 'lucide-react'

export default function SettingsPage() {
  const [defaultUsdtRate, setDefaultUsdtRate] = useState('24000')
  const [enablePriceAlerts, setEnablePriceAlerts] = useState(true)
  const [enablePaymentReminders, setEnablePaymentReminders] = useState(true)
  const [reminderDaysBefore, setReminderDaysBefore] = useState('2')

  const handleSave = () => {
    alert('Đã lưu cài đặt!')
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Cài đặt</h1>
        <p className="text-gray-600 mt-2">
          Tùy chỉnh ứng dụng theo nhu cầu của bạn
        </p>
      </div>

      {/* General Settings */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-blue-100 p-2 rounded-lg">
            <SettingsIcon className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Cài đặt chung</h2>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tỷ giá USDT/VND mặc định
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={defaultUsdtRate}
                onChange={(e) => setDefaultUsdtRate(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="24000"
              />
              <span className="text-gray-600">₫</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Tỷ giá này sẽ được sử dụng khi tính toán tổng tài sản VND
            </p>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-purple-100 p-2 rounded-lg">
            <Bell className="w-6 h-6 text-purple-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">
            Thông báo & Cảnh báo
          </h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Cảnh báo biến động giá</p>
              <p className="text-sm text-gray-500">
                Nhận thông báo khi giá tài sản thay đổi đáng kể
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={enablePriceAlerts}
                onChange={(e) => setEnablePriceAlerts(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Nhắc nhở thanh toán</p>
              <p className="text-sm text-gray-500">
                Nhắc nhở trước hạn thanh toán thẻ tín dụng
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={enablePaymentReminders}
                onChange={(e) => setEnablePaymentReminders(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {enablePaymentReminders && (
            <div className="ml-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nhắc trước bao nhiêu ngày?
              </label>
              <select
                value={reminderDaysBefore}
                onChange={(e) => setReminderDaysBefore(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="1">1 ngày</option>
                <option value="2">2 ngày</option>
                <option value="3">3 ngày</option>
                <option value="5">5 ngày</option>
                <option value="7">7 ngày</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* API Keys */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-green-100 p-2 rounded-lg">
            <Key className="w-6 h-6 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">
            Quản lý API Keys
          </h2>
        </div>

        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">
              Kết nối sàn giao dịch Crypto
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Kết nối API (Read-only) để tự động cập nhật số dư và giá
            </p>
            <div className="space-y-2">
              <button className="w-full text-left px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                + Thêm Binance API Key
              </button>
              <button className="w-full text-left px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                + Thêm OKX API Key
              </button>
              <button className="w-full text-left px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                + Thêm Bybit API Key
              </button>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>⚠️ Lưu ý bảo mật:</strong> Chỉ nhập API Key ở chế độ Read-only (chỉ đọc). 
              Tuyệt đối không sử dụng API Key có quyền rút tiền hoặc giao dịch.
            </p>
          </div>
        </div>
      </div>

      {/* Interest Rates */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-orange-100 p-2 rounded-lg">
            <DollarSign className="w-6 h-6 text-orange-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">
            Lãi suất tham khảo
          </h2>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tiết kiệm 1 tháng (%/năm)
              </label>
              <input
                type="number"
                defaultValue="4.5"
                step="0.1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tích lũy linh hoạt (%/năm)
              </label>
              <input
                type="number"
                defaultValue="3.5"
                step="0.1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <p className="text-sm text-gray-500">
            Lãi suất này sẽ được sử dụng để tính toán gợi ý tiết kiệm
          </p>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors font-semibold"
        >
          Lưu cài đặt
        </button>
      </div>
    </div>
  )
}
