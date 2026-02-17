'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Target, Plus, Calendar, TrendingUp, DollarSign, Home, GraduationCap, Plane } from 'lucide-react'

interface Goal {
  id: string
  name: string
  type: string
  targetAmount: number
  currentAmount: number
  deadline: string
  priority: string
  monthlyContribution: number
  progress: number
  icon: any
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      name: 'Nghỉ hưu sớm',
      type: 'RETIREMENT',
      targetAmount: 5000000000,
      currentAmount: 1200000000,
      deadline: '2045-12-31',
      priority: 'HIGH',
      monthlyContribution: 15000000,
      progress: 24,
      icon: Target
    },
    {
      id: '2',
      name: 'Mua nhà',
      type: 'HOUSE',
      targetAmount: 2000000000,
      currentAmount: 600000000,
      deadline: '2028-12-31',
      priority: 'HIGH',
      monthlyContribution: 25000000,
      progress: 30,
      icon: Home
    },
    {
      id: '3',
      name: 'Học phí con',
      type: 'EDUCATION',
      targetAmount: 500000000,
      currentAmount: 150000000,
      deadline: '2030-09-01',
      priority: 'MEDIUM',
      monthlyContribution: 5000000,
      progress: 30,
      icon: GraduationCap
    },
    {
      id: '4',
      name: 'Du lịch châu Âu',
      type: 'TRAVEL',
      targetAmount: 150000000,
      currentAmount: 80000000,
      deadline: '2027-06-30',
      priority: 'LOW',
      monthlyContribution: 3000000,
      progress: 53,
      icon: Plane
    },
  ])

  const totalGoals = goals.length
  const completedGoals = goals.filter(g => g.progress >= 100).length
  const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0)
  const totalCurrent = goals.reduce((sum, g) => sum + g.currentAmount, 0)
  const totalMonthly = goals.reduce((sum, g) => sum + g.monthlyContribution, 0)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-100 text-red-800'
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800'
      case 'LOW': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'Cao'
      case 'MEDIUM': return 'Trung bình'
      case 'LOW': return 'Thấp'
      default: return priority
    }
  }

  const getMonthsRemaining = (deadline: string) => {
    const now = new Date()
    const end = new Date(deadline)
    const diff = end.getTime() - now.getTime()
    return Math.ceil(diff / (1000 * 60 * 60 * 24 * 30))
  }

  const handleAddGoal = () => {
    // Navigate to add goal form
    window.location.href = '/goals/new'
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Target className="w-8 h-8 mr-3 text-teal-600" />
            Mục tiêu Đầu tư
          </h1>
          <p className="text-gray-600 mt-2">
            Lập kế hoạch và theo dõi tiến độ đạt mục tiêu tài chính
          </p>
        </div>
        <button 
          onClick={handleAddGoal}
          className="bg-teal-500 text-white px-6 py-3 rounded-lg hover:bg-teal-600 transition-colors flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Thêm mục tiêu
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tổng mục tiêu</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{totalGoals}</p>
            </div>
            <div className="bg-teal-100 p-3 rounded-lg">
              <Target className="w-6 h-6 text-teal-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">{completedGoals} đã hoàn thành</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tổng mục tiêu</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {(totalTarget / 1000000000).toFixed(1)} tỷ
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Đã tích lũy</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {(totalCurrent / 1000000000).toFixed(1)} tỷ
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-sm text-green-600 mt-2">
            {((totalCurrent / totalTarget) * 100).toFixed(0)}% hoàn thành
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Đóng góp/tháng</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {(totalMonthly / 1000000).toFixed(0)} tr
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Goals List */}
      <div className="space-y-4">
        {goals.map((goal) => {
          const Icon = goal.icon
          const monthsLeft = getMonthsRemaining(goal.deadline)
          const monthlyNeeded = (goal.targetAmount - goal.currentAmount) / monthsLeft

          return (
            <div key={goal.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <div className="bg-teal-100 p-3 rounded-lg">
                    <Icon className="w-6 h-6 text-teal-600" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-3 mb-1">
                      <h3 className="text-xl font-semibold text-gray-900">{goal.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPriorityColor(goal.priority)}`}>
                        Ưu tiên {getPriorityLabel(goal.priority)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Hạn: {new Date(goal.deadline).toLocaleDateString('vi-VN')} • Còn {monthsLeft} tháng
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Tiến độ</p>
                  <p className="text-2xl font-bold text-teal-600">{goal.progress}%</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div 
                    className="bg-teal-500 h-4 rounded-full transition-all flex items-center justify-end pr-2"
                    style={{ width: `${Math.min(goal.progress, 100)}%` }}
                  >
                    {goal.progress >= 10 && (
                      <span className="text-xs text-white font-semibold">
                        {goal.progress}%
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Goal Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                <div>
                  <p className="text-xs text-gray-600">Mục tiêu</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {(goal.targetAmount / 1000000000).toFixed(2)} tỷ
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Hiện tại</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {(goal.currentAmount / 1000000000).toFixed(2)} tỷ
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Còn thiếu</p>
                  <p className="text-sm font-semibold text-orange-600">
                    {((goal.targetAmount - goal.currentAmount) / 1000000000).toFixed(2)} tỷ
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Cần đóng góp/tháng</p>
                  <p className="text-sm font-semibold text-blue-600">
                    {(monthlyNeeded / 1000000).toFixed(1)} tr
                  </p>
                </div>
              </div>

              {/* Current Monthly Contribution */}
              <div className="mt-4 bg-teal-50 border border-teal-200 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-teal-800">Đang đóng góp hàng tháng:</p>
                    <p className="text-lg font-bold text-teal-900">
                      {(goal.monthlyContribution / 1000000).toFixed(0)} triệu/tháng
                    </p>
                  </div>
                  {goal.monthlyContribution >= monthlyNeeded ? (
                    <div className="text-green-600 flex items-center">
                      <TrendingUp className="w-5 h-5 mr-1" />
                      <span className="text-sm font-semibold">Đúng hướng!</span>
                    </div>
                  ) : (
                    <div className="text-orange-600 flex items-center">
                      <Target className="w-5 h-5 mr-1" />
                      <span className="text-sm font-semibold">
                        Tăng thêm {((monthlyNeeded - goal.monthlyContribution) / 1000000).toFixed(1)} tr
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Tips Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">💡 Mẹo Đặt mục tiêu</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• Mục tiêu SMART: Cụ thể, Đo lường được, Khả thi, Liên quan, Có thời hạn</li>
            <li>• Ưu tiên theo tầm quan trọng và thời gian</li>
            <li>• Chia nhỏ mục tiêu lớn thành các cột mốc nhỏ</li>
            <li>• Xem xét lại và điều chỉnh định kỳ</li>
          </ul>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-900 mb-3">🎯 Chiến lược Đạt mục tiêu</h3>
          <ul className="space-y-2 text-sm text-green-800">
            <li>• Tự động hóa đóng góp hàng tháng</li>
            <li>• Phân bổ tài sản phù hợp với thời hạn</li>
            <li>• Tận dụng lãi kép và tái đầu tư</li>
            <li>• Theo dõi và đánh giá tiến độ thường xuyên</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
