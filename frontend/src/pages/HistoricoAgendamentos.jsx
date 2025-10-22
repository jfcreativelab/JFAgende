import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar, Clock, MapPin, Package, DollarSign, Filter, X, Download, RefreshCw, Star, TrendingUp, Award, History } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import clienteService from '../services/clienteService'
import avaliacaoService from '../services/avaliacaoService'
import Button from '../components/Button'
import Card from '../components/Card'
import Badge from '../components/Badge'
import Loading from '../components/Loading'
import Select from '../components/Select'
import EmptyState from '../components/EmptyState'
import SkeletonCard from '../components/SkeletonCard'
import Toast from '../components/Toast'

const HistoricoAgendamentos = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const [agendamentos, setAgendamentos] = useState([])
  const [agendamentosFiltrados, setAgendamentosFiltrados] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const [filtros, setFiltros] = useState({
    status: '',
    periodo: 'todos',
    ordenacao: 'recente'
  })
  const [estatisticas, setEstatisticas] = useState({
    total: 0,
    concluidos: 0,
    cancelados: 0,
    totalGasto: 0,
    estabelecimentoFavorito: null
  })

  const opcoesStatus = [
    { value: '', label: 'Todos os status' },
    { value: 'PENDENTE', label: '⏳ Pendentes' },
    { value: 'CONFIRMADO', label: '✅ Confirmados' },
    { value: 'CONCLUIDO', label: '✔️ Concluídos' },
    { value: 'CANCELADO', label: '❌ Cancelados' },
  ]

  const opcoesPeriodo = [
    { value: 'todos', label: 'Todo o período' },
    { value: 'mes', label: 'Último mês' },
    { value: '3meses', label: 'Últimos 3 meses' },
    { value: 'ano', label: 'Último ano' },
  ]

  const opcoesOrdenacao = [
    { value: 'recente', label: 'Mais recentes' },
    { value: 'antigo', label: 'Mais antigos' },
    { value: 'valor', label: 'Maior valor' },
    { value: 'alfabetico', label: 'Estabelecimento (A-Z)' },
  ]

  useEffect(() => {
    carregarAgendamentos()
  }, [])

  useEffect(() => {
    aplicarFiltros()
  }, [filtros, agendamentos])

  const carregarAgendamentos = async () => {
    try {
      const data = await clienteService.getAgendamentos(user.id)
      setAgendamentos(data)
      calcularEstatisticas(data)
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error)
      setToast({ type: 'error', message: 'Erro ao carregar histórico' })
    } finally {
      setLoading(false)
    }
  }

  const calcularEstatisticas = (data) => {
    const total = data.length
    const concluidos = data.filter(a => a.status === 'CONCLUIDO').length
    const cancelados = data.filter(a => a.status === 'CANCELADO').length
    
    const totalGasto = data
      .filter(a => a.status === 'CONCLUIDO')
      .reduce((sum, a) => sum + (a.servico?.preco || 0), 0)

    // Estabelecimento favorito (mais visitado)
    const estabelecimentos = {}
    data.forEach(a => {
      const nome = a.estabelecimento?.nome
      if (nome) {
        estabelecimentos[nome] = (estabelecimentos[nome] || 0) + 1
      }
    })

    const estabelecimentoFavorito = Object.keys(estabelecimentos).length > 0
      ? Object.keys(estabelecimentos).reduce((a, b) => 
          estabelecimentos[a] > estabelecimentos[b] ? a : b
        )
      : null

    setEstatisticas({
      total,
      concluidos,
      cancelados,
      totalGasto,
      estabelecimentoFavorito
    })
  }

  const aplicarFiltros = () => {
    let resultado = [...agendamentos]

    // Filtro por status
    if (filtros.status) {
      resultado = resultado.filter(a => a.status === filtros.status)
    }

    // Filtro por período
    if (filtros.periodo !== 'todos') {
      const agora = new Date()
      const dataLimite = new Date()
      
      switch (filtros.periodo) {
        case 'mes':
          dataLimite.setMonth(agora.getMonth() - 1)
          break
        case '3meses':
          dataLimite.setMonth(agora.getMonth() - 3)
          break
        case 'ano':
          dataLimite.setFullYear(agora.getFullYear() - 1)
          break
      }

      resultado = resultado.filter(a => new Date(a.dataHora) >= dataLimite)
    }

    // Ordenação
    switch (filtros.ordenacao) {
      case 'recente':
        resultado.sort((a, b) => new Date(b.dataHora) - new Date(a.dataHora))
        break
      case 'antigo':
        resultado.sort((a, b) => new Date(a.dataHora) - new Date(b.dataHora))
        break
      case 'valor':
        resultado.sort((a, b) => (b.servico?.preco || 0) - (a.servico?.preco || 0))
        break
      case 'alfabetico':
        resultado.sort((a, b) => 
          (a.estabelecimento?.nome || '').localeCompare(b.estabelecimento?.nome || '')
        )
        break
    }

    setAgendamentosFiltrados(resultado)
  }

  const handleReagendar = (agendamento) => {
    navigate(`/estabelecimento/${agendamento.estabelecimentoId}`)
  }

  const handleAvaliar = async (agendamentoId) => {
    // TODO: Abrir modal de avaliação
    setToast({ type: 'info', message: 'Modal de avaliação em breve!' })
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDENTE': return '⏳'
      case 'CONFIRMADO': return '✅'
      case 'CONCLUIDO': return '✔️'
      case 'CANCELADO': return '❌'
      default: return '📅'
    }
  }

  const formatData = (data) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDataCurta = (data) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short'
    })
  }

  const limparFiltros = () => {
    setFiltros({
      status: '',
      periodo: 'todos',
      ordenacao: 'recente'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50">
          <Toast 
            type={toast.type} 
            message={toast.message}
            onClose={() => setToast(null)}
          />
        </div>
      )}

      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate('/cliente/dashboard')}
            >
              <ArrowLeft size={20} />
              Voltar
            </Button>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={carregarAgendamentos}>
                <RefreshCw size={16} />
                Atualizar
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Cabeçalho */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <History className="text-primary-600" size={32} />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Histórico de Agendamentos
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Acompanhe todos os seus agendamentos e estatísticas pessoais
          </p>
        </div>

        {/* Estatísticas Pessoais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-primary-100 dark:bg-primary-900/20 rounded-full -mr-10 -mt-10"></div>
            <div className="relative">
              <Calendar className="text-primary-600 mb-2" size={24} />
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Agendamentos</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {estatisticas.total}
              </p>
            </div>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full -mr-10 -mt-10"></div>
            <div className="relative">
              <Award className="text-green-600 mb-2" size={24} />
              <p className="text-sm text-gray-600 dark:text-gray-400">Concluídos</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {estatisticas.concluidos}
              </p>
            </div>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-100 dark:bg-blue-900/20 rounded-full -mr-10 -mt-10"></div>
            <div className="relative">
              <DollarSign className="text-blue-600 mb-2" size={24} />
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Gasto</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                R$ {estatisticas.totalGasto.toFixed(2)}
              </p>
            </div>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-purple-100 dark:bg-purple-900/20 rounded-full -mr-10 -mt-10"></div>
            <div className="relative">
              <TrendingUp className="text-purple-600 mb-2" size={24} />
              <p className="text-sm text-gray-600 dark:text-gray-400">Favorito</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white truncate">
                {estatisticas.estabelecimentoFavorito || 'N/A'}
              </p>
            </div>
          </Card>
        </div>

        {/* Filtros */}
        <Card className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="text-primary-600" size={20} />
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">
              Filtros
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <Select
              label="Status"
              options={opcoesStatus}
              value={filtros.status}
              onChange={(e) => setFiltros({ ...filtros, status: e.target.value })}
            />

            <Select
              label="Período"
              options={opcoesPeriodo}
              value={filtros.periodo}
              onChange={(e) => setFiltros({ ...filtros, periodo: e.target.value })}
            />

            <Select
              label="Ordenação"
              options={opcoesOrdenacao}
              value={filtros.ordenacao}
              onChange={(e) => setFiltros({ ...filtros, ordenacao: e.target.value })}
            />
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong className="text-gray-900 dark:text-white">{agendamentosFiltrados.length}</strong> agendamento(s) encontrado(s)
            </p>

            {(filtros.status || filtros.periodo !== 'todos' || filtros.ordenacao !== 'recente') && (
              <Button variant="outline" size="sm" onClick={limparFiltros}>
                <X size={16} />
                Limpar Filtros
              </Button>
            )}
          </div>
        </Card>

        {/* Timeline de Agendamentos */}
        {loading ? (
          <SkeletonCard variant="agendamento" count={5} />
        ) : agendamentosFiltrados.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="Nenhum agendamento encontrado"
            description={
              filtros.status || filtros.periodo !== 'todos'
                ? 'Tente ajustar os filtros para ver mais resultados.'
                : 'Você ainda não tem nenhum agendamento. Encontre um estabelecimento e agende seu primeiro horário!'
            }
            actionLabel={!filtros.status && filtros.periodo === 'todos' ? 'Buscar Estabelecimentos' : undefined}
            onAction={!filtros.status && filtros.periodo === 'todos' ? () => navigate('/cliente/dashboard') : undefined}
            illustration={true}
          />
        ) : (
          <div className="space-y-4">
            {agendamentosFiltrados.map((agendamento, index) => (
              <Card key={agendamento.id} hoverable className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                <div className="flex gap-6">
                  {/* Logo do Estabelecimento */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gradient-to-br from-primary-100 via-purple-100 to-pink-100 dark:from-primary-900 dark:via-purple-900 dark:to-pink-900 flex items-center justify-center shadow-lg ring-2 ring-primary-500/30">
                      {agendamento.estabelecimento?.fotoPerfilUrl ? (
                        <img 
                          src={agendamento.estabelecimento.fotoPerfilUrl.startsWith('http') ? agendamento.estabelecimento.fotoPerfilUrl : `${import.meta.env.VITE_API_URL || 'https://jfagende-production.up.railway.app'}${agendamento.estabelecimento.fotoPerfilUrl}`}
                          alt={agendamento.estabelecimento.nome}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <MapPin className="text-primary-600 dark:text-primary-400" size={28} />
                      )}
                    </div>
                  </div>

                  {/* Linha Timeline */}
                  {index !== agendamentosFiltrados.length - 1 && (
                    <div className="absolute left-[74px] top-20 w-0.5 h-full bg-gray-200 dark:bg-gray-700"></div>
                  )}

                  {/* Conteúdo */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                            {agendamento.estabelecimento?.nome}
                          </h3>
                          <Badge variant={getStatusColor(agendamento.status)}>
                            {getStatusIcon(agendamento.status)} {agendamento.status}
                          </Badge>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          {agendamento.servico?.nome}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary-600">
                          R$ {agendamento.servico?.preco?.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {agendamento.servico?.duracaoMin} min
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <MapPin size={16} />
                        <span className="truncate">{agendamento.estabelecimento?.endereco}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Clock size={16} />
                        <span>{formatData(agendamento.dataHora)}</span>
                      </div>
                    </div>

                    {agendamento.observacoes && (
                      <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <strong>Observações:</strong> {agendamento.observacoes}
                        </p>
                      </div>
                    )}

                    {/* Ações */}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReagendar(agendamento)}
                      >
                        <RefreshCw size={16} />
                        Reagendar
                      </Button>

                      {agendamento.status === 'CONCLUIDO' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAvaliar(agendamento.id)}
                        >
                          <Star size={16} />
                          Avaliar
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default HistoricoAgendamentos


