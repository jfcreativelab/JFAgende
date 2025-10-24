import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, ArrowLeft } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Button from '../components/Button'
import Input from '../components/Input'
import Card from '../components/Card'
import Toast from '../components/Toast'
import Logo from '../components/Logo'

const LoginEstabelecimento = () => {
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

    const result = await login(formData.email, formData.senha, 'estabelecimento', rememberLogin)

    if (result.success) {
      // Aguardar um pouco para garantir que o estado foi atualizado
      setTimeout(() => {
        navigate('/estabelecimento/dashboard')
      }, 100)
    } else {
      setToast({ type: 'error', message: result.error })
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950/30 relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden opacity-40 dark:opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
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

      <div className="w-full max-w-md">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft size={20} />
          Voltar
        </Button>

        <Card>
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <Logo size="2xl" />
            </div>
            <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">
              Login Estabelecimento
            </h1>
            <p className="text-gray-600">
              Acesse seu painel administrativo
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              name="email"
              placeholder="contato@estabelecimento.com"
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

            {/* Checkbox Lembrar Login */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberLogin"
                checked={rememberLogin}
                onChange={(e) => setRememberLogin(e.target.checked)}
                className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label htmlFor="rememberLogin" className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                Lembrar login
              </label>
            </div>

            <Button
              type="submit"
              fullWidth
              disabled={loading}
              className="mt-6"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Não tem uma conta?{' '}
              <a
                href="/cadastro/estabelecimento"
                onClick={(e) => {
                  e.preventDefault()
                  console.log('🔍 Debug - LINK Cadastre-se clicado')
                  console.log('🔍 Debug - Navegando para /cadastro/estabelecimento')
                  navigate('/cadastro/estabelecimento')
                }}
                className="text-primary-600 font-medium hover:text-primary-700 cursor-pointer underline hover:no-underline transition-all"
                style={{ 
                  pointerEvents: 'auto',
                  zIndex: 10,
                  position: 'relative',
                  display: 'inline'
                }}
              >
                Cadastre-se
              </a>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default LoginEstabelecimento

