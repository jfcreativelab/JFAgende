import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar, Clock, DollarSign, Check, CreditCard, QrCode } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import estabelecimentoService from '../services/estabelecimentoService'
import agendamentoService from '../services/agendamentoService'
import Button from '../components/Button'
import Card from '../components/Card'
import Loading from '../components/Loading'
import Toast from '../components/Toast'
import PagamentoPixModal from '../components/PagamentoPixModal'

const Agendamento = () => {
  const { estabelecimentoId, servicoId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const [estabelecimento, setEstabelecimento] = useState(null)
  const [servico, setServico] = useState(null)
  const [dataSelecionada, setDataSelecionada] = useState('')
  const [horarioSelecionado, setHorarioSelecionado] = useState('')
  const [observacoes, setObservacoes] = useState('')
  const [horariosDisponiveis, setHorariosDisponiveis] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingHorarios, setLoadingHorarios] = useState(false)
  const [agendando, setAgendando] = useState(false)
  const [toast, setToast] = useState(null)
  const [pagamentoAntecipado, setPagamentoAntecipado] = useState(false)
  const [showPagamentoModal, setShowPagamentoModal] = useState(false)

  useEffect(() => {
    // Verificar se o usuário é um cliente
    if (user?.tipo !== 'cliente') {
      console.log('❌ Acesso negado: apenas clientes podem fazer agendamentos');
      setToast({ type: 'error', message: 'Apenas clientes podem fazer agendamentos' });
      navigate('/');
      return;
    }
    
    carregarDados()
  }, [estabelecimentoId, user, navigate])

  useEffect(() => {
    if (dataSelecionada && user?.tipo === 'cliente') {
      buscarHorariosDisponiveis()
    }
  }, [dataSelecionada, user])

  const carregarDados = async () => {
    try {
      const estabelecimentoData = await estabelecimentoService.getById(estabelecimentoId)
      setEstabelecimento(estabelecimentoData)
      
      const servicoEncontrado = estabelecimentoData.servicos.find(s => s.id === servicoId)
      setServico(servicoEncontrado)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      setToast({ type: 'error', message: 'Erro ao carregar informações' })
    } finally {
      setLoading(false)
    }
  }

  const buscarHorariosDisponiveis = async () => {
    console.log('🔍 buscarHorariosDisponiveis chamado com:', {
      estabelecimentoId,
      servicoId,
      dataSelecionada,
      userTipo: user?.tipo
    });

    // Verificar se o usuário é um cliente
    if (user?.tipo !== 'cliente') {
      console.log('❌ Acesso negado: apenas clientes podem buscar horários');
      setToast({ type: 'error', message: 'Apenas clientes podem buscar horários disponíveis' });
      return;
    }

    if (!estabelecimentoId || !servicoId || !dataSelecionada) {
      console.log('❌ Parâmetros obrigatórios ausentes');
      setToast({ type: 'error', message: 'Dados necessários não encontrados' });
      return;
    }

    setLoadingHorarios(true)
    try {
      const data = await agendamentoService.getHorariosDisponiveis(
        estabelecimentoId,
        servicoId,
        dataSelecionada
      )
      
      console.log('✅ Dados de horários recebidos:', data);
      
      // Gera horários de exemplo (simplificado)
      const horarios = gerarHorarios(data)
      setHorariosDisponiveis(horarios)
    } catch (error) {
      console.error('❌ Erro ao buscar horários:', error)
      setToast({ type: 'error', message: 'Erro ao buscar horários disponíveis' })
    } finally {
      setLoadingHorarios(false)
    }
  }

  const gerarHorarios = (data) => {
    // Implementação simplificada - gera horários a cada 30 minutos
    const horarios = []
    const ocupados = data.horariosOcupados || []
    
    for (let hora = 9; hora <= 18; hora++) {
      for (let minuto = 0; minuto < 60; minuto += 30) {
        const horario = `${String(hora).padStart(2, '0')}:${String(minuto).padStart(2, '0')}`
        const dataHora = new Date(`${dataSelecionada}T${horario}:00`)
        
        const ocupado = ocupados.some(o => {
          const ocupadoDate = new Date(o)
          return ocupadoDate.getTime() === dataHora.getTime()
        })
        
        horarios.push({
          horario,
          disponivel: !ocupado
        })
      }
    }
    
    return horarios
  }

  const handleAgendar = async () => {
    if (!dataSelecionada || !horarioSelecionado) {
      setToast({ type: 'error', message: 'Selecione uma data e horário' })
      return
    }

    // Se pagamento antecipado está selecionado e estabelecimento tem chave PIX, abrir modal PIX
    if (pagamentoAntecipado && estabelecimento?.chavePix) {
      setShowPagamentoModal(true)
      return
    }

    // Caso contrário, fazer agendamento normal
    await realizarAgendamento()
  }

  const realizarAgendamento = async (dadosPagamento = {}) => {
    setAgendando(true)

    try {
      const dataHora = new Date(`${dataSelecionada}T${horarioSelecionado}:00`)
      
      // Validar se a data é válida
      if (isNaN(dataHora.getTime())) {
        setToast({ type: 'error', message: 'Data ou horário inválido' })
        return
      }
      
      const dadosAgendamento = {
        estabelecimentoId,
        servicoId,
        dataHora: dataHora.toISOString(),
        observacoes,
        ...dadosPagamento
      }

      await agendamentoService.create(dadosAgendamento)

      setToast({ type: 'success', message: 'Agendamento realizado com sucesso!' })
      
      setTimeout(() => {
        navigate('/cliente/dashboard')
      }, 2000)
    } catch (error) {
      console.error('Erro ao agendar:', error)
      setToast({ 
        type: 'error', 
        message: error.response?.data?.error || 'Erro ao realizar agendamento' 
      })
    } finally {
      setAgendando(false)
    }
  }

  const handleConfirmarPagamento = async (dadosPagamento) => {
    setShowPagamentoModal(false)
    await realizarAgendamento(dadosPagamento)
  }

  if (loading) {
    return <Loading fullScreen />
  }

  if (!estabelecimento || !servico) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <p className="text-gray-600">Serviço não encontrado</p>
          <Button onClick={() => navigate('/cliente/dashboard')} className="mt-4">
            Voltar
          </Button>
        </Card>
      </div>
    )
  }

  // Data mínima é hoje
  const dataMinima = new Date().toISOString().split('T')[0]

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

      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate(`/estabelecimento/${estabelecimentoId}`)}
          >
            <ArrowLeft size={20} />
            Voltar
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="font-display text-3xl font-bold text-gray-900 mb-8">
          Novo Agendamento
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Formulário de Agendamento */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <h2 className="font-bold text-xl text-gray-900 mb-4">
                Selecione Data e Horário
              </h2>

              {/* Seleção de Data */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline mr-2" size={16} />
                  Data
                </label>
                <input
                  type="date"
                  min={dataMinima}
                  value={dataSelecionada}
                  onChange={(e) => {
                    setDataSelecionada(e.target.value)
                    setHorarioSelecionado('')
                  }}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                />
              </div>

              {/* Seleção de Horário */}
              {dataSelecionada && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="inline mr-2" size={16} />
                    Horário
                  </label>
                  
                  {loadingHorarios ? (
                    <Loading />
                  ) : (
                    <div className="grid grid-cols-4 gap-2">
                      {horariosDisponiveis.map((item) => (
                        <button
                          key={item.horario}
                          disabled={!item.disponivel}
                          onClick={() => setHorarioSelecionado(item.horario)}
                          className={`
                            px-3 py-2 rounded-lg text-sm font-medium transition-all
                            ${horarioSelecionado === item.horario
                              ? 'bg-primary-600 text-white'
                              : item.disponivel
                                ? 'bg-white border-2 border-gray-300 hover:border-primary-400 text-gray-700'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }
                          `}
                        >
                          {item.horario}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Observações */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observações (opcional)
                </label>
                <textarea
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  rows="3"
                  placeholder="Alguma observação ou preferência?"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                />
              </div>

              {/* Opção de Pagamento PIX */}
              {estabelecimento?.chavePix && (
                <div className="mt-6">
                  <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <QrCode className="text-blue-600 dark:text-blue-400" size={24} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                          Pagamento Antecipado via PIX
                        </h3>
                        <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                          Pague antecipadamente e garante sua vaga! Taxa da plataforma: R$ 5,00
                        </p>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="pagamentoAntecipado"
                            checked={pagamentoAntecipado}
                            onChange={(e) => setPagamentoAntecipado(e.target.checked)}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          />
                          <label htmlFor="pagamentoAntecipado" className="text-sm font-medium text-blue-900 dark:text-blue-100">
                            Quero pagar antecipadamente via PIX
                          </label>
                        </div>
                        {pagamentoAntecipado && (
                          <div className="mt-3 p-3 bg-blue-100 dark:bg-blue-800/30 rounded-lg">
                            <div className="flex justify-between text-sm">
                              <span className="text-blue-800 dark:text-blue-200">Valor do serviço:</span>
                              <span className="font-semibold text-blue-900 dark:text-blue-100">R$ {servico.preco.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-blue-800 dark:text-blue-200">Taxa da plataforma:</span>
                              <span className="font-semibold text-blue-900 dark:text-blue-100">R$ 5,00</span>
                            </div>
                            <div className="flex justify-between text-sm font-bold border-t border-blue-200 dark:border-blue-600 pt-1 mt-1">
                              <span className="text-blue-900 dark:text-blue-100">Total a pagar:</span>
                              <span className="text-blue-900 dark:text-blue-100">R$ {(servico.preco + 5).toFixed(2)}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                </div>
              )}
            </Card>

            <Button
              fullWidth
              size="lg"
              onClick={handleAgendar}
              disabled={!dataSelecionada || !horarioSelecionado || agendando}
            >
              {agendando ? (
                'Agendando...'
              ) : pagamentoAntecipado && estabelecimento?.chavePix ? (
                <>
                  <QrCode size={20} />
                  Pagar via PIX e Agendar
                </>
              ) : (
                <>
                  <Check size={20} />
                  Confirmar Agendamento
                </>
              )}
            </Button>
          </div>

          {/* Resumo */}
          <div>
            <Card>
              <h3 className="font-bold text-lg text-gray-900 mb-4">
                Resumo do Agendamento
              </h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Estabelecimento</p>
                  <p className="font-semibold text-gray-900">{estabelecimento.nome}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-1">Serviço</p>
                  <p className="font-semibold text-gray-900">{servico.nome}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-1">Duração</p>
                  <div className="flex items-center gap-1">
                    <Clock size={16} className="text-gray-600" />
                    <span className="text-gray-900">{servico.duracaoMin} minutos</span>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-1">Valor</p>
                  <div className="flex items-center gap-1">
                    <DollarSign size={16} className="text-primary-600" />
                    <span className="font-bold text-xl text-primary-600">
                      R$ {servico.preco.toFixed(2)}
                    </span>
                  </div>
                  {pagamentoAntecipado && estabelecimento?.chavePix && (
                    <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="flex justify-between text-xs text-blue-700 dark:text-blue-300">
                        <span>Taxa da plataforma:</span>
                        <span>R$ 5,00</span>
                      </div>
                      <div className="flex justify-between text-sm font-bold text-blue-900 dark:text-blue-100 border-t border-blue-200 dark:border-blue-600 pt-1 mt-1">
                        <span>Total:</span>
                        <span>R$ {(servico.preco + 5).toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                </div>
                
                {dataSelecionada && horarioSelecionado && (
                  <>
                    <div className="border-t border-gray-200 pt-4">
                      <p className="text-sm text-gray-500 mb-1">Data Selecionada</p>
                      <p className="font-semibold text-gray-900">
                        {new Date(dataSelecionada).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Horário</p>
                      <p className="font-semibold text-gray-900">{horarioSelecionado}</p>
                    </div>
                  </>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Modal de Pagamento PIX */}
      <PagamentoPixModal
        isOpen={showPagamentoModal}
        onClose={() => setShowPagamentoModal(false)}
        agendamento={{
          id: 'temp-' + Date.now(),
          servico: servico,
          dataHora: dataSelecionada && horarioSelecionado 
            ? new Date(`${dataSelecionada}T${horarioSelecionado}:00`).toISOString()
            : new Date().toISOString()
        }}
        estabelecimento={estabelecimento}
        onConfirmarPagamento={handleConfirmarPagamento}
      />
    </div>
  )
}

export default Agendamento

