'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { use } from 'react'
import { Target, ArrowLeft, Edit, Trash2, Loader2, Save, X } from 'lucide-react'

export default function GoalDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [goal, setGoal] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    targetAmount: '',
    currentAmount: '',
    deadline: '',
    priority: '',
    monthlyContribution: '',
    notes: ''
  })

  useEffect(() => {
    fetchGoal()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchGoal = async () => {
    try {
      const response = await fetch(`/api/goals/${resolvedParams.id}`)
      if (response.ok) {
        const data = await response.json()
        setGoal(data)
        setFormData({
          name: data.name,
          type: data.type,
          targetAmount: data.targetAmount.toString(),
          currentAmount: data.currentAmount.toString(),
          deadline: data.deadline.split('T')[0],
          priority: data.priority,
          monthlyContribution: data.monthlyContribution?.toString() || '',
          notes: data.notes || ''
        })
      } else {
        alert('Không tìm thấy mục tiêu')
        router.push('/goals')
      }
    } catch (error) {
      console.error('Error fetching goal:', error)
      alert('Có lỗi xảy ra')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch(`/api/goals/${resolvedParams.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const updatedGoal = await response.json()
        setGoal(updatedGoal)
        setIsEditing(false)
        alert('Đã cập nhật mục tiêu')
      } else {
        alert('Có lỗi xảy ra khi cập nhật')
      }
    } catch (error) {
      console.error('Error updating goal:', error)
      alert('Có lỗi xảy ra')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Bạn có chắc muốn xóa mục tiêu này?')) return

    try {
      const response = await fetch(`/api/goals/${resolvedParams.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        alert('Đã xóa mục tiêu')
        router.push('/goals')
      } else {
        alert('Có lỗi xảy ra khi xóa')
      }
    } catch (error) {
      console.error('Error deleting goal:', error)
      alert('Có lỗi xảy ra')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 text-teal-500 animate-spin" />
      </div>
    )
  }

  if (!goal) return null

  const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/goals" className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Chi tiết Mục tiêu</h1>
            <p className="text-gray-600">{goal.name}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 flex items-center space-x-2"
              >
                <Save className="w-5 h-5" />
                <span>Lưu</span>
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center space-x-2"
              >
                <X className="w-5 h-5" />
                <span>Hủy</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 flex items-center space-x-2"
              >
                <Edit className="w-5 h-5" />
                <span>Chỉnh sửa</span>
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center space-x-2"
              >
                <Trash2 className="w-5 h-5" />
                <span>Xóa</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tên mục tiêu</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            disabled={!isEditing}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mục tiêu (VNĐ)</label>
            <input
              type="number"
              value={formData.targetAmount}
              onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
              disabled={!isEditing}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hiện có (VNĐ)</label>
            <input
              type="number"
              value={formData.currentAmount}
              onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
              disabled={!isEditing}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Thời hạn</label>
            <input
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              disabled={!isEditing}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ưu tiên</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              disabled={!isEditing}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50"
            >
              <option value="HIGH">Cao</option>
              <option value="MEDIUM">Trung bình</option>
              <option value="LOW">Thấp</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Đóng góp hàng tháng (VNĐ)</label>
          <input
            type="number"
            value={formData.monthlyContribution}
            onChange={(e) => setFormData({ ...formData, monthlyContribution: e.target.value })}
            disabled={!isEditing}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50"
          />
        </div>

        {/* Progress */}
        <div className="bg-teal-50 border border-teal-200 rounded-lg p-6">
          <h3 className="font-semibold text-teal-900 mb-3">Tiến độ: {progress.toFixed(1)}%</h3>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className="bg-teal-500 h-4 rounded-full transition-all"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
