import { useState } from 'react'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false, 
  disabled = false,
  type = 'button',
  onClick,
  className = '',
  ...props 
}) => {
  const [ripples, setRipples] = useState([])

  const handleClick = (e) => {
    if (disabled) return
    
    // Efeito ripple
    const button = e.currentTarget
    const rect = button.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const x = e.clientX - rect.left - size / 2
    const y = e.clientY - rect.top - size / 2
    
    const newRipple = {
      x,
      y,
      size,
      id: Date.now()
    }
    
    setRipples([...ripples, newRipple])
    
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id))
    }, 600)
    
    if (onClick) onClick(e)
  }

  const baseStyles = 'relative overflow-hidden font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2 transform active:scale-95'
  
  const variants = {
    primary: 'bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-500 dark:to-primary-600 text-white hover:from-primary-700 hover:to-primary-800 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed shadow-lg hover:shadow-xl',
    secondary: 'bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 border-2 border-primary-600 dark:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 active:bg-primary-100 dark:active:bg-primary-900/30 disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:text-gray-400 disabled:border-gray-300 dark:disabled:border-gray-600 disabled:cursor-not-allowed shadow-md hover:shadow-lg',
    outline: 'bg-transparent text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 active:bg-gray-100 dark:active:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed',
    danger: 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed shadow-lg hover:shadow-xl',
    ghost: 'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 active:bg-gray-200 dark:active:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed',
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-8 py-4 text-lg',
  }
  
  const widthClass = fullWidth ? 'w-full' : ''
  
  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      {...props}
    >
      {/* Efeito Ripple */}
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute rounded-full bg-white/30 animate-ping"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
            animation: 'ping 0.6s cubic-bezier(0, 0, 0.2, 1)'
          }}
        />
      ))}
      
      {/* Conteúdo do botão */}
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
    </button>
  )
}

export default Button

