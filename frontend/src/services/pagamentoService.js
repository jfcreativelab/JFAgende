import api from './api'

export const pagamentoService = {
  // Criar sessão de pagamento
  criarSessaoPagamento: async (planoId, estabelecimentoId) => {
    try {
      const response = await api.post('/pagamento/criar-sessao', {
        planoId,
        estabelecimentoId
      })
      return response.data
    } catch (error) {
      console.error('Erro ao criar sessão de pagamento:', error)
      throw error
    }
  },

  // Obter status da assinatura
  obterStatusAssinatura: async (estabelecimentoId) => {
    try {
      const response = await api.get(`/pagamento/status/${estabelecimentoId}`)
      return response.data
    } catch (error) {
      console.error('Erro ao obter status da assinatura:', error)
      throw error
    }
  }
}

export default pagamentoService





















