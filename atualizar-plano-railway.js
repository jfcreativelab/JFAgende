// Script para atualizar plano FREE via Railway CLI
const { exec } = require('child_process');

async function atualizarPlanoRailway() {
  try {
    console.log('🚀 Atualizando plano FREE via Railway...');
    
    // Primeiro, conectar ao banco e executar o SQL
    const sqlContent = `
UPDATE planos 
SET 
  "limiteAgendamentos" = 110,
  "limiteAgendamentosDia" = 5,
  "permitePortfolio" = false,
  "permiteRelatorios" = false,
  "permiteDestaque" = false,
  "diasDestaque" = 0
WHERE nome = 'FREE';

SELECT 
  nome,
  "limiteAgendamentos",
  "limiteAgendamentosDia",
  "permitePortfolio",
  "permiteRelatorios",
  "permiteDestaque",
  "diasDestaque"
FROM planos 
WHERE nome = 'FREE';
    `;
    
    console.log('📝 SQL a ser executado:');
    console.log(sqlContent);
    
    console.log('\n🔧 Para executar manualmente:');
    console.log('1. Acesse: https://railway.app');
    console.log('2. Vá para o projeto JFAgende');
    console.log('3. Clique no serviço backend');
    console.log('4. Vá para a aba "Database"');
    console.log('5. Execute o SQL acima');
    
    console.log('\n📋 Ou use o Railway CLI:');
    console.log('railway connect backend');
    console.log('psql');
    console.log('\\c jfagende');
    console.log(sqlContent);
    
  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

atualizarPlanoRailway();
