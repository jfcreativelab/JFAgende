import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, User, Mail, Phone, MapPin, Edit3, Save, X, Upload, Camera, Settings, Shield, Bell, CreditCard, BarChart3, Image as ImageIcon, CheckCircle, Plus, Clock, Smartphone } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import ThemeToggle from '../components/ThemeToggle'
import Button from '../components/Button'
import Card from '../components/Card'
import Input from '../components/Input'
import Toast from '../components/Toast'
import Loading from '../components/Loading'
import Badge from '../components/Badge'
import LogoUpload from '../components/LogoUpload'
import estabelecimentoService from '../services/estabelecimentoService'

const PerfilEstabelecimento = () => {
  const navigate = useNavigate()
  const { user, updateUser } = useAuth()
  
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [toast, setToast] = useState(null)
  
  const [formData, setFormData] = useState({
    nome: '',
    categoria: '',
    descricao: '',
    endereco: '',
    telefone: '',
    email: '',
    chavePix: ''
  })

  const [logoPreview, setLogoPreview] = useState(null)
  const [horarios, setHorarios] = useState([])
  const [loadingHorarios, setLoadingHorarios] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData({
        nome: user.nome || '',
        categoria: user.categoria || '',
        descricao: user.descricao || '',
        endereco: user.endereco || '',
        telefone: user.telefone || '',
        email: user.email || '',
        chavePix: user.chavePix || ''
      })
      setLogoPreview(user.fotoPerfilUrl || null)
      carregarHorarios()
    }
  }, [user])

  const carregarHorarios = async () => {
    if (!user?.id) return
    
    setLoadingHorarios(true)
    try {
      const response = await fetch(`/api/estabelecimentos/${user.id}/horarios`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      if (response.ok) {
        const horariosData = await response.json()
        setHorarios(horariosData)
      }
    } catch (error) {
      console.error('Erro ao carregar horários:', error)
    } finally {
      setLoadingHorarios(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }


  const handleSave = async () => {
    setLoading(true)
    try {
      // Atualizar dados do estabelecimento
      await estabelecimentoService.update(user.id, formData)
      

      setToast({ type: 'success', message: 'Perfil atualizado com sucesso!' })
      setEditing(false)
      
      // Atualizar contexto do usuário
      updateUser({ ...user, ...formData })
      
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error)
      setToast({ type: 'error', message: 'Erro ao atualizar perfil' })
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      nome: user.nome || '',
      categoria: user.categoria || '',
      descricao: user.descricao || '',
      endereco: user.endereco || '',
      telefone: user.telefone || '',
      email: user.email || '',
      chavePix: user.chavePix || ''
    })
    setLogoPreview(user.fotoPerfilUrl ? `https://jfagende-production.up.railway.app${user.fotoPerfilUrl}` : null)
    setEditing(false)
  }

  const handleLogoUpdate = (newLogoUrl) => {
    updateUser({ ...user, fotoPerfilUrl: newLogoUrl })
    setLogoPreview(newLogoUrl)
  }

  const salvarHorarios = async () => {
    setLoadingHorarios(true)
    try {
      const response = await fetch(`https://jfagende-production.up.railway.app/api/estabelecimentos/${user.id}/horarios`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ horarios })
      })

      if (response.ok) {
        setToast({ type: 'success', message: 'Horários salvos com sucesso!' })
      } else {
        throw new Error('Erro ao salvar horários')
      }
    } catch (error) {
      console.error('Erro ao salvar horários:', error)
      setToast({ type: 'error', message: 'Erro ao salvar horários' })
    } finally {
      setLoadingHorarios(false)
    }
  }

  const salvarChavePix = async () => {
    setLoading(true)
    try {
      const response = await fetch(`https://jfagende-production.up.railway.app/api/estabelecimentos/${user.id}/pix`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ chavePix: formData.chavePix })
      })

      if (response.ok) {
        setToast({ type: 'success', message: 'Chave PIX salva com sucesso!' })
        updateUser({ ...user, chavePix: formData.chavePix })
      } else {
        throw new Error('Erro ao salvar chave PIX')
      }
    } catch (error) {
      console.error('Erro ao salvar chave PIX:', error)
      setToast({ type: 'error', message: 'Erro ao salvar chave PIX' })
    } finally {
      setLoading(false)
    }
  }

  const adicionarHorario = () => {
    setHorarios([...horarios, {
      diaSemana: 1,
      horaInicio: '09:00',
      horaFim: '18:00',
      ativo: true
    }])
  }

  const removerHorario = (index) => {
    setHorarios(horarios.filter((_, i) => i !== index))
  }

  const atualizarHorario = (index, campo, valor) => {
    const novosHorarios = [...horarios]
    novosHorarios[index] = { ...novosHorarios[index], [campo]: valor }
    setHorarios(novosHorarios)
  }

  const diasSemana = [
    { valor: 0, nome: 'Domingo' },
    { valor: 1, nome: 'Segunda-feira' },
    { valor: 2, nome: 'Terça-feira' },
    { valor: 3, nome: 'Quarta-feira' },
    { valor: 4, nome: 'Quinta-feira' },
    { valor: 5, nome: 'Sexta-feira' },
    { valor: 6, nome: 'Sábado' }
  ]

  const categorias = [
    { value: 'barbearia', label: 'Barbearia' },
    { value: 'salao', label: 'Salão de Beleza' },
    { value: 'spa', label: 'Spa' },
    { value: 'manicure', label: 'Manicure/Pedicure' },
    { value: 'depilacao', label: 'Depilação' },
    { value: 'estetica', label: 'Estética' },
    { value: 'bronze', label: 'Bronzeamento' },
    { value: 'ozonioterapia', label: 'Ozonioterapia' },
    { value: 'outros', label: 'Outros' }
  ]

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

      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/estabelecimento/dashboard')}
              >
                <ArrowLeft size={18} />
                Voltar
              </Button>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                👤 Meu Perfil
              </h1>
            </div>
            
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/estabelecimento/dashboard')}
              >
                <User size={18} />
                Dashboard
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Card Principal do Perfil */}
          <Card className="p-8 mb-8">
            <div className="flex items-start justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Informações do Estabelecimento
              </h2>
              <Button
                variant={editing ? "outline" : "primary"}
                onClick={() => editing ? handleCancel() : setEditing(true)}
              >
                {editing ? (
                  <>
                    <X size={18} className="mr-2" />
                    Cancelar
                  </>
                ) : (
                  <>
                    <Edit3 size={18} className="mr-2" />
                    Editar Perfil
                  </>
                )}
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Logo e Foto */}
              <div>
                <LogoUpload 
                  estabelecimento={user}
                  onLogoUpdate={handleLogoUpdate}
                  className="w-full"
                />
              </div>

              {/* Informações Básicas */}
              <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nome do Estabelecimento *
                    </label>
                    <Input
                      name="nome"
                      value={formData.nome}
                      onChange={handleInputChange}
                      disabled={!editing}
                      placeholder="Ex: Barbearia do João"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Categoria *
                    </label>
                    <select
                      name="categoria"
                      value={formData.categoria}
                      onChange={handleInputChange}
                      disabled={!editing}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800"
                    >
                      <option value="">Selecione uma categoria</option>
                      {categorias.map(cat => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Descrição
                  </label>
                  <textarea
                    name="descricao"
                    value={formData.descricao}
                    onChange={handleInputChange}
                    disabled={!editing}
                    rows={3}
                    placeholder="Descreva seu estabelecimento..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Phone className="inline w-4 h-4 mr-1" />
                      Telefone *
                    </label>
                    <Input
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleInputChange}
                      disabled={!editing}
                      placeholder="(31) 99999-9999"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Mail className="inline w-4 h-4 mr-1" />
                      Email *
                    </label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!editing}
                      placeholder="contato@estabelecimento.com"
                    />
                  </div>
                </div>

                {/* Chave PIX */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <CreditCard className="inline w-4 h-4 mr-1" />
                    Chave PIX (para pagamentos antecipados)
                  </label>
                  <div className="flex gap-2">
                    <Input
                      name="chavePix"
                      value={formData.chavePix}
                      onChange={handleInputChange}
                      disabled={!editing}
                      placeholder="Ex: 11999999999 ou email@exemplo.com"
                      className="flex-1"
                    />
                    {editing && (
                      <Button
                        type="button"
                        onClick={salvarChavePix}
                        disabled={loading}
                        size="sm"
                        className="px-4"
                      >
                        {loading ? 'Salvando...' : 'Salvar PIX'}
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Permite que clientes paguem antecipadamente via PIX
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <MapPin className="inline w-4 h-4 mr-1" />
                    Endereço *
                  </label>
                  <Input
                    name="endereco"
                    value={formData.endereco}
                    onChange={handleInputChange}
                    disabled={!editing}
                    placeholder="Rua, número, bairro, cidade - UF"
                  />
                </div>
              </div>
            </div>

            {editing && (
              <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button variant="outline" onClick={handleCancel}>
                  Cancelar
                </Button>
                <Button onClick={handleSave} disabled={loading}>
                  {loading ? (
                    <Loading size="sm" />
                  ) : (
                    <>
                      <Save size={18} className="mr-2" />
                      Salvar Alterações
                    </>
                  )}
                </Button>
              </div>
            )}
          </Card>

          {/* Horários de Funcionamento */}
          <Card className="p-8 mb-8">
            <div className="flex items-start justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Horários de Funcionamento
              </h2>
              <Button
                onClick={adicionarHorario}
                size="sm"
                className="flex items-center gap-2"
              >
                <Plus size={18} />
                Adicionar Horário
              </Button>
            </div>

            {loadingHorarios ? (
              <div className="text-center py-8">
                <Loading size="lg" />
                <p className="text-gray-600 dark:text-gray-400 mt-2">Carregando horários...</p>
              </div>
            ) : horarios.length === 0 ? (
              <div className="text-center py-8">
                <Clock size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-4">Nenhum horário cadastrado</p>
                <Button onClick={adicionarHorario} size="sm">
                  <Plus size={18} className="mr-2" />
                  Adicionar Primeiro Horário
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {horarios.map((horario, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Dia da Semana
                        </label>
                        <select
                          value={horario.diaSemana}
                          onChange={(e) => atualizarHorario(index, 'diaSemana', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                        >
                          {diasSemana.map(dia => (
                            <option key={dia.valor} value={dia.valor}>
                              {dia.nome}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Início
                        </label>
                        <input
                          type="time"
                          value={horario.horaInicio}
                          onChange={(e) => atualizarHorario(index, 'horaInicio', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Fim
                        </label>
                        <input
                          type="time"
                          value={horario.horaFim}
                          onChange={(e) => atualizarHorario(index, 'horaFim', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>

                      <div className="flex items-end">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={horario.ativo}
                            onChange={(e) => atualizarHorario(index, 'ativo', e.target.checked)}
                            className="mr-2 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">Ativo</span>
                        </label>
                      </div>
                    </div>

                    <Button
                      onClick={() => removerHorario(index)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X size={18} />
                    </Button>
                  </div>
                ))}

                <div className="flex justify-end pt-4">
                  <Button
                    onClick={salvarHorarios}
                    disabled={loadingHorarios}
                    className="px-6"
                  >
                    {loadingHorarios ? (
                      <>
                        <Loading size="sm" className="mr-2" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save size={18} className="mr-2" />
                        Salvar Horários
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </Card>

          {/* WhatsApp Admin */}
          <Card className="p-8 mb-8 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-500 rounded-xl">
                <Smartphone className="text-white" size={24} />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  📱 Mensagens Automáticas WhatsApp
                </h2>
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                  Configure mensagens automáticas para confirmação de agendamentos e lembretes para seus clientes.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={() => navigate('/estabelecimento/whatsapp')}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Smartphone size={16} />
                    Configurar WhatsApp
                  </Button>
                  <Button
                    onClick={() => navigate('/estabelecimento/whatsapp')}
                    variant="outline"
                    className="border-green-300 text-green-700 hover:bg-green-50 dark:border-green-600 dark:text-green-300 dark:hover:bg-green-900/20"
                  >
                    Ver Status
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Cards de Ações Rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/estabelecimento/portfolio')}>
              <ImageIcon className="w-12 h-12 text-primary-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Portfólio</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Gerencie fotos e logo</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/estabelecimento/dashboard')}>
              <BarChart3 className="w-12 h-12 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Relatórios</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Veja suas estatísticas</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/estabelecimento/assinatura')}>
              <CreditCard className="w-12 h-12 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Assinatura</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Gerencie seu plano</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/estabelecimento/equipe')}>
              <Shield className="w-12 h-12 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Equipe</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Gerencie funcionários</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PerfilEstabelecimento
