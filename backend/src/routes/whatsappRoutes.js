import express from 'express'
import whatsappSimpleService from '../services/whatsappSimpleService.js'

const router = express.Router()

// Rota para obter status do WhatsApp
router.get('/status', async (req, res) => {
  try {
    const status = whatsappSimpleService.getStatus()
    res.json({
      success: true,
      data: status
    })
  } catch (error) {
    console.error('Erro ao obter status WhatsApp:', error)
    res.status(500).json({
      success: false,
      error: 'Erro ao obter status do WhatsApp'
    })
  }
})

// Rota para inicializar WhatsApp
router.post('/initialize', async (req, res) => {
  try {
    await whatsappSimpleService.initialize()
    res.json({
      success: true,
      message: 'WhatsApp inicializado com sucesso'
    })
  } catch (error) {
    console.error('Erro ao inicializar WhatsApp:', error)
    res.json({
      success: false,
      error: 'WhatsApp não pôde ser inicializado, mas o servidor continua funcionando'
    })
  }
})

// Rota para enviar mensagem de teste
router.post('/send-test', async (req, res) => {
  try {
    const { phoneNumber, message } = req.body

    if (!phoneNumber || !message) {
      return res.status(400).json({
        success: false,
        error: 'Número de telefone e mensagem são obrigatórios'
      })
    }

    const result = await whatsappSimpleService.sendMessage(phoneNumber, message)
    
    if (result.success) {
      res.json({
        success: true,
        message: 'Mensagem enviada com sucesso',
        data: result
      })
    } else {
      res.status(500).json({
        success: false,
        error: result.error
      })
    }
  } catch (error) {
    console.error('Erro ao enviar mensagem de teste:', error)
    res.status(500).json({
      success: false,
      error: 'Erro ao enviar mensagem'
    })
  }
})

// Rota para enviar confirmação de agendamento
router.post('/send-appointment-confirmation', async (req, res) => {
  try {
    const appointmentData = req.body

    // Validar dados obrigatórios
    const requiredFields = ['clienteNome', 'clienteTelefone', 'estabelecimentoNome', 'servicoNome', 'dataHora']
    const missingFields = requiredFields.filter(field => !appointmentData[field])
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Campos obrigatórios ausentes: ${missingFields.join(', ')}`
      })
    }

    const result = await whatsappSimpleService.sendAppointmentConfirmation(appointmentData)
    
    if (result.success) {
      res.json({
        success: true,
        message: 'Confirmação de agendamento enviada com sucesso',
        data: result
      })
    } else {
      res.status(500).json({
        success: false,
        error: result.error
      })
    }
  } catch (error) {
    console.error('Erro ao enviar confirmação de agendamento:', error)
    res.status(500).json({
      success: false,
      error: 'Erro ao enviar confirmação de agendamento'
    })
  }
})

// Rota para enviar lembrete de agendamento
router.post('/send-appointment-reminder', async (req, res) => {
  try {
    const appointmentData = req.body

    // Validar dados obrigatórios
    const requiredFields = ['clienteNome', 'clienteTelefone', 'estabelecimentoNome', 'servicoNome', 'dataHora']
    const missingFields = requiredFields.filter(field => !appointmentData[field])
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Campos obrigatórios ausentes: ${missingFields.join(', ')}`
      })
    }

    const result = await whatsappSimpleService.sendAppointmentReminder(appointmentData)
    
    if (result.success) {
      res.json({
        success: true,
        message: 'Lembrete de agendamento enviado com sucesso',
        data: result
      })
    } else {
      res.status(500).json({
        success: false,
        error: result.error
      })
    }
  } catch (error) {
    console.error('Erro ao enviar lembrete de agendamento:', error)
    res.status(500).json({
      success: false,
      error: 'Erro ao enviar lembrete de agendamento'
    })
  }
})

// Rota para desconectar WhatsApp
router.post('/disconnect', async (req, res) => {
  try {
    await whatsappSimpleService.disconnect()
    res.json({
      success: true,
      message: 'WhatsApp desconectado com sucesso'
    })
  } catch (error) {
    console.error('Erro ao desconectar WhatsApp:', error)
    res.status(500).json({
      success: false,
      error: 'Erro ao desconectar WhatsApp'
    })
  }
})

export default router
