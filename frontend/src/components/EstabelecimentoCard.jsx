import { MapPin, Star, Clock, TrendingUp, Heart, Crown, Bug } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Badge from './Badge'
import Button from './Button'
import StarRating from './StarRating'
import PlanoBadge from './PlanoBadge'
import estabelecimentoService from '../services/estabelecimentoService'

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

  // Formatar horários de funcionamento
  const formatarHorarios = () => {
    if (!estabelecimento.horarios || estabelecimento.horarios.length === 0) {
      return 'Horários não informados'
    }

    const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
    const hoje = new Date().getDay()
    
    // Encontrar horário de hoje
    const horarioHoje = estabelecimento.horarios.find(h => h.diaSemana === hoje)
    
    if (horarioHoje) {
      return `${diasSemana[hoje]}: ${horarioHoje.horaInicio} - ${horarioHoje.horaFim}`
    }

    // Se não tem horário hoje, pegar o próximo
    const proximoHorario = estabelecimento.horarios
      .sort((a, b) => a.diaSemana - b.diaSemana)
      .find(h => h.diaSemana > hoje) || estabelecimento.horarios[0]

    const proximoDia = proximoHorario.diaSemana
    return `${diasSemana[proximoDia]}: ${proximoHorario.horaInicio} - ${proximoHorario.horaFim}`
  }

  // Pegar próximo horário disponível
  const getProximoHorario = () => {
    if (aberto) return 'Disponível agora'
    return formatarHorarios()
  }

  return (
    <div 
      className="group relative bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-smooth border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 sm:hover:-translate-y-2 cursor-pointer"
      onClick={() => navigate(`/estabelecimento/${estabelecimento.id}`)}
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-primary-500/10 group-hover:via-purple-500/10 group-hover:to-pink-500/10 rounded-2xl sm:rounded-3xl transition-all duration-500 pointer-events-none"></div>
      {/* Imagem de Capa com Logo */}
      <div className="relative h-40 sm:h-52 bg-gradient-to-br from-primary-100 via-purple-100 to-pink-100 dark:from-primary-900 dark:via-purple-900 dark:to-pink-900 overflow-hidden">
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

        {/* Debug Button - Mobile Only */}
        {window.innerWidth < 768 && (
          <button
            onClick={() => {
              const logs = [
                `🔍 Debug: ${estabelecimento.nome}`,
                `📱 Mobile: ${navigator.userAgent.includes('Mobile')}`,
                `🖼️ FotoPerfilUrl: ${estabelecimento.fotoPerfilUrl || 'Nenhuma'}`,
                `🔗 URL Railway: ${estabelecimento.fotoPerfilUrl ? estabelecimentoService.getImageUrl(estabelecimento.fotoPerfilUrl) : 'N/A'}`,
                `☁️ URL Cloudinary: ${estabelecimentoService.getCloudinaryUrl(estabelecimento.id, estabelecimento.nome) || 'N/A'}`
              ]
              alert(logs.join('\n'))
            }}
            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded text-xs z-20"
          >
            <Bug size={12} />
          </button>
        )}

        {/* Logo do Estabelecimento */}
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl overflow-hidden border-2 sm:border-3 border-white dark:border-gray-800 shadow-2xl ring-2 ring-primary-500/30 group-hover:scale-110 transition-transform duration-300 z-10">
          {/* Imagem principal */}
          <img 
            src={estabelecimentoService.getImageUrlWithFallback(estabelecimento.fotoPerfilUrl, estabelecimento.id, estabelecimento.nome)} 
            alt={`Logo ${estabelecimento.nome}`}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              console.error('❌ Erro ao carregar logo:', estabelecimento.fotoPerfilUrl);
              
              // Log para mobile debug
              if (window.innerWidth < 768) {
                console.log('📱 MOBILE DEBUG - Erro ao carregar imagem');
                console.log('📱 URL tentada:', e.target.src);
              }
              
              // Tentar URL do Cloudinary como fallback
              const cloudinaryUrl = estabelecimentoService.getCloudinaryUrl(estabelecimento.id, estabelecimento.nome);
              if (cloudinaryUrl) {
                console.log('🔄 Tentando URL do Cloudinary:', cloudinaryUrl);
                if (window.innerWidth < 768) {
                  console.log('📱 MOBILE DEBUG - Tentando Cloudinary:', cloudinaryUrl);
                }
                e.target.src = cloudinaryUrl;
              } else {
                console.log('❌ Sem URL do Cloudinary disponível');
                if (window.innerWidth < 768) {
                  console.log('📱 MOBILE DEBUG - Sem Cloudinary, mostrando fallback');
                }
                // Mostrar fallback visual
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }
            }}
            onLoad={(e) => {
              console.log('✅ Logo carregada com sucesso!');
              console.log('✅ URL usada:', e.target.src);
              
              // Log para mobile debug
              if (window.innerWidth < 768) {
                console.log('📱 MOBILE DEBUG - Imagem carregada com sucesso!');
              }
              
              // Esconder fallback quando imagem carrega
              e.target.nextSibling.style.display = 'none';
            }}
          />
          {/* Fallback visual */}
          <div className="w-full h-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs" style={{display: 'none'}}>
            {estabelecimento.nome.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* Overlay com gradiente */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

        {/* Badge de Status (Aberto/Fechado) */}
        <div className="absolute top-3 right-16 sm:top-4 sm:right-20">
          {aberto ? (
            <span className="inline-flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl text-xs font-bold glass-strong border-2 border-green-500/50 text-green-700 dark:text-green-300 shadow-lg backdrop-blur-md">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></span>
              <span className="hidden sm:inline">ABERTO</span>
              <span className="sm:hidden">ABR</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl text-xs font-bold glass-strong border-2 border-gray-500/50 text-gray-700 dark:text-gray-300 shadow-lg backdrop-blur-md">
              <Clock size={10} />
              <span className="hidden sm:inline">FECHADO</span>
              <span className="sm:hidden">FCH</span>
            </span>
          )}
        </div>

        {/* Botão de Favorito */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onToggleFavorito?.()
          }}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 sm:p-2.5 rounded-lg sm:rounded-xl glass-strong border-2 border-white/30 dark:border-gray-700/30 shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95"
        >
          <Heart 
            size={16} 
            className={`transition-all duration-300 ${isFavorito ? 'fill-red-500 text-red-500 scale-110' : 'text-gray-600 dark:text-gray-400'}`}
          />
        </button>

        {/* Badge de Plano */}
        {showPlano && estabelecimento.plano && (
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4">
            {estabelecimento.plano === 'PREMIUM' ? (
              <div className="flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white text-xs font-black shadow-2xl animate-gradient border-2 border-white/30 backdrop-blur-sm">
                <Crown size={12} className="drop-shadow-lg" />
                <span className="drop-shadow-lg hidden sm:inline">PREMIUM</span>
                <span className="drop-shadow-lg sm:hidden">PRO</span>
              </div>
            ) : (
              <PlanoBadge plano={estabelecimento.plano} size="sm" />
            )}
          </div>
        )}
      </div>

      {/* Conteúdo */}
      <div className="relative p-4 sm:p-6">
        {/* Cabeçalho */}
        <div className="mb-3 sm:mb-4">
          <h3 className="font-display font-black text-lg sm:text-xl text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:bg-gradient-to-r group-hover:from-primary-600 group-hover:via-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
            {estabelecimento.nome}
          </h3>
          
          {/* Categoria e Avaliação */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="primary" size="sm">
              {estabelecimento.categoria}
            </Badge>
            
            {avaliacao && avaliacao.total > 0 && (
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg glass">
                <Star size={12} className="fill-yellow-400 text-yellow-400 drop-shadow-sm" />
                <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                  {avaliacao.media.toFixed(1)}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  ({avaliacao.total})
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Endereço */}
        <div className="flex items-start gap-2 mb-2 sm:mb-3 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          <MapPin size={14} className="flex-shrink-0 mt-0.5" />
          <span className="line-clamp-1">{estabelecimento.endereco}</span>
        </div>

        {/* Próximo Horário */}
        <div className="flex items-center gap-2 mb-3 sm:mb-4 text-xs sm:text-sm">
          <Clock size={14} className="text-primary-600" />
          <span className={`font-medium ${aberto ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
            {getProximoHorario()}
          </span>
        </div>

        {/* Tags de Serviços Populares (simulado) */}
        <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-3 sm:mb-4">
          {['Corte', 'Barba', 'Coloração'].slice(0, 3).map((servico, index) => (
            <span 
              key={index}
              className="px-1.5 py-0.5 sm:px-2 sm:py-1 text-xs rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            >
              {servico}
            </span>
          ))}
        </div>

        {/* Botão de Ação */}
        <Button 
          fullWidth 
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            navigate(`/estabelecimento/${estabelecimento.id}`)
          }}
          className="shadow-lg shadow-primary-500/30 group-hover:shadow-2xl group-hover:shadow-primary-500/50"
        >
          <span className="hidden sm:inline">Ver Detalhes e Agendar</span>
          <span className="sm:hidden">Ver Detalhes</span>
          <TrendingUp size={14} className="group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  )
}

export default EstabelecimentoCard

