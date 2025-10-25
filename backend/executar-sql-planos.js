import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';

const execAsync = promisify(exec);

async function executarSQL() {
  try {
    console.log('🚀 Executando SQL para criar tabelas de planos...');
    
    // Ler o arquivo SQL
    const sqlContent = fs.readFileSync('./criar-tabelas-planos.sql', 'utf8');
    console.log('📄 SQL carregado:', sqlContent.length, 'caracteres');
    
    // Executar via Railway CLI
    console.log('📡 Executando SQL via Railway...');
    const command = `railway run --service backend psql -c "${sqlContent.replace(/"/g, '\\"')}"`;
    
    console.log('🔧 Comando:', command);
    
    const { stdout, stderr } = await execAsync(command);
    
    if (stdout) {
      console.log('✅ Sucesso:', stdout);
    }
    
    if (stderr) {
      console.log('⚠️ Avisos:', stderr);
    }
    
    console.log('🎉 Tabelas criadas com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro ao executar SQL:', error.message);
    
    console.log('\n💡 Solução alternativa manual:');
    console.log('1. Acesse o Railway Dashboard');
    console.log('2. Vá para o serviço backend');
    console.log('3. Clique em "Database"');
    console.log('4. Execute o SQL do arquivo criar-tabelas-planos.sql');
  }
}

executarSQL();
