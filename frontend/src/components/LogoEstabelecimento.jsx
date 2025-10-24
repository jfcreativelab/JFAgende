const LogoEstabelecimento = ({ 
  estabelecimento, 
  className = "w-full h-full object-cover",
  fallbackClassName = "w-full h-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-bold",
  showDebug = false
}) => {
  // URLs do Cloudinary para fallback (hardcoded para garantir funcionamento)
  const getCloudinaryUrl = (estabelecimentoId, nome) => {
    const cloudinaryUrls = {
      'f2b84226-0a4f-4678-9e17-5e0732e97c5f': 'https://res.cloudinary.com/dypmxu22a/image/upload/v1761312247/jfagende/estabelecimentos/logo-f2b84226-0a4f-4678-9e17-5e0732e97c5f.webp',
      'c8fb778a-c703-4605-9522-128993b78430': 'https://res.cloudinary.com/dypmxu22a/image/upload/v1761312248/jfagende/estabelecimentos/logo-c8fb778a-c703-4605-9522-128993b78430.webp',
      '6582f90e-03f8-45e1-88b6-0a066de1b10b': 'https://res.cloudinary.com/dypmxu22a/image/upload/v1761312249/jfagende/estabelecimentos/logo-6582f90e-03f8-45e1-88b6-0a066de1b10b.webp'
    }
    
    return cloudinaryUrls[estabelecimentoId] || null
  }

  // Função para obter URL da imagem
  const getImageUrl = (fotoPerfilUrl, estabelecimentoId, nome) => {
    console.log('🔍 LogoEstabelecimento - getImageUrl:', { fotoPerfilUrl, estabelecimentoId, nome })
    
    // Se tem fotoPerfilUrl e é uma URL válida, usar
    if (fotoPerfilUrl && fotoPerfilUrl.startsWith('http')) {
      console.log('✅ Usando fotoPerfilUrl:', fotoPerfilUrl)
      return fotoPerfilUrl
    }
    
    // Se não tem fotoPerfilUrl ou é inválida, usar Cloudinary
    const cloudinaryUrl = getCloudinaryUrl(estabelecimentoId, nome)
    console.log('☁️ Usando Cloudinary URL:', cloudinaryUrl)
    return cloudinaryUrl || ''
  }

  const imageUrl = getImageUrl(estabelecimento.fotoPerfilUrl, estabelecimento.id, estabelecimento.nome)
  
  if (showDebug) {
    console.log('🐛 LogoEstabelecimento Debug:', {
      estabelecimento: estabelecimento.nome,
      fotoPerfilUrl: estabelecimento.fotoPerfilUrl,
      imageUrl,
      hasImage: !!imageUrl
    })
  }

  return (
    <div className="relative">
      {imageUrl ? (
        <img 
          src={imageUrl}
          alt={`Logo ${estabelecimento.nome}`}
          className={className}
          loading="lazy"
          onError={(e) => {
            console.error('❌ Erro ao carregar logo:', imageUrl, e)
            // Se falhar, mostrar fallback
            e.target.style.display = 'none'
            e.target.nextSibling.style.display = 'flex'
          }}
          onLoad={() => {
            console.log('✅ Logo carregada com sucesso:', imageUrl)
          }}
        />
      ) : null}
      
      {/* Fallback visual */}
      <div 
        className={`absolute inset-0 ${fallbackClassName}`}
        style={{ display: imageUrl ? 'none' : 'flex' }}
      >
        {estabelecimento.nome.charAt(0).toUpperCase()}
      </div>
    </div>
  )
}

export default LogoEstabelecimento
