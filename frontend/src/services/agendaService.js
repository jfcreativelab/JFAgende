import api from './api'

export const agendaService = {
  // Criar bloqueio de horário
  createBloqueio: async (dados) => {
    const response = await api.post('/agenda/bloqueios', dados)
    return response.data
  },

  // Listar bloqueios
  getBloqueios: async (dataInicio, dataFim) => {
    const response = await api.get('/agenda/bloqueios', {
      params: { dataInicio, dataFim }
    })
    return response.data
  },

  // Deletar bloqueio
  deleteBloqueio: async (id) => {
    const response = await api.delete(`/agenda/bloqueios/${id}`)
    return response.data
  },

  // Obter agenda completa
  getAgendaCompleta: async (dataInicio, dataFim) => {
    const response = await api.get('/agenda/completa', {
      params: { dataInicio, dataFim }
    })
    return response.data
  },

  // Gerar link do WhatsApp
  gerarLinkWhatsApp: async (agendamentoId) => {
    const response = await api.get(`/agenda/whatsapp/${agendamentoId}`)
    return response.data
  },
}

export default agendaService


