import { User } from 'lucide-react'
import Card from './Card'
import StarRating from './StarRating'

const AvaliacaoCard = ({ avaliacao }) => {
  const formatData = (data) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }

  return (
    <Card padding="md" className="hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {avaliacao.cliente.fotoPerfil ? (
            <img
              src={avaliacao.cliente.fotoPerfil}
              alt={avaliacao.cliente.nome}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
              <User className="text-primary-600" size={24} />
            </div>
          )}
        </div>

        {/* Conteúdo */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className="font-semibold text-gray-900">
                {avaliacao.cliente.nome}
              </h4>
              <p className="text-xs text-gray-500">
                {formatData(avaliacao.criadoEm)}
              </p>
            </div>
            <StarRating rating={avaliacao.nota} readOnly size={16} showNumber={false} />
          </div>

          {avaliacao.comentario && (
            <p className="text-sm text-gray-700 leading-relaxed">
              {avaliacao.comentario}
            </p>
          )}
        </div>
      </div>
    </Card>
  )
}

export default AvaliacaoCard


