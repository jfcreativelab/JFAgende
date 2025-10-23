import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, BarChart3, PieChart, Activity } from 'lucide-react'
import Card from './Card'

const AdminChart = ({ 
  title, 
  data = [], 
  type = 'line',
  color = 'blue',
  height = 200,
  showTrend = true,
  trendValue = 0,
  trendType = 'positive'
}) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200)
    return () => clearTimeout(timer)
  }, [])

  const colorClasses = {
    blue: 'text-blue-500',
    green: 'text-green-500',
    purple: 'text-purple-500',
    yellow: 'text-yellow-500',
    red: 'text-red-500'
  }

  const generateMockData = () => {
    const points = 12
    const baseValue = 100
    const variation = 30
    
    return Array.from({ length: points }, (_, i) => ({
      x: i,
      y: baseValue + Math.sin(i * 0.5) * variation + Math.random() * 20 - 10,
      label: `Mês ${i + 1}`
    }))
  }

  const chartData = data.length > 0 ? data : generateMockData()
  const maxValue = Math.max(...chartData.map(d => d.y))
  const minValue = Math.min(...chartData.map(d => d.y))
  const range = maxValue - minValue

  const getPathData = () => {
    if (chartData.length === 0) return ''
    
    const width = 100
    const height = 80
    const padding = 10
    
    const points = chartData.map((point, index) => {
      const x = (index / (chartData.length - 1)) * (width - 2 * padding) + padding
      const y = height - padding - ((point.y - minValue) / range) * (height - 2 * padding)
      return `${x},${y}`
    }).join(' ')
    
    return `M ${points}`
  }

  const getBarData = () => {
    return chartData.map((point, index) => {
      const barHeight = ((point.y - minValue) / range) * 60
      const barWidth = 80 / chartData.length
      const x = (index * 100) / chartData.length + (100 / chartData.length - barWidth) / 2
      
      return {
        x: x,
        y: 80 - barHeight,
        width: barWidth,
        height: barHeight,
        value: point.y
      }
    })
  }

  return (
    <Card 
      className={`h-full ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{ transitionDelay: '200ms' }}
    >
      <div className="p-6 h-full flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          {showTrend && (
            <div className={`flex items-center gap-1 ${
              trendType === 'positive' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {trendType === 'positive' ? (
                <TrendingUp size={16} />
              ) : (
                <TrendingDown size={16} />
              )}
              <span className="text-sm font-semibold">
                {trendValue > 0 ? '+' : ''}{trendValue}%
              </span>
            </div>
          )}
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="w-full h-full relative">
            {type === 'line' && (
              <svg 
                viewBox="0 0 100 80" 
                className="w-full h-full"
                style={{ maxHeight: `${height}px` }}
              >
                <defs>
                  <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                  </linearGradient>
                </defs>
                
                {/* Grid lines */}
                <g stroke="currentColor" strokeWidth="0.5" opacity="0.1">
                  {[0, 20, 40, 60, 80].map(y => (
                    <line key={y} x1="10" y1={y} x2="90" y2={y} />
                  ))}
                </g>
                
                {/* Area under curve */}
                <path
                  d={`${getPathData()} L 90,80 L 10,80 Z`}
                  fill={`url(#gradient-${color})`}
                  className={colorClasses[color]}
                />
                
                {/* Line */}
                <path
                  d={getPathData()}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={colorClasses[color]}
                />
                
                {/* Data points */}
                {chartData.map((point, index) => {
                  const x = (index / (chartData.length - 1)) * 80 + 10
                  const y = 80 - ((point.y - minValue) / range) * 60 - 10
                  
                  return (
                    <circle
                      key={index}
                      cx={x}
                      cy={y}
                      r="2"
                      fill="currentColor"
                      className={colorClasses[color]}
                    />
                  )
                })}
              </svg>
            )}

            {type === 'bar' && (
              <svg 
                viewBox="0 0 100 80" 
                className="w-full h-full"
                style={{ maxHeight: `${height}px` }}
              >
                {getBarData().map((bar, index) => (
                  <g key={index}>
                    <rect
                      x={bar.x}
                      y={bar.y}
                      width={bar.width}
                      height={bar.height}
                      fill="currentColor"
                      opacity="0.7"
                      className={colorClasses[color]}
                    />
                    <text
                      x={bar.x + bar.width / 2}
                      y={bar.y - 2}
                      textAnchor="middle"
                      fontSize="8"
                      fill="currentColor"
                      className={colorClasses[color]}
                    >
                      {Math.round(bar.value)}
                    </text>
                  </g>
                ))}
              </svg>
            )}

            {type === 'pie' && (
              <div className="flex items-center justify-center h-full">
                <div className="relative w-32 h-32">
                  <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${2 * Math.PI * 40 * 0.7}`}
                      className={colorClasses[color]}
                      opacity="0.2"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeDasharray={`${2 * Math.PI * 40 * 0.7}`}
                      strokeDashoffset="0"
                      className={colorClasses[color]}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      70%
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {chartData.length > 0 && (
          <div className="mt-4 flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>{chartData[0]?.label || 'Início'}</span>
            <span>{chartData[chartData.length - 1]?.label || 'Atual'}</span>
          </div>
        )}
      </div>
    </Card>
  )
}

export default AdminChart
