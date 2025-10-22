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
  }
}

export default adminService






















