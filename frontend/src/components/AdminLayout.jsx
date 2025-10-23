import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { LogOut, Settings, User, Shield, Bell, Search } from 'lucide-react'
import AdminSidebar from './AdminSidebar'
import ThemeToggle from './ThemeToggle'
import adminService from '../services/adminService'
import Loading from './Loading'
import Button from './Button'

const AdminLayout = ({ children }) => {
  const navigate = useNavigate()
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      
      if (!token) {
        navigate('/admin/login')
        return
      }

      const profile = await adminService.getProfile()
      setAdmin(profile)
    } catch (error) {
      console.error('Erro na autenticação:', error)
      localStorage.removeItem('adminToken')
      localStorage.removeItem('adminData')
      navigate('/admin/login')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    adminService.logout()
    navigate('/admin/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">Verificando permissões...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-r border-white/20 dark:border-slate-700/50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <AdminSidebar onLogout={handleLogout} onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header Premium */}
        <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-white/20 dark:border-slate-700/50 sticky top-0 z-30">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Mobile Menu Button */}
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-lg bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-colors"
                >
                  <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>

                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    Painel Administrativo
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Bem-vindo, {admin?.nome || 'Administrador'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Search */}
                <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-lg border border-white/20 dark:border-slate-700/50">
                  <Search className="w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar..."
                    className="bg-transparent border-none outline-none text-sm text-gray-600 dark:text-gray-400 placeholder-gray-400"
                  />
                </div>

                {/* Notifications */}
                <button className="relative p-2 rounded-lg bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-colors">
                  <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                </button>

                {/* Theme Toggle */}
                <ThemeToggle />

                {/* Admin Profile Dropdown */}
                <div className="relative group">
                  <button className="flex items-center gap-3 px-4 py-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-lg border border-white/20 dark:border-slate-700/50 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-colors">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                      {admin?.nome?.charAt(0).toUpperCase() || 'A'}
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {admin?.nome || 'Administrador'}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {admin?.role || 'Super Admin'}
                      </p>
                    </div>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 dark:border-slate-700/50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-2">
                      <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                        <User className="w-4 h-4" />
                        Meu Perfil
                      </button>
                      <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                        <Settings className="w-4 h-4" />
                        Configurações
                      </button>
                      <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                        <Shield className="w-4 h-4" />
                        Segurança
                      </button>
                      <hr className="my-2 border-gray-200 dark:border-slate-700" />
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sair
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default AdminLayout