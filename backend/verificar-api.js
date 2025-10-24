import fetch from 'node-fetch';

async function verificarAPI() {
  try {
    console.log('🔍 Verificando API de estabelecimentos...');
    
    const response = await fetch('https://jfagende-production.up.railway.app/api/estabelecimentos');
    const data = await response.json();
    
    console.log(`📊 Total de estabelecimentos: ${data.estabelecimentos?.length || 0}`);
    
    if (data.estabelecimentos) {
      const comFoto = data.estabelecimentos.filter(e => e.fotoPerfilUrl);
      console.log(`🖼️ Com fotoPerfilUrl: ${comFoto.length}`);
      
      if (comFoto.length > 0) {
        console.log('\n📋 Estabelecimentos com fotos:');
        comFoto.forEach(estabelecimento => {
          console.log(`- ${estabelecimento.nome}: ${estabelecimento.fotoPerfilUrl}`);
          
          // Testar se a URL da imagem é acessível
          const baseUrl = 'https://jfagende-production.up.railway.app';
          const fullUrl = `${baseUrl}${estabelecimento.fotoPerfilUrl}`;
          console.log(`  URL completa: ${fullUrl}`);
        });
      } else {
        console.log('❌ Nenhum estabelecimento tem fotoPerfilUrl!');
      }
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

verificarAPI();
