import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { User, Mail, Phone, Lock, ArrowLeft } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Button from '../components/Button'
import Input from '../components/Input'
import Card from '../components/Card'
import Toast from '../components/Toast'
import Logo from '../components/Logo'

const CadastroCliente = () => {
  const navigate = useNavigate()
  const { register } = useAuth()
  
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    senha: '',
    confirmarSenha: ''
  })
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    // Limpa o erro do campo ao digitar
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' })
    }
  }

  const validate = () => {
    const newErrors = {}

    if (formData.senha.length < 6) {
      newErrors.senha = 'A senha deve ter no mínimo 6 caracteres'
    }

    if (formData.senha !== formData.confirmarSenha) {
      newErrors.confirmarSenha = 'As senhas não correspondem'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validate()) return

    setLoading(true)

    const { confirmarSenha, ...dadosCadastro } = formData
    const result = await register(dadosCadastro, 'cliente')

    if (result.success) {
      setToast({ type: 'success', message: 'Cadastro realizado com sucesso!' })
      setTimeout(() => {
        navigate('/cliente/dashboard')
      }, 1500)
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
              Cadastro Cliente
            </h1>
            <p className="text-gray-600">
              Crie sua conta para agendar serviços
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nome Completo"
              type="text"
              name="nome"
              placeholder="João Silva"
              icon={User}
              value={formData.nome}
              onChange={handleChange}
              required
            />

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
              label="Telefone"
              type="tel"
              name="telefone"
              placeholder="(11) 98888-8888"
              icon={Phone}
              value={formData.telefone}
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
              error={errors.senha}
              required
            />

            <Input
              label="Confirmar Senha"
              type="password"
              name="confirmarSenha"
              placeholder="••••••••"
              icon={Lock}
              value={formData.confirmarSenha}
              onChange={handleChange}
              error={errors.confirmarSenha}
              required
            />

            <Button
              type="submit"
              fullWidth
              disabled={loading}
              className="mt-6"
            >
              {loading ? 'Cadastrando...' : 'Criar Conta'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Já tem uma conta?{' '}
              <Link 
                to="/login/cliente" 
                className="text-primary-600 font-medium hover:text-primary-700"
              >
                Fazer login
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default CadastroCliente

