import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, TrendingUp, Calendar, DollarSign, Star, Users, Package, Award, Download, Receipt, Eye, CheckCircle, XCircle, Clock } from 'lucide-react'
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
  const [abaAtiva, setAbaAtiva] = useState('geral')
  const [recibos, setRecibos] = useState([])
  const [loadingRecibos, setLoadingRecibos] = useState(false)

  useEffect(() => {
    carregarDados()
  }, [])

  useEffect(() => {
    if (abaAtiva === 'recibos' && agendamentos.length > 0) {
      carregarRecibos()
    }
  }, [abaAtiva, agendamentos])

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

  const carregarRecibos = async () => {
    setLoadingRecibos(true)
    try {
      // Buscar agendamentos com comprovante PIX
      const agendamentosComComprovante = agendamentos.filter(ag => 
        ag.comprovantePix && ag.pagamentoAntecipado
      )
      setRecibos(agendamentosComComprovante)
    } catch (error) {
      console.error('Erro ao carregar recibos:', error)
    } finally {
      setLoadingRecibos(false)
    }
  }

  const aprovarPagamento = async (agendamentoId) => {
    try {
      // Aqui você implementaria a lógica para aprovar o pagamento
      console.log('Aprovar pagamento:', agendamentoId)
      // Atualizar lista de recibos
      carregarRecibos()
    } catch (error) {
      console.error('Erro ao aprovar pagamento:', error)
    }
  }

  const rejeitarPagamento = async (agendamentoId) => {
    try {
      // Aqui você implementaria a lógica para rejeitar o pagamento
      console.log('Rejeitar pagamento:', agendamentoId)
      // Atualizar lista de recibos
      carregarRecibos()
    } catch (error) {
      console.error('Erro ao rejeitar pagamento:', error)
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
        </div>

        {/* Abas */}
        <div className="flex space-x-1 mb-8">
          <button
            onClick={() => setAbaAtiva('geral')}
            className={`px-6 py-3 font-medium transition-all ${
              abaAtiva === 'geral'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            <TrendingUp className="inline mr-2" size={20} />
            Geral
          </button>
          <button
            onClick={() => setAbaAtiva('recibos')}
            className={`px-6 py-3 font-medium transition-all ${
              abaAtiva === 'recibos'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            <Receipt className="inline mr-2" size={20} />
            Recibos PIX ({recibos.length})
          </button>
        </div>

        {/* Conteúdo das Abas */}
        {abaAtiva === 'geral' && (
          <>
            <div className="flex justify-end mb-8">
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
          </>
        )}

        {/* Aba de Recibos PIX */}
        {abaAtiva === 'recibos' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Recibos de Pagamento PIX
              </h2>
              <Badge variant="info">
                {recibos.length} comprovante{recibos.length !== 1 ? 's' : ''}
              </Badge>
            </div>

            {loadingRecibos ? (
              <div className="flex justify-center py-12">
                <Loading size="lg" />
              </div>
            ) : recibos.length === 0 ? (
              <Card className="text-center py-12">
                <Receipt size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Nenhum comprovante PIX
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Ainda não há comprovantes de pagamento PIX para revisar.
                </p>
              </Card>
            ) : (
              <div className="grid gap-4">
                {recibos.map((recibo) => (
                  <Card key={recibo.id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                            <Receipt className="text-blue-600 dark:text-blue-400" size={20} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              Comprovante PIX - {recibo.servico?.nome || 'Serviço'}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {new Date(recibo.dataHora).toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Cliente</p>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {recibo.cliente?.nome || 'Cliente não cadastrado'}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Valor Total</p>
                            <p className="font-bold text-green-600 dark:text-green-400">
                              R$ {recibo.valorTotal?.toFixed(2) || '0,00'}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Taxa da Plataforma</p>
                            <p className="text-gray-900 dark:text-white">
                              R$ {recibo.valorTaxa?.toFixed(2) || '0,00'}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Status</p>
                            <Badge 
                              variant={
                                recibo.status === 'AGUARDANDO_APROVACAO_PAGAMENTO' ? 'warning' :
                                recibo.status === 'CONFIRMADO' ? 'success' : 'danger'
                              }
                            >
                              {recibo.status === 'AGUARDANDO_APROVACAO_PAGAMENTO' ? 'Aguardando Aprovação' :
                               recibo.status === 'CONFIRMADO' ? 'Aprovado' : 'Rejeitado'}
                            </Badge>
                          </div>
                        </div>

                        {recibo.comprovantePix && (
                          <div className="mb-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Comprovante:</p>
                            <div className="flex items-center gap-2">
                              <img 
                                src={`https://jfagende-production.up.railway.app${recibo.comprovantePix}`}
                                alt="Comprovante PIX"
                                className="w-32 h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                                onError={(e) => {
                                  e.target.style.display = 'none'
                                  e.target.nextSibling.style.display = 'block'
                                }}
                              />
                              <div style={{display: 'none'}} className="w-32 h-32 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                                <Eye size={24} className="text-gray-400" />
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => window.open(`https://jfagende-production.up.railway.app${recibo.comprovantePix}`, '_blank')}
                              >
                                <Eye size={16} />
                                Ver Completo
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>

                      {recibo.status === 'AGUARDANDO_APROVACAO_PAGAMENTO' && (
                        <div className="flex gap-2 ml-4">
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() => aprovarPagamento(recibo.id)}
                          >
                            <CheckCircle size={16} />
                            Aprovar
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => rejeitarPagamento(recibo.id)}
                          >
                            <XCircle size={16} />
                            Rejeitar
                          </Button>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default RelatoriosEstabelecimento


