// Script final para atualizar plano FREE via Railway
import { exec } from 'child_process';

async function atualizarPlanoRailway() {
  try {
    console.log('🚀 Atualizando plano FREE via Railway...');
    
    // Primeiro, verificar se o Railway CLI está disponível
    console.log('🔍 Verificando Railway CLI...');
    
    exec('railway --version', (error, stdout, stderr) => {
      if (error) {
        console.log('❌ Railway CLI não encontrado');
        console.log('📦 Instale com: npm install -g @railway/cli');
        console.log('🔗 Ou acesse: https://railway.app');
        return;
      }
      
      console.log('✅ Railway CLI encontrado:', stdout.trim());
      
      // Tentar conectar e executar SQL
      console.log('\n🔄 Tentando conectar ao banco...');
      
      const sqlCommand = `
        railway connect backend -- psql -c "
        UPDATE planos 
        SET 
          \\"limiteAgendamentos\\" = 110,
          \\"limiteAgendamentosDia\\" = 5,
          \\"permitePortfolio\\" = false,
          \\"permiteRelatorios\\" = false,
          \\"permiteDestaque\\" = false,
          \\"diasDestaque\\" = 0
        WHERE nome = 'FREE';
        
        SELECT 
          nome,
          \\"limiteAgendamentos\\",
          \\"limiteAgendamentosDia\\",
          \\"permitePortfolio\\",
          \\"permiteRelatorios\\",
          \\"permiteDestaque\\",
          \\"diasDestaque\\"
        FROM planos 
        WHERE nome = 'FREE';
        "
      `;
      
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
          console.log('\n6. Verifique se a atualização foi aplicada');
          return;
        }
        
        console.log('✅ SQL executado com sucesso!');
        console.log('📊 Resultado:', stdout);
        
        if (stderr) {
          console.log('⚠️  Avisos:', stderr);
        }
        
        console.log('\n🎉 Plano FREE atualizado com sucesso!');
        console.log('✅ Especificações aplicadas:');
        console.log('   ✅ 5 agendamentos por dia');
        console.log('   ✅ 110 agendamentos por mês');
        console.log('   ❌ Portfólio não permitido');
        console.log('   ❌ Relatórios não permitidos');
        console.log('   ❌ Destaque não permitido');
      });
    });
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

// Executar atualização
atualizarPlanoRailway();
