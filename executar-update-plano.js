// Script para executar a atualização do plano FREE
const { exec } = require('child_process');
const fs = require('fs');

async function executarUpdatePlano() {
  try {
    console.log('🚀 Executando atualização do plano FREE...');
    
    // Verificar se o Railway CLI está instalado
    console.log('🔍 Verificando Railway CLI...');
    
    exec('railway --version', (error, stdout, stderr) => {
      if (error) {
        console.log('❌ Railway CLI não encontrado. Instalando...');
        console.log('📦 Execute: npm install -g @railway/cli');
        console.log('🔗 Ou acesse: https://railway.app');
        return;
      }
      
      console.log('✅ Railway CLI encontrado:', stdout.trim());
      
      // Executar o SQL
      console.log('📝 Executando SQL de atualização...');
      
      const sqlCommand = `railway connect backend -- psql -f update-free-plan.sql`;
      
      exec(sqlCommand, (error, stdout, stderr) => {
        if (error) {
          console.log('❌ Erro ao executar SQL:', error.message);
          console.log('🔧 Alternativas:');
          console.log('1. Acesse o Railway Dashboard');
          console.log('2. Vá para o serviço backend');
          console.log('3. Acesse o banco de dados');
          console.log('4. Execute o SQL manualmente');
          return;
        }
        
        console.log('✅ SQL executado com sucesso!');
        console.log('📊 Resultado:', stdout);
        
        if (stderr) {
          console.log('⚠️  Avisos:', stderr);
        }
      });
    });
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

// Executar a atualização
executarUpdatePlano();
