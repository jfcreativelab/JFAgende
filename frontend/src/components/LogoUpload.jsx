import { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon, CheckCircle } from 'lucide-react'
import Button from './Button'
import Card from './Card'
import Loading from './Loading'
import Toast from './Toast'

const LogoUpload = ({ 
  currentLogo, 
  onLogoUpload, 
  onLogoRemove, 
  estabelecimentoId,
  className = '' 
}) => {
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState(null)
  const [toast, setToast] = useState(null)
  const fileInputRef = useRef(null)

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
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

    // Criar preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target.result)
    }
    reader.readAsDataURL(file)

    // Fazer upload
    uploadLogo(file)
  }

  const uploadLogo = async (file) => {
    setIsUploading(true)
    
    try {
      const formData = new FormData()
      formData.append('logo', file)

      const token = localStorage.getItem('estabelecimentoToken')
      const response = await fetch(`https://jfagende-production.up.railway.app/api/estabelecimentos/${estabelecimentoId}/logo`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao fazer upload da logo')
      }

      const data = await response.json()
      setToast({ type: 'success', message: 'Logo atualizada com sucesso!' })
      onLogoUpload?.(data.estabelecimento.fotoPerfilUrl)
      setPreview(null)
      
    } catch (error) {
      console.error('Erro ao fazer upload:', error)
      setToast({ type: 'error', message: error.message })
      setPreview(null)
    } finally {
      setIsUploading(false)
    }
  }

  const removeLogo = async () => {
    setIsUploading(true)
    
    try {
      const token = localStorage.getItem('estabelecimentoToken')
      const response = await fetch(`https://jfagende-production.up.railway.app/api/estabelecimentos/${estabelecimentoId}/logo`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao remover logo')
      }

      setToast({ type: 'success', message: 'Logo removida com sucesso!' })
      onLogoRemove?.()
      setPreview(null)
      
    } catch (error) {
      console.error('Erro ao remover logo:', error)
      setToast({ type: 'error', message: error.message })
    } finally {
      setIsUploading(false)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const displayImage = preview || currentLogo

  return (
    <Card className={`p-6 ${className}`}>
      {toast && (
        <div className="fixed top-4 right-4 z-50">
          <Toast
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        </div>
      )}

      <div className="text-center">
        <div className="mb-6">
          {displayImage ? (
            <div className="relative inline-block group">
              <img
                src={displayImage}
                alt="Logo do estabelecimento"
                className="w-32 h-32 object-cover rounded-xl border-4 border-white shadow-xl group-hover:scale-105 transition-transform duration-200"
              />
              {preview && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
              )}
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
            </div>
          ) : (
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center group hover:border-primary-400 transition-colors">
              <div className="text-center">
                <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-xs text-gray-500 dark:text-gray-400">Adicionar Logo</p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <Button
            onClick={triggerFileInput}
            disabled={isUploading}
            className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {isUploading ? (
              <Loading size="sm" />
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                {displayImage ? 'Alterar Logo' : 'Adicionar Logo'}
              </>
            )}
          </Button>

          {displayImage && (
            <Button
              variant="outline"
              onClick={removeLogo}
              disabled={isUploading}
              className="w-full border-red-300 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
            >
              <X className="w-4 h-4 mr-2" />
              Remover Logo
            </Button>
          )}
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
          Formatos aceitos: JPG, PNG, GIF. Tamanho máximo: 5MB.
        </p>
      </div>
    </Card>
  )
}

export default LogoUpload
