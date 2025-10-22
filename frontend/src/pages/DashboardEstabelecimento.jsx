import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, Calendar as CalendarIcon, Package, User, Plus, Edit2, Trash2, Clock, DollarSign, Check, X, BarChart3, CalendarDays, Image as ImageIcon, TrendingUp, TrendingDown, Users, CheckCircle, XCircle, AlertCircle, Wallet, CreditCard, PieChart, ArrowUpCircle, ArrowDownCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useNotifications } from '../hooks/useNotifications'
import { startOfMonth, endOfMonth, addMonths } from 'date-fns'
import ThemeToggle from '../components/ThemeToggle'
import NotificationCenter from '../components/NotificationCenter'
import AgendaProfissional from '../components/CalendarioAgenda'
import estabelecimentoService from '../services/estabelecimentoService'
import agendamentoService from '../services/agendamentoService'
import agendaService from '../services/agendaService'
import Button from '../components/Button'
import Card from '../components/Card'
import Badge from '../components/Badge'
import Loading from '../components/Loading'
import Modal from '../components/Modal'
import Input from '../components/Input'
import Toast from '../components/Toast'
import LogoUpload from '../components/LogoUpload'

const DashboardEstabelecimento = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { notifications, marcarComoLida, marcarTodasComoLidas } = useNotifications()
  
  const [abaAtiva, setAbaAtiva] = useState('estatisticas')
  const [agendamentos, setAgendamentos] = useState([])
  const [bloqueios, setBloqueios] = useState([])
  const [servicos, setServicos] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalServico, setModalServico] = useState({ aberto: false, servico: null })
  const [modalPagamento, setModalPagamento] = useState({ aberto: false, agendamentoId: null })
  const [formaPagamentoSelecionada, setFormaPagamentoSelecionada] = useState('')
  const [toast, setToast] = useState(null)
  const [mesAtual, setMesAtual] = useState(new Date())
  const [estatisticas, setEstatisticas] = useState({
    totalAgendamentos: 0,
    agendamentosHoje: 0,
    agendamentosMes: 0,
    receitaMes: 0,
    ticketMedio: 0,
    taxaConfirmacao: 0,
    clientesUnicos: 0,
    servicoMaisVendido: null,
    horarioMaisPopular: null
  })
  
  const [financeiro, setFinanceiro] = useState({
    receitaBruta: 0,
    receitaLiquida: 0,
    receitaPrevista: 0,
    receitaPendente: 0,
    crescimentoMes: 0,
    faturamentoPorDia: [],
    servicosPorReceita: [],
    formasPagamento: {
      dinheiro: 0,
      debito: 0,
      credito: 0,
      pix: 0
    }
  })
  
  const [novoServico, setNovoServico] = useState({
    nome: '',
    duracaoMin: '',
    preco: '',
    descricao: ''
  })

  useEffect(() => {
    carregarDados()
  }, [mesAtual])

  const carregarDados = async () => {
    try {
      // Validar se mesAtual é uma data válida
      const dataValida = mesAtual instanceof Date && !isNaN(mesAtual) ? mesAtual : new Date()
      const inicioMes = startOfMonth(dataValida)
      const fimMes = endOfMonth(addMonths(dataValida, 1))

      // Carregar agendamentos e serviços
      const [agendamentosData, servicosData] = await Promise.all([
        agendamentoService.getByEstabelecimento(user.id),
        estabelecimentoService.getServicos(user.id)
      ])
      
      setAgendamentos(agendamentosData)
      setServicos(servicosData)
      
      // Calcular estatísticas
      calcularEstatisticas(agendamentosData, servicosData)

      // Carregar agenda completa (bloqueios)
      try {
        const agendaData = await agendaService.getAgendaCompleta(
          inicioMes.toISOString(), 
          fimMes.toISOString()
        )
        setBloqueios(agendaData?.bloqueios || [])
      } catch (agendaError) {
        console.warn('Erro ao carregar bloqueios:', agendaError)
        setBloqueios([])
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      setToast({ type: 'error', message: 'Erro ao carregar dados principais' })
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleCriarAgendamento = async (dadosAgendamento) => {
    try {
      setLoading(true)
      
      // Criar agendamento via API
      const agendamentoData = {
        ...dadosAgendamento,
        estabelecimentoId: user.id,
        status: dadosAgendamento.status || 'confirmado'
      }
      
      await agendamentoService.create(agendamentoData)
      setToast({ type: 'success', message: 'Agendamento criado com sucesso!' })
      
      // Recarregar dados
      await carregarDados()
      
    } catch (error) {
      console.error('Erro ao criar agendamento:', error)
      setToast({ type: 'error', message: 'Erro ao criar agendamento' })
      throw error
    } finally {
      setLoading(false)
    }
  }

  const abrirModalServico = (servico = null) => {
    if (servico) {
      setNovoServico({
        nome: servico.nome,
        duracaoMin: servico.duracaoMin.toString(),
        preco: servico.preco.toString(),
        descricao: servico.descricao || ''
      })
    } else {
      setNovoServico({
        nome: '',
        duracaoMin: '',
        preco: '',
        descricao: ''
      })
    }
    setModalServico({ aberto: true, servico })
  }

  const fecharModalServico = () => {
    setModalServico({ aberto: false, servico: null })
    setNovoServico({
      nome: '',
      duracaoMin: '',
      preco: '',
      descricao: ''
    })
  }

  const handleSalvarServico = async () => {
    try {
      if (modalServico.servico) {
        // Atualizar
        await estabelecimentoService.updateServico(
          user.id,
          modalServico.servico.id,
          {
            ...novoServico,
            duracaoMin: parseInt(novoServico.duracaoMin),
            preco: parseFloat(novoServico.preco)
          }
        )
        setToast({ type: 'success', message: 'Serviço atualizado com sucesso!' })
      } else {
        // Criar
        await estabelecimentoService.createServico(user.id, {
          ...novoServico,
          duracaoMin: parseInt(novoServico.duracaoMin),
          preco: parseFloat(novoServico.preco)
        })
        setToast({ type: 'success', message: 'Serviço criado com sucesso!' })
      }
      
      fecharModalServico()
      carregarDados()
    } catch (error) {
      console.error('Erro ao salvar serviço:', error)
      setToast({ type: 'error', message: 'Erro ao salvar serviço' })
    }
  }

  const handleDeletarServico = async (servicoId) => {
    if (!confirm('⚠️ ATENÇÃO: Deseja realmente REMOVER este serviço permanentemente?\n\nEsta ação não pode ser desfeita e o serviço será excluído completamente do sistema.')) return

    try {
      await estabelecimentoService.deleteServico(user.id, servicoId)
      setToast({ type: 'success', message: 'Serviço removido permanentemente!' })
      carregarDados()
    } catch (error) {
      console.error('Erro ao deletar serviço:', error)
      setToast({ type: 'error', message: 'Erro ao remover serviço' })
    }
  }

  const handleAtualizarStatusAgendamento = async (agendamentoId, novoStatus, formaPagamento = null) => {
    try {
      // Se estiver marcando como CONCLUIDO e não tem forma de pagamento, abrir modal
      if (novoStatus === 'CONCLUIDO' && !formaPagamento) {
        setModalPagamento({ aberto: true, agendamentoId })
        return
      }
      
      await agendamentoService.updateStatus(agendamentoId, novoStatus, formaPagamento)
      setToast({ type: 'success', message: 'Status atualizado com sucesso!' })
      carregarDados()
      
      // Fechar modal se estiver aberto
      if (modalPagamento.aberto) {
        setModalPagamento({ aberto: false, agendamentoId: null })
        setFormaPagamentoSelecionada('')
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
      setToast({ type: 'error', message: 'Erro ao atualizar status' })
    }
  }
  
  const handleConfirmarPagamento = () => {
    if (!formaPagamentoSelecionada) {
      setToast({ type: 'error', message: 'Selecione uma forma de pagamento' })
      return
    }
    handleAtualizarStatusAgendamento(modalPagamento.agendamentoId, 'CONCLUIDO', formaPagamentoSelecionada)
  }

  const handleCreateBloqueio = async (bloqueioData) => {
    return await agendaService.createBloqueio(bloqueioData)
  }

  const handleDeleteBloqueio = async (id) => {
    return await agendaService.deleteBloqueio(id)
  }

  const handleWhatsAppClick = async (agendamentoId) => {
    return await agendaService.gerarLinkWhatsApp(agendamentoId)
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

  const calcularEstatisticas = (agendamentosData, servicosData) => {
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)
    
    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1)
    const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0, 23, 59, 59)

    // Total de agendamentos
    const totalAgendamentos = agendamentosData.length

    // Agendamentos hoje
    const agendamentosHoje = agendamentosData.filter(a => {
      const dataAgendamento = new Date(a.dataHora)
      dataAgendamento.setHours(0, 0, 0, 0)
      return dataAgendamento.getTime() === hoje.getTime()
    }).length

    // Agendamentos do mês
    const agendamentosMes = agendamentosData.filter(a => {
      const dataAgendamento = new Date(a.dataHora)
      return dataAgendamento >= inicioMes && dataAgendamento <= fimMes
    }).length

    // Receita do mês (apenas confirmados e concluídos)
    const agendamentosComReceita = agendamentosData.filter(a => {
      const dataAgendamento = new Date(a.dataHora)
      return (
        (a.status === 'CONFIRMADO' || a.status === 'CONCLUIDO') &&
        dataAgendamento >= inicioMes && 
        dataAgendamento <= fimMes
      )
    })
    
    const receitaMes = agendamentosComReceita.reduce((sum, a) => sum + (a.servico?.preco || 0), 0)

    // Ticket médio
    const ticketMedio = agendamentosComReceita.length > 0 
      ? receitaMes / agendamentosComReceita.length 
      : 0

    // Taxa de confirmação
    const agendamentosPendentesOuConfirmados = agendamentosData.filter(
      a => a.status === 'PENDENTE' || a.status === 'CONFIRMADO' || a.status === 'CONCLUIDO'
    )
    const agendamentosConfirmados = agendamentosData.filter(
      a => a.status === 'CONFIRMADO' || a.status === 'CONCLUIDO'
    )
    const taxaConfirmacao = agendamentosPendentesOuConfirmados.length > 0
      ? (agendamentosConfirmados.length / agendamentosPendentesOuConfirmados.length) * 100
      : 0

    // Clientes únicos
    const clientesUnicos = new Set(agendamentosData.map(a => a.clienteId)).size

    // Serviço mais vendido
    const servicosCount = {}
    agendamentosData.forEach(a => {
      const servicoNome = a.servico?.nome || 'Desconhecido'
      servicosCount[servicoNome] = (servicosCount[servicoNome] || 0) + 1
    })
    const servicoMaisVendido = Object.keys(servicosCount).length > 0
      ? Object.keys(servicosCount).reduce((a, b) => 
          servicosCount[a] > servicosCount[b] ? a : b
        )
      : null

    // Horário mais popular
    const horariosCount = {}
    agendamentosData.forEach(a => {
      const hora = new Date(a.dataHora).getHours()
      horariosCount[hora] = (horariosCount[hora] || 0) + 1
    })
    const horarioMaisPopular = Object.keys(horariosCount).length > 0
      ? `${Object.keys(horariosCount).reduce((a, b) => 
          horariosCount[a] > horariosCount[b] ? a : b
        )}:00`
      : null

    setEstatisticas({
      totalAgendamentos,
      agendamentosHoje,
      agendamentosMes,
      receitaMes,
      ticketMedio,
      taxaConfirmacao,
      clientesUnicos,
      servicoMaisVendido,
      horarioMaisPopular
    })
    
    // Calcular dados financeiros
    calcularFinanceiro(agendamentosData, servicosData)
  }

  const calcularFinanceiro = (agendamentosData, servicosData) => {
    const hoje = new Date()
    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1)
    const mesAnterior = new Date(hoje.getFullYear(), hoje.getMonth() - 1, 1)
    const fimMesAnterior = new Date(hoje.getFullYear(), hoje.getMonth(), 0, 23, 59, 59)

    // Receita Bruta (confirmados + concluídos do mês)
    const agendamentosMes = agendamentosData.filter(a => {
      const dataAgendamento = new Date(a.dataHora)
      return dataAgendamento >= inicioMes && 
             (a.status === 'CONFIRMADO' || a.status === 'CONCLUIDO')
    })
    const receitaBruta = agendamentosMes.reduce((sum, a) => sum + (a.servico?.preco || 0), 0)

    // Receita Líquida (apenas concluídos)
    const agendamentosConcluidos = agendamentosMes.filter(a => a.status === 'CONCLUIDO')
    const receitaLiquida = agendamentosConcluidos.reduce((sum, a) => sum + (a.servico?.preco || 0), 0)

    // Receita Prevista (confirmados que ainda não aconteceram)
    const agendamentosPrevistos = agendamentosData.filter(a => {
      const dataAgendamento = new Date(a.dataHora)
      return dataAgendamento > hoje && a.status === 'CONFIRMADO'
    })
    const receitaPrevista = agendamentosPrevistos.reduce((sum, a) => sum + (a.servico?.preco || 0), 0)

    // Receita Pendente (pendentes de confirmação)
    const agendamentosPendentes = agendamentosData.filter(a => a.status === 'PENDENTE')
    const receitaPendente = agendamentosPendentes.reduce((sum, a) => sum + (a.servico?.preco || 0), 0)

    // Crescimento em relação ao mês anterior
    const agendamentosMesAnterior = agendamentosData.filter(a => {
      const dataAgendamento = new Date(a.dataHora)
      return dataAgendamento >= mesAnterior && 
             dataAgendamento <= fimMesAnterior &&
             a.status === 'CONCLUIDO'
    })
    const receitaMesAnterior = agendamentosMesAnterior.reduce((sum, a) => sum + (a.servico?.preco || 0), 0)
    const crescimentoMes = receitaMesAnterior > 0 
      ? ((receitaLiquida - receitaMesAnterior) / receitaMesAnterior) * 100 
      : 0

    // Faturamento por dia (últimos 7 dias)
    const faturamentoPorDia = []
    for (let i = 6; i >= 0; i--) {
      const data = new Date()
      data.setDate(data.getDate() - i)
      data.setHours(0, 0, 0, 0)
      const dataFim = new Date(data)
      dataFim.setHours(23, 59, 59, 999)

      const agendamentosDia = agendamentosData.filter(a => {
        const dataAgendamento = new Date(a.dataHora)
        return dataAgendamento >= data && 
               dataAgendamento <= dataFim && 
               a.status === 'CONCLUIDO'
      })
      
      const receita = agendamentosDia.reduce((sum, a) => sum + (a.servico?.preco || 0), 0)
      
      faturamentoPorDia.push({
        dia: data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
        receita,
        agendamentos: agendamentosDia.length
      })
    }

    // Serviços por receita
    const servicosReceita = {}
    agendamentosConcluidos.forEach(a => {
      const servicoNome = a.servico?.nome || 'Desconhecido'
      const preco = a.servico?.preco || 0
      if (!servicosReceita[servicoNome]) {
        servicosReceita[servicoNome] = { total: 0, quantidade: 0 }
      }
      servicosReceita[servicoNome].total += preco
      servicosReceita[servicoNome].quantidade += 1
    })
    
    const servicosPorReceita = Object.entries(servicosReceita)
      .map(([nome, dados]) => ({ nome, ...dados }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5)

    // Formas de pagamento (dados reais dos agendamentos concluídos)
    const formasPagamento = {
      dinheiro: 0,
      debito: 0,
      credito: 0,
      pix: 0
    }
    
    agendamentosConcluidos.forEach(a => {
      const formaPagto = a.formaPagamento?.toUpperCase()
      const preco = a.servico?.preco || 0
      
      if (formaPagto === 'DINHEIRO') {
        formasPagamento.dinheiro += preco
      } else if (formaPagto === 'DEBITO') {
        formasPagamento.debito += preco
      } else if (formaPagto === 'CREDITO') {
        formasPagamento.credito += preco
      } else if (formaPagto === 'PIX') {
        formasPagamento.pix += preco
      }
    })

    setFinanceiro({
      receitaBruta,
      receitaLiquida,
      receitaPrevista,
      receitaPendente,
      crescimentoMes,
      faturamentoPorDia,
      servicosPorReceita,
      formasPagamento
    })
  }

  if (loading) {
    return <Loading fullScreen />
  }

  return (
    <div className="min-h-screen bg-gray-50">
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

      {/* Modal de Serviço */}
      <Modal
        isOpen={modalServico.aberto}
        onClose={fecharModalServico}
        title={modalServico.servico ? 'Editar Serviço' : 'Novo Serviço'}
        footer={
          <>
            <Button variant="outline" onClick={fecharModalServico}>
              Cancelar
            </Button>
            <Button onClick={handleSalvarServico}>
              Salvar
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Nome do Serviço"
            placeholder="Ex: Corte de Cabelo"
            value={novoServico.nome}
            onChange={(e) => setNovoServico({ ...novoServico, nome: e.target.value })}
            required
          />
          
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Duração (minutos)"
              type="number"
              placeholder="Ex: 30"
              value={novoServico.duracaoMin}
              onChange={(e) => setNovoServico({ ...novoServico, duracaoMin: e.target.value })}
              required
            />
            
            <Input
              label="Preço (R$)"
              type="number"
              step="0.01"
              placeholder="Ex: 50.00"
              value={novoServico.preco}
              onChange={(e) => setNovoServico({ ...novoServico, preco: e.target.value })}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Descrição (opcional)
            </label>
            <textarea
              placeholder="Descreva o serviço..."
              value={novoServico.descricao}
              onChange={(e) => setNovoServico({ ...novoServico, descricao: e.target.value })}
              rows="3"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
            />
          </div>
        </div>
      </Modal>

      {/* Modal de Pagamento */}
      <Modal
        isOpen={modalPagamento.aberto}
        onClose={() => {
          setModalPagamento({ aberto: false, agendamentoId: null })
          setFormaPagamentoSelecionada('')
        }}
        title="Forma de Pagamento"
        footer={
          <>
            <Button 
              variant="outline" 
              onClick={() => {
                setModalPagamento({ aberto: false, agendamentoId: null })
                setFormaPagamentoSelecionada('')
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleConfirmarPagamento}>
              Confirmar Conclusão
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Selecione a forma de pagamento utilizada pelo cliente:
          </p>
          
          <div className="space-y-3">
            <button
              onClick={() => setFormaPagamentoSelecionada('DINHEIRO')}
              className={`w-full p-4 rounded-lg border-2 transition-all ${
                formaPagamentoSelecionada === 'DINHEIRO'
                  ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">💵</span>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900 dark:text-white">Dinheiro</p>
                    <p className="text-xs text-gray-500">Pagamento em espécie</p>
                  </div>
                </div>
                {formaPagamentoSelecionada === 'DINHEIRO' && (
                  <Check className="text-primary-600" size={24} />
                )}
              </div>
            </button>

            <button
              onClick={() => setFormaPagamentoSelecionada('DEBITO')}
              className={`w-full p-4 rounded-lg border-2 transition-all ${
                formaPagamentoSelecionada === 'DEBITO'
                  ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">💳</span>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900 dark:text-white">Cartão de Débito</p>
                    <p className="text-xs text-gray-500">Débito na conta</p>
                  </div>
                </div>
                {formaPagamentoSelecionada === 'DEBITO' && (
                  <Check className="text-primary-600" size={24} />
                )}
              </div>
            </button>

            <button
              onClick={() => setFormaPagamentoSelecionada('CREDITO')}
              className={`w-full p-4 rounded-lg border-2 transition-all ${
                formaPagamentoSelecionada === 'CREDITO'
                  ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">💎</span>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900 dark:text-white">Cartão de Crédito</p>
                    <p className="text-xs text-gray-500">Parcelado ou à vista</p>
                  </div>
                </div>
                {formaPagamentoSelecionada === 'CREDITO' && (
                  <Check className="text-primary-600" size={24} />
                )}
              </div>
            </button>

            <button
              onClick={() => setFormaPagamentoSelecionada('PIX')}
              className={`w-full p-4 rounded-lg border-2 transition-all ${
                formaPagamentoSelecionada === 'PIX'
                  ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⚡</span>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900 dark:text-white">PIX</p>
                    <p className="text-xs text-gray-500">Transferência instantânea</p>
                  </div>
                </div>
                {formaPagamentoSelecionada === 'PIX' && (
                  <Check className="text-primary-600" size={24} />
                )}
              </div>
            </button>
          </div>
        </div>
      </Modal>

      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              <h1 className="font-display text-lg sm:text-xl md:text-2xl font-bold text-primary-600">
                JFAgende
              </h1>
              <div className="hidden md:flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <User size={18} />
                <span className="text-sm">{user.nome}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-1 sm:gap-2">
              <NotificationCenter 
                notifications={notifications}
                onMarkAsRead={marcarComoLida}
                onMarkAllAsRead={marcarTodasComoLidas}
              />
              <div className="hidden sm:flex items-center gap-1 sm:gap-2">
                <Button variant="ghost" size="sm" onClick={() => navigate('/estabelecimento/perfil')} className="hidden lg:flex">
                  <User size={16} />
                  <span className="hidden xl:inline">Meu Perfil</span>
                </Button>
                <Button variant="ghost" size="sm" onClick={() => navigate('/estabelecimento/assinatura')} className="hidden lg:flex">
                  <CreditCard size={16} />
                  <span className="hidden xl:inline">Plano</span>
                </Button>
                <Button variant="ghost" size="sm" onClick={() => navigate('/estabelecimento/equipe')} className="hidden lg:flex">
                  <Users size={16} />
                  <span className="hidden xl:inline">Equipe</span>
                </Button>
                <Button variant="ghost" size="sm" onClick={() => navigate('/estabelecimento/portfolio')} className="hidden lg:flex">
                  <ImageIcon size={16} />
                  <span className="hidden xl:inline">Portfólio</span>
                </Button>
                <Button variant="ghost" size="sm" onClick={() => navigate('/estabelecimento/relatorios')} className="hidden lg:flex">
                  <BarChart3 size={16} />
                  <span className="hidden xl:inline">Relatórios</span>
                </Button>
              </div>
              <ThemeToggle />
              <Button variant="outline" size="sm" onClick={handleLogout} className="text-xs sm:text-sm">
                <LogOut size={16} />
                <span className="hidden sm:inline">Sair</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
        {/* Tabs */}
        <div className="flex gap-1 sm:gap-2 mb-6 sm:mb-8 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
          <button
            onClick={() => setAbaAtiva('estatisticas')}
            className={`px-3 sm:px-4 md:px-6 py-2 sm:py-3 font-medium transition-all whitespace-nowrap text-sm sm:text-base ${
              abaAtiva === 'estatisticas'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            <BarChart3 className="inline mr-1 sm:mr-2" size={16} />
            <span className="hidden sm:inline">Estatísticas</span>
            <span className="sm:hidden">Stats</span>
          </button>

          <button
            onClick={() => setAbaAtiva('financeiro')}
            className={`px-3 sm:px-4 md:px-6 py-2 sm:py-3 font-medium transition-all whitespace-nowrap text-sm sm:text-base ${
              abaAtiva === 'financeiro'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            <Wallet className="inline mr-1 sm:mr-2" size={16} />
            <span className="hidden sm:inline">Financeiro</span>
            <span className="sm:hidden">Financeiro</span>
          </button>

          <button
            onClick={() => setAbaAtiva('agenda')}
            className={`px-3 sm:px-4 md:px-6 py-2 sm:py-3 font-medium transition-all whitespace-nowrap text-sm sm:text-base ${
              abaAtiva === 'agenda'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            <CalendarDays className="inline mr-1 sm:mr-2" size={16} />
            <span className="hidden sm:inline">Agenda</span>
            <span className="sm:hidden">Agenda</span>
          </button>

          <button
            onClick={() => setAbaAtiva('lista')}
            className={`px-3 sm:px-4 md:px-6 py-2 sm:py-3 font-medium transition-all whitespace-nowrap text-sm sm:text-base ${
              abaAtiva === 'lista'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            <CalendarIcon className="inline mr-1 sm:mr-2" size={16} />
            <span className="hidden sm:inline">Lista de Agendamentos</span>
            <span className="sm:hidden">Lista</span>
          </button>
          
          <button
            onClick={() => setAbaAtiva('servicos')}
            className={`px-3 sm:px-4 md:px-6 py-2 sm:py-3 font-medium transition-all whitespace-nowrap text-sm sm:text-base ${
              abaAtiva === 'servicos'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            <Package className="inline mr-1 sm:mr-2" size={16} />
            <span className="hidden sm:inline">Meus Serviços</span>
            <span className="sm:hidden">Serviços</span>
          </button>
        </div>

        {/* Conteúdo da Aba Estatísticas */}
        {abaAtiva === 'estatisticas' && (
          <div className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                📊 Estatísticas e KPIs
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Visão geral do desempenho do seu negócio
              </p>
            </div>

            {/* KPIs Principais */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {/* Total de Agendamentos */}
              <Card className="relative overflow-hidden p-3 sm:p-4">
                <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-primary-100 dark:bg-primary-900/20 rounded-full -mr-8 sm:-mr-10 md:-mr-12 -mt-8 sm:-mt-10 md:-mt-12"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-1 sm:mb-2">
                    <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                      Total Agendamentos
                    </span>
                    <CalendarIcon className="text-primary-600" size={16} />
                  </div>
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    {estatisticas.totalAgendamentos}
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <TrendingUp size={14} className="mr-1 text-green-600" />
                    <span>Todos os tempos</span>
                  </div>
                </div>
              </Card>

              {/* Agendamentos Hoje */}
              <Card className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100 dark:bg-blue-900/20 rounded-full -mr-12 -mt-12"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Hoje
                    </span>
                    <Clock className="text-blue-600" size={20} />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    {estatisticas.agendamentosHoje}
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <span>Agendamentos de hoje</span>
                  </div>
                </div>
              </Card>

              {/* Receita do Mês */}
              <Card className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-green-100 dark:bg-green-900/20 rounded-full -mr-12 -mt-12"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Receita do Mês
                    </span>
                    <DollarSign className="text-green-600" size={20} />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    R$ {estatisticas.receitaMes.toFixed(2)}
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <span>{estatisticas.agendamentosMes} agendamentos</span>
                  </div>
                </div>
              </Card>

              {/* Taxa de Confirmação */}
              <Card className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-100 dark:bg-purple-900/20 rounded-full -mr-12 -mt-12"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Taxa Confirmação
                    </span>
                    <CheckCircle className="text-purple-600" size={20} />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    {estatisticas.taxaConfirmacao.toFixed(0)}%
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    {estatisticas.taxaConfirmacao >= 80 ? (
                      <>
                        <TrendingUp size={14} className="mr-1 text-green-600" />
                        <span className="text-green-600">Excelente!</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle size={14} className="mr-1 text-yellow-600" />
                        <span className="text-yellow-600">Pode melhorar</span>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            </div>

            {/* Métricas Secundárias */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Ticket Médio */}
              <Card>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                    <DollarSign className="text-blue-600" size={24} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Ticket Médio</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      R$ {estatisticas.ticketMedio.toFixed(2)}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Clientes Únicos */}
              <Card>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                    <Users className="text-purple-600" size={24} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Clientes Únicos</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {estatisticas.clientesUnicos}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Serviço Mais Vendido */}
              <Card>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
                    <TrendingUp className="text-orange-600" size={24} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Serviço Popular</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white truncate">
                      {estatisticas.servicoMaisVendido || 'N/A'}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Insights e Dicas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <TrendingUp className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                      💡 Insight
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {estatisticas.horarioMaisPopular 
                        ? `Seu horário mais popular é ${estatisticas.horarioMaisPopular}. Considere adicionar mais slots neste horário!`
                        : 'Adicione mais agendamentos para ver insights personalizados.'
                      }
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-500 rounded-lg">
                    <CheckCircle className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                      🎯 Dica de Crescimento
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {estatisticas.taxaConfirmacao < 80
                        ? 'Sua taxa de confirmação pode melhorar. Experimente enviar lembretes automáticos!'
                        : 'Excelente taxa de confirmação! Continue assim.'
                      }
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Resumo de Status */}
            <Card>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">
                📈 Status dos Agendamentos
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <AlertCircle className="text-yellow-600 mx-auto mb-2" size={24} />
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {agendamentos.filter(a => a.status === 'PENDENTE').length}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Pendentes</p>
                </div>
                
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <CheckCircle className="text-green-600 mx-auto mb-2" size={24} />
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {agendamentos.filter(a => a.status === 'CONFIRMADO').length}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Confirmados</p>
                </div>
                
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Check className="text-blue-600 mx-auto mb-2" size={24} />
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {agendamentos.filter(a => a.status === 'CONCLUIDO').length}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Concluídos</p>
                </div>
                
                <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <XCircle className="text-red-600 mx-auto mb-2" size={24} />
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {agendamentos.filter(a => a.status === 'CANCELADO').length}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Cancelados</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Conteúdo da Aba Financeiro */}
        {abaAtiva === 'financeiro' && (
          <div className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                💰 Dashboard Financeiro
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Acompanhe receitas, despesas e análise financeira detalhada
              </p>
            </div>

            {/* KPIs Financeiros Principais */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Receita Líquida */}
              <Card className="relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-200 dark:bg-green-800/30 rounded-full -mr-16 -mt-16"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <Wallet className="text-green-600" size={24} />
                    {financeiro.crescimentoMes >= 0 ? (
                      <ArrowUpCircle className="text-green-600" size={20} />
                    ) : (
                      <ArrowDownCircle className="text-red-600" size={20} />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Receita Líquida</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    R$ {financeiro.receitaLiquida.toFixed(2)}
                  </p>
                  <div className="flex items-center text-xs">
                    <span className={`font-medium ${financeiro.crescimentoMes >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {financeiro.crescimentoMes >= 0 ? '+' : ''}{financeiro.crescimentoMes.toFixed(1)}%
                    </span>
                    <span className="text-gray-500 ml-1">vs mês anterior</span>
                  </div>
                </div>
              </Card>

              {/* Receita Prevista */}
              <Card className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 dark:bg-blue-900/20 rounded-full -mr-16 -mt-16"></div>
                <div className="relative">
                  <CreditCard className="text-blue-600 mb-2" size={24} />
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Receita Prevista</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    R$ {financeiro.receitaPrevista.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">Agendamentos confirmados</p>
                </div>
              </Card>

              {/* Receita Pendente */}
              <Card className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-100 dark:bg-yellow-900/20 rounded-full -mr-16 -mt-16"></div>
                <div className="relative">
                  <AlertCircle className="text-yellow-600 mb-2" size={24} />
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Receita Pendente</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    R$ {financeiro.receitaPendente.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">Aguardando confirmação</p>
                </div>
              </Card>

              {/* Ticket Médio */}
              <Card className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100 dark:bg-purple-900/20 rounded-full -mr-16 -mt-16"></div>
                <div className="relative">
                  <PieChart className="text-purple-600 mb-2" size={24} />
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Ticket Médio</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    R$ {estatisticas.ticketMedio.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">Por agendamento</p>
                </div>
              </Card>
            </div>

            {/* Gráfico de Faturamento (Últimos 7 dias) */}
            <Card>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-6">
                📈 Faturamento - Últimos 7 Dias
              </h3>
              
              <div className="space-y-4">
                {financeiro.faturamentoPorDia.map((dia, index) => {
                  const maxReceita = Math.max(...financeiro.faturamentoPorDia.map(d => d.receita))
                  const porcentagem = maxReceita > 0 ? (dia.receita / maxReceita) * 100 : 0
                  
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-gray-700 dark:text-gray-300 min-w-[60px]">
                          {dia.dia}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400 text-xs">
                          {dia.agendamentos} agendamento(s)
                        </span>
                        <span className="font-bold text-gray-900 dark:text-white min-w-[100px] text-right">
                          R$ {dia.receita.toFixed(2)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${porcentagem}%` }}
                        ></div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {financeiro.faturamentoPorDia.length === 0 && (
                <p className="text-center text-gray-500 py-8">
                  Nenhum faturamento nos últimos 7 dias
                </p>
              )}
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Top 5 Serviços por Receita */}
              <Card>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">
                  🏆 Top 5 Serviços - Receita
                </h3>
                
                <div className="space-y-4">
                  {financeiro.servicosPorReceita.map((servico, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {servico.nome}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {servico.quantidade} agendamento(s)
                          </p>
                        </div>
                      </div>
                      <p className="text-lg font-bold text-green-600">
                        R$ {servico.total.toFixed(2)}
                      </p>
                    </div>
                  ))}
                  
                  {financeiro.servicosPorReceita.length === 0 && (
                    <p className="text-center text-gray-500 py-4 text-sm">
                      Nenhum serviço com receita ainda
                    </p>
                  )}
                </div>
              </Card>

              {/* Formas de Pagamento */}
              <Card>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">
                  💳 Formas de Pagamento
                </h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        💵 Dinheiro
                      </span>
                      <span className="font-bold text-gray-900 dark:text-white">
                        R$ {financeiro.formasPagamento.dinheiro.toFixed(2)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${(financeiro.formasPagamento.dinheiro / financeiro.receitaLiquida * 100) || 0}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        💳 Débito
                      </span>
                      <span className="font-bold text-gray-900 dark:text-white">
                        R$ {financeiro.formasPagamento.debito.toFixed(2)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${(financeiro.formasPagamento.debito / financeiro.receitaLiquida * 100) || 0}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        💎 Crédito
                      </span>
                      <span className="font-bold text-gray-900 dark:text-white">
                        R$ {financeiro.formasPagamento.credito.toFixed(2)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full"
                        style={{ width: `${(financeiro.formasPagamento.credito / financeiro.receitaLiquida * 100) || 0}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        ⚡ PIX
                      </span>
                      <span className="font-bold text-gray-900 dark:text-white">
                        R$ {financeiro.formasPagamento.pix.toFixed(2)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-teal-500 h-2 rounded-full"
                        style={{ width: `${(financeiro.formasPagamento.pix / financeiro.receitaLiquida * 100) || 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Resumo Financeiro */}
            <Card className="bg-gradient-to-br from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">
                💡 Resumo Financeiro do Mês
              </h3>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Receita Bruta</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    R$ {financeiro.receitaBruta.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Confirmados + Concluídos</p>
                </div>
                
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Receita Líquida</p>
                  <p className="text-2xl font-bold text-green-600">
                    R$ {financeiro.receitaLiquida.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Apenas Concluídos</p>
                </div>
                
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Crescimento</p>
                  <p className={`text-2xl font-bold ${financeiro.crescimentoMes >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {financeiro.crescimentoMes >= 0 ? '+' : ''}{financeiro.crescimentoMes.toFixed(1)}%
                  </p>
                  <p className="text-xs text-gray-500 mt-1">vs Mês Anterior</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Conteúdo da Aba Agenda */}
        {abaAtiva === 'agenda' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                📅 Agenda Inteligente
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Visualize seus agendamentos, bloqueie horários e envie confirmações por WhatsApp
              </p>
            </div>

            <AgendaProfissional
              agendamentos={agendamentos}
              bloqueios={bloqueios}
              servicos={servicos}
              estabelecimento={user}
              onRefresh={carregarDados}
              onCreateBloqueio={handleCreateBloqueio}
              onDeleteBloqueio={handleDeleteBloqueio}
              onWhatsAppClick={handleWhatsAppClick}
              onCriarAgendamento={handleCriarAgendamento}
            />
          </div>
        )}

        {/* Conteúdo da Aba Lista de Agendamentos */}
        {abaAtiva === 'lista' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Lista de Agendamentos
              </h2>
            </div>

            {agendamentos.length === 0 ? (
              <Card>
                <p className="text-center text-gray-500 py-8">
                  Nenhum agendamento ainda
                </p>
              </Card>
            ) : (
              <div className="grid gap-4">
                {agendamentos.map((agendamento) => (
                  <Card key={agendamento.id}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="font-bold text-lg text-gray-900">
                            {agendamento.cliente.nome}
                          </h3>
                          <Badge variant={getStatusColor(agendamento.status)}>
                            {agendamento.status}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Package size={16} />
                            <span>{agendamento.servico.nome}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <CalendarIcon size={16} />
                            <span>{formatData(agendamento.dataHora)}</span>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Clock size={16} />
                              <span>{agendamento.servico.duracaoMin} min</span>
                            </div>
                            
                            <div className="flex items-center gap-1 text-primary-600 font-semibold">
                              <DollarSign size={16} />
                              <span>R$ {agendamento.servico.preco.toFixed(2)}</span>
                            </div>
                          </div>
                          
                          {agendamento.observacoes && (
                            <div className="mt-2 p-2 bg-gray-50 rounded">
                              <p className="text-xs text-gray-600">
                                <strong>Obs:</strong> {agendamento.observacoes}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {agendamento.status === 'PENDENTE' && (
                        <div className="flex gap-2 ml-4">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleAtualizarStatusAgendamento(agendamento.id, 'CONFIRMADO')}
                            title="Confirmar"
                          >
                            <Check size={18} className="text-green-600" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleAtualizarStatusAgendamento(agendamento.id, 'CANCELADO')}
                            title="Cancelar"
                          >
                            <X size={18} className="text-red-600" />
                          </Button>
                        </div>
                      )}
                      
                      {agendamento.status === 'CONFIRMADO' && (
                        <div className="flex gap-2 ml-4">
                          <Button
                            size="sm"
                            onClick={() => handleAtualizarStatusAgendamento(agendamento.id, 'CONCLUIDO')}
                            title="Marcar como Concluído"
                          >
                            <CheckCircle size={18} />
                            Concluir
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

        {/* Conteúdo da Aba Serviços */}
        {abaAtiva === 'servicos' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Meus Serviços
              </h2>
              
              <Button onClick={() => abrirModalServico()}>
                <Plus size={18} />
                Novo Serviço
              </Button>
            </div>

            {servicos.length === 0 ? (
              <Card>
                <p className="text-center text-gray-500 py-8">
                  Nenhum serviço cadastrado ainda
                </p>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {servicos.map((servico) => (
                  <Card key={servico.id}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold text-lg text-gray-900">
                            {servico.nome}
                          </h3>
                          {!servico.ativo && (
                            <Badge variant="danger" size="sm">Inativo</Badge>
                          )}
                        </div>
                        
                        {servico.descricao && (
                          <p className="text-sm text-gray-600 mb-3">
                            {servico.descricao}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1 text-gray-600">
                            <Clock size={16} />
                            <span>{servico.duracaoMin} min</span>
                          </div>
                          
                          <div className="flex items-center gap-1 text-primary-600 font-semibold">
                            <DollarSign size={16} />
                            <span>R$ {servico.preco.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => abrirModalServico(servico)}
                        >
                          <Edit2 size={16} />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeletarServico(servico.id)}
                          className="hover:bg-red-50 hover:border-red-200"
                          title="Remover serviço permanentemente"
                        >
                          <Trash2 size={16} className="text-red-600 hover:text-red-700" />
                        </Button>
                      </div>
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

export default DashboardEstabelecimento

