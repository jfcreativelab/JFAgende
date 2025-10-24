import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, ArrowLeft } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Button from '../components/Button'
import Input from '../components/Input'
import Card from '../components/Card'
import Toast from '../components/Toast'
import Logo from '../components/Logo'

const LoginCliente = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  })
  const [rememberLogin, setRememberLogin] = useState(false)
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

    const result = await login(formData.email, formData.senha, 'cliente', rememberLogin)

    if (result.success) {
      // Aguardar um pouco para garantir que o estado foi atualizado
      setTimeout(() => {
        navigate('/cliente/dashboard')
      }, 100)
    } else {
      setToast({ type: 'error', message: result.error })
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950/30 relative overflow-hidden flex items-center justify-center p-3 sm:p-4">
      {/* Animated background - otimizado para mobile */}
      <div className="absolute inset-0 overflow-hidden opacity-30 dark:opacity-15 sm:opacity-40 sm:dark:opacity-20">
        <div className="absolute top-0 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-primary-500/20 sm:bg-primary-500/30 rounded-full blur-2xl sm:blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/3 w-64 h-64 sm:w-96 sm:h-96 bg-purple-500/20 sm:bg-purple-500/30 rounded-full blur-2xl sm:blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
      </div>
      
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

      <div className="w-full max-w-sm sm:max-w-md relative z-10">
        {/* Back Button - otimizado para mobile */}
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-4 sm:mb-6 glass text-sm sm:text-base"
        >
          <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
          <span className="ml-1">Voltar</span>
        </Button>

        <Card glass className="border-2 border-primary-500/20">
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex justify-center mb-4 sm:mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-purple-400 rounded-full blur-lg sm:blur-xl opacity-20 sm:opacity-30"></div>
                <Logo size="lg" className="sm:hidden" />
                <Logo size="xl" className="hidden sm:block" />
              </div>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-black bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2 sm:mb-3 leading-tight">
              Login Cliente
            </h1>
            <p className="text-gray-600 dark:text-gray-300 font-medium text-sm sm:text-base">
              Entre para agendar seus serviços
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <Input
              label="Email"
              type="email"
              name="email"
              placeholder="seu@email.com"
              icon={Mail}
              value={formData.email}
              onChange={handleChange}
              required
            />

            <Input
              label="Senha"
              type="password"
              name="senha"
              placeholder="••••••••"
              icon={Lock}
              value={formData.senha}
              onChange={handleChange}
              required
            />

            {/* Checkbox Lembrar Login - otimizado para mobile */}
            <div className="flex items-center py-1">
              <input
                type="checkbox"
                id="rememberLogin"
                checked={rememberLogin}
                onChange={(e) => setRememberLogin(e.target.checked)}
                className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label htmlFor="rememberLogin" className="ml-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Lembrar login
              </label>
            </div>

            <Button
              type="submit"
              fullWidth
              size="lg"
              disabled={loading}
              className="mt-4 sm:mt-6 shadow-xl shadow-primary-500/30 h-12 sm:h-14 text-base sm:text-lg font-semibold"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          <div className="mt-4 sm:mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
              Não tem uma conta?{' '}
              <Link 
                to="/cadastro/cliente" 
                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-bold transition-colors"
              >
                Cadastre-se
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default LoginCliente

