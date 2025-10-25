import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, X, Crown, Star, Gift, ArrowLeft, Zap, CreditCard } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Button from '../components/Button'
import Card from '../components/Card'
import Loading from '../components/Loading'
import Toast from '../components/Toast'
import Modal from '../components/Modal'
import StripeCheckout from '../components/StripeCheckout'
import planoService from '../services/planoService'
import pagamentoService from '../services/pagamentoService'

const PlanosPage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [planos, setPlanos] = useState([])
  const [assinaturaAtual, setAssinaturaAtual] = useState(null)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const [upgrading, setUpgrading] = useState(false)
  const [modalUpgrade, setModalUpgrade] = useState({ open: false, plano: null })

  useEffect(() => {
    carregarDados()
  }, [])

  const carregarDados = async () => {
    try {
      const [planosData, assinaturaData] = await Promise.all([
        planoService.compararPlanos(),
        user?.tipo === 'estabelecimento' 
          ? planoService.obterAssinatura().catch(() => null)
          : Promise.resolve(null)
      ])

      setPlanos(planosData)
      setAssinaturaAtual(assinaturaData)
    } catch (error) {
      console.error('Erro ao carregar planos:', error)
      setToast({ type: 'error', message: 'Erro ao carregar planos' })
    } finally {
      setLoading(false)
    }
  }

  const handleSelecionarPlano = (plano) => {
    if (!user) {
      setToast({ type: 'warning', message: 'Faça login como estabelecimento para escolher um plano' })
      return
    }

    if (user.tipo !== 'estabelecimento') {
      setToast({ type: 'warning', message: 'Apenas estabelecimentos podem assinar planos' })
      return
    }

    if (plano.nome === 'FREE') {
      setToast({ type: 'info', message: 'Você já está no plano FREE' })
      return
    }

    if (assinaturaAtual?.assinatura?.plano?.nome === plano.nome) {
      setToast({ type: 'info', message: 'Você já está neste plano' })
      return
    }

    setModalUpgrade({ open: true, plano })
  }

  const handleConfirmarUpgrade = async () => {
    setUpgrading(true)

    try {
      // Criar sessão de pagamento no Stripe
      const response = await pagamentoService.criarSessaoPagamento(
        modalUpgrade.plano.id,
        user.id
      )
      
      // Redirecionar para o Stripe Checkout
      window.location.href = response.url
      
    } catch (error) {
      console.error('Erro ao criar sessão de pagamento:', error)
      setToast({ 
        type: 'error', 
        message: error.response?.data?.error || 'Erro ao processar pagamento' 
      })
      setUpgrading(false)
    }
  }

  const getPlanoIcon = (nome) => {
    switch (nome) {
      case 'FREE': return Gift
      case 'BASIC': return Star
      case 'PREMIUM': return Crown
      default: return Gift
    }
  }

  const getPlanoColor = (nome) => {
    switch (nome) {
      case 'FREE': return 'text-gray-600 dark:text-gray-400'
      case 'BASIC': return 'text-blue-600 dark:text-blue-400'
      case 'PREMIUM': return 'text-yellow-600 dark:text-yellow-400'
      default: return 'text-gray-600'
    }
  }

  if (loading) {
    return <Loading fullScreen />
  }

  const planoAtualNome = assinaturaAtual?.assinatura?.plano?.nome

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

      {/* Modal de Upgrade */}
      <Modal
        isOpen={modalUpgrade.open}
        onClose={() => !upgrading && setModalUpgrade({ open: false, plano: null })}
        title="Confirmar Upgrade"
      >
        {modalUpgrade.plano && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="inline-flex p-4 bg-primary-100 dark:bg-primary-900 rounded-full mb-4">
                {(() => {
                  const Icon = getPlanoIcon(modalUpgrade.plano.nome)
                  return <Icon size={32} className={getPlanoColor(modalUpgrade.plano.nome)} />
                })()}
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Plano {modalUpgrade.plano.nome}
              </h3>
              <p className="text-3xl font-bold text-primary-600">
                R$ {modalUpgrade.plano.preco.toFixed(2)}
                <span className="text-sm text-gray-600 dark:text-gray-400">/mês</span>
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                O que você vai ganhar:
              </h4>
              <ul className="space-y-2">
                {modalUpgrade.plano.recursos.agendamentosDia !== 5 && (
                  <li className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <Check className="text-green-500" size={16} />
                    <span>Agendamentos ilimitados por dia</span>
                  </li>
                )}
                {modalUpgrade.plano.recursos.agendamentosMes === 'Ilimitado' && (
                  <li className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <Check className="text-green-500" size={16} />
                    <span>Agendamentos ilimitados por mês</span>
                  </li>
                )}
                {modalUpgrade.plano.recursos.portfolio && (
                  <li className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <Check className="text-green-500" size={16} />
                    <span>Portfólio de fotos ilimitado</span>
                  </li>
                )}
                {modalUpgrade.plano.recursos.relatorios && (
                  <li className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <Check className="text-green-500" size={16} />
                    <span>Relatórios avançados</span>
                  </li>
                )}
                {modalUpgrade.plano.recursos.destaque && (
                  <li className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <Check className="text-green-500" size={16} />
                    <span>Destaque na página inicial por 7 dias</span>
                  </li>
                )}
              </ul>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <div className="flex items-start gap-2">
                <CreditCard className="text-blue-600 dark:text-blue-400 mt-0.5" size={20} />
                <div>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    <strong>Pagamento Seguro:</strong> Você será redirecionado para o Stripe Checkout para realizar o pagamento de forma segura.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                fullWidth
                onClick={() => setModalUpgrade({ open: false, plano: null })}
                disabled={upgrading}
              >
                Cancelar
              </Button>
              <Button
                fullWidth
                onClick={handleConfirmarUpgrade}
                disabled={upgrading}
              >
                {upgrading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    Redirecionando...
                  </>
                ) : (
                  <>
                    <CreditCard size={18} />
                    Pagar com Stripe
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft size={18} />
            Voltar
          </Button>

          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Escolha o Melhor Plano para Você
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Aumente seus agendamentos com recursos profissionais. Comece grátis e faça upgrade quando precisar.
            </p>
            
            {planoAtualNome && (
              <div className="mt-4 inline-flex items-center gap-2 bg-primary-100 dark:bg-primary-900 px-4 py-2 rounded-lg">
                <span className="text-sm text-primary-700 dark:text-primary-300">
                  Seu plano atual:
                </span>
                <span className="font-bold text-primary-600">
                  {planoAtualNome}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Planos */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {planos.map((plano) => {
            const Icon = getPlanoIcon(plano.nome)
            const isAtual = planoAtualNome === plano.nome
            const isPremium = plano.recomendado

            return (
              <Card 
                key={plano.id}
                className={`relative ${isPremium ? 'ring-2 ring-primary-500 shadow-xl' : ''}`}
              >
                {isPremium && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      ⭐ Recomendado
                    </span>
                  </div>
                )}

                {isAtual && (
                  <div className="absolute -top-4 right-4">
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      ✓ Plano Atual
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className={`inline-flex p-3 rounded-full mb-4 ${
                    plano.nome === 'FREE' ? 'bg-gray-100 dark:bg-gray-700' :
                    plano.nome === 'BASIC' ? 'bg-blue-100 dark:bg-blue-900' :
                    'bg-gradient-to-br from-yellow-400 to-orange-500'
                  }`}>
                    <Icon 
                      size={32} 
                      className={plano.nome === 'PREMIUM' ? 'text-white' : getPlanoColor(plano.nome)}
                    />
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {plano.nome}
                  </h3>

                  <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
                    R$ {plano.preco.toFixed(2)}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    por mês
                  </p>
                </div>

                <p className="text-center text-gray-600 dark:text-gray-400 mb-6 min-h-[48px]">
                  {plano.descricao}
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-2">
                    {plano.recursos.agendamentosDia === 'Ilimitado' ? (
                      <Check className="text-green-500 mt-0.5 flex-shrink-0" size={18} />
                    ) : (
                      <X className="text-red-500 mt-0.5 flex-shrink-0" size={18} />
                    )}
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {plano.recursos.agendamentosDia} agendamentos/dia
                    </span>
                  </div>

                  <div className="flex items-start gap-2">
                    <Check className="text-green-500 mt-0.5 flex-shrink-0" size={18} />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {plano.recursos.agendamentosMes} agendamentos/mês
                    </span>
                  </div>

                  <div className="flex items-start gap-2">
                    {plano.recursos.portfolio ? (
                      <Check className="text-green-500 mt-0.5 flex-shrink-0" size={18} />
                    ) : (
                      <X className="text-red-500 mt-0.5 flex-shrink-0" size={18} />
                    )}
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Portfólio de fotos
                    </span>
                  </div>

                  <div className="flex items-start gap-2">
                    {plano.recursos.relatorios ? (
                      <Check className="text-green-500 mt-0.5 flex-shrink-0" size={18} />
                    ) : (
                      <X className="text-red-500 mt-0.5 flex-shrink-0" size={18} />
                    )}
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Relatórios avançados
                    </span>
                  </div>

                  <div className="flex items-start gap-2">
                    {plano.recursos.destaque ? (
                      <Check className="text-green-500 mt-0.5 flex-shrink-0" size={18} />
                    ) : (
                      <X className="text-red-500 mt-0.5 flex-shrink-0" size={18} />
                    )}
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Destaque por {plano.recursos.diasDestaque} dias
                    </span>
                  </div>
                </div>

                <Button
                  fullWidth
                  variant={isPremium ? 'primary' : 'outline'}
                  onClick={() => handleSelecionarPlano(plano)}
                  disabled={isAtual}
                >
                  {isAtual ? 'Plano Atual' : plano.nome === 'FREE' ? 'Plano Gratuito' : 'Escolher Plano'}
                </Button>
              </Card>
            )
          })}
        </div>

        {/* Informações Adicionais */}
        <div className="max-w-4xl mx-auto mt-12">
          <Card>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">
              Perguntas Frequentes
            </h3>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Posso cancelar a qualquer momento?
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Sim! Você pode cancelar sua assinatura a qualquer momento e voltar para o plano FREE sem perder seus dados.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Como funciona o destaque do plano PREMIUM?
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Seu estabelecimento aparecerá no topo das buscas com a tag "🔥 Destaque da Semana" por 7 dias, aumentando sua visibilidade e chance de receber mais agendamentos.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  O que acontece se eu atingir o limite de agendamentos?
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  O sistema bloqueará novos agendamentos automaticamente e sugerirá um upgrade. Você pode fazer upgrade a qualquer momento para continuar recebendo agendamentos.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default PlanosPage

