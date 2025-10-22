import { useEffect } from 'react'
import ResponsiveSidebar from '../components/ResponsiveSidebar'
import NotificationCenter from '../components/NotificationCenter'
import { useNotifications } from '../hooks/useNotifications'

const Notificacoes = () => {
  const { notifications, marcarComoLida, marcarTodasComoLidas } = useNotifications()

  useEffect(() => {
    // página simples, sem logout
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <ResponsiveSidebar />
      <div className="md:ml-64 container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Notificações</h1>
        <NotificationCenter
          notifications={notifications}
          onMarkAsRead={marcarComoLida}
          onMarkAllAsRead={marcarTodasComoLidas}
        />
      </div>
    </div>
  )
}

export default Notificacoes


