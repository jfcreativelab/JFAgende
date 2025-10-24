import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 Configuração do Cloudinary para JFAgende');
console.log('==========================================\n');

console.log('📋 INSTRUÇÕES:');
console.log('1. No Cloudinary, clique em "View API Keys"');
console.log('2. Copie as 3 credenciais:');
console.log('   - Cloud Name');
console.log('   - API Key');
console.log('   - API Secret');
console.log('3. Cole as credenciais abaixo:\n');

// Verificar se já existe arquivo .env.cloudinary
const envPath = path.join(__dirname, '.env.cloudinary');
if (fs.existsSync(envPath)) {
  console.log('✅ Arquivo .env.cloudinary já existe!');
  console.log('📄 Conteúdo atual:');
  console.log(fs.readFileSync(envPath, 'utf8'));
} else {
  console.log('❌ Arquivo .env.cloudinary não encontrado.');
  console.log('📝 Criando arquivo de exemplo...');
  
  const envContent = `# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=seu_cloud_name_aqui
CLOUDINARY_API_KEY=sua_api_key_aqui
CLOUDINARY_API_SECRET=seu_api_secret_aqui
`;
  
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Arquivo .env.cloudinary criado!');
  console.log('📝 Edite o arquivo e adicione suas credenciais.');
}

console.log('\n🚀 PRÓXIMOS PASSOS:');
console.log('1. Configure suas credenciais no arquivo .env.cloudinary');
console.log('2. Execute: npm run migrate-images');
console.log('3. As logos aparecerão no mobile!');
console.log('\n💡 Dica: O Cloudinary é gratuito até 25GB de armazenamento!');
