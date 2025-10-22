import { forwardRef } from 'react'

const Input = forwardRef(({ 
  label, 
  error, 
  icon: Icon, 
  type = 'text',
  fullWidth = true,
  className = '',
  ...props 
}, ref) => {
  const widthClass = fullWidth ? 'w-full' : ''
  
  return (
    <div className={`${widthClass} ${className}`}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}
      
      <div className="relative group">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 group-focus-within:text-primary-500 dark:group-focus-within:text-primary-400 transition-colors duration-200">
            <Icon size={20} />
          </div>
        )}
        
        <input
          ref={ref}
          type={type}
          className={`
            w-full px-4 py-3 rounded-xl border-2 transition-all duration-300
            bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
            ${Icon ? 'pl-12' : ''}
            ${error 
              ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-200/50 dark:border-red-600 dark:focus:border-red-500 dark:focus:ring-red-900/50' 
              : 'border-gray-300 dark:border-gray-600 focus:border-primary-500 focus:ring-4 focus:ring-primary-200/50 dark:focus:ring-primary-900/50 hover:border-primary-400 dark:hover:border-primary-600'
            }
            disabled:bg-gray-50 dark:disabled:bg-gray-900 disabled:text-gray-500 disabled:cursor-not-allowed disabled:opacity-50
            placeholder:text-gray-400 dark:placeholder:text-gray-500
            shadow-sm hover:shadow-md focus:shadow-lg
          `}
          {...props}
        />
        
        {/* Focus indicator line */}
        <div className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-full transform scale-x-0 transition-transform duration-300 group-focus-within:scale-x-100 ${
          error ? 'bg-red-500' : 'bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500'
        }`} />
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1 animate-slide-down">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input

