import Link from 'next/link'
import { Wallet, CreditCard, TrendingUp, Settings } from 'lucide-react'

export default function Home() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Super App Tài chính Cá nhân
        </h1>
        <p className="text-xl text-gray-600">
          Quản lý toàn diện tài sản, đầu tư và tối ưu dòng tiền
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
        {/* Investment Portfolio Card */}
        <Link href="/investments" className="block">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-2 border-transparent hover:border-blue-500">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Danh mục Đầu tư
                </h2>
                <p className="text-gray-600 mt-1">
                  Quản lý Crypto, Vàng, Quỹ đầu tư
                </p>
              </div>
            </div>
            <div className="mt-4 space-y-2 text-sm text-gray-600">
              <div>• Kết nối API sàn giao dịch</div>
              <div>• Theo dõi giá USDT/VND</div>
              <div>• Cảnh báo biến động giá</div>
              <div>• So sánh hiệu suất với VN-Index</div>
            </div>
          </div>
        </Link>

        {/* Credit Card Optimizer Card */}
        <Link href="/credit-cards" className="block">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-2 border-transparent hover:border-green-500">
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <CreditCard className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Tối ưu Thẻ Tín dụng
                </h2>
                <p className="text-gray-600 mt-1">
                  Trợ lý thông minh & Tối ưu dòng tiền
                </p>
              </div>
            </div>
            <div className="mt-4 space-y-2 text-sm text-gray-600">
              <div>• Gợi ý thẻ quẹt thông minh</div>
              <div>• Tận dụng chu kỳ miễn lãi</div>
              <div>• Gợi ý gửi tiết kiệm</div>
              <div>• Nhắc nợ tự động</div>
            </div>
          </div>
        </Link>

        {/* Portfolio Overview */}
        <div className="bg-white rounded-lg shadow-md p-6 border-2 border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Wallet className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Tổng quan Tài sản
              </h2>
              <p className="text-gray-600 mt-1">
                Xem tổng hợp tất cả tài sản
              </p>
            </div>
          </div>
          <div className="mt-6">
            <div className="text-3xl font-bold text-gray-900">
              0 ₫
            </div>
            <div className="text-sm text-gray-500 mt-1">
              Tổng giá trị tài sản
            </div>
          </div>
        </div>

        {/* Settings */}
        <Link href="/settings" className="block">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-2 border-transparent hover:border-gray-400">
            <div className="flex items-center space-x-4">
              <div className="bg-gray-100 p-3 rounded-lg">
                <Settings className="w-8 h-8 text-gray-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Cài đặt
                </h2>
                <p className="text-gray-600 mt-1">
                  Tùy chỉnh ứng dụng
                </p>
              </div>
            </div>
            <div className="mt-4 space-y-2 text-sm text-gray-600">
              <div>• Tỷ giá USDT/VND mặc định</div>
              <div>• Cảnh báo và thông báo</div>
              <div>• API Keys quản lý</div>
            </div>
          </div>
        </Link>
      </div>

      {/* Features Overview */}
      <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-lg shadow-lg p-8 text-white mt-12">
        <h2 className="text-2xl font-bold mb-4">Tính năng Killer: Tối ưu Thẻ Tín dụng</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-semibold mb-2">🎯 Smart Swipe</h3>
            <p className="text-sm text-blue-50">
              Gợi ý thẻ tối ưu nhất để tận dụng tối đa thời gian miễn lãi (lên đến 55 ngày)
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">💰 Cash-to-Savings</h3>
            <p className="text-sm text-blue-50">
              Tự động đề xuất gửi tiết kiệm thay vì trả ngay, kiếm lãi từ vốn ngân hàng
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">⏰ Auto Reminder</h3>
            <p className="text-sm text-blue-50">
              Nhắc nhở tự động đến hạn thanh toán, tránh phí phạt và lãi suất cao
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
