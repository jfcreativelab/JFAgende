// Script para atualizar plano FREE via API (alternativa)
const API_BASE = 'https://jfagende-production.up.railway.app/api';

async function verificarEAtualizarPlano() {
  try {
    console.log('🔍 Verificando estado atual do plano FREE...');
    
    // Verificar estado atual
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
    
    // Verificar se já está correto
    const jaCorreto = 
      planoFree.recursos.agendamentosDia === 5 &&
      planoFree.recursos.agendamentosMes === 110 &&
      !planoFree.recursos.portfolio &&
      !planoFree.recursos.relatorios &&
      !planoFree.recursos.destaque;
    
    if (jaCorreto) {
      console.log('\n✅ Plano FREE já está com as configurações corretas!');
      return;
    }
    
    console.log('\n⚠️  O plano FREE precisa ser atualizado no banco de dados.');
    console.log('🔧 Para atualizar, você precisa executar este SQL no banco PostgreSQL:');
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
    
    console.log('\n🔧 Ou use o Railway CLI:');
    console.log('railway connect backend');
    console.log('psql');
    console.log('\\c jfagende');
    console.log('-- Execute o SQL acima');
    
    console.log('\n📊 Após executar o SQL, o plano FREE terá:');
    console.log('   ✅ 5 agendamentos por dia');
    console.log('   ✅ 110 agendamentos por mês');
    console.log('   ❌ Portfólio não permitido');
    console.log('   ❌ Relatórios não permitidos');
    console.log('   ❌ Destaque não permitido');
    
  } catch (error) {
    console.error('❌ Erro ao verificar plano FREE:', error.message);
  }
}

async function testarSistemaAposUpdate() {
  try {
    console.log('\n🧪 Testando sistema após atualização...');
    
    // Aguardar um pouco para o banco processar
    console.log('⏳ Aguardando processamento...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Verificar novamente
    const response = await fetch(`${API_BASE}/planos/comparar`);
    const planos = await response.json();
    const planoFree = planos.find(p => p.nome === 'FREE');
    
    if (planoFree) {
      const correto = 
        planoFree.recursos.agendamentosDia === 5 &&
        planoFree.recursos.agendamentosMes === 110 &&
        !planoFree.recursos.portfolio &&
        !planoFree.recursos.relatorios &&
        !planoFree.recursos.destaque;
      
      if (correto) {
        console.log('🎉 SUCESSO! Plano FREE foi atualizado corretamente!');
        console.log('✅ Todas as especificações estão corretas');
      } else {
        console.log('⚠️  Plano FREE ainda não foi atualizado no banco');
        console.log('🔧 Execute o SQL mostrado acima');
      }
    }
    
  } catch (error) {
    console.error('❌ Erro ao testar sistema:', error.message);
  }
}

// Executar verificação
console.log('🚀 Verificando e atualizando plano FREE...');
verificarEAtualizarPlano()
  .then(() => testarSistemaAposUpdate())
  .then(() => {
    console.log('\n✅ Verificação concluída!');
  })
  .catch(error => {
    console.error('❌ Erro geral:', error);
  });
