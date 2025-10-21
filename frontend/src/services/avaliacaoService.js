import api from './api'

export const avaliacaoService = {
  // Criar avaliação
  create: async (dados) => {
    const response = await api.post('/avaliacoes', dados)
    return response.data
  },

  // Listar avaliações de um estabelecimento
  getByEstabelecimento: async (estabelecimentoId) => {
    const response = await api.get(`/avaliacoes/estabelecimento/${estabelecimentoId}`)
    return response.data
  },

  // Atualizar avaliação
  update: async (id, dados) => {
    const response = await api.put(`/avaliacoes/${id}`, dados)
    return response.data
  },

  // Deletar avaliação
  delete: async (id) => {
    const response = await api.delete(`/avaliacoes/${id}`)
    return response.data
  },
}

export default avaliacaoService


