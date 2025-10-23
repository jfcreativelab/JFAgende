import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Store, Mail, Phone, Lock, MapPin, Tag, ArrowLeft } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Button from '../components/Button'
import Input from '../components/Input'
import Select from '../components/Select'
import Card from '../components/Card'
import Toast from '../components/Toast'
import Logo from '../components/Logo'

const CadastroEstabelecimento = () => {
  console.log('🔍 Debug - CadastroEstabelecimento carregado')
  const navigate = useNavigate()
  const { register } = useAuth()
  
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    categoria: '',
    endereco: '',
    descricao: '',
    senha: '',
    confirmarSenha: ''
  })
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [errors, setErrors] = useState({})

  const categorias = [
    { value: 'barbearia', label: 'Barbearia' },
    { value: 'salao', label: 'Salão de Beleza' },
    { value: 'spa', label: 'Spa' },
    { value: 'manicure', label: 'Manicure/Pedicure' },
    { value: 'depilacao', label: 'Depilação' },
    { value: 'estetica', label: 'Estética' },
    { value: 'bronze', label: 'Bronzeamento' },
    { value: 'ozonioterapia', label: 'Ozonioterapia' },
  ]

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
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
    const result = await register(dadosCadastro, 'estabelecimento')

    if (result.success) {
      setToast({ type: 'success', message: 'Cadastro realizado com sucesso!' })
      setTimeout(() => {
        navigate('/estabelecimento/dashboard')
      }, 1500)
    } else {
      setToast({ type: 'error', message: result.error })
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center p-4 py-12">
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

      <div className="w-full max-w-2xl">
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
              Cadastro Estabelecimento
            </h1>
            <p className="text-gray-600">
              Crie sua conta e comece a gerenciar seus agendamentos
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Nome do Estabelecimento"
                type="text"
                name="nome"
                placeholder="Salão Beleza Total"
                icon={Store}
                value={formData.nome}
                onChange={handleChange}
                required
              />

              <Select
                label="Categoria"
                name="categoria"
                options={categorias}
                value={formData.categoria}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
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
                label="Telefone"
                type="tel"
                name="telefone"
                placeholder="(11) 98888-8888"
                icon={Phone}
                value={formData.telefone}
                onChange={handleChange}
                required
              />
            </div>

            <Input
              label="Endereço Completo"
              type="text"
              name="endereco"
              placeholder="Rua Exemplo, 123 - Bairro - Cidade/UF"
              icon={MapPin}
              value={formData.endereco}
              onChange={handleChange}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Descrição (opcional)
              </label>
              <textarea
                name="descricao"
                placeholder="Conte um pouco sobre seu estabelecimento..."
                value={formData.descricao}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
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
            </div>

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
                to="/login/estabelecimento" 
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

export default CadastroEstabelecimento

