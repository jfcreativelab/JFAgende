import api from './api'

export const authService = {
  // Registrar cliente
  registerCliente: async (dados) => {
    const response = await api.post('/auth/register/cliente', dados)
    return response.data
  },

  // Registrar estabelecimento
  registerEstabelecimento: async (dados) => {
    const response = await api.post('/auth/register/estabelecimento', dados)
    return response.data
  },

  // Login de cliente
  loginCliente: async (email, senha) => {
    const response = await api.post('/auth/login/cliente', { email, senha })
    return response.data
  },

  // Login de estabelecimento
  loginEstabelecimento: async (email, senha) => {
    const response = await api.post('/auth/login/estabelecimento', { email, senha })
    return response.data
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },
}

export default authService

