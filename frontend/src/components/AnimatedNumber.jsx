import { useEffect, useState } from 'react'

const AnimatedNumber = ({ value, duration = 1000, prefix = '', suffix = '' }) => {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const startValue = 0
    const endValue = parseFloat(value) || 0
    const increment = endValue / (duration / 16)
    let current = startValue

    const timer = setInterval(() => {
      current += increment
      if (current >= endValue) {
        setDisplayValue(endValue)
        clearInterval(timer)
      } else {
        setDisplayValue(current)
      }
    }, 16)

    return () => clearInterval(timer)
  }, [value, duration])

  const formatValue = (val) => {
    if (typeof val === 'number' && !Number.isInteger(val)) {
      return val.toFixed(1)
    }
    return Math.floor(val)
  }

  return (
    <span>
      {prefix}{formatValue(displayValue)}{suffix}
    </span>
  )
}

export default AnimatedNumber


