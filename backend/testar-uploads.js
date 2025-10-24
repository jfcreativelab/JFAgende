import fetch from 'node-fetch';

async function testarUploads() {
  try {
    console.log('🔍 Testando acesso aos uploads...');
    
    // Testar diferentes URLs de upload
    const urls = [
      'https://jfagende-production.up.railway.app/uploads/',
      'https://jfagende-production.up.railway.app/uploads/estabelecimentos/',
      'https://jfagende-production.up.railway.app/uploads/estabelecimentos/logo-1761151456339-333114402.webp',
      'https://jfagende-production.up.railway.app/uploads/estabelecimentos/logo-1761152651411-140101727.webp',
      'https://jfagende-production.up.railway.app/uploads/estabelecimentos/logo-1761152457238-286447024.webp'
    ];
    
    for (const url of urls) {
      try {
        console.log(`\n🔗 Testando: ${url}`);
        const response = await fetch(url, { method: 'HEAD' });
        console.log(`   Status: ${response.status} ${response.statusText}`);
        
        if (response.headers.get('content-type')) {
          console.log(`   Content-Type: ${response.headers.get('content-type')}`);
        }
        
        if (response.headers.get('content-length')) {
          console.log(`   Content-Length: ${response.headers.get('content-length')}`);
        }
        
      } catch (error) {
        console.log(`   ❌ Erro: ${error.message}`);
      }
    }
    
    // Testar se o servidor está funcionando
    console.log('\n🌐 Testando servidor...');
    const serverResponse = await fetch('https://jfagende-production.up.railway.app/');
    console.log(`   Status: ${serverResponse.status} ${serverResponse.statusText}`);
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

testarUploads();
