import cloudinaryService from './src/services/cloudinaryService.js';

console.log('🔧 Testando configuração do Cloudinary...\n');

// Testar configuração
console.log('📋 Verificando variáveis de ambiente:');
console.log('   CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME || '❌ Não configurado');
console.log('   CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? '✅ Configurado' : '❌ Não configurado');
console.log('   CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? '✅ Configurado' : '❌ Não configurado');
console.log('');

// Testar upload de uma imagem de teste
console.log('🧪 Testando upload de imagem...');
try {
  // Criar um buffer de imagem de teste (1x1 pixel PNG)
  const testImageBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');
  
  const result = await cloudinaryService.uploadImageFromBuffer(testImageBuffer, 'jfagende/test');
  
  if (result.success) {
    console.log('✅ Upload funcionou!');
    console.log('   URL:', result.url);
    console.log('   Public ID:', result.publicId);
    
    // Testar remoção
    console.log('\n🗑️ Testando remoção...');
    const deleteResult = await cloudinaryService.deleteImage(result.publicId);
    if (deleteResult.success) {
      console.log('✅ Remoção funcionou!');
    } else {
      console.log('❌ Erro na remoção:', deleteResult.error);
    }
  } else {
    console.log('❌ Erro no upload:', result.error);
  }
} catch (error) {
  console.log('❌ Erro geral:', error.message);
}

console.log('\n🏁 Teste concluído!');
