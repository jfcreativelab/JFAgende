import api from './api'

export const favoritoService = {
  // Adicionar aos favoritos
  add: async (estabelecimentoId) => {
    const response = await api.post('/favoritos', { estabelecimentoId })
    return response.data
  },

  // Remover dos favoritos
  remove: async (estabelecimentoId) => {
    const response = await api.delete(`/favoritos/${estabelecimentoId}`)
    return response.data
  },

  // Listar favoritos
  getAll: async () => {
    const response = await api.get('/favoritos')
    return response.data
  },

  // Verificar se está nos favoritos
  check: async (estabelecimentoId) => {
    const response = await api.get(`/favoritos/check/${estabelecimentoId}`)
    return response.data
  },
}

export default favoritoService


