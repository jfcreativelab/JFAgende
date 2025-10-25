// Script correto para atualizar plano FREE via Railway
import { exec } from 'child_process';

async function updatePlanoRailway() {
  try {
    console.log('🚀 Atualizando plano FREE via Railway...');
    
    // Primeiro, conectar ao banco
    console.log('🔗 Conectando ao banco...');
    
    const connectCommand = 'railway connect backend';
    
    exec(connectCommand, (error, stdout, stderr) => {
      if (error) {
        console.log('❌ Erro ao conectar:', error.message);
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
      
      console.log('✅ Conectado ao banco!');
      console.log('📊 Resultado:', stdout);
      
      if (stderr) {
        console.log('⚠️  Avisos:', stderr);
      }
      
      console.log('\n🎉 Conexão estabelecida!');
      console.log('🔧 Agora execute manualmente no terminal:');
      console.log('1. psql');
      console.log('2. \\c jfagende');
      console.log('3. Execute o SQL mostrado acima');
    });
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

// Executar conexão
updatePlanoRailway();
