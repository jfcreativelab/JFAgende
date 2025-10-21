import api from './api'

export const estabelecimentoService = {
  // Listar estabelecimentos
  getAll: async (filtros = {}) => {
    const params = new URLSearchParams(filtros).toString()
    const response = await api.get(`/estabelecimentos?${params}`)
    return response.data
  },

  // Obter detalhes
  getById: async (id) => {
    const response = await api.get(`/estabelecimentos/${id}`)
    return response.data
  },

  // Atualizar estabelecimento
  update: async (id, dados) => {
    const response = await api.put(`/estabelecimentos/${id}`, dados)
    return response.data
  },

  // Criar serviço
  createServico: async (estabelecimentoId, dados) => {
    const response = await api.post(`/estabelecimentos/${estabelecimentoId}/servicos`, dados)
    return response.data
  },

  // Listar serviços
  getServicos: async (estabelecimentoId) => {
    const response = await api.get(`/estabelecimentos/${estabelecimentoId}/servicos`)
    return response.data
  },

  // Atualizar serviço
  updateServico: async (estabelecimentoId, servicoId, dados) => {
    const response = await api.put(`/estabelecimentos/${estabelecimentoId}/servicos/${servicoId}`, dados)
    return response.data
  },

  // Deletar serviço
  deleteServico: async (estabelecimentoId, servicoId) => {
    const response = await api.delete(`/estabelecimentos/${estabelecimentoId}/servicos/${servicoId}`)
    return response.data
  },

  // Criar horário
  createHorario: async (estabelecimentoId, dados) => {
    const response = await api.post(`/estabelecimentos/${estabelecimentoId}/horarios`, dados)
    return response.data
  },
}

export default estabelecimentoService

