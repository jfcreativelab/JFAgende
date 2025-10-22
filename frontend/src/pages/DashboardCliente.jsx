import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, LogOut, MapPin, Calendar, User, Clock, Heart, Star, TrendingUp, Settings, Filter, X, DollarSign, Sparkles, Store, Inbox } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useNotifications } from '../hooks/useNotifications'
import ThemeToggle from '../components/ThemeToggle'
import NotificationCenter from '../components/NotificationCenter'
import MobileBottomNav from '../components/MobileBottomNav'
import ResponsiveSidebar from '../components/ResponsiveSidebar'
import AdvancedSearch from '../components/AdvancedSearch'
import estabelecimentoService from '../services/estabelecimentoService'
import clienteService from '../services/clienteService'
import favoritoService from '../services/favoritoService'
import avaliacaoService from '../services/avaliacaoService'
import Button from '../components/Button'
import Input from '../components/Input'
import Card from '../components/Card'
import Badge from '../components/Badge'
import Loading from '../components/Loading'
import Select from '../components/Select'
import StarRating from '../components/StarRating'
import SkeletonCard from '../components/SkeletonCard'
import EmptyState from '../components/EmptyState'

const DashboardCliente = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { notifications, marcarComoLida, marcarTodasComoLidas } = useNotifications()
  
  const [estabelecimentos, setEstabelecimentos] = useState([])
  const [agendamentos, setAgendamentos] = useState([])
  const [favoritos, setFavoritos] = useState([])
  const [avaliacoesMap, setAvaliacoesMap] = useState({})
  const [loading, setLoading] = useState(true)
  const [abaAtiva, setAbaAtiva] = useState('todos')
  const [filtros, setFiltros] = useState({
    nome: '',
    categoria: '',
    ordenacao: 'relevancia',
    precoMin: '',
    precoMax: '',
    avaliacaoMin: '',
    disponivelAgora: false,
    mostrarFavoritos: false
  })

  const [mostrarFiltrosAvancados, setMostrarFiltrosAvancados] = useState(false)

  const categorias = [
    { value: '', label: 'Todas as categorias' },
    { value: 'barbearia', label: 'Barbearia' },
    { value: 'salao', label: 'Salão de Beleza' },
    { value: 'spa', label: 'Spa' },
    { value: 'manicure', label: 'Manicure/Pedicure' },
    { value: 'depilacao', label: 'Depilação' },
    { value: 'estetica', label: 'Estética' },
    { value: 'bronze', label: 'Bronzeamento' },
    { value: 'ozonioterapia', label: 'Ozonioterapia' },
  ]

  const opcoesOrdenacao = [
    { value: 'relevancia', label: '📍 Mais Relevantes' },
    { value: 'avaliacao', label: '⭐ Melhor Avaliados' },
    { value: 'nome', label: '🔤 Nome (A-Z)' },
    { value: 'preco', label: '💰 Menor Preço' },
  ]

  const opcoesAvaliacao = [
    { value: '', label: 'Qualquer avaliação' },
    { value: '4', label: '⭐ 4+ estrelas' },
    { value: '4.5', label: '⭐ 4.5+ estrelas' },
    { value: '5', label: '⭐ 5 estrelas' },
  ]

  useEffect(() => {
    carregarDados()
  }, [filtros])

  const carregarDados = async () => {
    try {
      const [estabelecimentosData, agendamentosData, favoritosData] = await Promise.all([
        estabelecimentoService.getAll({ nome: filtros.nome, categoria: filtros.categoria }),
        clienteService.getAgendamentos(user.id),
        favoritoService.getAll().catch(() => [])
      ])
      
      // Carregar avaliações para cada estabelecimento
      const avaliacoesPromises = estabelecimentosData.map(est => 
        avaliacaoService.getByEstabelecimento(est.id).catch(() => ({ media: 0, total: 0 }))
      )
      const avaliacoesResults = await Promise.all(avaliacoesPromises)
      
      const avaliacoesMapData = {}
      estabelecimentosData.forEach((est, index) => {
        avaliacoesMapData[est.id] = avaliacoesResults[index]
      })
      
      // Filtrar e ordenar estabelecimentos
      let estabelecimentosFiltrados = [...estabelecimentosData]
      
      // Filtro de avaliação mínima
      if (filtros.avaliacaoMin) {
        const minAvaliacao = parseFloat(filtros.avaliacaoMin)
        estabelecimentosFiltrados = estabelecimentosFiltrados.filter(est => 
          (avaliacoesMapData[est.id]?.media || 0) >= minAvaliacao
        )
      }
      
      // Filtro de preço (busca no menor preço dos serviços)
      if (filtros.precoMin || filtros.precoMax) {
        estabelecimentosFiltrados = estabelecimentosFiltrados.filter(est => {
          if (!est.servicos || est.servicos.length === 0) return false
          const menorPreco = Math.min(...est.servicos.map(s => s.preco))
          const min = filtros.precoMin ? parseFloat(filtros.precoMin) : 0
          const max = filtros.precoMax ? parseFloat(filtros.precoMax) : Infinity
          return menorPreco >= min && menorPreco <= max
        })
      }
      
      // Filtro de favoritos
      if (filtros.mostrarFavoritos) {
        const favoritosIds = favoritosData.map(f => f.estabelecimentoId)
        estabelecimentosFiltrados = estabelecimentosFiltrados.filter(est => 
          favoritosIds.includes(est.id)
        )
      }
      
      // Filtro "Disponível agora" (aberto agora)
      if (filtros.disponivelAgora) {
        estabelecimentosFiltrados = estabelecimentosFiltrados.filter(est => {
          if (!est.horarios || est.horarios.length === 0) return false
          const agora = new Date()
          const diaAtual = agora.getDay()
          const horaAtual = agora.getHours() * 60 + agora.getMinutes()
          
          const horario = est.horarios.find(h => h.diaSemana === diaAtual)
          if (!horario) return false
          
          const [horaInicioH, horaInicioM] = horario.horaInicio.split(':').map(Number)
          const [horaFimH, horaFimM] = horario.horaFim.split(':').map(Number)
          const inicioMin = horaInicioH * 60 + horaInicioM
          const fimMin = horaFimH * 60 + horaFimM
          
          return horaAtual >= inicioMin && horaAtual <= fimMin
        })
      }
      
      // Ordenar estabelecimentos
      let estabelecimentosOrdenados = [...estabelecimentosFiltrados]
      if (filtros.ordenacao === 'avaliacao') {
        estabelecimentosOrdenados.sort((a, b) => 
          (avaliacoesMapData[b.id]?.media || 0) - (avaliacoesMapData[a.id]?.media || 0)
        )
      } else if (filtros.ordenacao === 'nome') {
        estabelecimentosOrdenados.sort((a, b) => a.nome.localeCompare(b.nome))
      } else if (filtros.ordenacao === 'preco') {
        estabelecimentosOrdenados.sort((a, b) => {
          const precoA = a.servicos?.length > 0 ? Math.min(...a.servicos.map(s => s.preco)) : Infinity
          const precoB = b.servicos?.length > 0 ? Math.min(...b.servicos.map(s => s.preco)) : Infinity
          return precoA - precoB
        })
      } else if (filtros.ordenacao === 'relevancia') {
        // Ordenação por relevância (combina avaliação + número de avaliações)
        estabelecimentosOrdenados.sort((a, b) => {
          const scoreA = (avaliacoesMapData[a.id]?.media || 0) * Math.log(avaliacoesMapData[a.id]?.total + 1 || 1)
          const scoreB = (avaliacoesMapData[b.id]?.media || 0) * Math.log(avaliacoesMapData[b.id]?.total + 1 || 1)
          return scoreB - scoreA
        })
      }
      
      setEstabelecimentos(estabelecimentosOrdenados)
      setAgendamentos(agendamentosData)
      setFavoritos(favoritosData)
      setAvaliacoesMap(avaliacoesMapData)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const getStatusColor = (status) => {
    const colors = {
      PENDENTE: 'warning',
      CONFIRMADO: 'success',
      CANCELADO: 'danger',
      CONCLUIDO: 'default'
    }
    return colors[status] || 'default'
  }

  const formatData = (data) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return <Loading fullScreen />
  }

  const handleAdvancedSearch = (searchData) => {
    console.log('Busca avançada:', searchData)
    // Implementar lógica de busca avançada
    setFiltros(prev => ({
      ...prev,
      ...searchData.filters,
      nome: searchData.term
    }))
  }

  const handleFilterChange = (newFilters) => {
    setFiltros(prev => ({ ...prev, ...newFilters }))
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar Responsiva */}
      <ResponsiveSidebar />

      {/* Conteúdo Principal */}
      <div className="md:ml-64">
        {/* Header Mobile */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 md:hidden">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="font-display text-xl font-bold text-primary-600">
                JFAgende
              </h1>
              <div className="flex items-center gap-2">
                <NotificationCenter 
                  notifications={notifications}
                  onMarkAsRead={marcarComoLida}
                  onMarkAllAsRead={marcarTodasComoLidas}
                />
                <ThemeToggle />
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-4 sm:py-6 md:py-8">
          <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {/* Coluna Principal - Estabelecimentos */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                  Encontre Estabelecimentos
                </h2>

                {/* Busca Avançada */}
                <div className="mb-4 sm:mb-6">
                  <AdvancedSearch
                    onSearch={handleAdvancedSearch}
                    onFilterChange={handleFilterChange}
                    initialFilters={filtros}
                  />
                </div>

                {/* Filtros Rápidos */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <button
                    onClick={() => setFiltros({ ...filtros, disponivelAgora: !filtros.disponivelAgora })}
                    className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                      filtros.disponivelAgora
                        ? 'bg-green-500 text-white shadow-md'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <Clock className="inline mr-1" size={14} />
                    <span className="hidden sm:inline">Aberto Agora</span>
                    <span className="sm:hidden">Aberto</span>
                  </button>
                  
                  <button
                    onClick={() => setFiltros({ ...filtros, mostrarFavoritos: !filtros.mostrarFavoritos })}
                    className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                      filtros.mostrarFavoritos
                          ? 'bg-red-500 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Heart className="inline mr-1" size={14} />
                      <span className="hidden sm:inline">Favoritos</span>
                      <span className="sm:hidden">Fav</span>
                    </button>
                    
                    <button
                      onClick={() => setMostrarFiltrosAvancados(!mostrarFiltrosAvancados)}
                      className="px-4 py-2 rounded-lg text-sm font-medium bg-primary-500 text-white hover:bg-primary-600 transition-all"
                    >
                      <Filter className="inline mr-1" size={14} />
                      <span className="hidden sm:inline">Filtros Avançados</span>
                      <span className="sm:hidden">Filtros</span>
                      {(filtros.precoMin || filtros.precoMax || filtros.avaliacaoMin) && (
                        <span className="ml-2 px-2 py-0.5 bg-white text-primary-600 rounded-full text-xs font-bold">
                          {[filtros.precoMin, filtros.precoMax, filtros.avaliacaoMin].filter(Boolean).length}
                        </span>
                      )}
                    </button>
                  </div>

                  {/* Filtros Avançados (Expansível) */}
                  {mostrarFiltrosAvancados && (
                    <div className="border-t border-gray-200 pt-4 animate-fade-in">
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <DollarSign className="inline" size={14} /> Preço Mínimo
                          </label>
                          <Input
                            type="number"
                            placeholder="R$ 0"
                            value={filtros.precoMin}
                            onChange={(e) => setFiltros({ ...filtros, precoMin: e.target.value })}
                            min="0"
                            step="10"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <DollarSign className="inline" size={14} /> Preço Máximo
                          </label>
                          <Input
                            type="number"
                            placeholder="R$ 500"
                            value={filtros.precoMax}
                            onChange={(e) => setFiltros({ ...filtros, precoMax: e.target.value })}
                            min="0"
                            step="10"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Star className="inline" size={14} /> Avaliação Mínima
                          </label>
                          <Select
                            options={opcoesAvaliacao}
                            value={filtros.avaliacaoMin}
                            onChange={(e) => setFiltros({ ...filtros, avaliacaoMin: e.target.value })}
                          />
                        </div>
                      </div>
                      
                      <div className="mt-4 flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setFiltros({
                              ...filtros,
                              precoMin: '',
                              precoMax: '',
                              avaliacaoMin: '',
                              disponivelAgora: false,
                              mostrarFavoritos: false
                            })
                          }}
                        >
                          <X size={16} />
                          Limpar Filtros
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Contador de Resultados */}
                  <div className="flex items-center justify-between text-sm text-gray-600 border-t border-gray-200 pt-3">
                    <div className="flex items-center gap-2">
                      <Sparkles size={16} className="text-primary-600" />
                      <span>
                        <strong className="text-gray-900">{estabelecimentos.length}</strong> estabelecimento(s) encontrado(s)
                      </span>
                    </div>
                    
                    {(filtros.nome || filtros.categoria || filtros.precoMin || filtros.precoMax || filtros.avaliacaoMin || filtros.disponivelAgora || filtros.mostrarFavoritos) && (
                      <button
                        onClick={() => setFiltros({
                          nome: '',
                          categoria: '',
                          ordenacao: 'relevancia',
                          precoMin: '',
                          precoMax: '',
                          avaliacaoMin: '',
                          disponivelAgora: false,
                          mostrarFavoritos: false
                        })}
                        className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                      >
                        <X size={14} />
                        Remover todos os filtros
                      </button>
                    )}
                  </div>
                </div>

              {/* Lista de Estabelecimentos */}
              <div className="grid gap-4">
                {loading ? (
                  <SkeletonCard variant="estabelecimento" count={3} />
                ) : estabelecimentos.length === 0 ? (
                  <EmptyState
                    icon={Store}
                    title="Nenhum estabelecimento encontrado"
                    description="Tente ajustar os filtros ou remova alguns critérios de busca para ver mais resultados."
                    illustration={true}
                  />
                ) : (
                  estabelecimentos.map((estabelecimento) => (
                    <Card
                      key={estabelecimento.id}
                      hoverable
                      onClick={() => navigate(`/estabelecimento/${estabelecimento.id}`)}
                      className="cursor-pointer"
                    >
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-24 h-24 bg-gradient-to-br from-primary-100 via-purple-100 to-pink-100 dark:from-primary-900 dark:via-purple-900 dark:to-pink-900 rounded-xl flex items-center justify-center overflow-hidden shadow-md">
                          {estabelecimento.fotoPerfilUrl ? (
                            <img 
                              src={estabelecimento.fotoPerfilUrl}
                              alt={estabelecimento.nome}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.style.display = 'none';
                              }}
                            />
                          ) : estabelecimento.imagemCapa ? (
                            <img 
                              src={estabelecimento.imagemCapa} 
                              alt={estabelecimento.nome}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <MapPin className="text-primary-600 dark:text-primary-400" size={32} />
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-bold text-lg text-gray-900">
                                {estabelecimento.nome}
                              </h3>
                              <Badge variant="primary" size="sm">
                                {estabelecimento.categoria}
                              </Badge>
                            </div>
                          </div>
                          
                          {estabelecimento.descricao && (
                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                              {estabelecimento.descricao}
                            </p>
                          )}
                          
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <MapPin size={16} />
                            <span>{estabelecimento.endereco}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Meus Agendamentos */}
          <div className="space-y-4 sm:space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  Meus Agendamentos
                </h2>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate('/cliente/historico')}
                  className="text-xs sm:text-sm"
                >
                  <span className="hidden sm:inline">Ver Todos</span>
                  <span className="sm:hidden">Todos</span>
                </Button>
              </div>

              <div className="space-y-4">
                {loading ? (
                  <SkeletonCard variant="agendamento" count={3} />
                ) : agendamentos.length === 0 ? (
                  <EmptyState
                    icon={Inbox}
                    title="Sem agendamentos"
                    description="Você ainda não tem nenhum agendamento. Encontre um estabelecimento e agende seu primeiro horário!"
                    size="small"
                  />
                ) : (
                  agendamentos.slice(0, 5).map((agendamento) => (
                    <Card key={agendamento.id} padding="sm">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <h4 className="font-semibold text-sm text-gray-900">
                            {agendamento.estabelecimento.nome}
                          </h4>
                          <Badge variant={getStatusColor(agendamento.status)} size="sm">
                            {agendamento.status}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-gray-600">
                          {agendamento.servico.nome}
                        </p>
                        
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Calendar size={14} />
                          <span>{formatData(agendamento.dataHora)}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Clock size={14} />
                          <span>{agendamento.servico.duracaoMin} min</span>
                          <span className="ml-auto font-semibold text-primary-600">
                            R$ {agendamento.servico.preco.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  )
}

export default DashboardCliente

