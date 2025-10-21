import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Home, Calendar, User, Store, Bell, Search } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useNotifications } from '../hooks/useNotifications'

const MobileBottomNav = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const { notifications } = useNotifications()
  const [activeTab, setActiveTab] = useState('')

  // Determinar aba ativa baseada na rota
  const getActiveTab = () => {
    const path = location.pathname
    if (path.includes('/cliente/dashboard') || path === '/') return 'home'
    if (path.includes('/agendamento') || path.includes('/agenda')) return 'calendar'
    if (path.includes('/estabelecimento') && !path.includes('/dashboard')) return 'search'
    if (path.includes('/perfil') || path.includes('/profile')) return 'profile'
    if (path.includes('/notificacoes') || path.includes('/notifications')) return 'notifications'
    return 'home'
  }

  const currentTab = getActiveTab()

  const navItems = [
    {
      id: 'home',
      icon: Home,
      label: 'Início',
      path: user?.tipo === 'cliente' ? '/cliente/dashboard' : '/estabelecimento/dashboard',
      show: true
    },
    {
      id: 'search',
      icon: Search,
      label: 'Buscar',
      path: user?.tipo === 'cliente' ? '/cliente/dashboard' : '/estabelecimento/dashboard',
      show: user?.tipo === 'cliente'
    },
    {
      id: 'calendar',
      icon: Calendar,
      label: 'Agenda',
      path: user?.tipo === 'cliente' ? '/cliente/historico' : '/estabelecimento/dashboard',
      show: true
    },
    {
      id: 'notifications',
      icon: Bell,
      label: 'Notificações',
      path: '/notificacoes',
      show: true,
      badge: notifications.filter(n => !n.lida).length
    },
    {
      id: 'profile',
      icon: User,
      label: 'Perfil',
      path: user?.tipo === 'cliente' ? '/cliente/perfil' : '/estabelecimento/perfil',
      show: true
    }
  ]

  const handleTabClick = (item) => {
    setActiveTab(item.id)
    navigate(item.path)
  }

  // Não mostrar em telas grandes
  if (window.innerWidth >= 768) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 md:hidden">
      {/* Safe area para iPhone */}
      <div className="pb-safe">
        <div className="flex justify-around py-2">
          {navItems.filter(item => item.show).map((item) => {
            const Icon = item.icon
            const isActive = currentTab === item.id
            
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item)}
                className={`
                  relative flex flex-col items-center justify-center py-2 px-3 min-w-0 flex-1
                  transition-all duration-200 transform active:scale-95
                  ${isActive 
                    ? 'text-primary-600 dark:text-primary-400' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }
                `}
              >
                {/* Badge de notificação */}
                {item.badge > 0 && (
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                    {item.badge > 9 ? '9+' : item.badge}
                  </div>
                )}
                
                {/* Ícone */}
                <div className={`
                  p-2 rounded-xl transition-all duration-200
                  ${isActive 
                    ? 'bg-primary-100 dark:bg-primary-900/30' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }
                `}>
                  <Icon size={20} />
                </div>
                
                {/* Label */}
                <span className={`
                  text-xs font-medium mt-1 truncate max-w-full
                  ${isActive ? 'opacity-100' : 'opacity-70'}
                `}>
                  {item.label}
                </span>
                
                {/* Indicador ativo */}
                {isActive && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-primary-600 dark:bg-primary-400 rounded-full" />
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default MobileBottomNav
