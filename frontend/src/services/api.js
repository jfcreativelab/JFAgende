import axios from 'axios'

// Detecta automaticamente a URL da API baseado no hostname
const getApiBaseURL = () => {
  // Se estiver definido no .env, usa ele
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL
  }
  
  // Se estiver acessando via IP da rede (não localhost), usa o mesmo IP para a API
  const hostname = window.location.hostname
  if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
    // Se estiver em produção (Vercel), usar a API do Railway
    if (hostname.includes('vercel.app')) {
      return 'https://jfagende-production.up.railway.app/api'
    }
    return `http://${hostname}:5000/api`
  }
  
  // Fallback para localhost (desenvolvimento local)
  return 'http://localhost:5000/api'
}

const apiBaseURL = getApiBaseURL()
console.log('🔗 API Base URL:', apiBaseURL)

const api = axios.create({
  baseURL: apiBaseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para adicionar o token em todas as requisições
api.interceptors.request.use(
  (config) => {
    // Verificar se é uma rota de admin
    const isAdminRoute = config.url?.includes('/admin/')
    
    if (isAdminRoute) {
      const adminToken = localStorage.getItem('adminToken')
      if (adminToken) {
        config.headers.Authorization = `Bearer ${adminToken}`
      }
    } else {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para tratar erros de resposta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log detalhado de erros para debug
    console.error('❌ Erro na API:', {
      url: error.config?.url,
      method: error.config?.method,
      baseURL: error.config?.baseURL,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data
    })
    
    if (error.response?.status === 401) {
      // Verificar se é uma rota de admin
      const isAdminRoute = error.config?.url?.includes('/admin/')
      
      if (isAdminRoute) {
        localStorage.removeItem('adminToken')
        localStorage.removeItem('adminData')
        window.location.href = '/admin/login'
      } else {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/'
      }
    }
    return Promise.reject(error)
  }
)

export default api

