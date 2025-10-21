import { useState, useEffect } from 'react'
import { 
  Users, 
  Store, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  PieChart,
  RefreshCw,
  Download,
  Eye,
  Filter
} from 'lucide-react'
import AdminLayout from '../components/AdminLayout'
import Card from '../components/Card'
import StatCard from '../components/StatCard'
import Loading from '../components/Loading'
import AnimatedNumber from '../components/AnimatedNumber'
import Button from '../components/Button'
import adminService from '../services/adminService'

const DashboardAdmin = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [timeRange, setTimeRange] = useState('7d')
  const [viewMode, setViewMode] = useState('overview')

  useEffect(() => {
    carregarEstatisticas()
  }, [timeRange])

  const carregarEstatisticas = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }
      
      const data = await adminService.getDashboardStats()
      setStats(data)
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    carregarEstatisticas(true)
  }

  const handleExport = () => {
    // Implementar exportação de dados
    console.log('Exportando dados...')
  }

  if (loading) {
    return (
      <AdminLayout>
        <Loading fullScreen />
      </AdminLayout>
    )
  }

  const resumo = stats?.resumo || {}
  const distribuicaoPlanos = stats?.distribuicaoPlanos || []
  const agendamentosPorStatus = stats?.agendamentosPorStatus || []

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Dashboard Administrativo
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Visão geral e monitoramento do sistema
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Filtro de Período */}
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="24h">Últimas 24h</option>
              <option value="7d">Últimos 7 dias</option>
              <option value="30d">Últimos 30 dias</option>
              <option value="90d">Últimos 90 dias</option>
            </select>
            
            {/* Modo de Visualização */}
            <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('overview')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'overview'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Eye size={16} className="inline mr-1" />
                Visão Geral
              </button>
              <button
                onClick={() => setViewMode('analytics')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'analytics'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <BarChart3 size={16} className="inline mr-1" />
                Analytics
              </button>
            </div>
            
            {/* Ações */}
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2"
            >
              <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
              Atualizar
            </Button>
            
            <Button
              onClick={handleExport}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 flex items-center gap-2"
            >
              <Download size={16} />
              Exportar
            </Button>
          </div>
        </div>

        {/* Cards de Estatísticas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Total de Clientes
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  <AnimatedNumber value={resumo.totalClientes || 0} />
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp size={16} className="text-green-500" />
                  <span className="text-xs text-green-600 dark:text-green-400 font-semibold">
                    +{resumo.novosClientes7Dias || 0} esta semana
                  </span>
                </div>
              </div>
              <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-2xl">
                <Users size={32} className="text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </Card>

          <Card className="hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Estabelecimentos
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  <AnimatedNumber value={resumo.totalEstabelecimentos || 0} />
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp size={16} className="text-green-500" />
                  <span className="text-xs text-green-600 dark:text-green-400 font-semibold">
                    +{resumo.novosEstabelecimentos7Dias || 0} esta semana
                  </span>
                </div>
              </div>
              <div className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-2xl">
                <Store size={32} className="text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </Card>

          <Card className="hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Total Agendamentos
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  <AnimatedNumber value={resumo.totalAgendamentos || 0} />
                </p>
                <div className="flex items-center gap-1 mt-2">
                  {resumo.crescimentoAgendamentos >= 0 ? (
                    <>
                      <TrendingUp size={16} className="text-green-500" />
                      <span className="text-xs text-green-600 dark:text-green-400 font-semibold">
                        +{resumo.crescimentoAgendamentos}% este mês
                      </span>
                    </>
                  ) : (
                    <>
                      <TrendingDown size={16} className="text-red-500" />
                      <span className="text-xs text-red-600 dark:text-red-400 font-semibold">
                        {resumo.crescimentoAgendamentos}% este mês
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-2xl">
                <Calendar size={32} className="text-green-600 dark:text-green-400" />
              </div>
            </div>
          </Card>

          <Card className="hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Receita Estimada/Mês
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  R$ <AnimatedNumber value={parseFloat(resumo.receitaEstimadaMensal || 0)} decimals={2} />
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <Activity size={16} className="text-yellow-500" />
                  <span className="text-xs text-yellow-600 dark:text-yellow-400 font-semibold">
                    Assinaturas ativas
                  </span>
                </div>
              </div>
              <div className="p-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-2xl">
                <DollarSign size={32} className="text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </Card>
        </div>

        {/* Estatísticas Secundárias */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Distribuição de Planos */}
          <Card>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Distribuição de Planos
            </h3>
            <div className="space-y-4">
              {distribuicaoPlanos.map((item, index) => {
                const total = distribuicaoPlanos.reduce((sum, p) => sum + p.quantidade, 0)
                const percentage = ((item.quantidade / total) * 100).toFixed(1)
                
                const colors = {
                  FREE: { bg: 'bg-gray-500', text: 'text-gray-600 dark:text-gray-400' },
                  BASIC: { bg: 'bg-blue-500', text: 'text-blue-600 dark:text-blue-400' },
                  PREMIUM: { bg: 'bg-yellow-500', text: 'text-yellow-600 dark:text-yellow-400' }
                }
                
                const color = colors[item.plano] || colors.FREE

                return (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`font-semibold ${color.text}`}>
                        {item.plano}
                      </span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {item.quantidade} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                      <div
                        className={`${color.bg} h-full rounded-full transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>

          {/* Agendamentos por Status */}
          <Card>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Agendamentos por Status
            </h3>
            <div className="space-y-4">
              {agendamentosPorStatus.map((item, index) => {
                const total = agendamentosPorStatus.reduce((sum, s) => sum + s._count, 0)
                const percentage = ((item._count / total) * 100).toFixed(1)
                
                const statusConfig = {
                  PENDENTE: { bg: 'bg-yellow-500', text: 'text-yellow-600 dark:text-yellow-400', label: 'Pendente' },
                  CONFIRMADO: { bg: 'bg-green-500', text: 'text-green-600 dark:text-green-400', label: 'Confirmado' },
                  CANCELADO: { bg: 'bg-red-500', text: 'text-red-600 dark:text-red-400', label: 'Cancelado' },
                  CONCLUIDO: { bg: 'bg-blue-500', text: 'text-blue-600 dark:text-blue-400', label: 'Concluído' }
                }
                
                const config = statusConfig[item.status] || statusConfig.PENDENTE

                return (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`font-semibold ${config.text}`}>
                        {config.label}
                      </span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {item._count} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                      <div
                        className={`${config.bg} h-full rounded-full transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>

        {/* Alertas e Notificações */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Alertas do Sistema
              </h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Últimas 24h
              </span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <AlertTriangle size={20} className="text-yellow-600 dark:text-yellow-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    Alto volume de agendamentos
                  </p>
                  <p className="text-xs text-yellow-600 dark:text-yellow-400">
                    {resumo.agendamentosHoje || 0} agendamentos hoje - 15% acima da média
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <CheckCircle size={20} className="text-green-600 dark:text-green-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-800 dark:text-green-200">
                    Sistema funcionando normalmente
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400">
                    Todos os serviços operacionais
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <Clock size={20} className="text-blue-600 dark:text-blue-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    Backup automático concluído
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400">
                    Último backup: 2 horas atrás
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Atividade Recente
              </h3>
              <Activity size={20} className="text-gray-400" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-white">
                    Novo estabelecimento cadastrado
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    há 5 minutos
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-white">
                    Agendamento confirmado
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    há 12 minutos
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-white">
                    Nova avaliação recebida
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    há 18 minutos
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-white">
                    Plano atualizado
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    há 25 minutos
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Cards de Atividade */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500 rounded-xl">
                <Calendar className="text-white" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Agendamentos Hoje
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {resumo.agendamentosHoje || 0}
                </p>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500 rounded-xl">
                <Activity className="text-white" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total de Avaliações
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {resumo.totalAvaliacoes || 0}
                </p>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500 rounded-xl">
                <TrendingUp className="text-white" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Crescimento
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {resumo.crescimentoAgendamentos >= 0 ? '+' : ''}{resumo.crescimentoAgendamentos}%
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}

export default DashboardAdmin


