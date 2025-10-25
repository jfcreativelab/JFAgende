// Script para executar SQL diretamente no banco
import { PrismaClient } from '@prisma/client';

// URL do banco Railway (substitua pela URL real)
const DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres:password@localhost:5432/jfagende";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: DATABASE_URL
    }
  }
});

async function executarSQL() {
  try {
    console.log('🔄 Conectando ao banco de dados...');
    console.log('🔗 URL:', DATABASE_URL.replace(/\/\/.*@/, '//***@')); // Mascarar senha
    
    // Testar conexão
    await prisma.$connect();
    console.log('✅ Conectado ao banco com sucesso!');
    
    // Executar SQL de atualização
    console.log('\n🔄 Executando SQL de atualização...');
    
    const resultado = await prisma.$executeRaw`
      UPDATE planos 
      SET 
        "limiteAgendamentos" = 110,
        "limiteAgendamentosDia" = 5,
        "permitePortfolio" = false,
        "permiteRelatorios" = false,
        "permiteDestaque" = false,
        "diasDestaque" = 0
      WHERE nome = 'FREE'
    `;
    
    console.log(`✅ SQL executado! ${resultado} registro(s) atualizado(s)`);
    
    // Verificar se a atualização foi bem-sucedida
    console.log('\n🔍 Verificando atualização...');
    const planoAtualizado = await prisma.plano.findFirst({
      where: { nome: 'FREE' }
    });
    
    if (planoAtualizado) {
      console.log('📊 Estado do plano FREE após atualização:');
      console.log(`   Limite agendamentos: ${planoAtualizado.limiteAgendamentos}`);
      console.log(`   Limite agendamentos/dia: ${planoAtualizado.limiteAgendamentosDia}`);
      console.log(`   Permite portfólio: ${planoAtualizado.permitePortfolio}`);
      console.log(`   Permite relatórios: ${planoAtualizado.permiteRelatorios}`);
      console.log(`   Permite destaque: ${planoAtualizado.permiteDestaque}`);
      console.log(`   Dias destaque: ${planoAtualizado.diasDestaque}`);
      
      // Verificar se está correto
      const correto = 
        planoAtualizado.limiteAgendamentos === 110 &&
        planoAtualizado.limiteAgendamentosDia === 5 &&
        planoAtualizado.permitePortfolio === false &&
        planoAtualizado.permiteRelatorios === false &&
        planoAtualizado.permiteDestaque === false &&
        planoAtualizado.diasDestaque === 0;
      
      if (correto) {
        console.log('\n🎉 SUCESSO! Plano FREE atualizado corretamente!');
        console.log('✅ Todas as especificações foram aplicadas:');
        console.log('   ✅ 5 agendamentos por dia');
        console.log('   ✅ 110 agendamentos por mês');
        console.log('   ❌ Portfólio não permitido');
        console.log('   ❌ Relatórios não permitidos');
        console.log('   ❌ Destaque não permitido');
      } else {
        console.log('\n❌ ERRO! A atualização não foi aplicada corretamente');
      }
    } else {
      console.log('❌ Plano FREE não encontrado após atualização');
    }
    
  } catch (error) {
    console.error('❌ Erro ao executar SQL:', error);
    
    if (error.code === 'P1001') {
      console.log('💡 Dica: Verifique se a URL do banco está correta');
      console.log('🔧 Configure a variável DATABASE_URL com a URL do Railway');
    } else if (error.code === 'P2021') {
      console.log('💡 Dica: Verifique se a conexão com o banco está ativa');
    } else {
      console.log('💡 Dica: Verifique as credenciais e permissões do banco');
    }
    
    console.log('\n🔧 Alternativa: Execute o SQL manualmente no Railway Dashboard');
    console.log('1. Acesse: https://railway.app');
    console.log('2. Vá para o projeto JFAgende');
    console.log('3. Clique no serviço backend');
    console.log('4. Vá para a aba "Database"');
    console.log('5. Execute o SQL:');
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
    
  } finally {
    await prisma.$disconnect();
  }
}

// Executar SQL
executarSQL();
