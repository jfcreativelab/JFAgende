import api from './api'

export const portfolioService = {
  // Upload de foto
  uploadFoto: async (formData) => {
    const response = await api.post('/portfolio/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  },

  // Listar fotos de um estabelecimento
  getFotos: async (estabelecimentoId, filtros = {}) => {
    const params = new URLSearchParams(filtros).toString()
    const response = await api.get(
      `/portfolio/estabelecimento/${estabelecimentoId}${params ? `?${params}` : ''}`
    )
    return response.data
  },

  // Obter estatísticas do portfólio
  getEstatisticas: async () => {
    const response = await api.get('/portfolio/estatisticas')
    return response.data
  },

  // Obter categorias disponíveis
  getCategorias: async () => {
    const response = await api.get('/portfolio/categorias')
    return response.data
  },

  // Atualizar foto
  updateFoto: async (id, dados) => {
    const response = await api.put(`/portfolio/${id}`, dados)
    return response.data
  },

  // Deletar foto
  deleteFoto: async (id) => {
    const response = await api.delete(`/portfolio/${id}`)
    return response.data
  },

  // Reordenar fotos
  reordenarFotos: async (ordenacao) => {
    const response = await api.put('/portfolio/reordenar/fotos', { ordenacao })
    return response.data
  },

  // Obter URL completa da imagem
  getImageUrl: (url) => {
    if (!url) return ''
    if (url.startsWith('http')) return url
    return `http://localhost:5000${url}`
  }
}

export default portfolioService


