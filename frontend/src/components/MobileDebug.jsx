import { useState, useEffect } from 'react'
import { X, Bug, Image, AlertCircle, CheckCircle } from 'lucide-react'

const MobileDebug = ({ estabelecimento, isVisible, onClose }) => {
  const [logs, setLogs] = useState([])
  const [imageStatus, setImageStatus] = useState('loading')

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs(prev => [...prev, { timestamp, message, type }])
  }

  useEffect(() => {
    if (isVisible && estabelecimento) {
      addLog(`🔍 Debug para: ${estabelecimento.nome}`, 'info')
      addLog(`📱 User Agent: ${navigator.userAgent}`, 'info')
      addLog(`🌐 Hostname: ${window.location.hostname}`, 'info')
      addLog(`📏 Tela: ${window.innerWidth}x${window.innerHeight}`, 'info')
      addLog(`🖼️ FotoPerfilUrl: ${estabelecimento.fotoPerfilUrl || 'Nenhuma'}`, 'info')
      
      if (estabelecimento.fotoPerfilUrl) {
        addLog(`🔗 URL construída: ${estabelecimentoService.getImageUrl(estabelecimento.fotoPerfilUrl)}`, 'info')
        
        const cloudinaryUrl = estabelecimentoService.getCloudinaryUrl(estabelecimento.id, estabelecimento.nome)
        if (cloudinaryUrl) {
          addLog(`☁️ URL Cloudinary: ${cloudinaryUrl}`, 'info')
        } else {
          addLog(`❌ Sem URL Cloudinary para este estabelecimento`, 'warning')
        }
      }
    }
  }, [isVisible, estabelecimento])

  const testImageLoad = (url, name) => {
    addLog(`🧪 Testando carregamento: ${name}`, 'info')
    setImageStatus('testing')
    
    const img = new Image()
    img.onload = () => {
      addLog(`✅ ${name} carregou com sucesso!`, 'success')
      setImageStatus('success')
    }
    img.onerror = () => {
      addLog(`❌ ${name} falhou ao carregar`, 'error')
      setImageStatus('error')
    }
    img.src = url
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full max-h-96 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Bug className="text-blue-500" size={20} />
            <h3 className="font-semibold text-gray-900 dark:text-white">Debug Mobile</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Teste de URLs */}
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900 dark:text-white">Testar URLs:</h4>
            {estabelecimento.fotoPerfilUrl && (
              <button
                onClick={() => testImageLoad(estabelecimentoService.getImageUrl(estabelecimento.fotoPerfilUrl), 'Railway')}
                className="w-full p-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-sm"
              >
                🚂 Testar Railway
              </button>
            )}
            
            {estabelecimentoService.getCloudinaryUrl(estabelecimento.id, estabelecimento.nome) && (
              <button
                onClick={() => testImageLoad(estabelecimentoService.getCloudinaryUrl(estabelecimento.id, estabelecimento.nome), 'Cloudinary')}
                className="w-full p-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded text-sm"
              >
                ☁️ Testar Cloudinary
              </button>
            )}
          </div>

          {/* Status da Imagem */}
          <div className="flex items-center gap-2">
            <Image size={16} />
            <span className="text-sm">Status: </span>
            {imageStatus === 'loading' && <span className="text-yellow-600">Carregando...</span>}
            {imageStatus === 'testing' && <span className="text-blue-600">Testando...</span>}
            {imageStatus === 'success' && <span className="text-green-600">✅ Sucesso</span>}
            {imageStatus === 'error' && <span className="text-red-600">❌ Erro</span>}
          </div>

          {/* Logs */}
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900 dark:text-white">Logs:</h4>
            <div className="bg-gray-100 dark:bg-gray-700 rounded p-2 max-h-32 overflow-y-auto">
              {logs.map((log, index) => (
                <div key={index} className="text-xs font-mono mb-1">
                  <span className="text-gray-500">[{log.timestamp}]</span>{' '}
                  <span className={
                    log.type === 'error' ? 'text-red-600' :
                    log.type === 'warning' ? 'text-yellow-600' :
                    log.type === 'success' ? 'text-green-600' :
                    'text-gray-700 dark:text-gray-300'
                  }>
                    {log.message}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MobileDebug
