// Script para atualizar planos via API

const API_BASE = 'https://jfagende-production.up.railway.app/api';

async function verificarPlanos() {
  try {
    console.log('🔍 Verificando planos atuais...');
    
    const response = await fetch(`${API_BASE}/planos/comparar`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const planos = await response.json();
    
    console.log('📊 Planos encontrados:');
    planos.forEach(plano => {
      console.log(`\n📦 ${plano.nome}:`);
      console.log(`   💰 Preço: R$ ${plano.preco.toFixed(2)}`);
      console.log(`   📅 Agendamentos/dia: ${plano.recursos.agendamentosDia}`);
      console.log(`   📅 Agendamentos/mês: ${plano.recursos.agendamentosMes}`);
      console.log(`   📸 Portfólio: ${plano.recursos.portfolio ? '✅' : '❌'}`);
      console.log(`   📊 Relatórios: ${plano.recursos.relatorios ? '✅' : '❌'}`);
      console.log(`   ⭐ Destaque: ${plano.recursos.destaque ? '✅' : '❌'} (${plano.recursos.diasDestaque} dias)`);
    });
    
    // Verificar se o plano FREE está correto
    const planoFree = planos.find(p => p.nome === 'FREE');
    if (planoFree) {
      console.log('\n🔍 Verificação do plano FREE:');
      
      const correto = {
        agendamentosDia: planoFree.recursos.agendamentosDia === 5,
        agendamentosMes: planoFree.recursos.agendamentosMes === 110,
        portfolio: !planoFree.recursos.portfolio,
        relatorios: !planoFree.recursos.relatorios,
        destaque: !planoFree.recursos.destaque
      };
      
      console.log(`   ✅ Agendamentos/dia (5): ${correto.agendamentosDia ? '✅' : '❌'}`);
      console.log(`   ✅ Agendamentos/mês (110): ${correto.agendamentosMes ? '✅' : '❌'}`);
      console.log(`   ❌ Portfólio (não permitido): ${correto.portfolio ? '✅' : '❌'}`);
      console.log(`   ❌ Relatórios (não permitido): ${correto.relatorios ? '✅' : '❌'}`);
      console.log(`   ❌ Destaque (não permitido): ${correto.destaque ? '✅' : '❌'}`);
      
      const tudoCorreto = Object.values(correto).every(v => v);
      console.log(`\n🎯 Status geral: ${tudoCorreto ? '✅ CORRETO' : '❌ PRECISA ATUALIZAR'}`);
    }
    
  } catch (error) {
    console.error('❌ Erro ao verificar planos:', error.message);
  }
}

async function testarFuncionalidades() {
  try {
    console.log('\n🧪 Testando funcionalidades dos planos...');
    
    // Testar endpoint de estatísticas
    console.log('📊 Testando estatísticas...');
    const statsResponse = await fetch(`${API_BASE}/estatisticas`);
    if (statsResponse.ok) {
      const stats = await statsResponse.json();
      console.log('✅ Estatísticas funcionando:', stats);
    } else {
      console.log('❌ Erro nas estatísticas:', statsResponse.status);
    }
    
    // Testar endpoint de planos
    console.log('📦 Testando listagem de planos...');
    const planosResponse = await fetch(`${API_BASE}/planos`);
    if (planosResponse.ok) {
      const planos = await planosResponse.json();
      console.log('✅ Listagem de planos funcionando:', planos.length, 'planos encontrados');
    } else {
      console.log('❌ Erro na listagem de planos:', planosResponse.status);
    }
    
  } catch (error) {
    console.error('❌ Erro ao testar funcionalidades:', error.message);
  }
}

// Executar verificações
console.log('🚀 Iniciando verificação dos planos...');
verificarPlanos().then(() => {
  return testarFuncionalidades();
}).then(() => {
  console.log('\n✅ Verificação concluída!');
}).catch(error => {
  console.error('❌ Erro geral:', error);
});
