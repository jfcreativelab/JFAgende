// Serviço WhatsApp real usando WhatsApp Business API
import QRCode from 'qrcode'

class WhatsAppRealService {
  constructor() {
    this.isReady = false
    this.qrCode = null
    this.qrCodeImage = null
    this.client = null
    this.accessToken = process.env.WHATSAPP_ACCESS_TOKEN
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID
    this.verifyToken = process.env.WHATSAPP_VERIFY_TOKEN
  }

  async initialize() {
    try {
      console.log('🔧 Inicializando WhatsApp Real Service...')
      
      if (!this.accessToken || !this.phoneNumberId) {
        console.log('⚠️ Variáveis de ambiente do WhatsApp não configuradas')
        console.log('📝 Configure: WHATSAPP_ACCESS_TOKEN e WHATSAPP_PHONE_NUMBER_ID')
        
        // Gerar QR Code de demonstração com instruções
        const demoData = `WHATSAPP-DEMO-${Date.now()}`
        this.qrCode = demoData
        this.qrCodeImage = await QRCode.toDataURL(demoData, {
          width: 256,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        })
        
        return true
      }

      // Verificar se a API está funcionando
      const response = await fetch(`https://graph.facebook.com/v18.0/${this.phoneNumberId}`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      })

      if (!response.ok) {
        throw new Error('Falha ao conectar com WhatsApp Business API')
      }

      this.isReady = true
      console.log('✅ WhatsApp Real Service conectado com sucesso!')
      
      return true
    } catch (error) {
      console.error('❌ Erro ao inicializar WhatsApp Real Service:', error)
      this.isReady = false
      return false
    }
  }

  async sendMessage(phoneNumber, message) {
    try {
      if (!this.isReady) {
        throw new Error('WhatsApp não está pronto. Configure as variáveis de ambiente.')
      }

      // Formatar número de telefone
      const formattedNumber = this.formatPhoneNumber(phoneNumber)
      
      console.log(`📤 Enviando mensagem real para: ${formattedNumber}`)
      console.log(`📝 Mensagem: ${message}`)

      const response = await fetch(`https://graph.facebook.com/v18.0/${this.phoneNumberId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: formattedNumber,
          type: 'text',
          text: {
            body: message
          }
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`Erro na API WhatsApp: ${errorData.error?.message || 'Erro desconhecido'}`)
      }

      const result = await response.json()
      console.log('✅ Mensagem enviada com sucesso!', result)
      
      return {
        success: true,
        messageId: result.messages[0].id,
        timestamp: new Date()
      }
    } catch (error) {
      console.error('❌ Erro ao enviar mensagem WhatsApp:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  formatPhoneNumber(phoneNumber) {
    // Remove todos os caracteres não numéricos
    let cleaned = phoneNumber.replace(/\D/g, '')
    
    // Se não começar com 55 (Brasil), adiciona
    if (!cleaned.startsWith('55')) {
      cleaned = '55' + cleaned
    }
    
    return cleaned
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
      mode: 'real',
      configured: !!(this.accessToken && this.phoneNumberId)
    }
  }

  async disconnect() {
    this.isReady = false
    this.qrCode = null
    this.qrCodeImage = null
    console.log('📵 WhatsApp Real desconectado')
  }
}

// Singleton instance
const whatsappRealService = new WhatsAppRealService()

export default whatsappRealService
