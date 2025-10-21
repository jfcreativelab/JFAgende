import { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon, Loader } from 'lucide-react'
import Button from './Button'

const UploadImagem = ({ onUpload, loading = false, maxSize = 10 }) => {
  const [dragActive, setDragActive] = useState(false)
  const [preview, setPreview] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const inputRef = useRef(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file) => {
    // Validar tamanho
    const sizeMB = file.size / 1024 / 1024
    if (sizeMB > maxSize) {
      alert(`Arquivo muito grande! Máximo ${maxSize}MB`)
      return
    }

    // Validar tipo
    if (!file.type.startsWith('image/')) {
      alert('Apenas imagens são permitidas!')
      return
    }

    setSelectedFile(file)

    // Criar preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleRemove = () => {
    setPreview(null)
    setSelectedFile(null)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  const handleUpload = () => {
    if (selectedFile && onUpload) {
      onUpload(selectedFile)
    }
  }

  return (
    <div className="w-full">
      {!preview ? (
        <div
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
            dragActive
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-500'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleChange}
            disabled={loading}
          />

          <div className="flex flex-col items-center gap-4">
            <div className="p-4 bg-primary-100 dark:bg-primary-900 rounded-full">
              <Upload className="text-primary-600 dark:text-primary-400" size={32} />
            </div>

            <div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                Arraste uma imagem aqui
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                ou clique para selecionar
              </p>
            </div>

            <Button
              variant="outline"
              onClick={() => inputRef.current?.click()}
              disabled={loading}
            >
              <ImageIcon size={18} />
              Selecionar Imagem
            </Button>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              PNG, JPG ou WEBP até {maxSize}MB
            </p>
          </div>
        </div>
      ) : (
        <div className="relative">
          <div className="relative rounded-2xl overflow-hidden border-2 border-primary-500 dark:border-primary-400">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-auto max-h-96 object-contain bg-gray-100 dark:bg-gray-800"
            />
            
            {loading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="text-center text-white">
                  <Loader className="animate-spin mx-auto mb-2" size={32} />
                  <p className="text-sm">Processando imagem...</p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 flex gap-2">
            <Button
              fullWidth
              onClick={handleUpload}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader className="animate-spin" size={18} />
                  Enviando...
                </>
              ) : (
                <>
                  <Upload size={18} />
                  Fazer Upload
                </>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={handleRemove}
              disabled={loading}
            >
              <X size={18} />
            </Button>
          </div>

          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
            <p>Tamanho: {(selectedFile.size / 1024 / 1024).toFixed(2)}MB</p>
            <p className="text-primary-600 dark:text-primary-400 mt-1">
              ✨ A imagem será automaticamente comprimida e otimizada
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default UploadImagem


