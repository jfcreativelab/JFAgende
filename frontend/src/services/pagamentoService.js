import api from './api'

export const pagamentoService = {
  // Fazer upgrade de plano
  fazerUpgrade: async (planoId) => {
    try {
      const response = await api.post('/planos/upgrade', {
        planoId
      })
      return response.data
    } catch (error) {
      console.error('Erro ao fazer upgrade:', error)
      throw error
    }
  },

  // Obter assinatura atual
  obterAssinaturaAtual: async () => {
    try {
      const response = await api.get('/planos/assinatura')
      return response.data
    } catch (error) {
      console.error('Erro ao obter assinatura:', error)
      throw error
    }
  },

  // Cancelar assinatura
  cancelarAssinatura: async () => {
    try {
      const response = await api.post('/planos/cancelar')
      return response.data
    } catch (error) {
      console.error('Erro ao cancelar assinatura:', error)
      throw error
    }
  },

  // Listar planos disponíveis
  listarPlanos: async () => {
    try {
      const response = await api.get('/planos')
      return response.data
    } catch (error) {
      console.error('Erro ao listar planos:', error)
      throw error
    }
  }
}

export default pagamentoService





















