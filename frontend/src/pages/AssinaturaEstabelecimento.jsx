import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Crown, TrendingUp, Calendar, Zap, AlertTriangle, CreditCard } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import ThemeToggle from '../components/ThemeToggle'
import PlanoBadge from '../components/PlanoBadge'
import Button from '../components/Button'
import Card from '../components/Card'
import Loading from '../components/Loading'
import Toast from '../components/Toast'
import StatCard from '../components/StatCard'
import ProgressBar from '../components/ProgressBar'
import StripeCheckout from '../components/StripeCheckout'
import planoService from '../services/planoService'
import pagamentoService from '../services/pagamentoService'

const AssinaturaEstabelecimento = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [assinatura, setAssinatura] = useState(null)
  const [estatisticas, setEstatisticas] = useState(null)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const [cancelando, setCancelando] = useState(false)
  const [planoSelecionado, setPlanoSelecionado] = useState(null)
  const [mostrarCheckout, setMostrarCheckout] = useState(false)
  const [processandoPagamento, setProcessandoPagamento] = useState(false)

  useEffect(() => {
    carregarDados()
  }, [])

  const carregarDados = async () => {
    try {
      const data = await planoService.obterAssinatura()
      setAssinatura(data.assinatura)
      setEstatisticas(data.estatisticas)
    } catch (error) {
      console.error('Erro ao carregar assinatura:', error)
      setToast({ type: 'error', message: 'Erro ao carregar assinatura' })
    } finally {
      setLoading(false)
    }
  }

  const handleCancelarAssinatura = async () => {
    if (!confirm('Tem certeza que deseja cancelar sua assinatura? Você voltará para o plano FREE.')) {
      return
    }

    setCancelando(true)

    try {
      await planoService.cancelarAssinatura()
      setToast({ type: 'success', message: 'Assinatura cancelada com sucesso' })
      carregarDados()
    } catch (error) {
      console.error('Erro ao cancelar assinatura:', error)
      setToast({ type: 'error', message: 'Erro ao cancelar assinatura' })
    } finally {
      setCancelando(false)
    }
  }

  if (loading) {
    return <Loading fullScreen />
  }

  const plano = assinatura?.plano
  const isPremium = plano?.nome === 'PREMIUM'
  const isBasic = plano?.nome === 'BASIC'
  const isFree = plano?.nome === 'FREE'

  const formatarData = (data) => {
    if (!data) return 'Permanente'
    return new Date(data).toLocaleDateString('pt-BR')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
          <Toast
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        </div>
      )}

      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/estabelecimento/dashboard')}
              >
                <ArrowLeft size={18} />
                Voltar
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Crown size={28} className="text-primary-600" />
                  Minha Assinatura
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Gerencie seu plano e veja seu uso
                </p>
              </div>
            </div>

            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Plano Atual */}
        <Card className="mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Plano Atual
              </h2>
              <div className="flex items-center gap-3">
                <PlanoBadge plano={plano?.nome} size="lg" />
                {assinatura?.ativo ? (
                  <span className="text-sm text-green-600 dark:text-green-400">
                    ● Ativo
                  </span>
                ) : (
                  <span className="text-sm text-red-600 dark:text-red-400">
                    ● Inativo
                  </span>
                )}
              </div>
            </div>

            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                R$ {plano?.preco?.toFixed(2) || '0.00'}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                por mês
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Data de Início
              </p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {formatarData(assinatura?.dataInicio)}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                {isFree ? 'Permanente' : 'Próxima Renovação'}
              </p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {formatarData(assinatura?.dataFim)}
              </p>
            </div>
          </div>

          {!isFree && (
            <div className="flex gap-2">
              <Button
                fullWidth
                onClick={() => navigate('/planos')}
              >
                <Zap size={18} />
                {isPremium ? 'Ver Outros Planos' : 'Fazer Upgrade'}
              </Button>

              <Button
                variant="outline"
                onClick={handleCancelarAssinatura}
                disabled={cancelando}
              >
                {cancelando ? 'Cancelando...' : 'Cancelar Assinatura'}
              </Button>
            </div>
          )}

          {isFree && (
            <Button
              fullWidth
              onClick={() => navigate('/planos')}
            >
              <TrendingUp size={18} />
              Fazer Upgrade para Desbloquear Recursos
            </Button>
          )}
        </Card>

        {/* Estatísticas de Uso */}
        {estatisticas && (
          <>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Uso Atual
            </h2>

            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <StatCard
                title="Agendamentos Hoje"
                value={estatisticas.agendamentosHoje}
                subtitle={`Limite: ${estatisticas.limiteHoje}`}
                icon={Calendar}
                iconColor="text-blue-600"
                iconBg="bg-blue-100 dark:bg-blue-900"
                trend={
                  estatisticas.limiteHoje !== 'Ilimitado'
                    ? `${estatisticas.percentualUsoDia}% usado`
                    : null
                }
              >
                {estatisticas.limiteHoje !== 'Ilimitado' && (
                  <div className="mt-4">
                    <ProgressBar
                      progress={parseFloat(estatisticas.percentualUsoDia)}
                      color={
                        parseFloat(estatisticas.percentualUsoDia) >= 80
                          ? 'red'
                          : parseFloat(estatisticas.percentualUsoDia) >= 50
                          ? 'yellow'
                          : 'green'
                      }
                    />
                  </div>
                )}
              </StatCard>

              <StatCard
                title="Agendamentos este Mês"
                value={estatisticas.agendamentosMes}
                subtitle={`Limite: ${estatisticas.limiteMes}`}
                icon={TrendingUp}
                iconColor="text-green-600"
                iconBg="bg-green-100 dark:bg-green-900"
                trend={
                  estatisticas.limiteMes !== 'Ilimitado'
                    ? `${estatisticas.percentualUsoMes}% usado`
                    : null
                }
              >
                {estatisticas.limiteMes !== 'Ilimitado' && (
                  <div className="mt-4">
                    <ProgressBar
                      progress={parseFloat(estatisticas.percentualUsoMes)}
                      color={
                        parseFloat(estatisticas.percentualUsoMes) >= 80
                          ? 'red'
                          : parseFloat(estatisticas.percentualUsoMes) >= 50
                          ? 'yellow'
                          : 'green'
                      }
                    />
                  </div>
                )}
              </StatCard>
            </div>

            {/* Alertas de Limite */}
            {(parseFloat(estatisticas.percentualUsoDia) >= 80 || 
              parseFloat(estatisticas.percentualUsoMes) >= 80) && (
              <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 mb-8">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="text-yellow-600 mt-1 flex-shrink-0" size={24} />
                  <div className="flex-1">
                    <h3 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
                      Atenção: Você está próximo do limite!
                    </h3>
                    <p className="text-sm text-yellow-700 dark:text-yellow-400 mb-3">
                      Você usou mais de 80% do seu limite de agendamentos. Considere fazer upgrade para evitar bloqueios.
                    </p>
                    <Button
                      size="sm"
                      onClick={() => navigate('/planos')}
                    >
                      Ver Planos
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </>
        )}

        {/* Recursos do Plano */}
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Recursos Incluídos
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              Agendamentos
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-center gap-2">
                <span className={isFree ? 'text-yellow-600' : 'text-green-500'}>●</span>
                {plano?.limiteAgendamentosDia === null 
                  ? 'Ilimitado por dia'
                  : `Até ${plano?.limiteAgendamentosDia} por dia`}
              </li>
              <li className="flex items-center gap-2">
                <span className={plano?.limiteAgendamentos > 0 ? 'text-yellow-600' : 'text-green-500'}>●</span>
                {plano?.limiteAgendamentos === -1
                  ? 'Ilimitado por mês'
                  : `Até ${plano?.limiteAgendamentos} por mês`}
              </li>
            </ul>
          </Card>

          <Card>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              Recursos Avançados
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-center gap-2">
                <span className={plano?.permitePortfolio ? 'text-green-500' : 'text-red-500'}>●</span>
                Portfólio de Fotos
              </li>
              <li className="flex items-center gap-2">
                <span className={plano?.permiteRelatorios ? 'text-green-500' : 'text-red-500'}>●</span>
                Relatórios Avançados
              </li>
              <li className="flex items-center gap-2">
                <span className={plano?.permiteDestaque ? 'text-green-500' : 'text-red-500'}>●</span>
                Destaque na Página Inicial
                {plano?.diasDestaque > 0 && (
                  <span className="text-xs">({plano.diasDestaque} dias)</span>
                )}
              </li>
            </ul>
          </Card>
        </div>

        {/* Destaque PREMIUM */}
        {isPremium && assinatura?.destaqueAte && new Date(assinatura.destaqueAte) > new Date() && (
          <Card className="mt-8 bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 rounded-full">
                <Crown size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">
                  🔥 Você está em Destaque!
                </h3>
                <p className="text-sm text-white/90">
                  Seu estabelecimento aparece no topo das buscas até {formatarData(assinatura.destaqueAte)}
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

export default AssinaturaEstabelecimento

