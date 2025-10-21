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
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          {label}
        </label>
      )}
      
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
            <Icon size={20} />
          </div>
        )}
        
        <input
          ref={ref}
          type={type}
          className={`
            w-full px-4 py-2.5 rounded-lg border transition-all duration-200
            bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
            ${Icon ? 'pl-10' : ''}
            ${error 
              ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:border-red-600 dark:focus:border-red-500' 
              : 'border-gray-300 dark:border-gray-600 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800'
            }
            disabled:bg-gray-50 dark:disabled:bg-gray-900 disabled:text-gray-500 disabled:cursor-not-allowed
            placeholder:text-gray-400 dark:placeholder:text-gray-500
          `}
          {...props}
        />
      </div>
      
      {error && (
        <p className="mt-1.5 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input

