import { useState } from 'react'
import { Upload, X, Camera, CheckCircle, AlertCircle } from 'lucide-react'
import Button from './Button'
import Toast from './Toast'

const LogoUpload = ({ 
  estabelecimento, 
  onLogoUpdate, 
  className = "",
  showPreview = true 
}) => {
  const [logoFile, setLogoFile] = useState(null)
  const [logoPreview, setLogoPreview] = useState(estabelecimento?.fotoPerfilUrl || null)
  const [uploading, setUploading] = useState(false)
  const [toast, setToast] = useState(null)

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (!file) return

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

  const handleUpload = async () => {
    if (!logoFile) return

    setUploading(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setToast({ type: 'error', message: 'Sessão expirada. Faça login novamente.' })
        return
      }

      const formData = new FormData()
      formData.append('logo', logoFile)
      
      const baseURL = window.location.hostname.includes('vercel.app')
        ? 'https://jfagende-production.up.railway.app'
        : 'http://localhost:5000'
      
      const response = await fetch(`${baseURL}/api/estabelecimentos/${estabelecimento.id}/logo`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      if (response.status === 401) {
        setToast({ type: 'error', message: 'Sessão expirada. Faça login novamente.' })
        return
      }

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao fazer upload da logo')
      }

      const data = await response.json()
      setToast({ type: 'success', message: 'Logo atualizada com sucesso!' })
      setLogoFile(null)
      
      // Atualizar preview
      setLogoPreview(data.estabelecimento.fotoPerfilUrl)
      
      // Notificar componente pai
      if (onLogoUpdate) {
        onLogoUpdate(data.estabelecimento.fotoPerfilUrl)
      }
      
    } catch (error) {
      console.error('Erro ao fazer upload da logo:', error)
      setToast({ type: 'error', message: error.message || 'Erro ao fazer upload da logo' })
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = async () => {
    setUploading(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setToast({ type: 'error', message: 'Sessão expirada. Faça login novamente.' })
        return
      }

      const baseURL = window.location.hostname.includes('vercel.app')
        ? 'https://jfagende-production.up.railway.app'
        : 'http://localhost:5000'
      
      const response = await fetch(`${baseURL}/api/estabelecimentos/${estabelecimento.id}/logo`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Erro ao remover logo')
      }

      setToast({ type: 'success', message: 'Logo removida com sucesso!' })
      setLogoPreview(null)
      setLogoFile(null)
      
      // Notificar componente pai
      if (onLogoUpdate) {
        onLogoUpdate(null)
      }
      
    } catch (error) {
      console.error('Erro ao remover logo:', error)
      setToast({ type: 'error', message: 'Erro ao remover logo' })
    } finally {
      setUploading(false)
    }
  }

  const getImageUrl = (url) => {
    if (!url) return ''
    if (url.startsWith('http')) return url
    
    const baseURL = window.location.hostname.includes('vercel.app')
      ? 'https://jfagende-production.up.railway.app'
      : 'http://localhost:5000'
    
    return `${baseURL}${url}`
  }

  return (
    <div className={`space-y-4 ${className}`}>
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

      {/* Preview da Logo */}
      {showPreview && (
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 flex-shrink-0">
            {logoPreview ? (
              <img 
                src={getImageUrl(logoPreview)} 
                alt="Logo do estabelecimento"
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error('Erro ao carregar logo:', logoPreview)
                  e.target.style.display = 'none'
                  e.target.nextSibling.style.display = 'flex'
                }}
              />
            ) : null}
            <div 
              className="w-full h-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl"
              style={{ display: logoPreview ? 'none' : 'flex' }}
            >
              {estabelecimento?.nome?.charAt(0)?.toUpperCase() || 'E'}
            </div>
          </div>
          
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Logo do Estabelecimento
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {logoPreview ? 'Logo atualizada' : 'Nenhuma logo definida'}
            </p>
          </div>
        </div>
      )}

      {/* Controles de Upload */}
      <div className="space-y-3">
        {/* Input de arquivo */}
        <div className="relative">
          <input
            type="file"
            id="logo-upload"
            accept="image/*"
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={uploading}
          />
          <label
            htmlFor="logo-upload"
            className={`flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer transition-colors hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Camera size={20} className="text-gray-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {logoFile ? 'Arquivo selecionado' : 'Selecionar Logo'}
            </span>
          </label>
        </div>

        {/* Botões de ação */}
        <div className="flex gap-2">
          {logoFile && (
            <Button
              onClick={handleUpload}
              disabled={uploading}
              className="flex-1 flex items-center justify-center gap-2"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Enviando...
                </>
              ) : (
                <>
                  <Upload size={16} />
                  Enviar Logo
                </>
              )}
            </Button>
          )}
          
          {logoPreview && (
            <Button
              variant="outline"
              onClick={handleRemove}
              disabled={uploading}
              className="flex items-center gap-2"
            >
              <X size={16} />
              Remover
            </Button>
          )}
        </div>

        {/* Informações */}
        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
          <p>• Formatos aceitos: JPG, PNG, WEBP</p>
          <p>• Tamanho máximo: 5MB</p>
          <p>• Recomendado: 512x512px</p>
        </div>
      </div>
    </div>
  )
}

export default LogoUpload
