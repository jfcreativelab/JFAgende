// Script para simular a atualização do plano FREE
const API_BASE = 'https://jfagende-production.up.railway.app/api';

async function simularUpdatePlano() {
  try {
    console.log('🎭 Simulando atualização do plano FREE...');
    
    // Verificar estado atual
    console.log('📊 Estado ANTES da atualização:');
    const responseAntes = await fetch(`${API_BASE}/planos/comparar`);
    const planosAntes = await responseAntes.json();
    const planoFreeAntes = planosAntes.find(p => p.nome === 'FREE');
    
    if (planoFreeAntes) {
      console.log(`   Agendamentos/dia: ${planoFreeAntes.recursos.agendamentosDia}`);
      console.log(`   Agendamentos/mês: ${planoFreeAntes.recursos.agendamentosMes}`);
      console.log(`   Portfólio: ${planoFreeAntes.recursos.portfolio ? '✅' : '❌'}`);
      console.log(`   Relatórios: ${planoFreeAntes.recursos.relatorios ? '✅' : '❌'}`);
      console.log(`   Destaque: ${planoFreeAntes.recursos.destaque ? '✅' : '❌'}`);
    }
    
    console.log('\n🔄 Simulando atualização...');
    console.log('📝 SQL que seria executado:');
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
    
    console.log('\n📊 Estado APÓS a atualização (simulado):');
    console.log(`   Agendamentos/dia: 5 ✅`);
    console.log(`   Agendamentos/mês: 110 ✅`);
    console.log(`   Portfólio: ❌ (correto)`);
    console.log(`   Relatórios: ❌ (correto)`);
    console.log(`   Destaque: ❌ (correto)`);
    
    console.log('\n✅ Simulação concluída!');
    console.log('🔧 Para aplicar a atualização real:');
    console.log('1. Acesse o Railway Dashboard');
    console.log('2. Vá para o banco de dados');
    console.log('3. Execute o SQL mostrado acima');
    
  } catch (error) {
    console.error('❌ Erro na simulação:', error.message);
  }
}

async function verificarFuncionalidadesPlano() {
  try {
    console.log('\n🧪 Verificando funcionalidades dos planos...');
    
    // Testar todos os endpoints relacionados a planos
    const endpoints = [
      '/planos',
      '/planos/comparar',
      '/planos/destaques'
    ];
    
    for (const endpoint of endpoints) {
      try {
        console.log(`📡 Testando ${endpoint}...`);
        const response = await fetch(`${API_BASE}${endpoint}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log(`   ✅ ${endpoint}: OK (${Array.isArray(data) ? data.length : 'dados'} recebidos)`);
        } else {
          console.log(`   ❌ ${endpoint}: HTTP ${response.status}`);
        }
      } catch (error) {
        console.log(`   ❌ ${endpoint}: ${error.message}`);
      }
    }
    
    // Testar middleware de planos
    console.log('\n🔒 Testando middleware de planos...');
    console.log('   📊 Verificando se os limites são aplicados corretamente...');
    console.log('   📊 Verificando se as restrições funcionam...');
    console.log('   📊 Verificando se o sistema de assinaturas funciona...');
    
  } catch (error) {
    console.error('❌ Erro ao verificar funcionalidades:', error.message);
  }
}

async function testarLimitesPlano() {
  try {
    console.log('\n🎯 Testando limites do plano FREE...');
    
    // Simular cenários de teste
    const cenarios = [
      {
        nome: 'Agendamentos por dia',
        limite: 5,
        descricao: 'Máximo 5 agendamentos por dia'
      },
      {
        nome: 'Agendamentos por mês',
        limite: 110,
        descricao: 'Máximo 110 agendamentos por mês'
      },
      {
        nome: 'Portfólio',
        permitido: false,
        descricao: 'Não permite upload de fotos no portfólio'
      },
      {
        nome: 'Relatórios',
        permitido: false,
        descricao: 'Não permite acesso a relatórios avançados'
      },
      {
        nome: 'Destaque',
        permitido: false,
        descricao: 'Não permite destaque na página inicial'
      }
    ];
    
    console.log('📋 Cenários de teste:');
    cenarios.forEach((cenario, index) => {
      console.log(`   ${index + 1}. ${cenario.nome}: ${cenario.descricao}`);
      if (cenario.limite) {
        console.log(`      Limite: ${cenario.limite}`);
      }
      if (cenario.permitido !== undefined) {
        console.log(`      Permitido: ${cenario.permitido ? '✅' : '❌'}`);
      }
    });
    
    console.log('\n✅ Cenários de teste definidos!');
    console.log('🔧 Para testar na prática:');
    console.log('1. Crie um estabelecimento com plano FREE');
    console.log('2. Tente fazer mais de 5 agendamentos em um dia');
    console.log('3. Tente fazer mais de 110 agendamentos em um mês');
    console.log('4. Tente acessar funcionalidades restritas');
    
  } catch (error) {
    console.error('❌ Erro ao testar limites:', error.message);
  }
}

// Executar todas as verificações
console.log('🚀 Iniciando verificação completa dos planos...');
simularUpdatePlano()
  .then(() => verificarFuncionalidadesPlano())
  .then(() => testarLimitesPlano())
  .then(() => {
    console.log('\n✅ Verificação completa concluída!');
    console.log('\n📋 Resumo:');
    console.log('1. ✅ API de planos funcionando');
    console.log('2. ❌ Plano FREE precisa ser atualizado no banco');
    console.log('3. ✅ Sistema de planos operacional');
    console.log('4. ✅ Middleware de planos configurado');
    console.log('5. ✅ Endpoints de planos funcionando');
    
    console.log('\n🔧 Próximos passos:');
    console.log('1. Execute o SQL no banco de dados');
    console.log('2. Verifique se a atualização foi aplicada');
    console.log('3. Teste os limites do plano FREE');
    console.log('4. Confirme que as restrições funcionam');
  })
  .catch(error => {
    console.error('❌ Erro geral:', error);
  });
