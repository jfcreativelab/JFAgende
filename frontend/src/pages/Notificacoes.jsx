import { useEffect } from 'react'
import ResponsiveSidebar from '../components/ResponsiveSidebar'
import { useNotifications } from '../hooks/useNotifications'
import { Bell, Check, Clock, Calendar } from 'lucide-react'
import Card from '../components/Card'
import Badge from '../components/Badge'
import Button from '../components/Button'

const Notificacoes = () => {
  const { notifications, marcarComoLida, marcarTodasComoLidas } = useNotifications()

  const getIcon = (tipo) => {
    switch (tipo) {
      case 'agendamento':
        return <Calendar size={24} className="text-blue-500" />
      case 'confirmacao':
        return <Check size={24} className="text-green-500" />
      case 'lembrete':
        return <Clock size={24} className="text-yellow-500" />
      default:
        return <Bell size={24} className="text-gray-500" />
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

  const unreadCount = notifications.filter(n => !n.lida).length

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <ResponsiveSidebar />
      <div className="md:ml-64 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              📬 Notificações
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Acompanhe todas as suas notificações em um só lugar
            </p>
          </div>
          
          {unreadCount > 0 && (
            <Button onClick={marcarTodasComoLidas} variant="outline">
              <Check size={18} className="mr-2" />
              Marcar todas como lidas ({unreadCount})
            </Button>
          )}
        </div>

        <div className="space-y-4">
          {notifications.length === 0 ? (
            <Card className="text-center py-12">
              <Bell size={64} className="mx-auto text-gray-400 mb-4" />
              <p className="text-xl font-medium text-gray-600 dark:text-gray-400 mb-2">
                Nenhuma notificação
              </p>
              <p className="text-gray-500 dark:text-gray-500">
                Você está em dia! Não há notificações pendentes.
              </p>
            </Card>
          ) : (
            notifications.map((notif) => (
              <Card 
                key={notif.id}
                hoverable
                className={`transition-all ${
                  !notif.lida ? 'bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-600' : ''
                }`}
              >
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    {getIcon(notif.tipo)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {notif.titulo}
                      </h3>
                      {!notif.lida && (
                        <Badge variant="primary" size="sm">
                          Nova
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                      {notif.mensagem}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-500 dark:text-gray-500">
                        {formatTempo(notif.criadoEm)}
                      </p>
                      
                      {!notif.lida && (
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => marcarComoLida(notif.id)}
                        >
                          <Check size={16} className="mr-1" />
                          Marcar como lida
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Notificacoes


