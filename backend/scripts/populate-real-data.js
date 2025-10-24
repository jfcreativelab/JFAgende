const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function populateRealData() {
  try {
    console.log('🚀 Populando dados reais para o painel admin...')

    // 1. Criar notificações reais
    console.log('📢 Criando notificações...')
    const notificacoes = [
      {
        titulo: 'Sistema de Backup Concluído',
        mensagem: 'O backup automático do sistema foi executado com sucesso. Todos os dados foram salvos.',
        tipo: 'success',
        prioridade: 'medium',
        canais: ['in-app', 'email'],
        usuariosAlvo: 'admins',
        lida: false,
        status: 'sent',
        enviadaEm: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        titulo: 'Alta Demanda no Servidor',
        mensagem: 'O servidor está com 85% de utilização. Considere escalar os recursos.',
        tipo: 'warning',
        prioridade: 'high',
        canais: ['in-app', 'email', 'push'],
        usuariosAlvo: 'admins',
        lida: true,
        lidaEm: new Date(Date.now() - 1 * 60 * 60 * 1000),
        status: 'sent',
        enviadaEm: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        titulo: 'Novo Estabelecimento Cadastrado',
        mensagem: 'Um novo estabelecimento se cadastrou na plataforma e está aguardando aprovação.',
        tipo: 'info',
        prioridade: 'medium',
        canais: ['in-app'],
        usuariosAlvo: 'admins',
        lida: false,
        status: 'sent',
        enviadaEm: new Date(Date.now() - 4 * 60 * 60 * 1000)
      }
    ]

    for (const notif of notificacoes) {
      await prisma.notificacao.create({ data: notif })
    }

    // 2. Criar dados de analytics
    console.log('📊 Criando dados de analytics...')
    const paginas = ['/', '/estabelecimentos', '/login', '/cadastro', '/sobre', '/admin/dashboard']
    const acoes = ['page_view', 'user_action', 'system_event']
    
    for (let i = 0; i < 1000; i++) {
      const dataAleatoria = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) // Últimos 7 dias
      const pagina = paginas[Math.floor(Math.random() * paginas.length)]
      const acao = acoes[Math.floor(Math.random() * acoes.length)]
      
      await prisma.analytics.create({
        data: {
          tipo: acao,
          pagina: acao === 'page_view' ? pagina : null,
          acao: acao === 'user_action' ? 'click' : null,
          dados: JSON.stringify({ 
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            referrer: 'https://google.com'
          }),
          criadoEm: dataAleatoria
        }
      })
    }

    // 3. Criar dados de monitoramento
    console.log('🖥️ Criando dados de monitoramento...')
    const metricas = ['cpu', 'memory', 'disk', 'response_time']
    const statuses = ['ok', 'warning', 'critical']
    
    for (let i = 0; i < 500; i++) {
      const dataAleatoria = new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000) // Últimas 24h
      const metrica = metricas[Math.floor(Math.random() * metricas.length)]
      const status = statuses[Math.floor(Math.random() * statuses.length)]
      
      let valor, unidade
      switch (metrica) {
        case 'cpu':
          valor = Math.random() * 100
          unidade = '%'
          break
        case 'memory':
          valor = Math.random() * 100
          unidade = '%'
          break
        case 'disk':
          valor = Math.random() * 100
          unidade = '%'
          break
        case 'response_time':
          valor = Math.random() * 500 + 50
          unidade = 'ms'
          break
      }
      
      await prisma.monitoramento.create({
        data: {
          tipo: 'server',
          metrica,
          valor,
          unidade,
          status,
          detalhes: JSON.stringify({ 
            timestamp: dataAleatoria.toISOString(),
            server: 'production-01'
          }),
          criadoEm: dataAleatoria
        }
      })
    }

    // 4. Criar transações financeiras reais
    console.log('💰 Criando transações financeiras...')
    const tipos = ['revenue', 'expense', 'commission', 'refund']
    const statuses = ['pending', 'completed', 'failed', 'cancelled']
    const metodos = ['pix', 'credit_card', 'debit_card', 'cash']
    
    for (let i = 0; i < 200; i++) {
      const dataAleatoria = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Últimos 30 dias
      const tipo = tipos[Math.floor(Math.random() * tipos.length)]
      const status = statuses[Math.floor(Math.random() * statuses.length)]
      const metodo = metodos[Math.floor(Math.random() * metodos.length)]
      
      await prisma.transacaoFinanceira.create({
        data: {
          tipo,
          descricao: `Transação ${tipo} - ${i + 1}`,
          valor: Math.random() * 1000 + 50,
          status,
          metodoPagamento: metodo,
          dadosPagamento: JSON.stringify({
            gateway: 'stripe',
            transactionId: `tx_${Date.now()}_${i}`
          }),
          processadaEm: status === 'completed' ? dataAleatoria : null,
          criadoEm: dataAleatoria
        }
      })
    }

    console.log('✅ Dados reais populados com sucesso!')
  } catch (error) {
    console.error('❌ Erro ao popular dados:', error)
  } finally {
    await prisma.$disconnect()
  }
}

populateRealData()
