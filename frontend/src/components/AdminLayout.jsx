import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import AdminSidebar from './AdminSidebar'
import ThemeToggle from './ThemeToggle'
import adminService from '../services/adminService'
import Loading from './Loading'

const AdminLayout = ({ children }) => {
  const navigate = useNavigate()
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)

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
    return <Loading fullScreen />
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Sidebar */}
      <AdminSidebar onLogout={handleLogout} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Painel Administrativo
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Bem-vindo, {admin?.nome}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <ThemeToggle />
              
              {/* Admin Info */}
              <div className="flex items-center gap-3 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  {admin?.nome?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {admin?.nome}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {admin?.role}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default AdminLayout


