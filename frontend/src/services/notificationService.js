class NotificationService {
  constructor() {
    this.isSupported = 'Notification' in window
    this.permission = this.isSupported ? Notification.permission : 'denied'
    this.registration = null
  }

  // Solicitar permissão para notificações
  async requestPermission() {
    if (!this.isSupported) {
      throw new Error('Notificações não são suportadas neste navegador')
    }

    if (this.permission === 'granted') {
      return true
    }

    if (this.permission === 'denied') {
      throw new Error('Permissão para notificações foi negada')
    }

    const permission = await Notification.requestPermission()
    this.permission = permission
    
    if (permission === 'granted') {
      await this.registerServiceWorker()
      return true
    }
    
    return false
  }

  // Registrar Service Worker
  async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        this.registration = await navigator.serviceWorker.register('/sw.js')
        console.log('Service Worker registrado com sucesso')
        return this.registration
      } catch (error) {
        console.error('Erro ao registrar Service Worker:', error)
        throw error
      }
    }
  }

  // Enviar notificação local
  showNotification(title, options = {}) {
    if (!this.isSupported || this.permission !== 'granted') {
      console.warn('Notificações não disponíveis')
      return
    }

    const defaultOptions = {
      body: '',
      icon: '/favicon.png',
      badge: '/favicon.png',
      vibrate: [100, 50, 100],
      requireInteraction: false,
      silent: false,
      tag: 'jfagende-notification',
      data: {
        url: window.location.href,
        timestamp: Date.now()
      }
    }

    const notification = new Notification(title, { ...defaultOptions, ...options })
    
    // Auto-close após 5 segundos
    setTimeout(() => {
      notification.close()
    }, 5000)

    return notification
  }

  // Enviar notificação push via Service Worker
  async sendPushNotification(title, options = {}) {
    if (!this.registration) {
      await this.registerServiceWorker()
    }

    if (!this.registration) {
      throw new Error('Service Worker não registrado')
    }

    const defaultOptions = {
      body: '',
      icon: '/favicon.png',
      badge: '/favicon.png',
      vibrate: [100, 50, 100],
      requireInteraction: false,
      data: {
        url: window.location.href,
        timestamp: Date.now()
      }
    }

    await this.registration.showNotification(title, { ...defaultOptions, ...options })
  }

  // Notificações específicas do app
  async notifyNewAppointment(appointment) {
    const title = 'Novo Agendamento!'
    const body = `Você tem um agendamento em ${new Date(appointment.dataHora).toLocaleDateString('pt-BR')} às ${new Date(appointment.dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
    
    return this.showNotification(title, { body })
  }

  async notifyAppointmentReminder(appointment) {
    const title = 'Lembrete de Agendamento'
    const body = `Seu agendamento é em 1 hora: ${appointment.servico?.nome || 'Serviço'}`
    
    return this.showNotification(title, { body, requireInteraction: true })
  }

  async notifyAppointmentCancelled(appointment) {
    const title = 'Agendamento Cancelado'
    const body = `Seu agendamento de ${appointment.servico?.nome || 'serviço'} foi cancelado`
    
    return this.showNotification(title, { body })
  }

  async notifyPaymentReceived(payment) {
    const title = 'Pagamento Recebido!'
    const body = `Pagamento de R$ ${payment.valor?.toFixed(2)} confirmado`
    
    return this.showNotification(title, { body })
  }

  async notifyNewReview(review) {
    const title = 'Nova Avaliação!'
    const body = `Você recebeu uma avaliação de ${review.nota} estrelas`
    
    return this.showNotification(title, { body })
  }

  // Configurar lembretes
  async scheduleReminder(appointment, minutesBefore = 60) {
    const appointmentTime = new Date(appointment.dataHora)
    const reminderTime = new Date(appointmentTime.getTime() - (minutesBefore * 60 * 1000))
    const now = new Date()

    if (reminderTime > now) {
      const delay = reminderTime.getTime() - now.getTime()
      
      setTimeout(() => {
        this.notifyAppointmentReminder(appointment)
      }, delay)
    }
  }

  // Limpar notificações
  clearNotifications() {
    if (this.registration) {
      this.registration.getNotifications().then(notifications => {
        notifications.forEach(notification => notification.close())
      })
    }
  }

  // Verificar se notificações estão habilitadas
  isEnabled() {
    return this.isSupported && this.permission === 'granted'
  }

  // Obter status das notificações
  getStatus() {
    return {
      supported: this.isSupported,
      permission: this.permission,
      enabled: this.isEnabled()
    }
  }
}

// Instância singleton
const notificationService = new NotificationService()

export default notificationService
