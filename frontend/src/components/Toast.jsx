import { useEffect } from 'react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle, Sparkles } from 'lucide-react'

const Toast = ({ message, type = 'info', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      
      return () => clearTimeout(timer)
    }
  }, [duration, onClose])
  
  const types = {
    success: {
      bg: 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
      border: 'border-green-200 dark:border-green-700',
      text: 'text-green-800 dark:text-green-200',
      icon: CheckCircle,
      iconColor: 'text-green-600 dark:text-green-400',
      progressColor: 'bg-green-500'
    },
    error: {
      bg: 'bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20',
      border: 'border-red-200 dark:border-red-700',
      text: 'text-red-800 dark:text-red-200',
      icon: AlertCircle,
      iconColor: 'text-red-600 dark:text-red-400',
      progressColor: 'bg-red-500'
    },
    warning: {
      bg: 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20',
      border: 'border-yellow-200 dark:border-yellow-700',
      text: 'text-yellow-800 dark:text-yellow-200',
      icon: AlertTriangle,
      iconColor: 'text-yellow-600 dark:text-yellow-400',
      progressColor: 'bg-yellow-500'
    },
    info: {
      bg: 'bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
      border: 'border-blue-200 dark:border-blue-700',
      text: 'text-blue-800 dark:text-blue-200',
      icon: Info,
      iconColor: 'text-blue-600 dark:text-blue-400',
      progressColor: 'bg-blue-500'
    },
    premium: {
      bg: 'bg-gradient-to-r from-purple-50 via-pink-50 to-yellow-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-yellow-900/20',
      border: 'border-purple-200 dark:border-purple-700',
      text: 'text-purple-800 dark:text-purple-200',
      icon: Sparkles,
      iconColor: 'text-purple-600 dark:text-purple-400',
      progressColor: 'bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500'
    }
  }
  
  const config = types[type] || types.info
  const Icon = config.icon
  
  return (
    <div className="animate-slide-in-right">
      <div className={`${config.bg} ${config.border} ${config.text} border rounded-xl p-4 shadow-2xl backdrop-blur-sm flex items-start gap-3 min-w-[320px] max-w-md relative overflow-hidden`}>
        {/* Ícone Animado */}
        <div className={`${config.iconColor} flex-shrink-0 animate-scale-in`}>
          <Icon size={24} className={type === 'success' ? 'animate-bounce-in' : ''} />
        </div>
        
        {/* Mensagem */}
        <p className="flex-1 text-sm font-medium leading-relaxed pt-0.5">{message}</p>
        
        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="flex-shrink-0 hover:scale-110 transition-transform p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5"
        >
          <X size={18} />
        </button>

        {/* Barra de Progresso */}
        {duration > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/10 dark:bg-white/10">
            <div 
              className={`h-full ${config.progressColor} origin-left`}
              style={{
                animation: `shrink ${duration}ms linear forwards`
              }}
            ></div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Toast

