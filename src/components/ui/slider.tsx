import * as React from "react"

export interface SliderProps {
  min?: number
  max?: number
  step?: number
  value?: number[]
  onValueChange?: (value: number[]) => void
  className?: string
}

const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  ({ min = 0, max = 100, step = 1, value = [0, 100], onValueChange, className }, ref) => {
    const [localValue, setLocalValue] = React.useState(value)
    const sliderRef = React.useRef<HTMLDivElement>(null)
    const [isDragging, setIsDragging] = React.useState<number | null>(null)

    React.useEffect(() => {
      setLocalValue(value)
    }, [value])

    const updateValue = React.useCallback((clientX: number) => {
      if (!sliderRef.current || isDragging === null) return

      const rect = sliderRef.current.getBoundingClientRect()
      const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
      const newValue = min + percent * (max - min)
      const steppedValue = Math.round(newValue / step) * step

      const newValues = [...localValue]
      newValues[isDragging] = Math.max(min, Math.min(max, steppedValue))
      
      // Ensure min thumb doesn't go past max thumb
      if (isDragging === 0 && newValues[0] > newValues[1]) {
        newValues[0] = newValues[1]
      }
      // Ensure max thumb doesn't go below min thumb
      if (isDragging === 1 && newValues[1] < newValues[0]) {
        newValues[1] = newValues[0]
      }

      setLocalValue(newValues)
      onValueChange?.(newValues)
    }, [isDragging, localValue, max, min, onValueChange, step])

    const handleMouseDown = (index: number) => {
      setIsDragging(index)
    }

    React.useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => {
        if (isDragging !== null) {
          updateValue(e.clientX)
        }
      }

      const handleMouseUp = () => {
        setIsDragging(null)
      }

      if (isDragging !== null) {
        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)
      }

      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }, [isDragging, updateValue])

    const getPercent = (val: number) => ((val - min) / (max - min)) * 100

    return (
      <div
        ref={ref}
        className={`relative flex items-center w-full touch-none select-none ${className || ''}`}
      >
        <div
          ref={sliderRef}
          className="relative h-2 w-full rounded-full bg-secondary cursor-pointer"
        >
          {/* Active range */}
          <div
            className="absolute h-2 rounded-full bg-primary"
            style={{
              left: `${getPercent(localValue[0])}%`,
              width: `${getPercent(localValue[1]) - getPercent(localValue[0])}%`,
            }}
          />
          
          {/* Min thumb */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-5 w-5 rounded-full border-2 border-primary bg-background shadow-md cursor-grab active:cursor-grabbing focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            style={{ left: `${getPercent(localValue[0])}%` }}
            onMouseDown={() => handleMouseDown(0)}
            role="slider"
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={localValue[0]}
          />
          
          {/* Max thumb */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-5 w-5 rounded-full border-2 border-primary bg-background shadow-md cursor-grab active:cursor-grabbing focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            style={{ left: `${getPercent(localValue[1])}%` }}
            onMouseDown={() => handleMouseDown(1)}
            role="slider"
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={localValue[1]}
          />
        </div>
      </div>
    )
  }
)
Slider.displayName = "Slider"

export { Slider }