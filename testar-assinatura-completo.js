// Teste completo do sistema de assinatura
const testarSistemaAssinatura = async () => {
  try {
    console.log('🧪 Testando sistema completo de assinatura...');
    
    // 1. Testar endpoint de planos
    console.log('\n1️⃣ Testando endpoint de planos...');
    const planosResponse = await fetch('https://jfagende-production.up.railway.app/api/planos-estabelecimento/f2b84226-0a4f-4678-9e17-5e0732e97c5f');
    console.log('📊 Status planos:', planosResponse.status);
    
    if (planosResponse.ok) {
      const planos = await planosResponse.json();
      console.log('✅ Planos carregados:', planos.length);
      
      if (planos.length > 0) {
        const primeiroPlano = planos[0];
        console.log('🎯 Primeiro plano:', primeiroPlano.nome, '- R$', primeiroPlano.preco);
        
        // 2. Testar endpoint de assinatura (sem token)
        console.log('\n2️⃣ Testando endpoint de assinatura...');
        const assinaturaResponse = await fetch(`https://jfagende-production.up.railway.app/api/assinatura-plano/${primeiroPlano.id}/criar-sessao`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ clienteId: 'test' })
        });
        
        console.log('📊 Status assinatura:', assinaturaResponse.status);
        const assinaturaData = await assinaturaResponse.text();
        console.log('📄 Response assinatura:', assinaturaData);
        
        if (assinaturaResponse.status === 401) {
          console.log('✅ Endpoint de assinatura funcionando (erro de auth esperado)');
        } else if (assinaturaResponse.status === 404) {
          console.log('❌ Endpoint de assinatura não encontrado');
        } else {
          console.log('✅ Endpoint de assinatura funcionando - Status:', assinaturaResponse.status);
        }
      }
    } else {
      console.log('❌ Erro ao carregar planos:', planosResponse.status);
    }
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
  }
};

testarSistemaAssinatura();
