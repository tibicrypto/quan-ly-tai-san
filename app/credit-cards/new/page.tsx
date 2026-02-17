'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CreditCard, ArrowLeft, Calendar, DollarSign } from 'lucide-react'

export default function NewCreditCardPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [formData, setFormData] = useState({
    bankName: '',
    cardName: '',
    lastFourDigits: '',
    statementDay: '',
    interestFreeDays: '',
    paymentDueDays: '',
    creditLimit: '',
    notes: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // TODO: API call to save credit card
    console.log('Submitting credit card:', formData)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      router.push('/credit-cards')
    }, 1000)
  }

  // Popular Vietnamese banks
  const vietnameseBanks = [
    'VIB', 'Techcombank', 'HSBC', 'Vietcombank', 'ACB', 'VPBank',
    'TPBank', 'MB Bank', 'Sacombank', 'Citibank', 'Standard Chartered',
    'Shinhan Bank', 'Agribank', 'BIDV', 'VietinBank', 'Khác'
  ]

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <Link 
          href="/credit-cards"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <CreditCard className="w-8 h-8 mr-3 text-blue-600" />
          Thêm Thẻ Tín dụng
        </h1>
        <p className="text-gray-600 mt-2">
          Nhập thông tin thẻ tín dụng để tối ưu dòng tiền
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
        {/* Bank Information */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">
            Thông tin Ngân hàng
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="bankName" className="block text-sm font-medium text-gray-700 mb-2">
                Ngân hàng <span className="text-red-500">*</span>
              </label>
              <select
                id="bankName"
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Chọn ngân hàng</option>
                {vietnameseBanks.map(bank => (
                  <option key={bank} value={bank}>{bank}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-2">
                Tên sản phẩm thẻ <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="cardName"
                name="cardName"
                value={formData.cardName}
                onChange={handleChange}
                required
                placeholder="VD: Online Plus, Cash Back"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="lastFourDigits" className="block text-sm font-medium text-gray-700 mb-2">
                4 số cuối thẻ <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="lastFourDigits"
                name="lastFourDigits"
                value={formData.lastFourDigits}
                onChange={handleChange}
                required
                maxLength={4}
                pattern="[0-9]{4}"
                placeholder="1234"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Chỉ nhập 4 số cuối để bảo mật</p>
            </div>

            <div>
              <label htmlFor="creditLimit" className="block text-sm font-medium text-gray-700 mb-2">
                Hạn mức (VNĐ)
              </label>
              <input
                type="number"
                id="creditLimit"
                name="creditLimit"
                value={formData.creditLimit}
                onChange={handleChange}
                placeholder="50000000"
                min="0"
                step="1000000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Payment Cycle */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 border-b pb-2 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-blue-600" />
            Chu kỳ Thanh toán
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="statementDay" className="block text-sm font-medium text-gray-700 mb-2">
                Ngày sao kê <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="statementDay"
                name="statementDay"
                value={formData.statementDay}
                onChange={handleChange}
                required
                min="1"
                max="31"
                placeholder="20"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Ngày trong tháng (1-31)</p>
            </div>

            <div>
              <label htmlFor="interestFreeDays" className="block text-sm font-medium text-gray-700 mb-2">
                Số ngày miễn lãi <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="interestFreeDays"
                name="interestFreeDays"
                value={formData.interestFreeDays}
                onChange={handleChange}
                required
                min="30"
                max="60"
                placeholder="55"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Thường 45-55 ngày</p>
            </div>

            <div>
              <label htmlFor="paymentDueDays" className="block text-sm font-medium text-gray-700 mb-2">
                Số ngày thanh toán <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="paymentDueDays"
                name="paymentDueDays"
                value={formData.paymentDueDays}
                onChange={handleChange}
                required
                min="10"
                max="30"
                placeholder="15"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Sau ngày sao kê</p>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">💡 Thông tin hữu ích:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• <strong>Ngày sao kê</strong>: Ngày ngân hàng gửi bảng sao kê</li>
              <li>• <strong>Miễn lãi</strong>: Tổng số ngày từ khi chi tiêu đến hạn thanh toán</li>
              <li>• <strong>Thanh toán</strong>: Số ngày từ sao kê đến hạn trả tiền</li>
            </ul>
          </div>
        </div>

        {/* Additional Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
            Ghi chú
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            placeholder="Ghi chú về chương trình ưu đãi, điều kiện sử dụng..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Example Calculation */}
        {formData.statementDay && formData.interestFreeDays && formData.paymentDueDays && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-green-900 mb-2 flex items-center">
              <DollarSign className="w-4 h-4 mr-1" />
              Ví dụ tính toán:
            </h3>
            <p className="text-sm text-green-800">
              Nếu chi tiêu ngay sau ngày sao kê ({formData.statementDay}), bạn có tối đa{' '}
              <strong>{formData.interestFreeDays} ngày</strong> miễn lãi.
              <br />
              Hạn thanh toán: Ngày <strong>{(parseInt(formData.statementDay) + parseInt(formData.paymentDueDays)) % 31 || 31}</strong> (tháng sau)
            </p>
          </div>
        )}

        {/* Submit Buttons */}
        <div className="flex items-center justify-end space-x-4 pt-4 border-t">
          <Link
            href="/credit-cards"
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Hủy
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang lưu...
              </>
            ) : (
              'Lưu thẻ'
            )}
          </button>
        </div>
      </form>

      {/* Tips Card */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-yellow-900 mb-3">📌 Mẹo Credit Card Arbitrage</h3>
        <ul className="space-y-2 text-sm text-yellow-800">
          <li>• <strong>Tối ưu dòng tiền</strong>: Chi tiêu ngay sau ngày sao kê để tận dụng tối đa thời gian miễn lãi</li>
          <li>• <strong>Đầu tư ngắn hạn</strong>: Gửi tiền vào MMF/tiết kiệm linh hoạt trong kỳ miễn lãi</li>
          <li>• <strong>Nhắc nhở thanh toán</strong>: Hệ thống sẽ tự động nhắc trước 2 ngày đến hạn</li>
          <li>• <strong>Gợi ý tiết kiệm</strong>: Dựa vào khoản thanh toán để đề xuất kênh tiết kiệm tối ưu</li>
        </ul>
      </div>
    </div>
  )
}
