import { useState } from 'react'
import { ImageIcon, AlertCircle } from 'lucide-react'

const LogoEstabelecimento = ({ 
  estabelecimento, 
  className = "w-full h-full object-cover",
  fallbackClassName = "w-full h-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-bold",
  showDebug = false
}) => {
  const [imageError, setImageError] = useState(false)
  const [currentUrl, setCurrentUrl] = useState('')
  const [debugInfo, setDebugInfo] = useState({})

  // Função para obter URL da imagem
  const getImageUrl = (fotoPerfilUrl, id, nome) => {
    // Se não tem fotoPerfilUrl, tentar Cloudinary direto
    if (!fotoPerfilUrl) {
      const cloudinaryUrl = getCloudinaryUrl(id, nome)
      if (showDebug) {
        setDebugInfo(prev => ({ ...prev, source: 'cloudinary', url: cloudinaryUrl }))
      }
      return cloudinaryUrl || ''
    }

    // Se tem fotoPerfilUrl, construir URL Railway
    if (fotoPerfilUrl.startsWith('http')) {
      if (showDebug) {
        setDebugInfo(prev => ({ ...prev, source: 'railway-direct', url: fotoPerfilUrl }))
      }
      return fotoPerfilUrl
    }

    const baseURL = window.location.hostname.includes('vercel.app')
      ? 'https://jfagende-production.up.railway.app'
      : 'http://localhost:5000'
    
    const railwayUrl = `${baseURL}${fotoPerfilUrl}`
    
    if (showDebug) {
      setDebugInfo(prev => ({ ...prev, source: 'railway-constructed', url: railwayUrl }))
    }
    
    return railwayUrl
  }

  // URLs do Cloudinary para fallback
  const getCloudinaryUrl = (estabelecimentoId, nome) => {
    const cloudinaryUrls = {
      'f2b84226-0a4f-4678-9e17-5e0732e97c5f': 'https://res.cloudinary.com/dypmxu22a/image/upload/v1761312247/jfagende/estabelecimentos/logo-f2b84226-0a4f-4678-9e17-5e0732e97c5f.webp',
      'c8fb778a-c703-4605-9522-128993b78430': 'https://res.cloudinary.com/dypmxu22a/image/upload/v1761312248/jfagende/estabelecimentos/logo-c8fb778a-c703-4605-9522-128993b78430.webp',
      '6582f90e-03f8-45e1-88b6-0a066de1b10b': 'https://res.cloudinary.com/dypmxu22a/image/upload/v1761312249/jfagende/estabelecimentos/logo-6582f90e-03f8-45e1-88b6-0a066de1b10b.webp'
    }
    
    return cloudinaryUrls[estabelecimentoId] || null
  }

  // Obter URL inicial
  const initialUrl = getImageUrl(estabelecimento.fotoPerfilUrl, estabelecimento.id, estabelecimento.nome)
  
  // Se não tem URL inicial, mostrar fallback direto
  if (!initialUrl) {
    return (
      <div className={fallbackClassName}>
        {showDebug && (
          <div className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded text-xs z-10">
            <AlertCircle size={12} />
          </div>
        )}
        {estabelecimento.nome.charAt(0).toUpperCase()}
      </div>
    )
  }

  const handleError = () => {
    if (imageError) return // Já tentou fallback
    
    setImageError(true)
    
    // Tentar Cloudinary como fallback
    const cloudinaryUrl = getCloudinaryUrl(estabelecimento.id, estabelecimento.nome)
    if (cloudinaryUrl) {
      setCurrentUrl(cloudinaryUrl)
      if (showDebug) {
        setDebugInfo(prev => ({ ...prev, fallback: 'cloudinary', fallbackUrl: cloudinaryUrl }))
      }
    }
  }

  const handleLoad = () => {
    if (showDebug) {
      setDebugInfo(prev => ({ ...prev, loaded: true, finalUrl: currentUrl || initialUrl }))
    }
  }

  return (
    <div className="relative">
      {/* Debug Info - Mobile Only */}
      {showDebug && window.innerWidth < 768 && (
        <div className="absolute top-1 right-1 bg-blue-500 text-white p-1 rounded text-xs z-10">
          <ImageIcon size={12} />
        </div>
      )}
      
      {/* Imagem principal */}
      <img 
        src={currentUrl || initialUrl}
        alt={`Logo ${estabelecimento.nome}`}
        className={className}
        loading="lazy"
        onError={handleError}
        onLoad={handleLoad}
      />
      
      {/* Fallback visual - só aparece se imagem falhar */}
      {imageError && !getCloudinaryUrl(estabelecimento.id, estabelecimento.nome) && (
        <div className={`absolute inset-0 ${fallbackClassName}`}>
          {estabelecimento.nome.charAt(0).toUpperCase()}
        </div>
      )}
      
      {/* Debug Info Display - Mobile Only */}
      {showDebug && window.innerWidth < 768 && Object.keys(debugInfo).length > 0 && (
        <div className="absolute bottom-1 left-1 bg-black bg-opacity-75 text-white text-xs p-1 rounded max-w-32">
          <div>Source: {debugInfo.source}</div>
          {debugInfo.fallback && <div>Fallback: {debugInfo.fallback}</div>}
          {debugInfo.loaded && <div>✅ Loaded</div>}
        </div>
      )}
    </div>
  )
}

export default LogoEstabelecimento
