import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield, Lock, Mail, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import Button from '../components/Button'
import Input from '../components/Input'
import Card from '../components/Card'
import Toast from '../components/Toast'
import Logo from '../components/Logo'
import adminService from '../services/adminService'

const LoginAdmin = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await adminService.login(formData.email, formData.senha)
      
      setToast({ 
        type: 'premium', 
        message: `Bem-vindo, ${result.admin.nome}!` 
      })

      setTimeout(() => {
        navigate('/admin/dashboard')
      }, 1000)
    } catch (error) {
      console.error('Erro no login:', error)
      setToast({
        type: 'error',
        message: error.response?.data?.error || 'Credenciais inválidas'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50">
          <Toast
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        </div>
      )}

      {/* Background Animated Circles */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md relative z-10">
        {/* Botão Voltar */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          Voltar para Home
        </button>

        <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl">
          {/* Logo e Título */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <Logo size="2xl" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Painel Administrativo
            </h1>
            <p className="text-gray-300">
              Acesso restrito a administradores
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                  placeholder="admin@jfagende.com"
                  required
                />
              </div>
            </div>

            {/* Senha */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="senha"
                  value={formData.senha}
                  onChange={handleChange}
                  className="w-full pl-11 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Botão Submit */}
            <Button
              type="submit"
              fullWidth
              disabled={loading}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  Entrando...
                </>
              ) : (
                <>
                  <Shield size={20} />
                  Entrar no Painel
                </>
              )}
            </Button>
          </form>

          {/* Aviso de Segurança */}
          <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <p className="text-xs text-yellow-200 text-center">
              🔒 Acesso monitorado e registrado. Todas as ações são auditadas.
            </p>
          </div>
        </Card>

        {/* Informação Extra */}
        <p className="text-center text-gray-400 text-sm mt-6">
          © 2024 JFAgende - Sistema Administrativo
        </p>
      </div>
    </div>
  )
}

export default LoginAdmin


