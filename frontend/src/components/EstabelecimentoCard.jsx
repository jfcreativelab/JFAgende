import { MapPin, Star, Clock, TrendingUp, Heart, Crown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Badge from './Badge'
import Button from './Button'
import StarRating from './StarRating'
import PlanoBadge from './PlanoBadge'

const EstabelecimentoCard = ({ 
  estabelecimento, 
  avaliacao = null,
  isFavorito = false,
  onToggleFavorito,
  showPlano = true
}) => {
  const navigate = useNavigate()

  // Verificar se está aberto agora
  const isAbertoAgora = () => {
    const agora = new Date()
    const diaAtual = agora.getDay()
    const horaAtual = agora.getHours() * 60 + agora.getMinutes()

    const horario = estabelecimento.horarios?.find(h => h.diaSemana === diaAtual)
    if (!horario) return false

    const [horaInicioH, horaInicioM] = horario.horaInicio.split(':').map(Number)
    const [horaFimH, horaFimM] = horario.horaFim.split(':').map(Number)
    
    const inicioMin = horaInicioH * 60 + horaInicioM
    const fimMin = horaFimH * 60 + horaFimM

    return horaAtual >= inicioMin && horaAtual <= fimMin
  }

  const aberto = isAbertoAgora()

  // Pegar próximo horário disponível (simulado - pode ser melhorado com API)
  const getProximoHorario = () => {
    if (aberto) return 'Disponível agora'
    return 'Próx: Amanhã 09:00'
  }

  return (
    <div 
      className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] cursor-pointer"
      onClick={() => navigate(`/estabelecimento/${estabelecimento.id}`)}
    >
      {/* Imagem de Capa */}
      <div className="relative h-48 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800 overflow-hidden">
        {estabelecimento.imagemCapa ? (
          <img 
            src={estabelecimento.imagemCapa} 
            alt={estabelecimento.nome}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <MapPin size={64} className="text-primary-600 dark:text-primary-400 opacity-50" />
          </div>
        )}

        {/* Overlay com gradiente */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

        {/* Badge de Status (Aberto/Fechado) */}
        <div className="absolute top-4 left-4">
          {aberto ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-500 text-white shadow-lg">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
              ABERTO AGORA
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-500 text-white shadow-lg">
              <Clock size={12} />
              FECHADO
            </span>
          )}
        </div>

        {/* Botão de Favorito */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onToggleFavorito?.()
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg transition-all duration-200 hover:scale-110"
        >
          <Heart 
            size={20} 
            className={`transition-colors ${isFavorito ? 'fill-red-500 text-red-500' : 'text-gray-600 dark:text-gray-400'}`}
          />
        </button>

        {/* Badge de Plano */}
        {showPlano && estabelecimento.plano && (
          <div className="absolute bottom-4 left-4">
            {estabelecimento.plano === 'PREMIUM' ? (
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold shadow-lg">
                <Crown size={12} />
                🔥 Destaque
              </div>
            ) : (
              <PlanoBadge plano={estabelecimento.plano} size="sm" />
            )}
          </div>
        )}
      </div>

      {/* Conteúdo */}
      <div className="p-5">
        {/* Cabeçalho */}
        <div className="mb-3">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1 line-clamp-1 group-hover:text-primary-600 transition-colors">
            {estabelecimento.nome}
          </h3>
          
          {/* Categoria e Avaliação */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="default" className="text-xs">
              {estabelecimento.categoria}
            </Badge>
            
            {avaliacao && avaliacao.total > 0 && (
              <div className="flex items-center gap-1">
                <Star size={14} className="fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {avaliacao.media.toFixed(1)}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  ({avaliacao.total})
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Endereço */}
        <div className="flex items-start gap-2 mb-3 text-sm text-gray-600 dark:text-gray-400">
          <MapPin size={16} className="flex-shrink-0 mt-0.5" />
          <span className="line-clamp-1">{estabelecimento.endereco}</span>
        </div>

        {/* Próximo Horário */}
        <div className="flex items-center gap-2 mb-4 text-sm">
          <Clock size={16} className="text-primary-600" />
          <span className={`font-medium ${aberto ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
            {getProximoHorario()}
          </span>
        </div>

        {/* Tags de Serviços Populares (simulado) */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {['Corte', 'Barba', 'Coloração'].slice(0, 3).map((servico, index) => (
            <span 
              key={index}
              className="px-2 py-1 text-xs rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            >
              {servico}
            </span>
          ))}
        </div>

        {/* Botão de Ação */}
        <Button 
          fullWidth 
          size="md"
          onClick={(e) => {
            e.stopPropagation()
            navigate(`/estabelecimento/${estabelecimento.id}`)
          }}
          className="group-hover:bg-primary-700 transition-colors"
        >
          Ver Detalhes e Agendar
          <TrendingUp size={16} />
        </Button>
      </div>
    </div>
  )
}

export default EstabelecimentoCard

