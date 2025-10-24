import fetch from 'node-fetch';

const urlsCloudinary = [
  'https://res.cloudinary.com/dypmxu22a/image/upload/v1761312247/jfagende/estabelecimentos/logo-f2b84226-0a4f-4678-9e17-5e0732e97c5f.webp',
  'https://res.cloudinary.com/dypmxu22a/image/upload/v1761312248/jfagende/estabelecimentos/logo-c8fb778a-c703-4605-9522-128993b78430.webp',
  'https://res.cloudinary.com/dypmxu22a/image/upload/v1761312249/jfagende/estabelecimentos/logo-6582f90e-03f8-45e1-88b6-0a066de1b10b.webp'
];

async function testarURLs() {
  console.log('🔍 Testando URLs do Cloudinary...\n');
  
  for (let i = 0; i < urlsCloudinary.length; i++) {
    const url = urlsCloudinary[i];
    console.log(`${i + 1}. Testando: ${url}`);
    
    try {
      const response = await fetch(url, { method: 'HEAD' });
      console.log(`   Status: ${response.status} ${response.statusText}`);
      
      if (response.headers.get('content-type')) {
        console.log(`   Content-Type: ${response.headers.get('content-type')}`);
      }
      
      if (response.headers.get('content-length')) {
        console.log(`   Content-Length: ${response.headers.get('content-length')} bytes`);
      }
      
      if (response.status === 200) {
        console.log('   ✅ URL funcionando!');
      } else {
        console.log('   ❌ URL com problema');
      }
      
    } catch (error) {
      console.log(`   ❌ Erro: ${error.message}`);
    }
    
    console.log('');
  }
  
  console.log('🎯 RESULTADO:');
  console.log('Se todas as URLs retornaram 200, elas estão funcionando!');
  console.log('Agora teste no mobile para ver se as logos aparecem.');
}

testarURLs();
