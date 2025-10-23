import api from './api'

const whatsappService = {
  // Obter status do WhatsApp
  async getStatus() {
    try {
      const response = await api.get('/whatsapp/status')
      return response.data
    } catch (error) {
      console.error('Erro ao obter status WhatsApp:', error)
      throw error
    }
  },

  // Inicializar WhatsApp
  async initialize() {
    try {
      const response = await api.post('/whatsapp/initialize')
      return response.data
    } catch (error) {
      console.error('Erro ao inicializar WhatsApp:', error)
      throw error
    }
  },

  // Enviar mensagem de teste
  async sendTestMessage(phoneNumber, message) {
    try {
      const response = await api.post('/whatsapp/send-test', {
        phoneNumber,
        message
      })
      return response.data
    } catch (error) {
      console.error('Erro ao enviar mensagem de teste:', error)
      throw error
    }
  },

  // Enviar confirmação de agendamento
  async sendAppointmentConfirmation(appointmentData) {
    try {
      const response = await api.post('/whatsapp/send-appointment-confirmation', appointmentData)
      return response.data
    } catch (error) {
      console.error('Erro ao enviar confirmação de agendamento:', error)
      throw error
    }
  },

  // Enviar lembrete de agendamento
  async sendAppointmentReminder(appointmentData) {
    try {
      const response = await api.post('/whatsapp/send-appointment-reminder', appointmentData)
      return response.data
    } catch (error) {
      console.error('Erro ao enviar lembrete de agendamento:', error)
      throw error
    }
  },

  // Desconectar WhatsApp
  async disconnect() {
    try {
      const response = await api.post('/whatsapp/disconnect')
      return response.data
    } catch (error) {
      console.error('Erro ao desconectar WhatsApp:', error)
      throw error
    }
  }
}

export default whatsappService
