import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { 
  Home, 
  Calendar, 
  Users, 
  Store, 
  BarChart3, 
  Settings, 
  LogOut, 
  Bell, 
  X,
  Menu,
  User,
  Shield,
  FileText,
  DollarSign
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useNotifications } from '../hooks/useNotifications'
import Logo from './Logo'
import Button from './Button'

const ResponsiveSidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const { notifications } = useNotifications()
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const getNavItems = () => {
    if (user?.tipo === 'cliente') {
      return [
        { id: 'dashboard', icon: Home, label: 'Dashboard', path: '/cliente/dashboard' },
        { id: 'historico', icon: Calendar, label: 'Meus Agendamentos', path: '/cliente/historico' },
        { id: 'perfil', icon: User, label: 'Meu Perfil', path: '/cliente/perfil' },
        { id: 'notificacoes', icon: Bell, label: 'Notificações', path: '/notificacoes', badge: notifications.filter(n => !n.lida).length }
      ]
    } else if (user?.tipo === 'estabelecimento') {
      return [
        { id: 'dashboard', icon: Home, label: 'Dashboard', path: '/estabelecimento/dashboard' },
        { id: 'agenda', icon: Calendar, label: 'Agenda', path: '/estabelecimento/dashboard' },
        { id: 'servicos', icon: Store, label: 'Serviços', path: '/estabelecimento/dashboard' },
        { id: 'relatorios', icon: BarChart3, label: 'Relatórios', path: '/estabelecimento/relatorios' },
        { id: 'portfolio', icon: FileText, label: 'Portfólio', path: '/estabelecimento/portfolio' },
        { id: 'assinatura', icon: DollarSign, label: 'Assinatura', path: '/estabelecimento/assinatura' },
        { id: 'notificacoes', icon: Bell, label: 'Notificações', path: '/notificacoes', badge: notifications.filter(n => !n.lida).length }
      ]
    } else if (user?.tipo === 'admin') {
      return [
        { id: 'dashboard', icon: Home, label: 'Dashboard', path: '/admin/dashboard' },
        { id: 'clientes', icon: Users, label: 'Clientes', path: '/admin/clientes' },
        { id: 'estabelecimentos', icon: Store, label: 'Estabelecimentos', path: '/admin/estabelecimentos' },
        { id: 'planos', icon: DollarSign, label: 'Planos', path: '/admin/planos' },
        { id: 'relatorios', icon: BarChart3, label: 'Relatórios', path: '/admin/relatorios-avancados' },
        { id: 'logs', icon: FileText, label: 'Logs', path: '/admin/logs' },
        { id: 'admins', icon: Shield, label: 'Admins', path: '/admin/admins' },
        { id: 'configuracoes', icon: Settings, label: 'Configurações', path: '/admin/configuracoes' }
      ]
    }
    return []
  }

  const navItems = getNavItems()
  const currentPath = location.pathname

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <Logo size="lg" />
        {isMobile && (
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* User Info */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
            <User size={20} className="text-primary-600 dark:text-primary-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {user?.nome || 'Usuário'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
              {user?.tipo || 'cliente'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = currentPath === item.path
          
          return (
            <button
              key={item.id}
              onClick={() => {
                navigate(item.path)
                if (isMobile) setIsOpen(false)
              }}
              className={`
                w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200
                ${isActive 
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }
              `}
            >
              <div className="relative">
                <Icon size={20} />
                {item.badge > 0 && (
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {item.badge > 9 ? '9+' : item.badge}
                  </div>
                )}
              </div>
              <span className="font-medium">{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <LogOut size={20} />
          Sair
        </Button>
      </div>
    </div>
  )

  if (isMobile) {
    return (
      <>
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 md:hidden"
        >
          <Menu size={20} />
        </button>

        {/* Mobile Drawer */}
        {isOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Drawer */}
            <div className="absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white dark:bg-gray-800 shadow-xl">
              <SidebarContent />
            </div>
          </div>
        )}
      </>
    )
  }

  // Desktop Sidebar
  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <SidebarContent />
      </div>
    </div>
  )
}

export default ResponsiveSidebar
