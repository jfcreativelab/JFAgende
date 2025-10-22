import { useEffect } from 'react'
import { X } from 'lucide-react'
import Button from './Button'

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  footer,
  size = 'md' 
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])
  
  if (!isOpen) return null
  
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
  }
  
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 animate-fade-in">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-gray-900/70 to-black/80 backdrop-blur-md"
            onClick={onClose}
          />
          
          {/* Modal */}
          <div className={`relative bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-2xl ${sizes[size]} w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden animate-zoom-in border border-gray-200/50 dark:border-gray-700/50`}>
        {/* Decorative gradient border */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10" />
        
            {/* Header */}
            {title && (
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-white via-white to-gray-50/30 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900/30">
                <h2 className="text-lg sm:text-2xl font-bold gradient-text">{title}</h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-all duration-200 hover:rotate-90 transform p-1 sm:p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
            )}
        
            {/* Content */}
            <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(95vh-120px)] sm:max-h-[calc(90vh-180px)] bg-white dark:bg-gray-800">
              {children}
            </div>
            
            {/* Footer */}
            {footer && (
              <div className="flex flex-col sm:flex-row items-center justify-end gap-2 sm:gap-3 p-4 sm:p-6 border-t border-gray-100 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
                {footer}
              </div>
            )}
      </div>
    </div>
  )
}

export default Modal

