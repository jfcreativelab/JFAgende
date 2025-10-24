import { v2 as cloudinary } from 'cloudinary';
import sharp from 'sharp';

// Configurar Cloudinary diretamente
cloudinary.config({
  cloud_name: 'dypmxu22a',
  api_key: '313929499946394',
  api_secret: 'WndYrcC3VVeKKVIzC0ZzWHYnZho',
});

console.log('🔧 Cloudinary configurado diretamente');

async function testarUpload() {
  try {
    console.log('🔄 Testando upload para Cloudinary...');
    
    // Criar uma imagem de teste
    const testBuffer = await sharp({
      create: {
        width: 512,
        height: 512,
        channels: 4,
        background: { r: 147, g: 51, b: 234, alpha: 1 } // Cor roxa
      }
    })
    .composite([
      {
        input: Buffer.from(`
          <svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
            <rect width="512" height="512" fill="#9333ea"/>
            <circle cx="256" cy="200" r="80" fill="white" opacity="0.2"/>
            <text x="256" y="220" font-family="Arial, sans-serif" font-size="72" fill="white" text-anchor="middle" font-weight="bold">T</text>
            <text x="256" y="320" font-family="Arial, sans-serif" font-size="24" fill="white" text-anchor="middle" opacity="0.8">Teste</text>
            <text x="256" y="360" font-family="Arial, sans-serif" font-size="16" fill="white" text-anchor="middle" opacity="0.6">Logo</text>
          </svg>
        `),
        top: 0,
        left: 0
      }
    ])
    .webp({ quality: 85 })
    .toBuffer();

    // Upload para Cloudinary
    const result = await cloudinary.uploader.upload_stream(
      {
        folder: 'jfagende/estabelecimentos',
        resource_type: 'image',
        transformation: [
          { width: 512, height: 512, crop: 'fill', quality: 'auto' },
          { format: 'webp' }
        ]
      },
      (error, result) => {
        if (error) {
          console.error('❌ Erro no upload:', error);
        } else {
          console.log('✅ Upload bem-sucedido!');
          console.log('🔗 URL:', result.secure_url);
          console.log('🆔 Public ID:', result.public_id);
        }
      }
    );
    
    result.end(testBuffer);
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

testarUpload();
