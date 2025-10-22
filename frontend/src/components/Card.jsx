const Card = ({ 
  children, 
  className = '', 
  padding = 'md',
  hoverable = false,
  glass = false,
  gradient = false,
  bordered = true,
  glow = false,
  onClick,
  ...props 
}) => {
  const baseStyles = glass 
    ? 'glass rounded-3xl transition-all duration-300'
    : gradient
    ? 'bg-gradient-to-br from-white via-white to-gray-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900 rounded-3xl shadow-smooth border border-gray-100/50 dark:border-gray-700/50 transition-all duration-300'
    : 'bg-white dark:bg-gray-800 rounded-3xl shadow-smooth border transition-all duration-300'
  
  const borderStyles = bordered 
    ? 'border-gray-100 dark:border-gray-700' 
    : 'border-transparent'
  
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  }
  
  const hoverStyles = hoverable 
    ? 'hover:shadow-smooth-lg hover:-translate-y-1 hover:border-primary-200 dark:hover:border-primary-700 cursor-pointer transform' 
    : ''
  
  const glowStyles = glow ? 'glow-primary' : ''
  
  return (
    <div
      onClick={onClick}
      className={`${baseStyles} ${borderStyles} ${paddings[padding]} ${hoverStyles} ${glowStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card

