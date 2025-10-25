// Script para forçar atualização do plano FREE
import { exec } from 'child_process';

async function forcarUpdatePlano() {
  try {
    console.log('🔄 Forçando atualização do plano FREE...');
    
    // Comando mais específico para o Railway
    const sqlCommand = `railway connect backend -- psql -c "UPDATE planos SET \\"limiteAgendamentos\\" = 110, \\"limiteAgendamentosDia\\" = 5, \\"permitePortfolio\\" = false, \\"permiteRelatorios\\" = false, \\"permiteDestaque\\" = false, \\"diasDestaque\\" = 0 WHERE nome = 'FREE';"`;
    
    console.log('📝 Executando SQL de atualização...');
    
    exec(sqlCommand, (error, stdout, stderr) => {
      if (error) {
        console.log('❌ Erro ao executar SQL:', error.message);
        console.log('\n🔧 SOLUÇÃO MANUAL:');
        console.log('1. Acesse: https://railway.app');
        console.log('2. Vá para o projeto JFAgende');
        console.log('3. Clique no serviço backend');
        console.log('4. Vá para a aba "Database"');
        console.log('5. Execute este SQL:');
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
        return;
      }
      
      console.log('✅ SQL executado!');
      console.log('📊 Resultado:', stdout);
      
      if (stderr) {
        console.log('⚠️  Avisos:', stderr);
      }
      
      // Aguardar um pouco e verificar
      console.log('\n⏳ Aguardando processamento...');
      setTimeout(async () => {
        try {
          const response = await fetch('https://jfagende-production.up.railway.app/api/planos/comparar');
          const planos = await response.json();
          const planoFree = planos.find(p => p.nome === 'FREE');
          
          if (planoFree) {
            console.log('\n📊 Estado atual do plano FREE:');
            console.log(`   Agendamentos/dia: ${planoFree.recursos.agendamentosDia}`);
            console.log(`   Agendamentos/mês: ${planoFree.recursos.agendamentosMes}`);
            console.log(`   Portfólio: ${planoFree.recursos.portfolio ? '✅' : '❌'}`);
            console.log(`   Relatórios: ${planoFree.recursos.relatorios ? '✅' : '❌'}`);
            console.log(`   Destaque: ${planoFree.recursos.destaque ? '✅' : '❌'}`);
            
            const correto = 
              planoFree.recursos.agendamentosDia === 5 &&
              planoFree.recursos.agendamentosMes === 110 &&
              !planoFree.recursos.portfolio &&
              !planoFree.recursos.relatorios &&
              !planoFree.recursos.destaque;
            
            if (correto) {
              console.log('\n🎉 SUCESSO! Plano FREE atualizado corretamente!');
              console.log('✅ Todas as especificações foram aplicadas');
            } else {
              console.log('\n⚠️  Plano FREE ainda não foi atualizado corretamente');
              console.log('🔧 Execute o SQL manualmente no Railway Dashboard');
            }
          }
        } catch (error) {
          console.log('❌ Erro ao verificar atualização:', error.message);
        }
      }, 3000);
    });
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

// Executar atualização
forcarUpdatePlano();
