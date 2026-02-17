'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, TrendingUp, CreditCard, Settings, Scale, Target, BarChart3 } from 'lucide-react'

export function Navigation() {
  const pathname = usePathname()

  const links = [
    { href: '/', label: 'Trang chủ', icon: Home },
    { href: '/investments', label: 'Đầu tư', icon: TrendingUp },
    { href: '/credit-cards', label: 'Thẻ tín dụng', icon: CreditCard },
    { href: '/rebalance', label: 'Tái cân bằng', icon: Scale },
    { href: '/goals', label: 'Mục tiêu', icon: Target },
    { href: '/reports', label: 'Báo cáo', icon: BarChart3 },
    { href: '/settings', label: 'Cài đặt', icon: Settings },
  ]

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-blue-600">
            💰 Super App
          </Link>
          <div className="flex space-x-1">
            {links.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden md:inline">{label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
