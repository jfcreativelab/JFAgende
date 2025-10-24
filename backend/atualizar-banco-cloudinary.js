import fetch from 'node-fetch';

// URLs geradas do Cloudinary
const urlsCloudinary = [
  {
    id: 'f2b84226-0a4f-4678-9e17-5e0732e97c5f',
    nome: 'Barbearia 2 Irmãos',
    url: 'https://res.cloudinary.com/dypmxu22a/image/upload/v1761312247/jfagende/estabelecimentos/logo-f2b84226-0a4f-4678-9e17-5e0732e97c5f.webp'
  },
  {
    id: 'c8fb778a-c703-4605-9522-128993b78430',
    nome: 'Keyla Sant Anna tricologista',
    url: 'https://res.cloudinary.com/dypmxu22a/image/upload/v1761312248/jfagende/estabelecimentos/logo-c8fb778a-c703-4605-9522-128993b78430.webp'
  },
  {
    id: '6582f90e-03f8-45e1-88b6-0a066de1b10b',
    nome: 'Marisol Bronze',
    url: 'https://res.cloudinary.com/dypmxu22a/image/upload/v1761312249/jfagende/estabelecimentos/logo-6582f90e-03f8-45e1-88b6-0a066de1b10b.webp'
  }
];

async function atualizarBanco() {
  try {
    console.log('🔄 Atualizando banco de dados com URLs do Cloudinary...');
    
    for (const estabelecimento of urlsCloudinary) {
      try {
        console.log(`\n📝 Atualizando: ${estabelecimento.nome}`);
        
        // Fazer requisição para atualizar o estabelecimento
        const response = await fetch(`https://jfagende-production.up.railway.app/api/estabelecimentos/${estabelecimento.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            // Nota: Em produção, você precisaria de autenticação
          },
          body: JSON.stringify({
            fotoPerfilUrl: estabelecimento.url
          })
        });
        
        if (response.ok) {
          console.log(`   ✅ ${estabelecimento.nome} atualizado com sucesso!`);
          console.log(`   🔗 Nova URL: ${estabelecimento.url}`);
        } else {
          console.log(`   ❌ Erro ao atualizar ${estabelecimento.nome}: ${response.status}`);
        }
        
      } catch (error) {
        console.log(`   ❌ Erro ao atualizar ${estabelecimento.nome}:`, error.message);
      }
    }
    
    console.log('\n🎉 Atualização concluída!');
    console.log('\n📱 TESTE NO MOBILE:');
    console.log('1. Acesse o app no mobile');
    console.log('2. Veja a lista de estabelecimentos');
    console.log('3. As logos agora devem aparecer!');
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

atualizarBanco();
