'use client'

import { CheckCircle, Truck, XCircle, Package } from 'lucide-react'

interface StatusBadgeProps {
  status: 'delivered' | 'shipping' | 'cancelled' | 'pending'
  showText?: boolean
}

export default function StatusBadge({ status, showText = true }: StatusBadgeProps) {
  const statusConfig = {
    delivered: {
      bg: 'bg-green-50',
      text: 'text-green-700',
      icon: CheckCircle,
      label: 'Đã giao',
      iconColor: 'text-green-600',
    },
    shipping: {
      bg: 'bg-orange-50',
      text: 'text-orange-700',
      icon: Truck,
      label: 'Đang giao',
      iconColor: 'text-orange-600',
    },
    cancelled: {
      bg: 'bg-gray-50',
      text: 'text-gray-700',
      icon: XCircle,
      label: 'Đã hủy',
      iconColor: 'text-gray-600',
    },
    pending: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      icon: Package,
      label: 'Chờ xác nhận',
      iconColor: 'text-blue-600',
    },
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${config.bg} ${config.text} w-fit`}>
      <Icon className={`w-5 h-5 ${config.iconColor}`} />
      {showText && <span className="font-medium text-sm">{config.label}</span>}
    </div>
  )
}
