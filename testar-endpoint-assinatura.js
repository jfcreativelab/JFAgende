// Script para testar o endpoint de assinatura
const testarEndpoint = async () => {
  try {
    console.log('🧪 Testando endpoint de assinatura...');
    
    // Testar se o endpoint existe
    const response = await fetch('https://jfagende-production.up.railway.app/api/assinatura-plano/status/test/test', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('📊 Status:', response.status);
    console.log('📄 Response:', await response.text());
    
    if (response.status === 404) {
      console.log('❌ Endpoint não encontrado - Backend não foi atualizado');
    } else if (response.status === 401) {
      console.log('✅ Endpoint funcionando - Erro de autenticação é esperado');
    } else {
      console.log('✅ Endpoint funcionando - Status:', response.status);
    }
    
  } catch (error) {
    console.error('❌ Erro ao testar endpoint:', error.message);
  }
};

testarEndpoint();
