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
  },

  // URLs do Cloudinary para fallback
  getCloudinaryUrl: (estabelecimentoId, nome) => {
    const cloudinaryUrls = {
      'f2b84226-0a4f-4678-9e17-5e0732e97c5f': 'https://res.cloudinary.com/dypmxu22a/image/upload/v1761312247/jfagende/estabelecimentos/logo-f2b84226-0a4f-4678-9e17-5e0732e97c5f.webp',
      'c8fb778a-c703-4605-9522-128993b78430': 'https://res.cloudinary.com/dypmxu22a/image/upload/v1761312248/jfagende/estabelecimentos/logo-c8fb778a-c703-4605-9522-128993b78430.webp',
      '6582f90e-03f8-45e1-88b6-0a066de1b10b': 'https://res.cloudinary.com/dypmxu22a/image/upload/v1761312249/jfagende/estabelecimentos/logo-6582f90e-03f8-45e1-88b6-0a066de1b10b.webp'
    }
    
    return cloudinaryUrls[estabelecimentoId] || null
  }
}

export default estabelecimentoService

