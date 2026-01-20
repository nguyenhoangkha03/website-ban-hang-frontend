'use client'

import { Plus, Minus } from 'lucide-react'

interface QuantitySelectorProps {
  quantity: number
  onQuantityChange: (qty: number) => void
  min?: number
  max?: number
  label?: string
}

export default function QuantitySelector({
  quantity,
  onQuantityChange,
  min = 1,
  max,
  label,
}: QuantitySelectorProps) {
  const handleDecrease = () => {
    if (quantity > min) {
      onQuantityChange(quantity - 1)
    }
  }

  const handleIncrease = () => {
    if (!max || quantity < max) {
      onQuantityChange(quantity + 1)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || min
    if (value >= min && (!max || value <= max)) {
      onQuantityChange(value)
    }
  }

  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}
      <div className="flex items-center border border-gray-300 rounded-lg w-fit">
        <button
          onClick={handleDecrease}
          disabled={quantity <= min}
          className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Minus className="w-4 h-4" />
        </button>
        <input
          type="number"
          value={quantity}
          onChange={handleChange}
          className="w-12 text-center border-l border-r border-gray-300 py-2 focus:outline-none"
          min={min}
          max={max}
        />
        <button
          onClick={handleIncrease}
          disabled={max !== undefined && quantity >= max}
          className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
