import { useState } from 'react'
import { X, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react'
import Button from './Button'
import EmptyState from './EmptyState'
import portfolioService from '../services/portfolioService'

const GaleriaPortfolio = ({ fotos = [], onDelete, editable = false }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [filtroCategoria, setFiltroCategoria] = useState('todas')

  // Categorias únicas das fotos
  const categorias = ['todas', ...new Set(fotos.map(f => f.categoria))]

  // Filtrar fotos por categoria
  const fotosFiltradas = filtroCategoria === 'todas'
    ? fotos
    : fotos.filter(f => f.categoria === filtroCategoria)

  const openLightbox = (index) => {
    setCurrentIndex(index)
    setLightboxOpen(true)
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
  }

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % fotosFiltradas.length)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + fotosFiltradas.length) % fotosFiltradas.length)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') closeLightbox()
    if (e.key === 'ArrowRight') nextImage()
    if (e.key === 'ArrowLeft') prevImage()
  }

  if (fotos.length === 0) {
    return (
      <EmptyState
        icon={ImageIcon}
        title="Nenhuma foto no portfólio"
        description="Adicione fotos para criar um portfólio visual atraente"
      />
    )
  }

  return (
    <div>
      {/* Filtros de Categoria */}
      {categorias.length > 1 && (
        <div className="flex gap-2 mb-6 flex-wrap">
          {categorias.map((cat) => (
            <button
              key={cat}
              onClick={() => setFiltroCategoria(cat)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filtroCategoria === cat
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      )}

      {/* Grid de Fotos */}
      {fotosFiltradas.length === 0 ? (
        <EmptyState
          icon={ImageIcon}
          title="Nenhuma foto nesta categoria"
          description="Tente selecionar outra categoria"
        />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {fotosFiltradas.map((foto, index) => (
            <div
              key={foto.id}
              className="group relative aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 cursor-pointer hover:shadow-lg transition-all"
              onClick={() => openLightbox(index)}
            >
              <img
                src={portfolioService.getImageUrl(foto.imagemThumbUrl || foto.imagemUrl)}
                alt={foto.titulo}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                loading="lazy"
              />
              
              {/* Overlay com informações */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h4 className="text-white font-semibold text-sm truncate">
                    {foto.titulo}
                  </h4>
                  <p className="text-gray-300 text-xs mt-1">
                    {foto.categoria}
                  </p>
                </div>
              </div>

              {/* Badge de categoria */}
              <div className="absolute top-2 left-2 bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
                {foto.categoria}
              </div>

              {/* Botão de deletar (apenas se editável) */}
              {editable && onDelete && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    if (confirm('Deseja deletar esta foto?')) {
                      onDelete(foto.id)
                    }
                  }}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && fotosFiltradas[currentIndex] && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center"
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          {/* Botão Fechar */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 bg-white dark:bg-gray-800 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors z-10"
          >
            <X size={24} className="text-gray-900 dark:text-white" />
          </button>

          {/* Navegação Anterior */}
          {fotosFiltradas.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                prevImage()
              }}
              className="absolute left-4 p-3 bg-white dark:bg-gray-800 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <ChevronLeft size={24} className="text-gray-900 dark:text-white" />
            </button>
          )}

          {/* Imagem */}
          <div
            className="max-w-7xl max-h-[90vh] mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={portfolioService.getImageUrl(fotosFiltradas[currentIndex].imagemUrl)}
              alt={fotosFiltradas[currentIndex].titulo}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
            
            {/* Informações da Foto */}
            <div className="mt-4 text-center">
              <h3 className="text-white text-xl font-semibold">
                {fotosFiltradas[currentIndex].titulo}
              </h3>
              {fotosFiltradas[currentIndex].descricao && (
                <p className="text-gray-300 mt-2">
                  {fotosFiltradas[currentIndex].descricao}
                </p>
              )}
              <p className="text-gray-400 text-sm mt-2">
                {currentIndex + 1} / {fotosFiltradas.length}
              </p>
            </div>
          </div>

          {/* Navegação Próxima */}
          {fotosFiltradas.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                nextImage()
              }}
              className="absolute right-4 p-3 bg-white dark:bg-gray-800 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <ChevronRight size={24} className="text-gray-900 dark:text-white" />
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default GaleriaPortfolio


