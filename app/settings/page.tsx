'use client'

import { useState } from 'react'
import { Settings as SettingsIcon, Bell, DollarSign, Scale } from 'lucide-react'

export default function SettingsPage() {
  const [defaultUsdtRate, setDefaultUsdtRate] = useState('24000')
  const [enablePriceAlerts, setEnablePriceAlerts] = useState(true)
  const [enablePaymentReminders, setEnablePaymentReminders] = useState(true)
  const [reminderDaysBefore, setReminderDaysBefore] = useState('2')
  const [rebalanceThreshold, setRebalanceThreshold] = useState('2')
  const [rebalanceFrequency, setRebalanceFrequency] = useState('monthly')
  const [enableRebalanceNotifications, setEnableRebalanceNotifications] = useState(true)

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



      {/* Rebalance Settings */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-indigo-100 p-2 rounded-lg">
            <Scale className="w-6 h-6 text-indigo-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">
            Cài đặt Tái cân bằng
          </h2>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ngưỡng tái cân bằng (%)
            </label>
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">±</span>
              <select
                value={rebalanceThreshold}
                onChange={(e) => setRebalanceThreshold(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="1">1%</option>
                <option value="2">2%</option>
                <option value="3">3%</option>
                <option value="5">5%</option>
                <option value="10">10%</option>
              </select>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Tự động đề xuất tái cân bằng khi chênh lệch vượt ngưỡng này
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tần suất kiểm tra
            </label>
            <select
              value={rebalanceFrequency}
              onChange={(e) => setRebalanceFrequency(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="weekly">Hàng tuần</option>
              <option value="monthly">Hàng tháng</option>
              <option value="quarterly">Hàng quý</option>
              <option value="manual">Thủ công</option>
            </select>
            <p className="text-sm text-gray-500 mt-1">
              Tần suất hệ thống kiểm tra và thông báo nhu cầu tái cân bằng
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Tự động thông báo</p>
              <p className="text-sm text-gray-500">
                Nhận thông báo khi danh mục cần tái cân bằng
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={enableRebalanceNotifications}
                onChange={(e) => setEnableRebalanceNotifications(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">💡 Lợi ích Tái cân bằng</h4>
            <ul className="space-y-1 text-sm text-blue-800">
              <li>• Duy trì mức độ rủi ro mong muốn</li>
              <li>• &quot;Mua thấp, bán cao&quot; tự động</li>
              <li>• Tối ưu hóa lợi nhuận dài hạn</li>
              <li>• Kỷ luật đầu tư, tránh cảm tính</li>
            </ul>
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
