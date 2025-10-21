import { forwardRef } from 'react'

const Select = forwardRef(({ 
  label, 
  error, 
  options = [],
  fullWidth = true,
  placeholder = 'Selecione...',
  className = '',
  ...props 
}, ref) => {
  const widthClass = fullWidth ? 'w-full' : ''
  
  return (
    <div className={`${widthClass} ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
      )}
      
      <select
        ref={ref}
        className={`
          w-full px-4 py-2.5 rounded-lg border transition-all duration-200
          ${error 
            ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
            : 'border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200'
          }
          disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
          bg-white
        `}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {error && (
        <p className="mt-1.5 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
})

Select.displayName = 'Select'

export default Select

