import { useState } from 'react'
import { User, Phone, Mail, Calendar, Clock, DollarSign, AlertTriangle, CheckCircle, X, CreditCard, QrCode } from 'lucide-react'
import Modal from './Modal'
import Button from './Button'
import Input from './Input'
import Card from './Card'
import Badge from './Badge'
import Toast from './Toast'
import PagamentoPixModal from './PagamentoPixModal'

const AgendamentoNaoCadastrado = ({ 
  isOpen, 
  onClose, 
  servico, 
  estabelecimento,
  onConfirmarAgendamento 
}) => {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  
  const [dadosCliente, setDadosCliente] = useState({
    nome: '',
    telefone: '',
    email: '',
    observacoes: ''
  })
  
  const [dadosAgendamento, setDadosAgendamento] = useState({
    data: '',
    hora: '',
    servicoId: servico?.id || '',
    valor: servico?.preco || 0
  })

  const [pagamentoAntecipado, setPagamentoAntecipado] = useState(false)
  const [showPagamentoModal, setShowPagamentoModal] = useState(false)

  const isBronzeamento = estabelecimento?.categoria?.toLowerCase().includes('bronze')
  const valorEntrada = isBronzeamento ? (dadosAgendamento.valor * 0.5) : 0

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Simular criação de agendamento
      const agendamentoData = {
        ...dadosCliente,
        ...dadosAgendamento,
        estabelecimentoId: estabelecimento.id,
        tipoCliente: 'nao_cadastrado',
        status: isBronzeamento ? 'pendente_pagamento' : 'confirmado',
        valorEntrada: valorEntrada
      }
      
      await onConfirmarAgendamento(agendamentoData)
      setToast({ type: 'success', message: 'Agendamento criado com sucesso!' })
      onClose()
    } catch (error) {
      setToast({ type: 'error', message: 'Erro ao criar agendamento' })
    } finally {
      setLoading(false)
    }
  }

  const proximoStep = () => {
    if (step === 1) {
      // Validar dados do cliente
      if (!dadosCliente.nome || !dadosCliente.telefone) {
        setToast({ type: 'error', message: 'Nome e telefone são obrigatórios' })
        return
      }
      setStep(2)
    } else if (step === 2) {
      // Validar dados do agendamento
      if (!dadosAgendamento.data || !dadosAgendamento.hora) {
        setToast({ type: 'error', message: 'Data e hora são obrigatórios' })
        return
      }
      setStep(3)
    }
  }

  const stepAnterior = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  return (
    <>
      {toast && (
        <div className="fixed top-4 right-4 z-50">
          <Toast 
            type={toast.type} 
            message={toast.message}
            onClose={() => setToast(null)}
          />
        </div>
      )}

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Agendamento Rápido"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Progress Steps */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step >= stepNumber 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-12 h-0.5 mx-2 ${
                    step > stepNumber ? 'bg-primary-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Dados do Cliente */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <User className="w-12 h-12 text-primary-600 mx-auto mb-2" />
                <h3 className="text-xl font-bold text-gray-900">Dados do Cliente</h3>
                <p className="text-gray-600">Preencha as informações básicas</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nome Completo *"
                  value={dadosCliente.nome}
                  onChange={(e) => setDadosCliente({...dadosCliente, nome: e.target.value})}
                  icon={User}
                  placeholder="Digite seu nome completo"
                />
                
                <Input
                  label="Telefone *"
                  value={dadosCliente.telefone}
                  onChange={(e) => setDadosCliente({...dadosCliente, telefone: e.target.value})}
                  icon={Phone}
                  placeholder="(11) 99999-9999"
                  type="tel"
                />
                
                <Input
                  label="E-mail"
                  value={dadosCliente.email}
                  onChange={(e) => setDadosCliente({...dadosCliente, email: e.target.value})}
                  icon={Mail}
                  placeholder="seu@email.com"
                  type="email"
                />
                
                <div className="md:col-span-2">
                  <Input
                    label="Observações"
                    value={dadosCliente.observacoes}
                    onChange={(e) => setDadosCliente({...dadosCliente, observacoes: e.target.value})}
                    placeholder="Alguma observação especial?"
                    multiline
                    rows={3}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Dados do Agendamento */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <Calendar className="w-12 h-12 text-primary-600 mx-auto mb-2" />
                <h3 className="text-xl font-bold text-gray-900">Dados do Agendamento</h3>
                <p className="text-gray-600">Escolha data, hora e confirme o serviço</p>
              </div>

              <Card className="p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-lg">{servico?.nome}</h4>
                    <p className="text-gray-600">{servico?.descricao}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <Badge variant="primary">
                        <Clock size={14} className="mr-1" />
                        {servico?.duracaoMin} min
                      </Badge>
                      <Badge variant="success">
                        <DollarSign size={14} className="mr-1" />
                        R$ {servico?.preco?.toFixed(2)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Data *"
                  value={dadosAgendamento.data}
                  onChange={(e) => setDadosAgendamento({...dadosAgendamento, data: e.target.value})}
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                />
                
                <Input
                  label="Hora *"
                  value={dadosAgendamento.hora}
                  onChange={(e) => setDadosAgendamento({...dadosAgendamento, hora: e.target.value})}
                  type="time"
                />
              </div>
            </div>
          )}

          {/* Step 3: Confirmação e Pagamento */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-2" />
                <h3 className="text-xl font-bold text-gray-900">Confirmação</h3>
                <p className="text-gray-600">Revise os dados e confirme o agendamento</p>
              </div>

              {/* Informações do Bronzeamento */}
              {isBronzeamento && (
                <Card className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200">
                  <div className="flex items-start gap-3 mb-4">
                    <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold text-lg text-amber-800 mb-2">
                        ⚠ Preparação Para Bronzeamento
                      </h4>
                      <div className="space-y-2 text-sm text-amber-700">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <div>
                            <p className="font-semibold mb-1">✅ O que levar:</p>
                            <ul className="space-y-1 text-xs">
                              <li>🟢 Ir bem alimentada</li>
                              <li>🟢 Ir com a pele limpa</li>
                              <li>🟢 Não passar cremes ou óleos</li>
                              <li>🟢 Ir com roupas leves e chinelos</li>
                              <li>🟢 Levar Prendedor de cabelo</li>
                              <li>🟢 Protetor solar para rosto</li>
                              <li>🟢 Levar 1 toalha de banho</li>
                            </ul>
                          </div>
                          <div>
                            <p className="font-semibold mb-1">❌ Proibições:</p>
                            <ul className="space-y-1 text-xs">
                              <li>📵 Proibido o uso de celular durante o bronze</li>
                              <li>🚫 Proibido levar Crianças</li>
                              <li>🚫 Proibido acompanhantes que não forem realizar o procedimento</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-amber-100 p-4 rounded-lg">
                    <div className="text-center">
                      <p className="font-bold text-amber-800 mb-2">
                        💙 Atendemos todos os dias com horário agendado
                      </p>
                      <p className="text-sm text-amber-700 mb-3">
                        🆘 Para confirmar seu horário é necessário fazer 50% do valor pelo PIX
                      </p>
                      <div className="bg-white p-3 rounded-lg border-2 border-amber-300">
                        <p className="font-bold text-amber-800">PIX: 31999885467</p>
                        <p className="text-sm text-amber-700">Roberta Cristina</p>
                        <p className="text-xs text-amber-600 mt-1">Favor enviar o comprovante</p>
                      </div>
                      <div className="mt-3 text-xs text-amber-700">
                        <p>🆘 Cancelamentos devem ser feitos no mínimo 24 horas antes</p>
                        <p>❌ No caso de falta (bolo) sujeito a multa❗</p>
                        <p>✅ Servimos Café da manhã</p>
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              {/* Resumo do Agendamento */}
              <Card className="p-4">
                <h4 className="font-bold text-lg mb-4">Resumo do Agendamento</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cliente:</span>
                    <span className="font-semibold">{dadosCliente.nome}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Telefone:</span>
                    <span className="font-semibold">{dadosCliente.telefone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Serviço:</span>
                    <span className="font-semibold">{servico?.nome}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Data/Hora:</span>
                    <span className="font-semibold">
                      {new Date(dadosAgendamento.data).toLocaleDateString('pt-BR')} às {dadosAgendamento.hora}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Valor Total:</span>
                    <span className="font-semibold">R$ {dadosAgendamento.valor?.toFixed(2)}</span>
                  </div>
                  {isBronzeamento && (
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-amber-600 font-bold">Entrada (50%):</span>
                      <span className="text-amber-600 font-bold">R$ {valorEntrada.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </Card>

              {/* Opção de Pagamento Antecipado */}
              {estabelecimento?.chavePix && (
                <Card className="p-4 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-3 flex items-center gap-2">
                    <CreditCard size={20} />
                    Pagamento Antecipado via PIX
                  </h4>
                  <div className="space-y-3">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Pague antecipadamente e garante seu horário! Inclui taxa de R$ 5,00 da plataforma.
                    </p>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="pagamento-antecipado"
                        checked={pagamentoAntecipado}
                        onChange={(e) => setPagamentoAntecipado(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="pagamento-antecipado" className="text-sm text-blue-700 dark:text-blue-300">
                        Quero pagar antecipadamente via PIX
                      </label>
                    </div>
                    {pagamentoAntecipado && (
                      <div className="mt-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-blue-200 dark:border-blue-600">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Valor do serviço:</span>
                          <span className="font-medium">R$ {dadosAgendamento.valor?.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Taxa da plataforma:</span>
                          <span className="font-medium">R$ 5,00</span>
                        </div>
                        <div className="flex justify-between items-center border-t pt-2">
                          <span className="font-semibold text-gray-900 dark:text-white">Total a pagar:</span>
                          <span className="font-bold text-blue-600 dark:text-blue-400">R$ {(dadosAgendamento.valor + 5).toFixed(2)}</span>
                        </div>
                        <Button
                          onClick={() => setShowPagamentoModal(true)}
                          size="sm"
                          className="w-full mt-3"
                        >
                          <QrCode size={16} className="mr-2" />
                          Pagar via PIX
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              )}

              {/* Status do Agendamento */}
              <div className="text-center">
                {isBronzeamento ? (
                  <div className="bg-amber-100 border-2 border-amber-300 rounded-lg p-4">
                    <AlertTriangle className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                    <p className="font-bold text-amber-800 mb-2">
                      Agendamento Pendente de Confirmação
                    </p>
                    <p className="text-sm text-amber-700">
                      Envie o comprovante do PIX para confirmar seu horário
                    </p>
                  </div>
                ) : (
                  <div className="bg-green-100 border-2 border-green-300 rounded-lg p-4">
                    <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="font-bold text-green-800 mb-2">
                      Agendamento Confirmado
                    </p>
                    <p className="text-sm text-green-700">
                      Você receberá uma confirmação por WhatsApp
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Botões de Navegação */}
          <div className="flex justify-between pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={step === 1 ? onClose : stepAnterior}
              disabled={loading}
            >
              <X className="w-4 h-4 mr-2" />
              {step === 1 ? 'Cancelar' : 'Voltar'}
            </Button>
            
            {step < 3 ? (
              <Button
                type="button"
                onClick={proximoStep}
                disabled={loading}
              >
                Próximo
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={loading}
                className="bg-green-600 hover:bg-green-700"
              >
                {loading ? 'Criando...' : 'Confirmar Agendamento'}
              </Button>
            )}
          </div>
        </form>
      </Modal>

      {/* Modal de Pagamento PIX */}
      <PagamentoPixModal
        isOpen={showPagamentoModal}
        onClose={() => setShowPagamentoModal(false)}
        agendamento={{
          id: 'temp-' + Date.now(), // ID temporário
          servico: servico,
          dataHora: new Date(`${dadosAgendamento.data}T${dadosAgendamento.hora}`).toISOString()
        }}
        estabelecimento={estabelecimento}
        onConfirmarPagamento={() => {
          setShowPagamentoModal(false)
          setToast({ type: 'success', message: 'Pagamento processado! Aguarde a confirmação.' })
        }}
      />
    </>
  )
}

export default AgendamentoNaoCadastrado
