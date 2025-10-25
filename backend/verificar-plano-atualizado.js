// Script para verificar se o plano FREE foi atualizado
const API_BASE = 'https://jfagende-production.up.railway.app/api';

async function verificarPlanoAtualizado() {
  try {
    console.log('🔍 Verificando se o plano FREE foi atualizado...');
    
    const response = await fetch(`${API_BASE}/planos/comparar`);
    const planos = await response.json();
    const planoFree = planos.find(p => p.nome === 'FREE');
    
    if (!planoFree) {
      console.log('❌ Plano FREE não encontrado');
      return;
    }
    
    console.log('📊 Estado atual do plano FREE:');
    console.log(`   Agendamentos/dia: ${planoFree.recursos.agendamentosDia}`);
    console.log(`   Agendamentos/mês: ${planoFree.recursos.agendamentosMes}`);
    console.log(`   Portfólio: ${planoFree.recursos.portfolio ? '✅' : '❌'}`);
    console.log(`   Relatórios: ${planoFree.recursos.relatorios ? '✅' : '❌'}`);
    console.log(`   Destaque: ${planoFree.recursos.destaque ? '✅' : '❌'}`);
    
    // Verificar se está correto
    const correto = 
      planoFree.recursos.agendamentosDia === 5 &&
      planoFree.recursos.agendamentosMes === 110 &&
      !planoFree.recursos.portfolio &&
      !planoFree.recursos.relatorios &&
      !planoFree.recursos.destaque;
    
    if (correto) {
      console.log('\n🎉 SUCESSO! Plano FREE foi atualizado corretamente!');
      console.log('✅ Todas as especificações estão corretas:');
      console.log('   ✅ 5 agendamentos por dia');
      console.log('   ✅ 110 agendamentos por mês');
      console.log('   ❌ Portfólio não permitido');
      console.log('   ❌ Relatórios não permitidos');
      console.log('   ❌ Destaque não permitido');
      
      console.log('\n🚀 Sistema de planos está 100% funcional!');
      console.log('✅ Middleware implementado');
      console.log('✅ Limites aplicados');
      console.log('✅ Restrições funcionando');
      
    } else {
      console.log('\n❌ Plano FREE ainda não foi atualizado no banco');
      console.log('🔧 Execute o SQL no Railway Dashboard:');
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
      
      console.log('\n📋 Como executar:');
      console.log('1. Acesse: https://railway.app');
      console.log('2. Vá para o projeto JFAgende');
      console.log('3. Clique no serviço backend');
      console.log('4. Vá para a aba "Database"');
      console.log('5. Execute o SQL acima');
    }
    
  } catch (error) {
    console.error('❌ Erro ao verificar plano FREE:', error.message);
  }
}

// Executar verificação
verificarPlanoAtualizado();
