import { useState } from 'react'

const Logo = ({ 
  size = 'lg', 
  className = '',
  onClick = null
}) => {
  const [imageError, setImageError] = useState(false)

  const sizeClasses = {
    xs: 'h-12 w-12',
    sm: 'h-16 w-16', 
    md: 'h-20 w-20',
    lg: 'h-24 w-24',
    xl: 'h-32 w-32',
    '2xl': 'h-40 w-40'
  }

  const handleImageError = () => {
    setImageError(true)
  }

  const LogoComponent = () => (
    <div 
      className={`flex items-center justify-center ${className} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {/* Logo Icon */}
      <div className={`${sizeClasses[size]} flex-shrink-0`}>
        {!imageError ? (
          <img
            src="/assets/logo-jfagende.png"
            alt="JFAgende Logo"
            className="w-full h-full object-contain"
            onError={handleImageError}
          />
        ) : (
          // Fallback icon se a imagem não carregar
          <div className={`${sizeClasses[size]} bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center`}>
            <svg 
              className="w-3/4 h-3/4 text-white" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
            </svg>
          </div>
        )}
      </div>
    </div>
  )

  return <LogoComponent />
}

export default Logo
