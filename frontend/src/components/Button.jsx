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

  const baseStyles = 'relative overflow-hidden font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 transform active:scale-95 disabled:cursor-not-allowed'
  
  const variants = {
    primary: 'bg-gradient-to-r from-primary-600 via-primary-700 to-purple-600 dark:from-primary-500 dark:via-primary-600 dark:to-purple-500 text-white hover:from-primary-700 hover:via-primary-800 hover:to-purple-700 hover:shadow-2xl hover:shadow-primary-500/50 disabled:from-gray-300 disabled:via-gray-300 disabled:to-gray-400 disabled:opacity-50 shadow-lg shadow-primary-500/30 animate-gradient',
    secondary: 'glass-strong text-primary-600 dark:text-primary-400 border-2 border-primary-500/30 dark:border-primary-500/50 hover:border-primary-500 dark:hover:border-primary-400 hover:shadow-xl hover:shadow-primary-500/20 disabled:opacity-50 disabled:text-gray-400 disabled:border-gray-300 dark:disabled:border-gray-600 shimmer',
    outline: 'bg-transparent text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600 hover:bg-white/50 dark:hover:bg-gray-800/50 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-lg disabled:text-gray-400 disabled:opacity-50 backdrop-blur-sm',
    danger: 'bg-gradient-to-r from-red-600 via-red-700 to-pink-600 text-white hover:from-red-700 hover:via-red-800 hover:to-pink-700 hover:shadow-2xl hover:shadow-red-500/50 disabled:from-gray-300 disabled:via-gray-300 disabled:to-gray-400 disabled:opacity-50 shadow-lg shadow-red-500/30 animate-gradient',
    ghost: 'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-gray-100/80 hover:to-gray-200/80 dark:hover:from-gray-800/80 dark:hover:to-gray-700/80 hover:shadow-md disabled:text-gray-400 disabled:opacity-50 backdrop-blur-sm',
    success: 'bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white hover:from-emerald-700 hover:via-green-700 hover:to-teal-700 hover:shadow-2xl hover:shadow-emerald-500/50 disabled:from-gray-300 disabled:via-gray-300 disabled:to-gray-400 disabled:opacity-50 shadow-lg shadow-emerald-500/30 animate-gradient',
    warning: 'bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600 text-white hover:from-amber-700 hover:via-orange-700 hover:to-yellow-700 hover:shadow-2xl hover:shadow-amber-500/50 disabled:from-gray-300 disabled:via-gray-300 disabled:to-gray-400 disabled:opacity-50 shadow-lg shadow-amber-500/30 animate-gradient',
  }
  
  const sizes = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl',
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

