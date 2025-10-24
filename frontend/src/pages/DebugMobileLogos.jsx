import { useState, useEffect } from 'react'
import { ArrowLeft, Bug, Image as ImageIcon, AlertCircle, CheckCircle, ExternalLink, Smartphone } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import estabelecimentoService from '../services/estabelecimentoService'
import Button from '../components/Button'
import Card from '../components/Card'

const DebugMobileLogos = () => {
  const navigate = useNavigate()
  const [estabelecimentos, setEstabelecimentos] = useState([])
  const [loading, setLoading] = useState(true)
  const [debugInfo, setDebugInfo] = useState({})

  useEffect(() => {
    carregarEstabelecimentos()
    coletarInfoDebug()
  }, [])

  const coletarInfoDebug = () => {
    const info = {
      userAgent: navigator.userAgent,
      isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      hostname: window.location.hostname,
      protocol: window.location.protocol,
      timestamp: new Date().toISOString()
    }
    setDebugInfo(info)
    console.log('📱 DEBUG INFO:', info)
  }

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

  const testarUrl = async (url, tipo) => {
    return new Promise((resolve) => {
      if (!url) {
        resolve({ status: 'error', message: 'URL vazia' })
        return
      }

      const img = new Image()
      const timeout = setTimeout(() => {
        resolve({ status: 'timeout', message: 'Timeout após 10s' })
      }, 10000)

      img.onload = () => {
        clearTimeout(timeout)
        resolve({ status: 'success', message: 'Imagem carregada com sucesso' })
      }

      img.onerror = (e) => {
        clearTimeout(timeout)
        resolve({ status: 'error', message: `Erro ao carregar: ${e.type}` })
      }

      img.src = url
    })
  }

  const testarEstabelecimento = async (estabelecimento) => {
    console.log(`🔍 Testando: ${estabelecimento.nome}`)
    
    const railwayUrl = estabelecimentoService.getImageUrl(estabelecimento.fotoPerfilUrl)
    const cloudinaryUrl = estabelecimentoService.getCloudinaryUrl(estabelecimento.id, estabelecimento.nome)
    
    console.log(`   Railway URL: ${railwayUrl}`)
    console.log(`   Cloudinary URL: ${cloudinaryUrl}`)
    
    const results = {
      estabelecimento: estabelecimento.nome,
      fotoPerfilUrl: estabelecimento.fotoPerfilUrl,
      railway: await testarUrl(railwayUrl, 'railway'),
      cloudinary: await testarUrl(cloudinaryUrl, 'cloudinary')
    }
    
    setDebugInfo(prev => ({
      ...prev,
      [`test_${estabelecimento.id}`]: results
    }))
    
    return results
  }

  const testarTodos = async () => {
    for (const estabelecimento of estabelecimentos) {
      await testarEstabelecimento(estabelecimento)
      // Pequena pausa entre testes
      await new Promise(resolve => setTimeout(resolve, 500))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Carregando estabelecimentos...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={20} />
            Voltar
          </Button>
          <div className="flex items-center gap-2">
            <Smartphone className="text-primary-500" size={24} />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Debug Mobile - Logos
            </h1>
          </div>
        </div>

        {/* Debug Info */}
        <Card className="mb-6 p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Bug size={20} className="text-blue-500" />
            Informações do Dispositivo
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>User Agent:</strong>
              <p className="text-gray-600 dark:text-gray-400 break-all">{debugInfo.userAgent}</p>
            </div>
            <div>
              <strong>É Mobile:</strong>
              <span className={`ml-2 px-2 py-1 rounded text-xs ${debugInfo.isMobile ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {debugInfo.isMobile ? 'SIM' : 'NÃO'}
              </span>
            </div>
            <div>
              <strong>Tela:</strong>
              <p className="text-gray-600 dark:text-gray-400">{debugInfo.screenWidth}x{debugInfo.screenHeight}</p>
            </div>
            <div>
              <strong>Hostname:</strong>
              <p className="text-gray-600 dark:text-gray-400">{debugInfo.hostname}</p>
            </div>
          </div>
        </Card>

        {/* Teste de URLs */}
        <Card className="mb-6 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <ImageIcon size={20} className="text-purple-500" />
              Teste de URLs
            </h2>
            <Button onClick={testarTodos} className="flex items-center gap-2">
              <Bug size={16} />
              Testar Todos
            </Button>
          </div>
          
          <div className="space-y-4">
            {estabelecimentos.map((estabelecimento) => {
              const testKey = `test_${estabelecimento.id}`
              const test = debugInfo[testKey]
              
              return (
                <div key={estabelecimento.id} className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">{estabelecimento.nome}</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Railway URL */}
                    <div>
                      <h4 className="text-sm font-medium mb-2">Railway URL:</h4>
                      <div className="flex items-center gap-2 mb-2">
                        {test?.railway?.status === 'success' && <CheckCircle size={16} className="text-green-500" />}
                        {test?.railway?.status === 'error' && <AlertCircle size={16} className="text-red-500" />}
                        {test?.railway?.status === 'timeout' && <AlertCircle size={16} className="text-yellow-500" />}
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {test?.railway?.status || 'Não testado'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 break-all">
                        {estabelecimentoService.getImageUrl(estabelecimento.fotoPerfilUrl) || 'N/A'}
                      </p>
                    </div>
                    
                    {/* Cloudinary URL */}
                    <div>
                      <h4 className="text-sm font-medium mb-2">Cloudinary URL:</h4>
                      <div className="flex items-center gap-2 mb-2">
                        {test?.cloudinary?.status === 'success' && <CheckCircle size={16} className="text-green-500" />}
                        {test?.cloudinary?.status === 'error' && <AlertCircle size={16} className="text-red-500" />}
                        {test?.cloudinary?.status === 'timeout' && <AlertCircle size={16} className="text-yellow-500" />}
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {test?.cloudinary?.status || 'Não testado'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 break-all">
                        {estabelecimentoService.getCloudinaryUrl(estabelecimento.id, estabelecimento.nome) || 'N/A'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Testar individualmente */}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => testarEstabelecimento(estabelecimento)}
                    className="mt-2"
                  >
                    Testar Este
                  </Button>
                </div>
              )
            })}
          </div>
        </Card>

        {/* Instruções */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Instruções</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li>Clique em "Testar Todos" para verificar todas as URLs</li>
            <li>Verifique se as URLs Railway estão retornando 200 (sucesso)</li>
            <li>Verifique se as URLs Cloudinary estão funcionando como fallback</li>
            <li>Se Railway falhar, Cloudinary deve funcionar automaticamente</li>
            <li>Abra o console do navegador para ver logs detalhados</li>
          </ol>
        </Card>
      </div>
    </div>
  )
}

export default DebugMobileLogos
