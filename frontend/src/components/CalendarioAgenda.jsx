import { useState, useEffect, useMemo } from 'react'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay, addHours, startOfMonth, endOfMonth, addMonths } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { Clock, Ban, User, MessageSquare, X, Phone } from 'lucide-react'
import Modal from './Modal'
import Button from './Button'
import Input from './Input'
import Badge from './Badge'
import Toast from './Toast'

const locales = { 'pt-BR': ptBR }

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { locale: ptBR }),
  getDay,
  locales,
})

const CalendarioAgenda = ({ 
  agendamentos = [], 
  bloqueios = [], 
  onRefresh,
  onCreateBloqueio,
  onDeleteBloqueio,
  onWhatsAppClick
}) => {
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [showBloqueioModal, setShowBloqueioModal] = useState(false)
  const [bloqueioData, setBloqueioData] = useState({
    dataInicio: '',
    dataFim: '',
    motivo: ''
  })
  const [toast, setToast] = useState(null)
  const [currentDate, setCurrentDate] = useState(new Date())

  // Converte agendamentos e bloqueios para eventos do calendário
  const events = useMemo(() => {
    const agendamentosEvents = agendamentos.map(agendamento => ({
      id: agendamento.id,
      title: `${agendamento.servico.nome} - ${agendamento.cliente.nome}`,
      start: new Date(agendamento.dataHora),
      end: addHours(new Date(agendamento.dataHora), agendamento.servico.duracaoMin / 60),
      resource: {
        tipo: 'agendamento',
        data: agendamento
      }
    }))

    const bloqueiosEvents = bloqueios.map(bloqueio => ({
      id: bloqueio.id,
      title: `🚫 Bloqueado${bloqueio.motivo ? `: ${bloqueio.motivo}` : ''}`,
      start: new Date(bloqueio.dataInicio),
      end: new Date(bloqueio.dataFim),
      resource: {
        tipo: 'bloqueio',
        data: bloqueio
      }
    }))

    return [...agendamentosEvents, ...bloqueiosEvents]
  }, [agendamentos, bloqueios])

  // Estilo dos eventos
  const eventStyleGetter = (event) => {
    const isBloqueio = event.resource.tipo === 'bloqueio'
    const agendamento = event.resource.data

    let backgroundColor = '#9333ea' // primary
    
    if (isBloqueio) {
      backgroundColor = '#ef4444' // red
    } else if (agendamento?.status === 'PENDENTE') {
      backgroundColor = '#eab308' // yellow
    } else if (agendamento?.status === 'CONFIRMADO') {
      backgroundColor = '#22c55e' // green
    } else if (agendamento?.status === 'CANCELADO') {
      backgroundColor = '#6b7280' // gray
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '8px',
        opacity: 0.9,
        color: 'white',
        border: '0px',
        display: 'block',
        padding: '4px 8px',
        fontSize: '13px',
        fontWeight: '500'
      }
    }
  }

  const handleSelectEvent = (event) => {
    setSelectedEvent(event)
    setShowModal(true)
  }

  const handleSelectSlot = ({ start, end }) => {
    setBloqueioData({
      dataInicio: start.toISOString(),
      dataFim: end.toISOString(),
      motivo: ''
    })
    setShowBloqueioModal(true)
  }

  const handleCreateBloqueio = async () => {
    try {
      await onCreateBloqueio(bloqueioData)
      setShowBloqueioModal(false)
      setBloqueioData({ dataInicio: '', dataFim: '', motivo: '' })
      setToast({ type: 'success', message: 'Horário bloqueado com sucesso!' })
      if (onRefresh) onRefresh()
    } catch (error) {
      setToast({ 
        type: 'error', 
        message: error.response?.data?.error || 'Erro ao bloquear horário' 
      })
    }
  }

  const handleDeleteBloqueio = async (id) => {
    if (!confirm('Deseja remover este bloqueio?')) return
    
    try {
      await onDeleteBloqueio(id)
      setShowModal(false)
      setToast({ type: 'success', message: 'Bloqueio removido!' })
      if (onRefresh) onRefresh()
    } catch (error) {
      setToast({ type: 'error', message: 'Erro ao remover bloqueio' })
    }
  }

  const handleWhatsApp = async (agendamentoId) => {
    try {
      const { linkWhatsApp } = await onWhatsAppClick(agendamentoId)
      window.open(linkWhatsApp, '_blank')
      setToast({ type: 'success', message: 'Link do WhatsApp gerado!' })
    } catch (error) {
      setToast({ type: 'error', message: 'Erro ao gerar link' })
    }
  }

  const formatDateTime = (date) => {
    if (!date) return ''
    try {
      const dateObj = new Date(date)
      if (isNaN(dateObj.getTime())) return ''
      return format(dateObj, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
    } catch (error) {
      return ''
    }
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

  return (
    <div className="h-[700px] bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
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

      {/* Legenda */}
      <div className="flex items-center gap-4 mb-4 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-500 rounded"></div>
          <span className="text-sm text-gray-700 dark:text-gray-300">Pendente</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span className="text-sm text-gray-700 dark:text-gray-300">Confirmado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span className="text-sm text-gray-700 dark:text-gray-300">Bloqueado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-500 rounded"></div>
          <span className="text-sm text-gray-700 dark:text-gray-300">Cancelado</span>
        </div>
      </div>

      {/* Calendário */}
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '600px' }}
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
        selectable
        eventPropGetter={eventStyleGetter}
        messages={{
          next: 'Próximo',
          previous: 'Anterior',
          today: 'Hoje',
          month: 'Mês',
          week: 'Semana',
          day: 'Dia',
          agenda: 'Agenda',
          date: 'Data',
          time: 'Hora',
          event: 'Evento',
          noEventsInRange: 'Nenhum evento neste período',
        }}
        views={['month', 'week', 'day', 'agenda']}
        defaultView="week"
      />

      {/* Modal de Detalhes do Evento */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={selectedEvent?.resource.tipo === 'bloqueio' ? 'Bloqueio de Horário' : 'Detalhes do Agendamento'}
      >
        {selectedEvent && (
          <div className="space-y-4">
            {selectedEvent.resource.tipo === 'agendamento' ? (
              <>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-lg">
                    <User className="text-primary-600 dark:text-primary-400" size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {selectedEvent.resource.data.cliente.nome}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedEvent.resource.data.cliente.telefone}
                    </p>
                  </div>
                  <Badge variant={getStatusColor(selectedEvent.resource.data.status)}>
                    {selectedEvent.resource.data.status}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock size={16} className="text-gray-500" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {formatDateTime(selectedEvent.start)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MessageSquare size={16} className="text-gray-500" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {selectedEvent.resource.data.servico.nome}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock size={16} className="text-gray-500" />
                    <span className="text-gray-700 dark:text-gray-300">
                      Duração: {selectedEvent.resource.data.servico.duracaoMin} min
                    </span>
                  </div>
                </div>

                {selectedEvent.resource.data.observacoes && (
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <strong>Obs:</strong> {selectedEvent.resource.data.observacoes}
                    </p>
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  <Button
                    fullWidth
                    onClick={() => handleWhatsApp(selectedEvent.id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Phone size={18} />
                    Enviar WhatsApp
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
                    <Ban className="text-red-600 dark:text-red-400" size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Horário Bloqueado
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {formatDateTime(selectedEvent.start)} até {formatDateTime(selectedEvent.end)}
                    </p>
                  </div>
                </div>

                {selectedEvent.resource.data.motivo && (
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <strong>Motivo:</strong> {selectedEvent.resource.data.motivo}
                    </p>
                  </div>
                )}

                <Button
                  fullWidth
                  variant="danger"
                  onClick={() => handleDeleteBloqueio(selectedEvent.id)}
                >
                  <X size={18} />
                  Remover Bloqueio
                </Button>
              </>
            )}
          </div>
        )}
      </Modal>

      {/* Modal de Criar Bloqueio */}
      <Modal
        isOpen={showBloqueioModal}
        onClose={() => setShowBloqueioModal(false)}
        title="Bloquear Horário"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowBloqueioModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateBloqueio}>
              Bloquear
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Bloqueie horários para impedir novos agendamentos. Útil para férias, feriados ou compromissos pessoais.
          </p>

          <Input
            label="Motivo (opcional)"
            type="text"
            placeholder="Ex: Férias, Feriado, Compromisso pessoal"
            value={bloqueioData.motivo}
            onChange={(e) => setBloqueioData({ ...bloqueioData, motivo: e.target.value })}
          />

          {bloqueioData.dataInicio && bloqueioData.dataFim && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-400">
                📅 {formatDateTime(bloqueioData.dataInicio)} até {formatDateTime(bloqueioData.dataFim)}
              </p>
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}

export default CalendarioAgenda

