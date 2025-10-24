const LogoEstabelecimento = ({ 
  estabelecimento, 
  className = "w-full h-full object-cover",
  fallbackClassName = "w-full h-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-bold"
}) => {
  // Função simples para obter URL da imagem
  const getImageUrl = (fotoPerfilUrl) => {
    if (!fotoPerfilUrl) return ''
    if (fotoPerfilUrl.startsWith('http')) return fotoPerfilUrl
    
    const baseURL = window.location.hostname.includes('vercel.app')
      ? 'https://jfagende-production.up.railway.app'
      : 'http://localhost:5000'
    
    return `${baseURL}${fotoPerfilUrl}`
  }

  const imageUrl = getImageUrl(estabelecimento.fotoPerfilUrl)

  return (
    <div className="relative">
      {imageUrl ? (
        <img 
          src={imageUrl}
          alt={`Logo ${estabelecimento.nome}`}
          className={className}
          loading="lazy"
          onError={(e) => {
            // Se falhar, mostrar fallback
            e.target.style.display = 'none'
            e.target.nextSibling.style.display = 'flex'
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
