import Card from './Card'
import Button from './Button'
import { Sparkles } from 'lucide-react'

const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  actionLabel, 
  onAction,
  illustration = false,
  size = 'medium' // small, medium, large
}) => {
  const sizes = {
    small: 'py-8',
    medium: 'py-12',
    large: 'py-16'
  }

  const iconSizes = {
    small: 40,
    medium: 56,
    large: 72
  }

  return (
    <Card>
      <div className={`text-center ${sizes[size]} animate-fade-in`}>
        {/* Ícone com animação */}
        {Icon && (
          <div className="relative inline-block mb-6">
            {/* Efeito de brilho atrás do ícone */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-100 to-purple-100 dark:from-primary-900/30 dark:to-purple-900/30 rounded-full blur-2xl animate-pulse-slow"></div>
            
            {/* Ícone principal */}
            <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border-2 border-gray-200 dark:border-gray-600 mb-2 animate-bounce-in shadow-lg">
              <Icon className="text-gray-400 dark:text-gray-500" size={iconSizes[size]} />
            </div>
            
            {/* Estrelinhas decorativas */}
            {illustration && (
              <>
                <Sparkles 
                  className="absolute -top-2 -right-2 text-yellow-400 animate-pulse" 
                  size={16} 
                />
                <Sparkles 
                  className="absolute -bottom-1 -left-2 text-purple-400 animate-pulse" 
                  size={12} 
                  style={{ animationDelay: '0.5s' }}
                />
              </>
            )}
          </div>
        )}
        
        {/* Título */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
          {title}
        </h3>
        
        {/* Descrição */}
        {description && (
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto leading-relaxed">
            {description}
          </p>
        )}
        
        {/* Botão de ação */}
        {actionLabel && onAction && (
          <div className="flex justify-center gap-3">
            <Button onClick={onAction} size="lg">
              {actionLabel}
            </Button>
          </div>
        )}
        
        {/* Dica adicional */}
        {illustration && (
          <p className="mt-6 text-xs text-gray-500 dark:text-gray-500 italic">
            💡 Dica: Comece adicionando seu primeiro item!
          </p>
        )}
      </div>
    </Card>
  )
}

export default EmptyState


