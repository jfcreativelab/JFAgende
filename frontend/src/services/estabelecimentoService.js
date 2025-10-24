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

  // Obter URL completa da imagem
  getImageUrl: (url) => {
    console.log('🔍 getImageUrl chamada com:', url)
    
    if (!url) {
      console.log('❌ URL vazia, retornando string vazia')
      return ''
    }
    
    if (url.startsWith('http')) {
      console.log('✅ URL já completa:', url)
      return url
    }
    
    // Usar URL da produção se estiver no Vercel, senão usa localhost
    const baseURL = window.location.hostname.includes('vercel.app')
      ? 'https://jfagende-production.up.railway.app'
      : 'http://localhost:5000'
    
    const fullUrl = `${baseURL}${url}`
    console.log('🔗 URL construída:', fullUrl)
    console.log('🌐 Hostname atual:', window.location.hostname)
    console.log('📱 User Agent:', navigator.userAgent)
    
    return fullUrl
  }
}

export default estabelecimentoService

