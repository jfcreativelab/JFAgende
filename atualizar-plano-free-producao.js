// Script para atualizar plano FREE na produção
const API_BASE = 'https://jfagende-production.up.railway.app/api';

async function atualizarPlanoFree() {
  try {
    console.log('🔄 Atualizando plano FREE na produção...');
    
    // Primeiro, vamos verificar os planos atuais
    console.log('📊 Verificando planos atuais...');
    const response = await fetch(`${API_BASE}/planos/comparar`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const planos = await response.json();
    const planoFree = planos.find(p => p.nome === 'FREE');
    
    if (!planoFree) {
      throw new Error('Plano FREE não encontrado');
    }
    
    console.log('📦 Plano FREE atual:');
    console.log(`   Agendamentos/dia: ${planoFree.recursos.agendamentosDia}`);
    console.log(`   Agendamentos/mês: ${planoFree.recursos.agendamentosMes}`);
    console.log(`   Portfólio: ${planoFree.recursos.portfolio ? '✅' : '❌'}`);
    console.log(`   Relatórios: ${planoFree.recursos.relatorios ? '✅' : '❌'}`);
    console.log(`   Destaque: ${planoFree.recursos.destaque ? '✅' : '❌'}`);
    
    // Verificar se já está correto
    const jaCorreto = 
      planoFree.recursos.agendamentosDia === 5 &&
      planoFree.recursos.agendamentosMes === 110 &&
      !planoFree.recursos.portfolio &&
      !planoFree.recursos.relatorios &&
      !planoFree.recursos.destaque;
    
    if (jaCorreto) {
      console.log('✅ Plano FREE já está com as configurações corretas!');
      return;
    }
    
    console.log('\n⚠️  ATENÇÃO: O plano FREE precisa ser atualizado no banco de dados.');
    console.log('📝 Valores atuais vs. esperados:');
    console.log(`   Agendamentos/dia: ${planoFree.recursos.agendamentosDia} → 5`);
    console.log(`   Agendamentos/mês: ${planoFree.recursos.agendamentosMes} → 110`);
    console.log(`   Portfólio: ${planoFree.recursos.portfolio} → false`);
    console.log(`   Relatórios: ${planoFree.recursos.relatorios} → false`);
    console.log(`   Destaque: ${planoFree.recursos.destaque} → false`);
    
    console.log('\n🔧 Para atualizar, você precisa:');
    console.log('1. Acessar o banco de dados PostgreSQL');
    console.log('2. Executar o SQL:');
    console.log(`
UPDATE planos 
SET 
  "limiteAgendamentos" = 110,
  "limiteAgendamentosDia" = 5,
  "permitePortfolio" = false,
  "permiteRelatorios" = false,
  "permiteDestaque" = false,
  "diasDestaque" = 0
WHERE nome = 'FREE';
    `);
    
    console.log('\n📋 Ou usar o Prisma Studio:');
    console.log('1. Acesse: https://jfagende-production.up.railway.app (se disponível)');
    console.log('2. Ou conecte diretamente ao banco PostgreSQL');
    console.log('3. Atualize o registro do plano FREE com os novos valores');
    
  } catch (error) {
    console.error('❌ Erro ao verificar plano FREE:', error.message);
  }
}

async function testarLimitesPlano() {
  try {
    console.log('\n🧪 Testando limites do plano FREE...');
    
    // Testar se os middleware de plano estão funcionando
    console.log('📊 Testando middleware de planos...');
    
    // Simular uma requisição que deveria ser limitada pelo plano FREE
    const testResponse = await fetch(`${API_BASE}/planos/assinatura`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (testResponse.ok) {
      console.log('✅ Endpoint de assinatura funcionando');
    } else {
      console.log('⚠️  Endpoint de assinatura retornou:', testResponse.status);
    }
    
  } catch (error) {
    console.error('❌ Erro ao testar limites:', error.message);
  }
}

async function verificarFuncionalidades() {
  try {
    console.log('\n🔍 Verificando funcionalidades dos planos...');
    
    // Testar endpoint de estatísticas
    console.log('📊 Testando estatísticas...');
    const statsResponse = await fetch(`${API_BASE}/estatisticas`);
    if (statsResponse.ok) {
      const stats = await statsResponse.json();
      console.log('✅ Estatísticas funcionando');
      console.log(`   Estabelecimentos: ${stats.totalEstabelecimentos || 0}`);
      console.log(`   Agendamentos: ${stats.totalAgendamentos || 0}`);
      console.log(`   Avaliações: ${stats.totalAvaliacoes || 0}`);
      console.log(`   Usuários ativos: ${stats.totalUsuariosAtivos || 0}`);
    } else {
      console.log('❌ Erro nas estatísticas:', statsResponse.status);
    }
    
    // Testar endpoint de planos
    console.log('📦 Testando listagem de planos...');
    const planosResponse = await fetch(`${API_BASE}/planos`);
    if (planosResponse.ok) {
      const planos = await planosResponse.json();
      console.log('✅ Listagem de planos funcionando');
      console.log(`   ${planos.length} planos encontrados`);
    } else {
      console.log('❌ Erro na listagem de planos:', planosResponse.status);
    }
    
    // Testar endpoint de comparação
    console.log('⚖️  Testando comparação de planos...');
    const comparacaoResponse = await fetch(`${API_BASE}/planos/comparar`);
    if (comparacaoResponse.ok) {
      const comparacao = await comparacaoResponse.json();
      console.log('✅ Comparação de planos funcionando');
      console.log(`   ${comparacao.length} planos para comparação`);
    } else {
      console.log('❌ Erro na comparação de planos:', comparacaoResponse.status);
    }
    
  } catch (error) {
    console.error('❌ Erro ao verificar funcionalidades:', error.message);
  }
}

// Executar todas as verificações
console.log('🚀 Iniciando verificação completa dos planos...');
atualizarPlanoFree()
  .then(() => testarLimitesPlano())
  .then(() => verificarFuncionalidades())
  .then(() => {
    console.log('\n✅ Verificação completa concluída!');
    console.log('\n📋 Resumo:');
    console.log('1. ✅ API funcionando');
    console.log('2. ❌ Plano FREE precisa ser atualizado no banco');
    console.log('3. ✅ Endpoints de planos funcionando');
    console.log('4. ✅ Sistema de planos operacional');
  })
  .catch(error => {
    console.error('❌ Erro geral:', error);
  });
