import pkg from 'whatsapp-web.js'
import qrcode from 'qrcode-terminal'

const { Client, LocalAuth } = pkg

class WhatsAppService {
  constructor() {
    this.client = null
    this.isReady = false
    this.qrCode = null
  }

  async initialize() {
    try {
      console.log('🔧 Inicializando WhatsApp Service...')
      
      this.client = new Client({
        authStrategy: new LocalAuth({
          clientId: 'jfagende-whatsapp'
        }),
        puppeteer: {
          headless: true,
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process',
            '--disable-gpu'
          ]
        }
      })

      // Evento quando o QR Code for gerado
      this.client.on('qr', (qr) => {
        console.log('📱 QR Code gerado para WhatsApp:')
        qrcode.generate(qr, { small: true })
        this.qrCode = qr
      })

      // Evento quando estiver pronto
      this.client.on('ready', () => {
        console.log('✅ WhatsApp está pronto!')
        this.isReady = true
        this.qrCode = null
      })

      // Evento de autenticação
      this.client.on('authenticated', () => {
        console.log('🔐 WhatsApp autenticado!')
      })

      // Evento de falha na autenticação
      this.client.on('auth_failure', (msg) => {
        console.error('❌ Falha na autenticação WhatsApp:', msg)
      })

      // Evento de desconexão
      this.client.on('disconnected', (reason) => {
        console.log('📵 WhatsApp desconectado:', reason)
        this.isReady = false
      })

      // Inicializar o cliente
      await this.client.initialize()
      
    } catch (error) {
      console.error('❌ Erro ao inicializar WhatsApp Service:', error)
      throw error
    }
  }

  async sendMessage(phoneNumber, message) {
    try {
      if (!this.isReady) {
        throw new Error('WhatsApp não está pronto. Aguarde a inicialização.')
      }

      // Formatar número de telefone (remover caracteres especiais e adicionar código do país)
      const formattedNumber = this.formatPhoneNumber(phoneNumber)
      
      console.log(`📤 Enviando mensagem para: ${formattedNumber}`)
      console.log(`📝 Mensagem: ${message}`)

      const result = await this.client.sendMessage(formattedNumber, message)
      console.log('✅ Mensagem enviada com sucesso!')
      
      return {
        success: true,
        messageId: result.id._serialized,
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
    
    // Adiciona @c.us no final
    return cleaned + '@c.us'
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
      qrCode: this.qrCode
    }
  }

  async disconnect() {
    if (this.client) {
      await this.client.destroy()
      this.isReady = false
      console.log('📵 WhatsApp desconectado')
    }
  }
}

// Singleton instance
const whatsappService = new WhatsAppService()

export default whatsappService
