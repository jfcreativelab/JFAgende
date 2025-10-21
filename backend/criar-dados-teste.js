import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function criarDadosTeste() {
  try {
    console.log('🔧 Criando dados de teste para relatórios...')

    // Buscar um estabelecimento existente
    const estabelecimento = await prisma.estabelecimento.findFirst({
      include: {
        servicos: true
      }
    })

    if (!estabelecimento) {
      console.log('❌ Nenhum estabelecimento encontrado. Execute o seed primeiro.')
      return
    }

    console.log(`📋 Estabelecimento encontrado: ${estabelecimento.nome}`)
    console.log(`📋 Serviços disponíveis: ${estabelecimento.servicos.length}`)

    if (estabelecimento.servicos.length === 0) {
      console.log('❌ Nenhum serviço encontrado. Criando serviços de teste...')
      
      // Criar serviços de teste
      await prisma.servico.createMany({
        data: [
          {
            nome: 'Corte de Cabelo',
            descricao: 'Corte moderno e estiloso',
            duracaoMin: 30,
            preco: 50.00,
            estabelecimentoId: estabelecimento.id
          },
          {
            nome: 'Escova',
            descricao: 'Escova lisa ou cacheada',
            duracaoMin: 60,
            preco: 80.00,
            estabelecimentoId: estabelecimento.id
          },
          {
            nome: 'Coloração',
            descricao: 'Coloração completa',
            duracaoMin: 120,
            preco: 150.00,
            estabelecimentoId: estabelecimento.id
          }
        ]
      })

      // Recarregar estabelecimento com serviços
      const estabelecimentoAtualizado = await prisma.estabelecimento.findUnique({
        where: { id: estabelecimento.id },
        include: { servicos: true }
      })

      estabelecimento.servicos = estabelecimentoAtualizado.servicos
    }

    // Verificar quantos agendamentos já existem
    const agendamentosExistentes = await prisma.agendamento.count({
      where: { estabelecimentoId: estabelecimento.id }
    })

    console.log(`📊 Agendamentos existentes: ${agendamentosExistentes}`)
    
    if (agendamentosExistentes >= 25) {
      console.log(`✅ Já existem ${agendamentosExistentes} agendamentos suficientes para testes.`)
      return
    }

    console.log('📝 Criando mais agendamentos de teste...')

    // Criar cliente de teste se não existir
    let clienteTeste = await prisma.cliente.findFirst({
      where: { email: 'cliente.teste@jfagende.com' }
    })

    if (!clienteTeste) {
      console.log('👤 Criando cliente de teste...')
      clienteTeste = await prisma.cliente.create({
        data: {
          nome: 'Cliente Teste',
          email: 'cliente.teste@jfagende.com',
          senhaHash: '$2a$10$abcdefghijklmnopqrstuu', // Hash qualquer (não será usado para login)
          telefone: '(11) 99999-9999'
        }
      })
    }

    console.log('👤 Cliente de teste:', clienteTeste.nome)

    // Criar agendamentos de teste
    const agendamentos = []
    const hoje = new Date()
    
    // Agendamentos do mês atual
    for (let i = 0; i < 15; i++) {
      const dataHora = new Date(hoje)
      dataHora.setDate(hoje.getDate() + i)
      dataHora.setHours(9 + (i % 8), 0, 0, 0)

      const servico = estabelecimento.servicos[i % estabelecimento.servicos.length]
      
      agendamentos.push({
        dataHora,
        status: ['PENDENTE', 'CONFIRMADO', 'CONCLUIDO', 'CANCELADO'][i % 4],
        observacoes: `Agendamento de teste ${i + 1}`,
        estabelecimentoId: estabelecimento.id,
        servicoId: servico.id,
        clienteId: clienteTeste.id
      })
    }

    // Agendamentos do mês anterior
    const mesAnterior = new Date(hoje)
    mesAnterior.setMonth(mesAnterior.getMonth() - 1)
    
    for (let i = 0; i < 10; i++) {
      const dataHora = new Date(mesAnterior)
      dataHora.setDate(mesAnterior.getDate() + i)
      dataHora.setHours(10 + (i % 6), 0, 0, 0)

      const servico = estabelecimento.servicos[i % estabelecimento.servicos.length]
      
      agendamentos.push({
        dataHora,
        status: 'CONCLUIDO',
        observacoes: `Agendamento anterior ${i + 1}`,
        estabelecimentoId: estabelecimento.id,
        servicoId: servico.id,
        clienteId: clienteTeste.id
      })
    }

    await prisma.agendamento.createMany({
      data: agendamentos
    })

    // Buscar alguns agendamentos concluídos para criar avaliações
    const agendamentosConcluidos = await prisma.agendamento.findMany({
      where: {
        estabelecimentoId: estabelecimento.id,
        status: 'CONCLUIDO'
      },
      take: 3,
      orderBy: { criadoEm: 'desc' }
    })

    // Criar avaliações para os agendamentos concluídos
    if (agendamentosConcluidos.length > 0) {
      const avaliacoesData = agendamentosConcluidos.map((agendamento, index) => ({
        nota: [5, 4, 5][index],
        comentario: ['Excelente atendimento!', 'Muito bom, recomendo.', 'Perfeito!'][index],
        estabelecimentoId: estabelecimento.id,
        clienteId: clienteTeste.id,
        agendamentoId: agendamento.id
      }))

      await prisma.avaliacao.createMany({
        data: avaliacoesData
      })
    }

    console.log('✅ Dados de teste criados com sucesso!')
    console.log(`📊 ${agendamentos.length} agendamentos criados`)
    console.log('📊 3 avaliações criadas')
    console.log('🎯 Agora teste a página de relatórios!')

  } catch (error) {
    console.error('❌ Erro ao criar dados de teste:', error)
  } finally {
    await prisma.$disconnect()
  }
}

criarDadosTeste()

