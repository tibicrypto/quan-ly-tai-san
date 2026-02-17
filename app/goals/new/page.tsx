'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Target, Home, GraduationCap, Plane, Car, Heart, DollarSign, Calendar, TrendingUp, ArrowLeft } from 'lucide-react'

export default function NewGoalPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    type: 'RETIREMENT',
    targetAmount: '',
    currentAmount: '',
    deadline: '',
    priority: 'MEDIUM',
    monthlyContribution: '',
  })

  const goalTypes = [
    { value: 'RETIREMENT', label: 'Nghỉ hưu', icon: Target },
    { value: 'HOUSE', label: 'Mua nhà', icon: Home },
    { value: 'EDUCATION', label: 'Học phí', icon: GraduationCap },
    { value: 'TRAVEL', label: 'Du lịch', icon: Plane },
    { value: 'CAR', label: 'Mua xe', icon: Car },
    { value: 'EMERGENCY', label: 'Quỹ khẩn cấp', icon: Heart },
    { value: 'OTHER', label: 'Khác', icon: DollarSign },
  ]

  const priorities = [
    { value: 'HIGH', label: 'Cao', color: 'bg-red-100 text-red-800' },
    { value: 'MEDIUM', label: 'Trung bình', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'LOW', label: 'Thấp', color: 'bg-green-100 text-green-800' },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Calculate derived fields
      const targetAmount = parseFloat(formData.targetAmount)
      const currentAmount = parseFloat(formData.currentAmount) || 0
      const monthlyContribution = parseFloat(formData.monthlyContribution) || 0
      
      const deadline = new Date(formData.deadline)
      const now = new Date()
      const monthsRemaining = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30))
      
      const progress = currentAmount > 0 ? (currentAmount / targetAmount) * 100 : 0
      const requiredMonthly = monthsRemaining > 0 ? (targetAmount - currentAmount) / monthsRemaining : 0

      const goalData = {
        ...formData,
        targetAmount,
        currentAmount,
        monthlyContribution,
        progress: Math.round(progress * 10) / 10,
        requiredMonthly: Math.round(requiredMonthly),
        monthsRemaining,
      }

      // TODO: API call to save goal
      console.log('Saving goal:', goalData)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      alert(`Đã thêm mục tiêu: ${formData.name}\n\n` +
            `Số tiền mục tiêu: ${(targetAmount / 1000000000).toFixed(2)} tỷ\n` +
            `Tiến độ hiện tại: ${progress.toFixed(1)}%\n` +
            `Cần đóng góp: ${(requiredMonthly / 1000000).toFixed(1)} triệu/tháng\n` +
            `Thời gian còn lại: ${monthsRemaining} tháng`)
      
      // Navigate back to goals page
      router.push('/goals')
    } catch (error) {
      console.error('Error saving goal:', error)
      alert('Có lỗi xảy ra khi lưu mục tiêu')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  // Calculate estimated monthly needed
  const calculateMonthlyNeeded = () => {
    if (formData.targetAmount && formData.deadline) {
      const target = parseFloat(formData.targetAmount)
      const current = parseFloat(formData.currentAmount) || 0
      const deadline = new Date(formData.deadline)
      const now = new Date()
      const monthsLeft = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30))
      
      if (monthsLeft > 0) {
        return ((target - current) / monthsLeft).toFixed(0)
      }
    }
    return '0'
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link 
          href="/goals"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Target className="w-8 h-8 mr-3 text-teal-600" />
            Thêm mục tiêu mới
          </h1>
          <p className="text-gray-600 mt-1">
            Tạo mục tiêu tài chính và theo dõi tiến độ đạt được
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8 space-y-6">
        {/* Goal Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tên mục tiêu <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Ví dụ: Nghỉ hưu sớm, Mua nhà, Du lịch châu Âu..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>

        {/* Goal Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Loại mục tiêu <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {goalTypes.map((type) => {
              const Icon = type.icon
              return (
                <label
                  key={type.value}
                  className={`flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.type === type.value
                      ? 'border-teal-500 bg-teal-50'
                      : 'border-gray-200 hover:border-teal-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="type"
                    value={type.value}
                    checked={formData.type === type.value}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <Icon className={`w-8 h-8 mb-2 ${
                    formData.type === type.value ? 'text-teal-600' : 'text-gray-400'
                  }`} />
                  <span className={`text-sm font-medium ${
                    formData.type === type.value ? 'text-teal-900' : 'text-gray-600'
                  }`}>
                    {type.label}
                  </span>
                </label>
              )
            })}
          </div>
        </div>

        {/* Financial Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số tiền mục tiêu (VNĐ) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="targetAmount"
              value={formData.targetAmount}
              onChange={handleChange}
              required
              min="0"
              step="1000000"
              placeholder="Ví dụ: 5000000000 (5 tỷ)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
            {formData.targetAmount && (
              <p className="text-sm text-gray-600 mt-1">
                ≈ {(parseFloat(formData.targetAmount) / 1000000000).toFixed(2)} tỷ VNĐ
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số tiền hiện có (VNĐ)
            </label>
            <input
              type="number"
              name="currentAmount"
              value={formData.currentAmount}
              onChange={handleChange}
              min="0"
              step="1000000"
              placeholder="Ví dụ: 1000000000 (1 tỷ)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
            {formData.currentAmount && (
              <p className="text-sm text-gray-600 mt-1">
                ≈ {(parseFloat(formData.currentAmount) / 1000000000).toFixed(2)} tỷ VNĐ
              </p>
            )}
          </div>
        </div>

        {/* Deadline and Priority */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thời hạn <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              required
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mức độ ưu tiên <span className="text-red-500">*</span>
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              {priorities.map((priority) => (
                <option key={priority.value} value={priority.value}>
                  {priority.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Monthly Contribution */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Đóng góp hàng tháng (VNĐ)
          </label>
          <input
            type="number"
            name="monthlyContribution"
            value={formData.monthlyContribution}
            onChange={handleChange}
            min="0"
            step="100000"
            placeholder="Ví dụ: 15000000 (15 triệu)"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
          {formData.monthlyContribution && (
            <p className="text-sm text-gray-600 mt-1">
              ≈ {(parseFloat(formData.monthlyContribution) / 1000000).toFixed(1)} triệu/tháng
            </p>
          )}
        </div>

        {/* Calculation Summary */}
        {formData.targetAmount && formData.deadline && (
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-teal-900 mb-3 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Tóm tắt kế hoạch
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-teal-700">Cần đóng góp hàng tháng:</p>
                <p className="text-xl font-bold text-teal-900">
                  {(parseFloat(calculateMonthlyNeeded()) / 1000000).toFixed(1)} triệu
                </p>
              </div>
              <div>
                <p className="text-teal-700">Thời gian còn lại:</p>
                <p className="text-xl font-bold text-teal-900">
                  {Math.ceil((new Date(formData.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 30))} tháng
                </p>
              </div>
              <div>
                <p className="text-teal-700">Tiến độ hiện tại:</p>
                <p className="text-xl font-bold text-teal-900">
                  {formData.currentAmount 
                    ? ((parseFloat(formData.currentAmount) / parseFloat(formData.targetAmount)) * 100).toFixed(1)
                    : 0}%
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex items-center space-x-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-teal-500 text-white py-3 px-6 rounded-lg hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            {loading ? 'Đang lưu...' : 'Tạo mục tiêu'}
          </button>
          <Link
            href="/goals"
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
          >
            Hủy
          </Link>
        </div>
      </form>

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">💡 Mẹo thiết lập mục tiêu</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>• <strong>Cụ thể:</strong> Xác định rõ số tiền cần đạt và thời hạn</li>
          <li>• <strong>Thực tế:</strong> Đặt mục tiêu phù hợp với thu nhập và chi tiêu hiện tại</li>
          <li>• <strong>Ưu tiên:</strong> Tập trung vào 2-3 mục tiêu quan trọng nhất</li>
          <li>• <strong>Linh hoạt:</strong> Xem xét và điều chỉnh mục tiêu định kỳ</li>
          <li>• <strong>Tự động hóa:</strong> Thiết lập chuyển khoản tự động để đảm bảo đóng góp đều đặn</li>
        </ul>
      </div>
    </div>
  )
}
