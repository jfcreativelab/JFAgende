const SkeletonCard = ({ variant = 'estabelecimento', count = 1 }) => {
  const skeletonClass = "relative overflow-hidden bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-shimmer bg-[length:200%_100%]"
  
  const renderSkeleton = () => {
    if (variant === 'estabelecimento') {
      return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          {/* Imagem */}
          <div className={`w-full h-48 ${skeletonClass}`}></div>
          
          <div className="p-5">
            {/* Título */}
            <div className={`h-6 ${skeletonClass} rounded w-3/4 mb-3`}></div>
            
            {/* Categoria e Rating */}
            <div className="flex items-center gap-2 mb-3">
              <div className={`h-5 ${skeletonClass} rounded w-20`}></div>
              <div className={`h-5 ${skeletonClass} rounded w-24`}></div>
            </div>
            
            {/* Endereço */}
            <div className={`h-4 ${skeletonClass} rounded w-full mb-3`}></div>
            
            {/* Próximo horário */}
            <div className={`h-4 ${skeletonClass} rounded w-2/3 mb-4`}></div>
            
            {/* Tags */}
            <div className="flex gap-2 mb-4">
              <div className={`h-6 ${skeletonClass} rounded w-16`}></div>
              <div className={`h-6 ${skeletonClass} rounded w-20`}></div>
              <div className={`h-6 ${skeletonClass} rounded w-16`}></div>
            </div>
            
            {/* Botão */}
            <div className={`h-10 ${skeletonClass} rounded-lg w-full`}></div>
          </div>
        </div>
      )
    }

    if (variant === 'agendamento') {
      return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 space-y-2">
              <div className={`h-5 ${skeletonClass} rounded w-3/4`}></div>
              <div className={`h-4 ${skeletonClass} rounded w-1/2`}></div>
              <div className={`h-4 ${skeletonClass} rounded w-2/3`}></div>
            </div>
            <div className={`h-6 ${skeletonClass} rounded-full w-20 ml-4`}></div>
          </div>
        </div>
      )
    }

    if (variant === 'servico') {
      return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-3">
              <div className={`h-6 ${skeletonClass} rounded w-2/3`}></div>
              <div className={`h-4 ${skeletonClass} rounded w-full`}></div>
              <div className="flex items-center gap-4">
                <div className={`h-4 ${skeletonClass} rounded w-20`}></div>
                <div className={`h-4 ${skeletonClass} rounded w-24`}></div>
              </div>
            </div>
            <div className="flex gap-2 ml-4">
              <div className={`h-8 w-8 ${skeletonClass} rounded`}></div>
              <div className={`h-8 w-8 ${skeletonClass} rounded`}></div>
            </div>
          </div>
        </div>
      )
    }

    // Skeleton padrão
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
        <div className={`h-4 ${skeletonClass} rounded w-3/4`}></div>
      </div>
    )
  }

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="animate-fade-in">
          {renderSkeleton()}
        </div>
      ))}
    </>
  )
}

export default SkeletonCard

