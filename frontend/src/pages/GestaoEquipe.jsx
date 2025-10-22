import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Users, Plus, Edit2, Trash2, User, Mail, Phone, Briefcase, Calendar, TrendingUp, Award, Clock } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Button from '../components/Button'
import Card from '../components/Card'
import Badge from '../components/Badge'
import Input from '../components/Input'
import Modal from '../components/Modal'
import EmptyState from '../components/EmptyState'
import Toast from '../components/Toast'

const GestaoEquipe = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const [profissionais, setProfissionais] = useState([])
  const [modalAberto, setModalAberto] = useState(false)
  const [profissionalEditando, setProfissionalEditando] = useState(null)
  const [toast, setToast] = useState(null)
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    especialidade: '',
    comissao: '',
    ativo: true
  })

  // Carregar profissionais do localStorage
  useEffect(() => {
    carregarProfissionais()
  }, [])

  const carregarProfissionais = () => {
    const storageKey = `profissionais_${user.id}`
    const saved = localStorage.getItem(storageKey)
    if (saved) {
      setProfissionais(JSON.parse(saved))
    }
  }

  const salvarProfissionais = (lista) => {
    const storageKey = `profissionais_${user.id}`
    localStorage.setItem(storageKey, JSON.stringify(lista))
    setProfissionais(lista)
  }

  const abrirModal = (profissional = null) => {
    if (profissional) {
      setProfissionalEditando(profissional)
      setFormData({
        nome: profissional.nome,
        email: profissional.email,
        telefone: profissional.telefone,
        especialidade: profissional.especialidade,
        comissao: profissional.comissao.toString(),
        ativo: profissional.ativo
      })
    } else {
      setProfissionalEditando(null)
      setFormData({
        nome: '',
        email: '',
        telefone: '',
        especialidade: '',
        comissao: '',
        ativo: true
      })
    }
    setModalAberto(true)
  }

  const fecharModal = () => {
    setModalAberto(false)
    setProfissionalEditando(null)
    setFormData({
      nome: '',
      email: '',
      telefone: '',
      especialidade: '',
      comissao: '',
      ativo: true
    })
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validação
    if (!formData.nome || !formData.email || !formData.telefone || !formData.especialidade) {
      setToast({ type: 'error', message: 'Preencha todos os campos obrigatórios' })
      return
    }

    const comissao = parseFloat(formData.comissao) || 0
    if (comissao < 0 || comissao > 100) {
      setToast({ type: 'error', message: 'Comissão deve estar entre 0 e 100%' })
      return
    }

    if (profissionalEditando) {
      // Editar
      const novosProf = profissionais.map(p =>
        p.id === profissionalEditando.id
          ? {
              ...p,
              ...formData,
              comissao,
              atualizadoEm: new Date().toISOString()
            }
          : p
      )
      salvarProfissionais(novosProf)
      setToast({ type: 'success', message: 'Profissional atualizado com sucesso!' })
    } else {
      // Criar
      const novoProfissional = {
        id: Date.now().toString(),
        ...formData,
        comissao,
        agendamentos: 0,
        receita: 0,
        criadoEm: new Date().toISOString(),
        atualizadoEm: new Date().toISOString()
      }
      salvarProfissionais([...profissionais, novoProfissional])
      setToast({ type: 'success', message: 'Profissional cadastrado com sucesso!' })
    }

    fecharModal()
  }

  const handleDeletar = (id) => {
    if (!confirm('Deseja realmente remover este profissional?')) return

    const novosProf = profissionais.filter(p => p.id !== id)
    salvarProfissionais(novosProf)
    setToast({ type: 'success', message: 'Profissional removido com sucesso!' })
  }

  const toggleAtivo = (id) => {
    const novosProf = profissionais.map(p =>
      p.id === id
        ? { ...p, ativo: !p.ativo, atualizadoEm: new Date().toISOString() }
        : p
    )
    salvarProfissionais(novosProf)
    setToast({ type: 'success', message: 'Status atualizado!' })
  }

  // Estatísticas da equipe
  const totalProfissionais = profissionais.length
  const profissionaisAtivos = profissionais.filter(p => p.ativo).length
  const totalAgendamentos = profissionais.reduce((sum, p) => sum + (p.agendamentos || 0), 0)
  const receitaTotal = profissionais.reduce((sum, p) => sum + (p.receita || 0), 0)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
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

      {/* Modal de Profissional */}
      <Modal
        isOpen={modalAberto}
        onClose={fecharModal}
        title={profissionalEditando ? 'Editar Profissional' : 'Novo Profissional'}
        maxWidth="2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Nome Completo"
              name="nome"
              icon={User}
              placeholder="Ex: João Silva"
              value={formData.nome}
              onChange={handleChange}
              required
            />

            <Input
              label="Email"
              type="email"
              name="email"
              icon={Mail}
              placeholder="joao@exemplo.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Telefone"
              type="tel"
              name="telefone"
              icon={Phone}
              placeholder="(00) 00000-0000"
              value={formData.telefone}
              onChange={handleChange}
              required
            />

            <Input
              label="Especialidade"
              name="especialidade"
              icon={Briefcase}
              placeholder="Ex: Corte masculino, Coloração"
              value={formData.especialidade}
              onChange={handleChange}
              required
            />
          </div>

          <Input
            label="Comissão (%)"
            type="number"
            name="comissao"
            icon={TrendingUp}
            placeholder="Ex: 30"
            value={formData.comissao}
            onChange={handleChange}
            min="0"
            max="100"
            step="0.5"
          />

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="ativo"
              id="ativo"
              checked={formData.ativo}
              onChange={handleChange}
              className="w-4 h-4 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
            />
            <label htmlFor="ativo" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Profissional ativo
            </label>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button type="button" variant="outline" onClick={fecharModal} fullWidth>
              Cancelar
            </Button>
            <Button type="submit" fullWidth>
              {profissionalEditando ? 'Atualizar' : 'Cadastrar'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate('/estabelecimento/dashboard')}
            >
              <ArrowLeft size={20} />
              Voltar
            </Button>

            <Button onClick={() => abrirModal()}>
              <Plus size={20} />
              Novo Profissional
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Cabeçalho */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Users className="text-primary-600" size={32} />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Gestão de Equipe
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Gerencie seus profissionais, especialidades e comissões
          </p>
        </div>

        {/* Estatísticas da Equipe */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-primary-100 dark:bg-primary-900/20 rounded-full -mr-10 -mt-10"></div>
            <div className="relative">
              <Users className="text-primary-600 mb-2" size={24} />
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Profissionais</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {totalProfissionais}
              </p>
            </div>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full -mr-10 -mt-10"></div>
            <div className="relative">
              <Award className="text-green-600 mb-2" size={24} />
              <p className="text-sm text-gray-600 dark:text-gray-400">Ativos</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {profissionaisAtivos}
              </p>
            </div>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-100 dark:bg-blue-900/20 rounded-full -mr-10 -mt-10"></div>
            <div className="relative">
              <Calendar className="text-blue-600 mb-2" size={24} />
              <p className="text-sm text-gray-600 dark:text-gray-400">Agendamentos</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {totalAgendamentos}
              </p>
            </div>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-purple-100 dark:bg-purple-900/20 rounded-full -mr-10 -mt-10"></div>
            <div className="relative">
              <TrendingUp className="text-purple-600 mb-2" size={24} />
              <p className="text-sm text-gray-600 dark:text-gray-400">Receita Total</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                R$ {receitaTotal.toFixed(2)}
              </p>
            </div>
          </Card>
        </div>

        {/* Lista de Profissionais */}
        {profissionais.length === 0 ? (
          <EmptyState
            icon={Users}
            title="Nenhum profissional cadastrado"
            description="Comece cadastrando os profissionais da sua equipe para organizar melhor seus agendamentos e controlar comissões."
            actionLabel="Cadastrar Primeiro Profissional"
            onAction={() => abrirModal()}
            illustration={true}
          />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profissionais.map((prof, index) => (
              <Card key={prof.id} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                      {prof.nome.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                        {prof.nome}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {prof.especialidade}
                      </p>
                    </div>
                  </div>

                  <Badge variant={prof.ativo ? 'success' : 'default'}>
                    {prof.ativo ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>

                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Mail size={16} />
                    <span className="truncate">{prof.email}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Phone size={16} />
                    <span>{prof.telefone}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <TrendingUp size={16} />
                    <span>Comissão: {prof.comissao}%</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary-600">
                      {prof.agendamentos || 0}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Agendamentos</p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      R$ {(prof.receita || 0).toFixed(0)}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Receita</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleAtivo(prof.id)}
                    fullWidth
                  >
                    {prof.ativo ? 'Desativar' : 'Ativar'}
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => abrirModal(prof)}
                  >
                    <Edit2 size={16} />
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeletar(prof.id)}
                  >
                    <Trash2 size={16} className="text-red-600" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default GestaoEquipe





