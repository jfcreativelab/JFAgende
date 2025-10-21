import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Image as ImageIcon, Plus, BarChart2 } from 'lucide-react'
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
import portfolioService from '../services/portfolioService'

const PortfolioEstabelecimento = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [fotos, setFotos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [estatisticas, setEstatisticas] = useState(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [toast, setToast] = useState(null)
  
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
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      setToast({ type: 'error', message: 'Erro ao carregar portfólio' })
    } finally {
      setLoading(false)
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

        {/* Ações */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Galeria de Fotos
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


