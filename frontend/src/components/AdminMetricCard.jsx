import { useState, useEffect } from 'react'
import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown } from 'lucide-react'
import Card from './Card'
import AnimatedNumber from './AnimatedNumber'

const AdminMetricCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'positive',
  icon: Icon,
  color = 'blue',
  subtitle,
  loading = false 
}) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const colorClasses = {
    blue: {
      bg: 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20',
      border: 'border-blue-200 dark:border-blue-700',
      icon: 'bg-blue-500',
      text: 'text-blue-600 dark:text-blue-400',
      change: changeType === 'positive' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
    },
    green: {
      bg: 'from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20',
      border: 'border-green-200 dark:border-green-700',
      icon: 'bg-green-500',
      text: 'text-green-600 dark:text-green-400',
      change: changeType === 'positive' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
    },
    purple: {
      bg: 'from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20',
      border: 'border-purple-200 dark:border-purple-700',
      icon: 'bg-purple-500',
      text: 'text-purple-600 dark:text-purple-400',
      change: changeType === 'positive' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
    },
    yellow: {
      bg: 'from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20',
      border: 'border-yellow-200 dark:border-yellow-700',
      icon: 'bg-yellow-500',
      text: 'text-yellow-600 dark:text-yellow-400',
      change: changeType === 'positive' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
    },
    red: {
      bg: 'from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20',
      border: 'border-red-200 dark:border-red-700',
      icon: 'bg-red-500',
      text: 'text-red-600 dark:text-red-400',
      change: changeType === 'positive' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
    },
    gray: {
      bg: 'from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20',
      border: 'border-gray-200 dark:border-gray-700',
      icon: 'bg-gray-500',
      text: 'text-gray-600 dark:text-gray-400',
      change: changeType === 'positive' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
    }
  }

  const classes = colorClasses[color] || colorClasses.blue

  if (loading) {
    return (
      <Card className={`bg-gradient-to-br ${classes.bg} ${classes.border} animate-pulse`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 ${classes.icon} rounded-xl`}>
              <div className="w-6 h-6 bg-white/20 rounded"></div>
            </div>
            <div className="h-4 w-16 bg-white/20 rounded"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 w-24 bg-white/20 rounded"></div>
            <div className="h-8 w-20 bg-white/20 rounded"></div>
            <div className="h-3 w-32 bg-white/20 rounded"></div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card 
      className={`group hover:shadow-2xl transition-all duration-300 bg-gradient-to-br ${classes.bg} ${classes.border} ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{ transitionDelay: '100ms' }}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 ${classes.icon} rounded-xl group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          {change && (
            <div className={`flex items-center gap-1 ${classes.change}`}>
              {changeType === 'positive' ? (
                <ArrowUpRight size={16} />
              ) : (
                <ArrowDownRight size={16} />
              )}
              <span className="text-sm font-semibold">
                {typeof change === 'number' ? `+${change}%` : change}
              </span>
            </div>
          )}
        </div>
        
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {typeof value === 'number' ? (
              <AnimatedNumber value={value} />
            ) : (
              value
            )}
          </p>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </Card>
  )
}

export default AdminMetricCard
