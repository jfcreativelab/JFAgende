import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, TrendingUp, Calendar, DollarSign, Star, Users, Package, Award, Download } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import estatisticasService from '../services/estatisticasService'
import agendamentoService from '../services/agendamentoService'
import Button from '../components/Button'
import Card from '../components/Card'
import StatCard from '../components/StatCard'
import ProgressBar from '../components/ProgressBar'
import Loading from '../components/Loading'
import AnimatedNumber from '../components/AnimatedNumber'

const RelatoriosEstabelecimento = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const [estatisticas, setEstatisticas] = useState(null)
  const [agendamentos, setAgendamentos] = useState([])
  const [loading, setLoading] = useState(true)
  const [periodo, setPeriodo] = useState('mes')

  useEffect(() => {
    carregarDados()
  }, [])

  const carregarDados = async () => {
    try {
      console.log('[RELATORIOS] Carregando dados para user:', user)
      console.log('[RELATORIOS] User ID:', user.id)
      
      const [estatisticasData, agendamentosData] = await Promise.all([
        estatisticasService.get(),
        agendamentoService.getByEstabelecimento(user.id)
      ])
      
      console.log('[RELATORIOS] Estatísticas recebidas:', estatisticasData)
      console.log('[RELATORIOS] Agendamentos recebidos:', agendamentosData)
      
      setEstatisticas(estatisticasData)
      setAgendamentos(agendamentosData)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const calcularPercentuais = () => {
    if (!estatisticas || !estatisticas.agendamentosPorStatus) return {}
    
    const total = Object.values(estatisticas.agendamentosPorStatus).reduce((a, b) => a + b, 0)
    
    return {
      pendente: ((estatisticas.agendamentosPorStatus.PENDENTE || 0) / total * 100).toFixed(1),
      confirmado: ((estatisticas.agendamentosPorStatus.CONFIRMADO || 0) / total * 100).toFixed(1),
      concluido: ((estatisticas.agendamentosPorStatus.CONCLUIDO || 0) / total * 100).toFixed(1),
      cancelado: ((estatisticas.agendamentosPorStatus.CANCELADO || 0) / total * 100).toFixed(1),
    }
  }

  if (loading) {
    return <Loading fullScreen />
  }

  const percentuais = calcularPercentuais()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/estabelecimento/dashboard')}
          >
            <ArrowLeft size={20} />
            Voltar
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Título e Ações */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Relatórios e Estatísticas
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Acompanhe o desempenho do seu negócio
            </p>
          </div>

          <Button variant="outline">
            <Download size={18} />
            Exportar PDF
          </Button>
        </div>

        {/* Estatísticas Principais */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total de Agendamentos"
            value={<AnimatedNumber value={estatisticas?.totalAgendamentos || 0} />}
            icon={Calendar}
            color="primary"
            trend={estatisticas?.crescimentoMensal > 0 ? 'up' : 'down'}
            trendValue={`${estatisticas?.crescimentoMensal || 0}%`}
          />

          <StatCard
            title="Receita Total"
            value={<AnimatedNumber value={estatisticas?.receitaTotal || 0} prefix="R$ " />}
            icon={DollarSign}
            color="success"
          />

          <StatCard
            title="Média de Avaliações"
            value={<AnimatedNumber value={estatisticas?.mediaAvaliacoes || 0} />}
            icon={Star}
            color="warning"
          />

          <StatCard
            title="Este Mês"
            value={<AnimatedNumber value={estatisticas?.agendamentosMesAtual || 0} />}
            icon={TrendingUp}
            color="info"
          />
        </div>

        {/* Status dos Agendamentos */}
        <Card className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Distribuição de Agendamentos
          </h2>

          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Pendentes</span>
                </div>
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  {estatisticas?.agendamentosPorStatus?.PENDENTE || 0} ({percentuais.pendente}%)
                </span>
              </div>
              <ProgressBar 
                value={percentuais.pendente} 
                color="warning"
                showPercentage={false}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Confirmados</span>
                </div>
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  {estatisticas?.agendamentosPorStatus?.CONFIRMADO || 0} ({percentuais.confirmado}%)
                </span>
              </div>
              <ProgressBar 
                value={percentuais.confirmado} 
                color="success"
                showPercentage={false}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Concluídos</span>
                </div>
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  {estatisticas?.agendamentosPorStatus?.CONCLUIDO || 0} ({percentuais.concluido}%)
                </span>
              </div>
              <ProgressBar 
                value={percentuais.concluido} 
                color="info"
                showPercentage={false}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Cancelados</span>
                </div>
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  {estatisticas?.agendamentosPorStatus?.CANCELADO || 0} ({percentuais.cancelado}%)
                </span>
              </div>
              <ProgressBar 
                value={percentuais.cancelado} 
                color="danger"
                showPercentage={false}
              />
            </div>
          </div>
        </Card>

        {/* Insights */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <Award className="text-yellow-600 dark:text-yellow-400" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Serviço Mais Popular
                </h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {estatisticas?.servicoMaisPopular || 'N/A'}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  O serviço mais agendado
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Users className="text-purple-600 dark:text-purple-400" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Avaliações Recebidas
                </h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  <AnimatedNumber value={estatisticas?.totalAvaliacoes || 0} />
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Média de ⭐ {estatisticas?.mediaAvaliacoes?.toFixed(1) || 0}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default RelatoriosEstabelecimento


