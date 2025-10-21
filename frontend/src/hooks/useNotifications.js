import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import clienteService from '../services/clienteService'
import agendamentoService from '../services/agendamentoService'

export const useNotifications = () => {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      gerarNotificacoes()
    }
  }, [user])

  const gerarNotificacoes = async () => {
    try {
      const notificacoesGeradas = []
      const agora = new Date()
      
      if (user.tipo === 'cliente') {
        // Buscar agendamentos do cliente
        const agendamentos = await clienteService.getAgendamentos(user.id)
        
        // Notificações de agendamentos confirmados (últimas 24h)
        const confirmadosRecentes = agendamentos.filter(a => {
          const dataAgendamento = new Date(a.dataHora)
          const diffHoras = (agora - dataAgendamento) / (1000 * 60 * 60)
          return a.status === 'CONFIRMADO' && diffHoras < 24 && diffHoras > 0
        })

        confirmadosRecentes.forEach(a => {
          notificacoesGeradas.push({
            id: `conf-${a.id}`,
            tipo: 'confirmacao',
            titulo: '✅ Agendamento Confirmado',
            mensagem: `Seu agendamento em ${a.estabelecimento?.nome} foi confirmado!`,
            criadoEm: a.dataHora,
            lida: false
          })
        })

        // Lembretes de agendamentos próximos (próximas 24h)
        const proximosAgendamentos = agendamentos.filter(a => {
          const dataAgendamento = new Date(a.dataHora)
          const diffHoras = (dataAgendamento - agora) / (1000 * 60 * 60)
          return (a.status === 'CONFIRMADO' || a.status === 'PENDENTE') && diffHoras > 0 && diffHoras <= 24
        })

        proximosAgendamentos.forEach(a => {
          const dataAgendamento = new Date(a.dataHora)
          const diffHoras = Math.floor((dataAgendamento - agora) / (1000 * 60 * 60))
          
          notificacoesGeradas.push({
            id: `lembrete-${a.id}`,
            tipo: 'lembrete',
            titulo: '⏰ Lembrete de Agendamento',
            mensagem: `Seu agendamento em ${a.estabelecimento?.nome} é em ${diffHoras}h. Não esqueça!`,
            criadoEm: new Date(agora.getTime() - 30 * 60000), // 30 min atrás
            lida: false
          })
        })

        // Agendamentos pendentes de confirmação
        const pendentes = agendamentos.filter(a => a.status === 'PENDENTE')
        if (pendentes.length > 0) {
          notificacoesGeradas.push({
            id: 'pendentes',
            tipo: 'agendamento',
            titulo: '📅 Agendamentos Pendentes',
            mensagem: `Você tem ${pendentes.length} agendamento(s) aguardando confirmação.`,
            criadoEm: new Date(agora.getTime() - 60 * 60000), // 1h atrás
            lida: false
          })
        }

        // Lembrete de avaliação (agendamentos concluídos sem avaliação)
        const concluidosSemAvaliacao = agendamentos.filter(a => {
          const dataAgendamento = new Date(a.dataHora)
          const diffDias = (agora - dataAgendamento) / (1000 * 60 * 60 * 24)
          return a.status === 'CONCLUIDO' && diffDias < 7 && diffDias > 0
        })

        if (concluidosSemAvaliacao.length > 0) {
          notificacoesGeradas.push({
            id: 'avaliar',
            tipo: 'lembrete',
            titulo: '⭐ Avalie seu Atendimento',
            mensagem: `Você tem ${concluidosSemAvaliacao.length} serviço(s) para avaliar. Sua opinião é importante!`,
            criadoEm: new Date(agora.getTime() - 120 * 60000), // 2h atrás
            lida: false
          })
        }
      } 
      
      else if (user.tipo === 'estabelecimento') {
        // Buscar agendamentos do estabelecimento
        const agendamentos = await agendamentoService.getByEstabelecimento(user.id)
        
        // Novos agendamentos pendentes
        const pendentes = agendamentos.filter(a => a.status === 'PENDENTE')
        if (pendentes.length > 0) {
          notificacoesGeradas.push({
            id: 'novos-agendamentos',
            tipo: 'agendamento',
            titulo: '🔔 Novos Agendamentos',
            mensagem: `Você tem ${pendentes.length} novo(s) agendamento(s) aguardando confirmação.`,
            criadoEm: new Date(agora.getTime() - 15 * 60000), // 15 min atrás
            lida: false
          })
        }

        // Agendamentos de hoje
        const hoje = new Date()
        hoje.setHours(0, 0, 0, 0)
        const agendamentosHoje = agendamentos.filter(a => {
          const dataAgendamento = new Date(a.dataHora)
          dataAgendamento.setHours(0, 0, 0, 0)
          return dataAgendamento.getTime() === hoje.getTime() && 
                 (a.status === 'CONFIRMADO' || a.status === 'PENDENTE')
        })

        if (agendamentosHoje.length > 0) {
          notificacoesGeradas.push({
            id: 'hoje',
            tipo: 'lembrete',
            titulo: '📅 Agendamentos de Hoje',
            mensagem: `Você tem ${agendamentosHoje.length} agendamento(s) confirmado(s) para hoje.`,
            criadoEm: new Date(agora.getTime() - 180 * 60000), // 3h atrás
            lida: false
          })
        }

        // Próximo agendamento (próxima 1h)
        const proximoAgendamento = agendamentos
          .filter(a => {
            const dataAgendamento = new Date(a.dataHora)
            const diffMinutos = (dataAgendamento - agora) / (1000 * 60)
            return (a.status === 'CONFIRMADO') && diffMinutos > 0 && diffMinutos <= 60
          })
          .sort((a, b) => new Date(a.dataHora) - new Date(b.dataHora))[0]

        if (proximoAgendamento) {
          const dataAgendamento = new Date(proximoAgendamento.dataHora)
          const diffMinutos = Math.floor((dataAgendamento - agora) / (1000 * 60))
          
          notificacoesGeradas.push({
            id: `proximo-${proximoAgendamento.id}`,
            tipo: 'lembrete',
            titulo: '⏰ Próximo Cliente',
            mensagem: `${proximoAgendamento.cliente?.nome} chega em ${diffMinutos} minutos para ${proximoAgendamento.servico?.nome}.`,
            criadoEm: new Date(agora.getTime() - 10 * 60000), // 10 min atrás
            lida: false
          })
        }
      }

      // Ordenar por data (mais recentes primeiro)
      notificacoesGeradas.sort((a, b) => new Date(b.criadoEm) - new Date(a.criadoEm))

      // Limitar a 10 notificações
      setNotifications(notificacoesGeradas.slice(0, 10))
    } catch (error) {
      console.error('Erro ao gerar notificações:', error)
      setNotifications([])
    } finally {
      setLoading(false)
    }
  }

  const marcarComoLida = (notificationId) => {
    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, lida: true } : n)
    )
  }

  const marcarTodasComoLidas = () => {
    setNotifications(prev => prev.map(n => ({ ...n, lida: true })))
  }

  const limparNotificacoes = () => {
    setNotifications([])
  }

  return {
    notifications,
    loading,
    marcarComoLida,
    marcarTodasComoLidas,
    limparNotificacoes,
    recarregar: gerarNotificacoes
  }
}


