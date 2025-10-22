const Badge = ({ children, variant = 'default', size = 'md', gradient = false, glow = false, className = '' }) => {
  const variants = {
    default: 'bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-200',
    primary: 'bg-gradient-to-r from-primary-100 to-primary-200 dark:from-primary-900/50 dark:to-primary-800/50 text-primary-700 dark:text-primary-300 border border-primary-300/50 dark:border-primary-600/50',
    success: 'bg-gradient-to-r from-green-100 to-emerald-200 dark:from-green-900/50 dark:to-emerald-800/50 text-green-700 dark:text-green-300 border border-green-300/50 dark:border-green-600/50',
    warning: 'bg-gradient-to-r from-yellow-100 to-orange-200 dark:from-yellow-900/50 dark:to-orange-800/50 text-yellow-800 dark:text-yellow-300 border border-yellow-300/50 dark:border-yellow-600/50',
    danger: 'bg-gradient-to-r from-red-100 to-red-200 dark:from-red-900/50 dark:to-red-800/50 text-red-700 dark:text-red-300 border border-red-300/50 dark:border-red-600/50',
    info: 'bg-gradient-to-r from-blue-100 to-cyan-200 dark:from-blue-900/50 dark:to-cyan-800/50 text-blue-700 dark:text-blue-300 border border-blue-300/50 dark:border-blue-600/50',
  }

  const gradientVariants = {
    default: 'bg-gradient-to-r from-gray-500 to-gray-600 text-white',
    primary: 'bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500 text-white animate-gradient shadow-lg',
    success: 'bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white animate-gradient shadow-lg',
    warning: 'bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 text-white animate-gradient shadow-lg',
    danger: 'bg-gradient-to-r from-red-500 via-red-600 to-pink-600 text-white animate-gradient shadow-lg',
    info: 'bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 text-white animate-gradient shadow-lg',
  }
  
  const sizes = {
    xs: 'px-2 py-0.5 text-2xs',
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
    xl: 'px-5 py-2 text-lg',
  }
  
  const glowClass = glow ? 'shadow-lg shadow-current/50' : ''
  
  return (
    <span className={`inline-flex items-center gap-1 font-semibold rounded-full ${gradient ? gradientVariants[variant] : variants[variant]} ${sizes[size]} ${glowClass} transition-all duration-300 ${className}`}>
      {children}
    </span>
  )
}

export default Badge

