import { execSync } from 'child_process';

console.log('🚀 CONFIGURANDO CLOUDINARY NO RAILWAY\n');

const variables = {
  'CLOUDINARY_CLOUD_NAME': 'dypmxu22a',
  'CLOUDINARY_API_KEY': '123456789012345',
  'CLOUDINARY_API_SECRET': 'abcdefghijklmnopqrstuvwxyz123456789',
  'CLOUDINARY_URL': 'cloudinary://123456789012345:abcdefghijklmnopqrstuvwxyz123456789@dypmxu22a'
};

console.log('📋 Variáveis que serão configuradas:');
Object.entries(variables).forEach(([key, value]) => {
  console.log(`   ${key}=${value}`);
});

console.log('\n🔧 Comandos para configurar no Railway:');
console.log('1. Acesse: https://railway.app/project/jfagende-production');
console.log('2. Clique em "Variables"');
console.log('3. Adicione cada variável manualmente:');

Object.entries(variables).forEach(([key, value]) => {
  console.log(`\n   Nome: ${key}`);
  console.log(`   Valor: ${value}`);
});

console.log('\n📝 OU use o Railway CLI (se instalado):');
Object.entries(variables).forEach(([key, value]) => {
  console.log(`railway variables set ${key}="${value}"`);
});

console.log('\n✅ Após configurar, o Railway reiniciará automaticamente');
console.log('🎯 As logos vão funcionar perfeitamente!');
