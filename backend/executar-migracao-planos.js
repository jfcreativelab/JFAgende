import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function executarMigracao() {
  try {
    console.log('🚀 Iniciando migração do banco de dados...');
    
    // Conectar ao banco via Railway CLI
    console.log('📡 Conectando ao Railway...');
    const { stdout: connectOutput } = await execAsync('railway connect backend');
    console.log('✅ Conectado:', connectOutput);

    // Executar migração do Prisma
    console.log('🔄 Executando migração do Prisma...');
    const { stdout: migrateOutput } = await execAsync('npx prisma migrate deploy');
    console.log('✅ Migração executada:', migrateOutput);

    // Gerar cliente Prisma
    console.log('🔧 Gerando cliente Prisma...');
    const { stdout: generateOutput } = await execAsync('npx prisma generate');
    console.log('✅ Cliente gerado:', generateOutput);

    console.log('🎉 Migração concluída com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro na migração:', error.message);
    
    if (error.message.includes('railway connect')) {
      console.log('\n💡 Solução alternativa:');
      console.log('1. Execute: railway login');
      console.log('2. Execute: railway connect backend');
      console.log('3. Execute: npx prisma migrate deploy');
      console.log('4. Execute: npx prisma generate');
    }
  }
}

executarMigracao();
