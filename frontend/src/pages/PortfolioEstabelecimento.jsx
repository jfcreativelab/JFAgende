import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Image as ImageIcon, Plus, BarChart2, Upload, X, CheckCircle, Camera, Settings, User, Edit3, Save, Trash2, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import ThemeToggle from '../components/ThemeToggle'
import UploadImagem from '../components/UploadImagem'
import GaleriaPortfolio from '../components/GaleriaPortfolio'
import Modal from '../components/Modal'
import Input from '../components/Input'
import Select from '../components/Select'
import Button from '../components/Button'
import Toast from '../components/Toast'
import Loading from '../components/Loading'
import StatCard from '../components/StatCard'
import Card from '../components/Card'
import Badge from '../components/Badge'
import portfolioService from '../services/portfolioService'

const PortfolioEstabelecimento = () => {
  const navigate = useNavigate()
  const { user, updateUser } = useAuth()

  const [fotos, setFotos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [estatisticas, setEstatisticas] = useState(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [toast, setToast] = useState(null)
  const [logoFile, setLogoFile] = useState(null)
  const [logoPreview, setLogoPreview] = useState(null)
  
  const [fotoData, setFotoData] = useState({
    titulo: '',
    descricao: '',
    categoria: '',
    tipo: 'portfolio'
  })

  useEffect(() => {
    carregarDados()
  }, [user])

  const carregarDados = async () => {
    try {
      const [fotosData, categoriasData, statsData] = await Promise.all([
        portfolioService.getFotos(user.id),
        portfolioService.getCategorias(),
        portfolioService.getEstatisticas()
      ])

      setFotos(fotosData)
      setCategorias(categoriasData)
      setEstatisticas(statsData)
      setLogoPreview(user.fotoPerfilUrl ? `https://jfagende-production.up.railway.app${user.fotoPerfilUrl}` : null)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      setToast({ type: 'error', message: 'Erro ao carregar portfólio' })
    } finally {
      setLoading(false)
    }
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

  const handleLogoUpload = async () => {
    if (!logoFile) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('logo', logoFile)
      
      const response = await fetch(`https://jfagende-production.up.railway.app/api/estabelecimentos/${user.id}/logo`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      })

      if (!response.ok) {
        throw new Error('Erro ao fazer upload da logo')
      }

      const data = await response.json()
      setToast({ type: 'success', message: 'Logo atualizada com sucesso!' })
      setLogoFile(null)
      
      // Atualizar contexto do usuário
      updateUser({ ...user, fotoPerfilUrl: data.estabelecimento.fotoPerfilUrl })
      
      // Atualizar preview da logo
      setLogoPreview(data.estabelecimento.fotoPerfilUrl ? `https://jfagende-production.up.railway.app${data.estabelecimento.fotoPerfilUrl}` : null)
      
    } catch (error) {
      console.error('Erro ao fazer upload da logo:', error)
      setToast({ type: 'error', message: 'Erro ao fazer upload da logo' })
    } finally {
      setUploading(false)
    }
  }

  const handleLogoRemove = async () => {
    setUploading(true)
    try {
      const response = await fetch(`https://jfagende-production.up.railway.app/api/estabelecimentos/${user.id}/logo`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Erro ao remover logo')
      }

      setToast({ type: 'success', message: 'Logo removida com sucesso!' })
      setLogoPreview(null)
      setLogoFile(null)
      
      // Atualizar contexto do usuário
      updateUser({ ...user, fotoPerfilUrl: null })
      
    } catch (error) {
      console.error('Erro ao remover logo:', error)
      setToast({ type: 'error', message: 'Erro ao remover logo' })
    } finally {
      setUploading(false)
    }
  }

  const handleUpload = async (file) => {
    if (!fotoData.titulo || !fotoData.categoria) {
      setToast({ type: 'error', message: 'Preencha título e categoria' })
      return
    }

    setUploading(true)
    
    try {
      const formData = new FormData()
      formData.append('imagem', file)
      formData.append('titulo', fotoData.titulo)
      formData.append('descricao', fotoData.descricao)
      formData.append('categoria', fotoData.categoria)
      formData.append('tipo', fotoData.tipo)

      await portfolioService.uploadFoto(formData)
      
      setToast({ type: 'success', message: 'Foto adicionada com sucesso!' })
      setModalOpen(false)
      setFotoData({
        titulo: '',
        descricao: '',
        categoria: '',
        tipo: 'portfolio'
      })
      carregarDados()
    } catch (error) {
      console.error('Erro ao fazer upload:', error)
      setToast({ 
        type: 'error', 
        message: error.response?.data?.error || 'Erro ao fazer upload' 
      })
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await portfolioService.deleteFoto(id)
      setToast({ type: 'success', message: 'Foto deletada com sucesso!' })
      carregarDados()
    } catch (error) {
      console.error('Erro ao deletar foto:', error)
      setToast({ type: 'error', message: 'Erro ao deletar foto' })
    }
  }

  if (loading) {
    return <Loading fullScreen />
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
          <Toast
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        </div>
      )}

      {/* Modal de Upload */}
      <Modal
        isOpen={modalOpen}
        onClose={() => !uploading && setModalOpen(false)}
        title="Adicionar Foto ao Portfólio"
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Título da Foto *"
            placeholder="Ex: Corte Degradê Masculino"
            value={fotoData.titulo}
            onChange={(e) => setFotoData({ ...fotoData, titulo: e.target.value })}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Categoria *
            </label>
            <Select
              value={fotoData.categoria}
              onChange={(e) => setFotoData({ ...fotoData, categoria: e.target.value })}
              required
            >
              <option value="">Selecione uma categoria</option>
              {categorias.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.icon} {cat.label}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Descrição (opcional)
            </label>
            <textarea
              placeholder="Descrição ou detalhes do trabalho..."
              value={fotoData.descricao}
              onChange={(e) => setFotoData({ ...fotoData, descricao: e.target.value })}
              rows="3"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800"
            />
          </div>

          <UploadImagem
            onUpload={handleUpload}
            loading={uploading}
            maxSize={10}
          />
        </div>
      </Modal>

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
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <ImageIcon size={28} className="text-primary-600" />
                  Meu Portfólio
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Gerencie suas fotos de trabalhos realizados
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Estatísticas */}
        {estatisticas && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <StatCard
              title="Total de Fotos"
              value={estatisticas.total}
              icon={ImageIcon}
              iconColor="text-primary-600"
              iconBg="bg-primary-100 dark:bg-primary-900"
            />
            
            <StatCard
              title="Categorias"
              value={Object.keys(estatisticas.categorias || {}).length}
              icon={BarChart2}
              iconColor="text-purple-600"
              iconBg="bg-purple-100 dark:bg-purple-900"
            />

            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">
                Por Categoria
              </h3>
              <div className="space-y-2">
                {Object.entries(estatisticas.categorias || {}).slice(0, 3).map(([cat, count]) => (
                  <div key={cat} className="flex justify-between items-center">
                    <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                      {cat}
                    </span>
                    <span className="text-sm font-semibold text-primary-600">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Seção de Logo do Estabelecimento */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                🏷️ Logo do Estabelecimento
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Sua logo aparecerá nos cards da tela inicial e em todos os lugares do app
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate('/estabelecimento/perfil')}
            >
              <User size={18} className="mr-2" />
              Meu Perfil
            </Button>
          </div>
          
          <div className="max-w-md">
            <Card className="p-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Upload de Logo
                </h3>
                
                <div className="mb-6">
                  {logoPreview ? (
                    <div className="relative inline-block group">
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

                <div className="space-y-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoSelect}
                    className="hidden"
                    id="logoInput"
                  />
                  
                  <Button
                    onClick={() => document.getElementById('logoInput').click()}
                    disabled={uploading}
                    className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {uploading ? (
                      <Loading size="sm" />
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        {logoPreview ? 'Alterar Logo' : 'Adicionar Logo'}
                      </>
                    )}
                  </Button>

                  {logoFile && (
                    <Button
                      onClick={handleLogoUpload}
                      disabled={uploading}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Salvar Logo
                    </Button>
                  )}

                  {logoPreview && (
                    <Button
                      variant="outline"
                      onClick={handleLogoRemove}
                      disabled={uploading}
                      className="w-full border-red-300 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remover Logo
                    </Button>
                  )}
                </div>

                <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                  Formatos aceitos: JPG, PNG, GIF. Tamanho máximo: 5MB.
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* Dicas de Marketing Visual */}
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 mb-8">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <span className="text-2xl">💡</span>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Dicas para uma Identidade Visual Atraente
              </h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Use uma logo clara e legível, mesmo em tamanhos pequenos</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Escolha cores que representem sua marca e categoria</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Mantenha consistência visual em todas as suas fotos</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Mostre o ambiente e equipamentos do seu estabelecimento</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Ações */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            📸 Galeria de Fotos
          </h2>

          <Button onClick={() => setModalOpen(true)}>
            <Plus size={18} />
            Adicionar Foto
          </Button>
        </div>

        {/* Galeria */}
        <GaleriaPortfolio
          fotos={fotos}
          onDelete={handleDelete}
          editable={true}
        />
      </div>
    </div>
  )
}

export default PortfolioEstabelecimento


