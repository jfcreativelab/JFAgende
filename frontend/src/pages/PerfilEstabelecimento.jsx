import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, User, Mail, Phone, MapPin, Edit3, Save, X, Upload, Camera, Settings, Shield, Bell, CreditCard, BarChart3, Image as ImageIcon, CheckCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import ThemeToggle from '../components/ThemeToggle'
import Button from '../components/Button'
import Card from '../components/Card'
import Input from '../components/Input'
import Toast from '../components/Toast'
import Loading from '../components/Loading'
import Badge from '../components/Badge'
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
    email: ''
  })

  const [logoFile, setLogoFile] = useState(null)
  const [logoPreview, setLogoPreview] = useState(null)

  useEffect(() => {
    if (user) {
      setFormData({
        nome: user.nome || '',
        categoria: user.categoria || '',
        descricao: user.descricao || '',
        endereco: user.endereco || '',
        telefone: user.telefone || '',
        email: user.email || ''
      })
      setLogoPreview(user.fotoPerfilUrl)
    }
  }, [user])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleLogoSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        setToast({ type: 'error', message: 'Por favor, selecione apenas arquivos de imagem.' })
        return
      }

      // Validar tamanho (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setToast({ type: 'error', message: 'A imagem deve ter no máximo 5MB.' })
        return
      }

      setLogoFile(file)
      
      // Criar preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setLogoPreview(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      // Atualizar dados do estabelecimento
      await estabelecimentoService.update(user.id, formData)
      
      // Upload da logo se houver
      if (logoFile) {
        const formDataLogo = new FormData()
        formDataLogo.append('logo', logoFile)
        
        const response = await fetch(`https://jfagende-production.up.railway.app/api/estabelecimentos/${user.id}/logo`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('estabelecimentoToken')}`
          },
          body: formDataLogo
        })

        if (!response.ok) {
          throw new Error('Erro ao fazer upload da logo')
        }
      }

      setToast({ type: 'success', message: 'Perfil atualizado com sucesso!' })
      setEditing(false)
      setLogoFile(null)
      
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
      email: user.email || ''
    })
    setLogoPreview(user.fotoPerfilUrl)
    setLogoFile(null)
    setEditing(false)
  }

  const categorias = [
    { value: 'barbearia', label: 'Barbearia' },
    { value: 'salao', label: 'Salão de Beleza' },
    { value: 'spa', label: 'Spa' },
    { value: 'manicure', label: 'Manicure/Pedicure' },
    { value: 'depilacao', label: 'Depilação' },
    { value: 'estetica', label: 'Estética' },
    { value: 'bronze', label: 'Bronzeamento' },
    { value: 'ozonioterapia', label: 'Ozonioterapia' }
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
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Logo do Estabelecimento
                </h3>
                
                <div className="relative inline-block mb-4">
                  {logoPreview ? (
                    <div className="relative group">
                      <img
                        src={logoPreview}
                        alt="Logo do estabelecimento"
                        className="w-32 h-32 object-cover rounded-xl border-4 border-white shadow-xl group-hover:scale-105 transition-transform duration-200"
                      />
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">✓</span>
                      </div>
                    </div>
                  ) : (
                    <div className="w-32 h-32 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center group hover:border-primary-400 transition-colors">
                      <div className="text-center">
                        <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-xs text-gray-500 dark:text-gray-400">Adicionar Logo</p>
                      </div>
                    </div>
                  )}
                </div>

                {editing && (
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoSelect}
                      className="hidden"
                      id="logoInput"
                    />
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById('logoInput').click()}
                      className="w-full"
                    >
                      <Upload size={18} className="mr-2" />
                      {logoPreview ? 'Alterar Logo' : 'Adicionar Logo'}
                    </Button>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      JPG, PNG, GIF - Máx 5MB
                    </p>
                  </div>
                )}
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
