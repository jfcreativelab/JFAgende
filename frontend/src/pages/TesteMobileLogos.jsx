import { useState, useEffect } from 'react'
import { ArrowLeft, Image as ImageIcon, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import estabelecimentoService from '../services/estabelecimentoService'
import Button from '../components/Button'
import Card from '../components/Card'

const TesteMobileLogos = () => {
  const navigate = useNavigate()
  const [estabelecimentos, setEstabelecimentos] = useState([])
  const [loading, setLoading] = useState(true)
  const [testResults, setTestResults] = useState({})

  useEffect(() => {
    carregarEstabelecimentos()
  }, [])

  const carregarEstabelecimentos = async () => {
    try {
      const response = await estabelecimentoService.getAll()
      setEstabelecimentos(response.estabelecimentos || [])
    } catch (error) {
      console.error('Erro ao carregar estabelecimentos:', error)
    } finally {
      setLoading(false)
    }
  }

  const testarImagem = async (estabelecimento) => {
    const railwayUrl = estabelecimentoService.getImageUrl(estabelecimento.fotoPerfilUrl)
    const cloudinaryUrl = estabelecimentoService.getCloudinaryUrl(estabelecimento.id, estabelecimento.nome)
    
    const results = {
      railway: { status: 'testing', url: railwayUrl },
      cloudinary: { status: 'testing', url: cloudinaryUrl }
    }
    
    setTestResults(prev => ({ ...prev, [estabelecimento.id]: results }))

    // Testar Railway
    if (railwayUrl) {
      try {
        const img = new Image()
        img.onload = () => {
          setTestResults(prev => ({
            ...prev,
            [estabelecimento.id]: {
              ...prev[estabelecimento.id],
              railway: { status: 'success', url: railwayUrl }
            }
          }))
        }
        img.onerror = () => {
          setTestResults(prev => ({
            ...prev,
            [estabelecimento.id]: {
              ...prev[estabelecimento.id],
              railway: { status: 'error', url: railwayUrl }
            }
          }))
        }
        img.src = railwayUrl
      } catch (error) {
        setTestResults(prev => ({
          ...prev,
          [estabelecimento.id]: {
            ...prev[estabelecimento.id],
            railway: { status: 'error', url: railwayUrl }
          }
        }))
      }
    }

    // Testar Cloudinary
    if (cloudinaryUrl) {
      try {
        const img = new Image()
        img.onload = () => {
          setTestResults(prev => ({
            ...prev,
            [estabelecimento.id]: {
              ...prev[estabelecimento.id],
              cloudinary: { status: 'success', url: cloudinaryUrl }
            }
          }))
        }
        img.onerror = () => {
          setTestResults(prev => ({
            ...prev,
            [estabelecimento.id]: {
              ...prev[estabelecimento.id],
              cloudinary: { status: 'error', url: cloudinaryUrl }
            }
          }))
        }
        img.src = cloudinaryUrl
      } catch (error) {
        setTestResults(prev => ({
          ...prev,
          [estabelecimento.id]: {
            ...prev[estabelecimento.id],
            cloudinary: { status: 'error', url: cloudinaryUrl }
          }
        }))
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
            >
              <ArrowLeft size={20} />
              Voltar
            </Button>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Teste Mobile - Logos
            </h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-4">
        {/* Informações do Dispositivo */}
        <Card>
          <h2 className="text-lg font-semibold mb-4">Informações do Dispositivo</h2>
          <div className="space-y-2 text-sm">
            <p><strong>User Agent:</strong> {navigator.userAgent}</p>
            <p><strong>É Mobile:</strong> {navigator.userAgent.includes('Mobile') ? 'Sim' : 'Não'}</p>
            <p><strong>Largura:</strong> {window.innerWidth}px</p>
            <p><strong>Altura:</strong> {window.innerHeight}px</p>
          </div>
        </Card>

        {/* Estabelecimentos */}
        {estabelecimentos.map(estabelecimento => {
          const results = testResults[estabelecimento.id] || {}
          const railwayResult = results.railway
          const cloudinaryResult = results.cloudinary

          return (
            <Card key={estabelecimento.id}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">{estabelecimento.nome}</h3>
                  <Button
                    size="sm"
                    onClick={() => testarImagem(estabelecimento)}
                  >
                    <ImageIcon size={16} />
                    Testar
                  </Button>
                </div>

                {/* URLs */}
                <div className="space-y-3">
                  {/* Railway */}
                  <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">🚂 Railway:</span>
                      {railwayResult?.status === 'success' && <CheckCircle className="text-green-500" size={16} />}
                      {railwayResult?.status === 'error' && <AlertCircle className="text-red-500" size={16} />}
                      {railwayResult?.status === 'testing' && <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 break-all">
                      {estabelecimento.fotoPerfilUrl ? estabelecimentoService.getImageUrl(estabelecimento.fotoPerfilUrl) : 'Nenhuma URL'}
                    </p>
                    {railwayResult?.url && (
                      <a
                        href={railwayResult.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs mt-1"
                      >
                        <ExternalLink size={12} />
                        Abrir URL
                      </a>
                    )}
                  </div>

                  {/* Cloudinary */}
                  <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">☁️ Cloudinary:</span>
                      {cloudinaryResult?.status === 'success' && <CheckCircle className="text-green-500" size={16} />}
                      {cloudinaryResult?.status === 'error' && <AlertCircle className="text-red-500" size={16} />}
                      {cloudinaryResult?.status === 'testing' && <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 break-all">
                      {estabelecimentoService.getCloudinaryUrl(estabelecimento.id, estabelecimento.nome) || 'Nenhuma URL'}
                    </p>
                    {cloudinaryResult?.url && (
                      <a
                        href={cloudinaryResult.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs mt-1"
                      >
                        <ExternalLink size={12} />
                        Abrir URL
                      </a>
                    )}
                  </div>
                </div>

                {/* Imagem de Teste */}
                {(railwayResult?.status === 'success' || cloudinaryResult?.status === 'success') && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Imagem de Teste:</h4>
                    <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-gray-300">
                      <img
                        src={cloudinaryResult?.status === 'success' ? cloudinaryResult.url : railwayResult?.url}
                        alt={estabelecimento.nome}
                        className="w-full h-full object-cover"
                        onLoad={() => console.log('✅ Imagem carregada no teste!')}
                        onError={() => console.log('❌ Erro ao carregar imagem no teste!')}
                      />
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

export default TesteMobileLogos
