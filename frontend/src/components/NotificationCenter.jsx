import { useState, useEffect } from 'react'
import { Bell, X, Check, Clock, Calendar } from 'lucide-react'
import Card from './Card'
import Badge from './Badge'

const NotificationCenter = ({ 
  notifications = [], 
  onMarkAsRead = null,
  onMarkAllAsRead = null 
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const unread = notifications.filter(n => !n.lida).length
    setUnreadCount(unread)
  }, [notifications])

  const handleMarkAsRead = (notifId) => {
    if (onMarkAsRead) {
      onMarkAsRead(notifId)
    }
  }

  const handleMarkAllAsRead = () => {
    if (onMarkAllAsRead) {
      onMarkAllAsRead()
    }
    setIsOpen(false)
  }

  const getIcon = (tipo) => {
    switch (tipo) {
      case 'agendamento':
        return <Calendar size={18} className="text-blue-500" />
      case 'confirmacao':
        return <Check size={18} className="text-green-500" />
      case 'lembrete':
        return <Clock size={18} className="text-yellow-500" />
      default:
        return <Bell size={18} className="text-gray-500" />
    }
  }

  const formatTempo = (data) => {
    const agora = new Date()
    const notifData = new Date(data)
    const diffMs = agora - notifData
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 1) return 'Agora'
    if (diffMins < 60) return `${diffMins}m atrás`
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h atrás`
    return `${Math.floor(diffMins / 1440)}d atrás`
  }

  return (
    <div className="relative">
      {/* Botão de Notificações */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <Bell size={20} className="text-gray-600 dark:text-gray-400" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown de Notificações */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          <div className="absolute right-0 mt-2 w-96 z-50 animate-fade-in">
            <Card padding="none" className="max-h-[500px] overflow-y-auto">
              {/* Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Notificações
                  </h3>
                  {unreadCount > 0 && (
                    <Badge variant="primary" size="sm">
                      {unreadCount} nova{unreadCount !== 1 ? 's' : ''}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Notificações */}
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <Bell size={48} className="mx-auto text-gray-400 mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">
                      Nenhuma notificação
                    </p>
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => !notif.lida && handleMarkAsRead(notif.id)}
                      className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer ${
                        !notif.lida ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                      }`}
                    >
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {getIcon(notif.tipo)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {notif.titulo}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {notif.mensagem}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                            {formatTempo(notif.criadoEm)}
                          </p>
                        </div>

                        {!notif.lida && (
                          <div className="flex-shrink-0">
                            <div className="w-2 h-2 bg-primary-600 rounded-full animate-pulse"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && unreadCount > 0 && (
                <div className="p-3 border-t border-gray-200 dark:border-gray-700 sticky bottom-0 bg-white dark:bg-gray-800">
                  <button 
                    onClick={handleMarkAllAsRead}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium w-full text-center transition-colors"
                  >
                    Marcar todas como lidas ({unreadCount})
                  </button>
                </div>
              )}
            </Card>
          </div>
        </>
      )}
    </div>
  )
}

export default NotificationCenter


