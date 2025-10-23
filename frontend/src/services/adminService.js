import api from './api'

const adminService = {
  // =====================================================
  // AUTENTICAÇÃO
  // =====================================================
  
  login: async (email, senha) => {
    const response = await api.post('/admin/auth/login', { email, senha })
    
    // Salvar token
    localStorage.setItem('adminToken', response.data.token)
    localStorage.setItem('adminData', JSON.stringify(response.data.admin))
    
    return response.data
  },

  logout: () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminData')
  },

  getProfile: async () => {
    const token = localStorage.getItem('adminToken')
    const response = await api.get('/admin/auth/profile', {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  },

  createFirstAdmin: async (nome, email, senha) => {
    const response = await api.post('/admin/auth/setup', { nome, email, senha })
    return response.data
  },

  // =====================================================
  // DASHBOARD
  // =====================================================

  getDashboardStats: async () => {
    const token = localStorage.getItem('adminToken')
    const response = await api.get('/admin/dashboard/stats', {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  },

  // =====================================================
  // GERENCIAMENTO DE USUÁRIOS
  // =====================================================

  getAllClientes: async (params = {}) => {
    const token = localStorage.getItem('adminToken')
    const response = await api.get('/admin/clientes', {
      headers: { Authorization: `Bearer ${token}` },
      params
    })
    return response.data
  },

  getAllEstabelecimentos: async (params = {}) => {
    const token = localStorage.getItem('adminToken')
    const response = await api.get('/admin/estabelecimentos', {
      headers: { Authorization: `Bearer ${token}` },
      params
    })
    return response.data
  },

  deleteCliente: async (id) => {
    const token = localStorage.getItem('adminToken')
    const response = await api.delete(`/admin/clientes/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  },

  deleteEstabelecimento: async (id) => {
    const token = localStorage.getItem('adminToken')
    const response = await api.delete(`/admin/estabelecimentos/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  },

  // =====================================================
  // GERENCIAMENTO DE PLANOS
  // =====================================================

  getAllAssinaturas: async (params = {}) => {
    const token = localStorage.getItem('adminToken')
    const response = await api.get('/admin/assinaturas', {
      headers: { Authorization: `Bearer ${token}` },
      params
    })
    return response.data
  },

  mudarPlano: async (estabelecimentoId, planoId) => {
    const token = localStorage.getItem('adminToken')
    const response = await api.put(`/admin/assinaturas/${estabelecimentoId}/plano`, 
      { planoId },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    return response.data
  },

  cancelarAssinatura: async (estabelecimentoId) => {
    const token = localStorage.getItem('adminToken')
    const response = await api.post(`/admin/assinaturas/${estabelecimentoId}/cancelar`, 
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    )
    return response.data
  },

  // =====================================================
  // LOGS E AUDITORIA
  // =====================================================

  getLogs: async (params = {}) => {
    const token = localStorage.getItem('adminToken')
    const response = await api.get('/admin/logs', {
      headers: { Authorization: `Bearer ${token}` },
      params
    })
    return response.data
  },

  cleanOldLogs: async () => {
    const token = localStorage.getItem('adminToken')
    const response = await api.delete('/admin/logs/cleanup', {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  },

  // =====================================================
  // GERENCIAMENTO DE ADMINS (SUPER_ADMIN)
  // =====================================================

  getAllAdmins: async () => {
    const token = localStorage.getItem('adminToken')
    const response = await api.get('/admin/admins', {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  },

  createAdmin: async (nome, email, senha, role = 'ADMIN') => {
    const token = localStorage.getItem('adminToken')
    const response = await api.post('/admin/admins', 
      { nome, email, senha, role },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    return response.data
  },

  toggleAdminStatus: async (id) => {
    const token = localStorage.getItem('adminToken')
    const response = await api.patch(`/admin/admins/${id}/toggle`, 
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    )
    return response.data
  },

  deleteAdmin: async (id) => {
    const token = localStorage.getItem('adminToken')
    const response = await api.delete(`/admin/admins/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  },

  // =====================================================
  // ESTATÍSTICAS E RELATÓRIOS
  // =====================================================

  getEstatisticasGerais: async () => {
    const token = localStorage.getItem('adminToken')
    const response = await api.get('/admin/estatisticas-gerais', {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  },

  getEstatisticasUsuarios: async () => {
    const token = localStorage.getItem('adminToken')
    const response = await api.get('/admin/estatisticas-usuarios', {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  },

  getAtividadeRecente: async () => {
    const token = localStorage.getItem('adminToken')
    const response = await api.get('/admin/atividade-recente', {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  },

  getEstatisticasEstabelecimentos: async () => {
    const token = localStorage.getItem('adminToken')
    const response = await api.get('/admin/estatisticas-estabelecimentos', {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  },

  getEstatisticasLogs: async () => {
    const token = localStorage.getItem('adminToken')
    const response = await api.get('/admin/estatisticas-logs', {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  },

  getRelatoriosAvancados: async (params = {}) => {
    const token = localStorage.getItem('adminToken')
    const response = await api.get('/admin/relatorios-avancados', {
      headers: { Authorization: `Bearer ${token}` },
      params
    })
    return response.data
  },

  // =====================================================
  // EXPORTAÇÃO
  // =====================================================

  exportarEstabelecimentos: async (formato = 'csv') => {
    const token = localStorage.getItem('adminToken')
    const response = await api.get(`/admin/exportar-estabelecimentos?formato=${formato}`, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: formato === 'csv' ? 'blob' : 'json'
    })
    return response.data
  },

  exportarRelatorio: async (formato = 'pdf', filtros = {}) => {
    const token = localStorage.getItem('adminToken')
    const response = await api.post('/admin/exportar-relatorio', 
      { formato, ...filtros },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    return response.data
  },

  exportarLogs: async (formato = 'csv', filtros = {}, selectedLogs = []) => {
    const token = localStorage.getItem('adminToken')
    const response = await api.post('/admin/exportar-logs', 
      { formato, filtros, selectedLogs },
      { 
        headers: { Authorization: `Bearer ${token}` },
        responseType: formato === 'csv' ? 'blob' : 'json'
      }
    )
    return response.data
  },

  // =====================================================
  // FUNÇÕES ADICIONAIS PARA ESTABELECIMENTOS
  // =====================================================

  aprovarEstabelecimento: async (id) => {
    const token = localStorage.getItem('adminToken')
    const response = await api.patch(`/admin/estabelecimentos/${id}/aprovar`, 
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    )
    return response.data
  },

  rejeitarEstabelecimento: async (id) => {
    const token = localStorage.getItem('adminToken')
    const response = await api.patch(`/admin/estabelecimentos/${id}/rejeitar`, 
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    )
    return response.data
  }
}

export default adminService























