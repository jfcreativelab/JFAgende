import { createContext, useContext, useState, useEffect } from 'react'
import authService from '../services/authService'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Recupera os dados do usuário ao carregar a aplicação
    const token = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error('Erro ao recuperar dados do usuário:', error)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }

    setLoading(false)
  }, [])

  const login = async (email, senha, tipo) => {
    try {
      console.log('🔐 Iniciando login:', { email, tipo })
      let data
      
      if (tipo === 'cliente') {
        data = await authService.loginCliente(email, senha)
      } else if (tipo === 'estabelecimento') {
        data = await authService.loginEstabelecimento(email, senha)
      } else {
        throw new Error('Tipo de usuário inválido')
      }
      
      console.log('📊 Dados recebidos da API:', data)
      
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify({ ...data.usuario, tipo: data.tipo }))
      
      const userData = { ...data.usuario, tipo: data.tipo }
      console.log('👤 Dados do usuário salvos:', userData)
      
      setUser(userData)
      
      return { success: true, data }
    } catch (error) {
      console.error('❌ Erro no login:', error)
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao fazer login'
      }
    }
  }

  const register = async (dados, tipo) => {
    try {
      let data
      
      if (tipo === 'cliente') {
        data = await authService.registerCliente(dados)
      } else {
        data = await authService.registerEstabelecimento(dados)
      }
      
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify({ ...data.usuario, tipo }))
      
      setUser({ ...data.usuario, tipo })
      
      return { success: true, data }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao fazer cadastro'
      }
    }
  }

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  const updateUser = (newData) => {
    const updatedUser = { ...user, ...newData }
    setUser(updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

