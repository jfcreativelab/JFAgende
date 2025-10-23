import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  CreditCard, 
  FileText, 
  Settings,
  Shield,
  LogOut,
  BarChart3,
  Bell,
  Server,
  Database,
  HardDrive,
  DollarSign,
  Megaphone,
  Code,
  Headphones,
  HelpCircle,
  BookOpen,
  Activity,
  TrendingUp,
  PieChart,
  LineChart,
  Globe,
  Zap,
  ChevronDown,
  ChevronRight
} from 'lucide-react'
import { useState } from 'react'
import Logo from './Logo'

const AdminSidebar = ({ onLogout, onClose }) => {
  const [collapsed, setCollapsed] = useState(false)
  const [expandedSections, setExpandedSections] = useState({
    analytics: false,
    management: false,
    system: false,
    support: false
  })

  const menuSections = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: LayoutDashboard,
      items: [
        { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Visão Geral' }
      ]
    },
    {
      id: 'analytics',
      title: 'Analytics & Relatórios',
      icon: BarChart3,
      items: [
        { path: '/admin/analytics', icon: TrendingUp, label: 'Analytics' },
        { path: '/admin/relatorios', icon: PieChart, label: 'Relatórios' },
        { path: '/admin/logs', icon: FileText, label: 'Logs' }
      ]
    },
    {
      id: 'management',
      title: 'Gerenciamento',
      icon: Users,
      items: [
        { path: '/admin/clientes', icon: Users, label: 'Clientes' },
        { path: '/admin/estabelecimentos', icon: Building2, label: 'Estabelecimentos' },
        { path: '/admin/planos', icon: CreditCard, label: 'Planos' },
        { path: '/admin/admins', icon: Shield, label: 'Administradores' }
      ]
    },
    {
      id: 'system',
      title: 'Sistema',
      icon: Server,
      items: [
        { path: '/admin/monitoramento', icon: Activity, label: 'Monitoramento' },
        { path: '/admin/backup', icon: HardDrive, label: 'Backup' },
        { path: '/admin/seguranca', icon: Shield, label: 'Segurança' },
        { path: '/admin/api', icon: Code, label: 'API' }
      ]
    },
    {
      id: 'business',
      title: 'Negócios',
      icon: DollarSign,
      items: [
        { path: '/admin/financeiro', icon: DollarSign, label: 'Financeiro' },
        { path: '/admin/marketing', icon: Megaphone, label: 'Marketing' },
        { path: '/admin/conteudo', icon: FileText, label: 'Conteúdo' }
      ]
    },
    {
      id: 'support',
      title: 'Suporte',
      icon: Headphones,
      items: [
        { path: '/admin/suporte', icon: Headphones, label: 'Tickets' },
        { path: '/admin/notificacoes', icon: Bell, label: 'Notificações' }
      ]
    },
    {
      id: 'config',
      title: 'Configurações',
      icon: Settings,
      items: [
        { path: '/admin/configuracoes', icon: Settings, label: 'Configurações' }
      ]
    }
  ]

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }))
  }

  const handleItemClick = () => {
    if (onClose) {
      onClose()
    }
  }

  return (
    <div className="h-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-r border-white/20 dark:border-slate-700/50 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-white/20 dark:border-slate-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">JF</span>
            </div>
            <div>
              <h2 className="text-gray-900 dark:text-white font-bold text-lg">JFAgende</h2>
              <p className="text-gray-500 dark:text-gray-400 text-xs">Admin Panel</p>
            </div>
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
          >
            <ChevronRight className={`w-4 h-4 text-gray-600 dark:text-gray-400 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuSections.map((section) => (
          <div key={section.id} className="space-y-1">
            {/* Section Header */}
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <section.icon className="w-5 h-5" />
              {!collapsed && (
                <>
                  <span className="flex-1 text-left">{section.title}</span>
                  {expandedSections[section.id] ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </>
              )}
            </button>

            {/* Section Items */}
            {(!collapsed && expandedSections[section.id]) && (
              <div className="ml-6 space-y-1">
                {section.items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={handleItemClick}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800'
                      }`
                    }
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-white/20 dark:border-slate-700/50">
        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          {!collapsed && (
            <div className="flex-1">
              <p className="text-sm font-semibold">Administrador</p>
              <p className="text-xs text-blue-100">Super Admin</p>
            </div>
          )}
        </div>
        
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2 mt-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          {!collapsed && <span>Sair</span>}
        </button>
      </div>
    </div>
  )
}

export default AdminSidebar