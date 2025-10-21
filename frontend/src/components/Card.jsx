const Card = ({ 
  children, 
  className = '', 
  padding = 'md',
  hoverable = false,
  onClick,
  ...props 
}) => {
  const baseStyles = 'bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all duration-200'
  
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }
  
  const hoverStyles = hoverable ? 'hover:shadow-md hover:border-primary-200 dark:hover:border-primary-700 cursor-pointer' : ''
  
  return (
    <div
      onClick={onClick}
      className={`${baseStyles} ${paddings[padding]} ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card

