import { Crown, Star, Gift } from 'lucide-react'

const PlanoBadge = ({ plano, showIcon = true, size = 'md' }) => {
  const configs = {
    FREE: {
      label: 'FREE',
      icon: Gift,
      bgColor: 'bg-gray-100 dark:bg-gray-700',
      textColor: 'text-gray-600 dark:text-gray-300',
      iconColor: 'text-gray-500'
    },
    BASIC: {
      label: 'BASIC',
      icon: Star,
      bgColor: 'bg-blue-100 dark:bg-blue-900',
      textColor: 'text-blue-700 dark:text-blue-300',
      iconColor: 'text-blue-600'
    },
    PREMIUM: {
      label: 'PREMIUM',
      icon: Crown,
      bgColor: 'bg-gradient-to-r from-yellow-400 to-orange-500',
      textColor: 'text-white',
      iconColor: 'text-white'
    }
  }

  const config = configs[plano] || configs.FREE

  const Icon = config.icon

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  }

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${sizeClasses[size]} ${config.bgColor} ${config.textColor}`}
    >
      {showIcon && <Icon size={iconSizes[size]} className={config.iconColor} />}
      {config.label}
    </span>
  )
}

export default PlanoBadge

