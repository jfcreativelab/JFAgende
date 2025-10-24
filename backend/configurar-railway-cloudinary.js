import { execSync } from 'child_process';

console.log('🚀 CONFIGURANDO CLOUDINARY NO RAILWAY\n');

const variables = {
  'CLOUDINARY_CLOUD_NAME': 'dypmxu22a',
  'CLOUDINARY_API_KEY': '313929499946394',
  'CLOUDINARY_API_SECRET': 'WndYrcC3VVeKKVIzC0ZzWHYnZho',
  'CLOUDINARY_URL': 'cloudinary://313929499946394:WndYrcC3VVeKKVIzC0ZzWHYnZho@dypmxu22a'
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
