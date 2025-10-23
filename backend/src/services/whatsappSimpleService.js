// Serviço WhatsApp simplificado para evitar problemas de dependências
import QRCode from 'qrcode'

class WhatsAppSimpleService {
  constructor() {
    this.isReady = false
    this.qrCode = null
    this.qrCodeImage = null
    this.client = null
  }

  async initialize() {
    try {
      console.log('🔧 Inicializando WhatsApp Simple Service...')
      
      // Gerar QR Code real para demonstração
      const qrData = `JFAgende-WhatsApp-${Date.now()}`
      this.qrCode = qrData
      
      // Gerar QR Code como imagem base64
      this.qrCodeImage = await QRCode.toDataURL(qrData, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
      
      console.log('📱 QR Code gerado para WhatsApp:')
      console.log('QR Code Data:', qrData)
      console.log('⚠️ WhatsApp Simple Service - Modo de desenvolvimento')
      console.log('📱 Para usar WhatsApp real, configure as dependências corretamente')
      
      return true
    } catch (error) {
      console.error('❌ Erro ao inicializar WhatsApp Simple Service:', error)
      this.isReady = false
      return false
    }
  }

  async sendMessage(phoneNumber, message) {
    try {
      console.log('📤 WhatsApp Simple - Simulando envio de mensagem:')
      console.log(`📱 Para: ${phoneNumber}`)
      console.log(`📝 Mensagem: ${message}`)
      
      // Simular envio
      return {
        success: true,
        messageId: 'simulated-' + Date.now(),
        timestamp: new Date()
      }
    } catch (error) {
      console.error('❌ Erro ao enviar mensagem (simulada):', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  async sendAppointmentConfirmation(appointmentData) {
    const {
      clienteNome,
      clienteTelefone,
      estabelecimentoNome,
      servicoNome,
      dataHora,
      observacoes,
      enderecoEstabelecimento
    } = appointmentData

    const dataFormatada = new Date(dataHora).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })

    const message = `🎉 *Agendamento Confirmado!*

Olá *${clienteNome}*! 

Seu agendamento foi confirmado com sucesso:

📅 *Data/Hora:* ${dataFormatada}
🏢 *Estabelecimento:* ${estabelecimentoNome}
💆 *Serviço:* ${servicoNome}
📍 *Endereço:* ${enderecoEstabelecimento}

${observacoes ? `📝 *Observações:* ${observacoes}` : ''}

*Lembre-se de chegar com 10 minutos de antecedência!*

Caso precise reagendar ou cancelar, entre em contato conosco.

Obrigado por escolher nossos serviços! 🙏`

    return await this.sendMessage(clienteTelefone, message)
  }

  async sendAppointmentReminder(appointmentData) {
    const {
      clienteNome,
      clienteTelefone,
      estabelecimentoNome,
      servicoNome,
      dataHora
    } = appointmentData

    const dataFormatada = new Date(dataHora).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })

    const message = `⏰ *Lembrete de Agendamento*

Olá *${clienteNome}*!

Este é um lembrete do seu agendamento:

📅 *Data/Hora:* ${dataFormatada}
🏢 *Estabelecimento:* ${estabelecimentoNome}
💆 *Serviço:* ${servicoNome}

*Lembre-se de chegar com 10 minutos de antecedência!*

Nos vemos em breve! 😊`

    return await this.sendMessage(clienteTelefone, message)
  }

  getStatus() {
    return {
      isReady: this.isReady,
      hasQrCode: !!this.qrCode,
      qrCode: this.qrCode,
      qrCodeImage: this.qrCodeImage,
      mode: 'simple'
    }
  }

  async disconnect() {
    this.isReady = false
    this.qrCode = null
    this.client = null
    console.log('📵 WhatsApp Simple desconectado')
  }
}

// Singleton instance
const whatsappSimpleService = new WhatsAppSimpleService()

export default whatsappSimpleService
