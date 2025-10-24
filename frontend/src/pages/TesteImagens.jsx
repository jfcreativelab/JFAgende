import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Image as ImageIcon, AlertCircle, CheckCircle } from 'lucide-react'
import estabelecimentoService from '../services/estabelecimentoService'
import Button from '../components/Button'
import Card from '../components/Card'

const TesteImagens = () => {
  const navigate = useNavigate()
  const [estabelecimentos, setEstabelecimentos] = useState([])
  const [loading, setLoading] = useState(true)
  const [logs, setLogs] = useState([])

  useEffect(() => {
    carregarEstabelecimentos()
  }, [])

  const carregarEstabelecimentos = async () => {
    try {
      const response = await estabelecimentoService.getAll()
      setEstabelecimentos(response.estabelecimentos || [])
      
      // Log de informações do dispositivo
      addLog('📱 User Agent:', navigator.userAgent)
      addLog('🌐 Hostname:', window.location.hostname)
      addLog('🔗 URL atual:', window.location.href)
      addLog('📱 É mobile?', /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
      
    } catch (error) {
      addLog('❌ Erro ao carregar estabelecimentos:', error.message)
    } finally {
      setLoading(false)
    }
  }

  const addLog = (message, data) => {
    const logEntry = `${new Date().toLocaleTimeString()} - ${message} ${data ? JSON.stringify(data) : ''}`
    setLogs(prev => [...prev, logEntry])
    console.log(logEntry)
  }

  const testarImagem = (estabelecimento) => {
    const url = estabelecimentoService.getImageUrl(estabelecimento.fotoPerfilUrl)
    addLog(`🔍 Testando imagem para ${estabelecimento.nome}:`, url)
    
    const img = new Image()
    img.onload = () => {
      addLog(`✅ Imagem carregada com sucesso: ${estabelecimento.nome}`)
    }
    img.onerror = () => {
      addLog(`❌ Erro ao carregar imagem: ${estabelecimento.nome}`)
    }
    img.src = url
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
              Teste de Imagens - Mobile Debug
            </h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Informações do Dispositivo */}
        <Card>
          <h2 className="text-lg font-semibold mb-4">Informações do Dispositivo</h2>
          <div className="space-y-2 text-sm">
            <p><strong>User Agent:</strong> {navigator.userAgent}</p>
            <p><strong>Hostname:</strong> {window.location.hostname}</p>
            <p><strong>URL:</strong> {window.location.href}</p>
            <p><strong>É Mobile:</strong> {/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? 'Sim' : 'Não'}</p>
            <p><strong>Largura da Tela:</strong> {window.innerWidth}px</p>
            <p><strong>Altura da Tela:</strong> {window.innerHeight}px</p>
          </div>
        </Card>

        {/* Estabelecimentos com Logos */}
        <Card>
          <h2 className="text-lg font-semibold mb-4">Estabelecimentos com Logos</h2>
          <div className="space-y-4">
            {estabelecimentos.filter(e => e.fotoPerfilUrl).map(estabelecimento => (
              <div key={estabelecimento.id} className="border rounded-lg p-4">
                <div className="flex items-center gap-4">
                  {/* Logo */}
                  <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-primary-500">
                    <img 
                      src={estabelecimentoService.getImageUrl(estabelecimento.fotoPerfilUrl)} 
                      alt={estabelecimento.nome}
                      className="w-full h-full object-cover"
                      onLoad={() => addLog(`✅ Logo carregada: ${estabelecimento.nome}`)}
                      onError={() => addLog(`❌ Erro na logo: ${estabelecimento.nome}`)}
                    />
                  </div>
                  
                  {/* Informações */}
                  <div className="flex-1">
                    <h3 className="font-semibold">{estabelecimento.nome}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      URL: {estabelecimento.fotoPerfilUrl}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      URL Completa: {estabelecimentoService.getImageUrl(estabelecimento.fotoPerfilUrl)}
                    </p>
                  </div>
                  
                  {/* Botão de Teste */}
                  <Button
                    size="sm"
                    onClick={() => testarImagem(estabelecimento)}
                  >
                    <ImageIcon size={16} />
                    Testar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Logs */}
        <Card>
          <h2 className="text-lg font-semibold mb-4">Logs de Debug</h2>
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 max-h-96 overflow-y-auto">
            {logs.map((log, index) => (
              <div key={index} className="text-xs font-mono mb-1">
                {log}
              </div>
            ))}
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setLogs([])}
            className="mt-2"
          >
            Limpar Logs
          </Button>
        </Card>
      </div>
    </div>
  )
}

export default TesteImagens
