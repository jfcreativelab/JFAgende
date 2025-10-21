import { useState, useEffect } from 'react'
import Logo from './Logo'

const LogoLoading = ({ 
  size = 'lg', 
  message = 'Carregando...',
  showMessage = true,
  className = ''
}) => {
  const [dots, setDots] = useState('')

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev === '...') return ''
        return prev + '.'
      })
    }, 500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
      {/* Logo com animação de rotação */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur-lg opacity-30 animate-pulse"></div>
        <div className="relative animate-spin-slow">
          <Logo size={size} />
        </div>
      </div>
      
      {/* Mensagem de carregamento */}
      {showMessage && (
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 font-medium">
            {message}{dots}
          </p>
        </div>
      )}
      
      {/* Barra de progresso animada */}
      <div className="w-32 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-full animate-progress-bar"></div>
      </div>
    </div>
  )
}

export default LogoLoading
