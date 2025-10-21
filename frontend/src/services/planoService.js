import api from './api'

export const planoService = {
  // Listar todos os planos
  listarPlanos: async () => {
    const response = await api.get('/planos')
    return response.data
  },

  // Comparar planos (para página de pricing)
  compararPlanos: async () => {
    const response = await api.get('/planos/comparar')
    return response.data
  },

  // Listar estabelecimentos em destaque
  listarDestaques: async () => {
    const response = await api.get('/planos/destaques')
    return response.data
  },

  // Obter assinatura atual do estabelecimento
  obterAssinatura: async () => {
    const response = await api.get('/planos/assinatura')
    return response.data
  },

  // Fazer upgrade de plano
  fazerUpgrade: async (planoId, metodoPagamento = 'cartao') => {
    const response = await api.post('/planos/upgrade', {
      planoId,
      metodoPagamento
    })
    return response.data
  },

  // Cancelar assinatura (downgrade para FREE)
  cancelarAssinatura: async () => {
    const response = await api.post('/planos/cancelar')
    return response.data
  },

  // Verificar se estabelecimento está em destaque
  verificarDestaque: async (estabelecimentoId) => {
    const response = await api.get(`/planos/destaque/${estabelecimentoId}`)
    return response.data
  }
}

export default planoService

