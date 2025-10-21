import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Users, 
  Store, 
  CreditCard, 
  FileText, 
  Settings,
  Shield,
  LogOut,
  ChevronLeft,
  ChevronRight,
  BarChart3
} from 'lucide-react'
import { useState } from 'react'
import Logo from './Logo'

const AdminSidebar = ({ onLogout }) => {
  const [collapsed, setCollapsed] = useState(false)

  const menuItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/clientes', icon: Users, label: 'Clientes' },
    { path: '/admin/estabelecimentos', icon: Store, label: 'Estabelecimentos' },
    { path: '/admin/planos', icon: CreditCard, label: 'Planos' },
    { path: '/admin/relatorios', icon: BarChart3, label: 'Relatórios' },
    { path: '/admin/logs', icon: FileText, label: 'Logs' },
    { path: '/admin/admins', icon: Shield, label: 'Admins' },
    { path: '/admin/configuracoes', icon: Settings, label: 'Configurações' },
  ]

  return (
    <div 
      className={`${
        collapsed ? 'w-20' : 'w-64'
      } bg-gradient-to-b from-gray-900 to-gray-800 border-r border-gray-700 flex flex-col transition-all duration-300`}
    >
      {/* Logo */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center justify-between">
          {!collapsed ? (
            <div className="flex items-center gap-3">
              <Logo size="xl" />
              <div>
                <h2 className="text-white font-bold text-lg">JFAgende</h2>
                <p className="text-gray-400 text-xs">Admin Panel</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center w-full">
              <Logo size="lg" />
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            {collapsed ? (
              <ChevronRight size={20} className="text-gray-400" />
            ) : (
              <ChevronLeft size={20} className="text-gray-400" />
            )}
          </button>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                    : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                }`
              }
              title={collapsed ? item.label : ''}
            >
              <Icon size={20} className="flex-shrink-0" />
              {!collapsed && <span className="font-medium">{item.label}</span>}
            </NavLink>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-all"
          title={collapsed ? 'Sair' : ''}
        >
          <LogOut size={20} className="flex-shrink-0" />
          {!collapsed && <span className="font-medium">Sair</span>}
        </button>
      </div>
    </div>
  )
}

export default AdminSidebar


