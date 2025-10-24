import { v2 as cloudinary } from 'cloudinary';
import fetch from 'node-fetch';
import sharp from 'sharp';

// Configurar Cloudinary diretamente
cloudinary.config({
  cloud_name: 'dypmxu22a',
  api_key: '313929499946394',
  api_secret: 'WndYrcC3VVeKKVIzC0ZzWHYnZho',
});

async function gerarURLs() {
  try {
    console.log('🔄 Gerando URLs do Cloudinary para estabelecimentos...');
    
    // Buscar estabelecimentos via API
    const response = await fetch('https://jfagende-production.up.railway.app/api/estabelecimentos');
    const data = await response.json();
    
    if (!Array.isArray(data)) {
      console.log('❌ Erro: API não retornou array de estabelecimentos');
      return;
    }

    const estabelecimentos = data.filter(e => e.fotoPerfilUrl);
    console.log(`📊 Encontrados ${estabelecimentos.length} estabelecimentos com fotos`);

    const urlsGeradas = [];

    for (const estabelecimento of estabelecimentos) {
      try {
        console.log(`\n🖼️ Processando: ${estabelecimento.nome}`);

        // Criar uma imagem placeholder elegante
        const placeholderBuffer = await sharp({
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
                <text x="256" y="220" font-family="Arial, sans-serif" font-size="72" fill="white" text-anchor="middle" font-weight="bold">${estabelecimento.nome.charAt(0).toUpperCase()}</text>
                <text x="256" y="320" font-family="Arial, sans-serif" font-size="24" fill="white" text-anchor="middle" opacity="0.8">${estabelecimento.nome}</text>
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
            public_id: `logo-${estabelecimento.id}`,
            transformation: [
              { width: 512, height: 512, crop: 'fill', quality: 'auto' },
              { format: 'webp' }
            ]
          },
          (error, result) => {
            if (error) {
              console.error(`   ❌ Erro no upload: ${error.message}`);
            } else {
              console.log(`   ✅ Upload bem-sucedido!`);
              console.log(`   🔗 URL: ${result.secure_url}`);
              urlsGeradas.push({
                id: estabelecimento.id,
                nome: estabelecimento.nome,
                url: result.secure_url
              });
            }
          }
        );
        
        result.end(placeholderBuffer);
        
        // Aguardar um pouco entre uploads
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error) {
        console.log(`   ❌ Erro ao processar ${estabelecimento.nome}:`, error.message);
      }
    }

    console.log('\n🎉 Processo concluído!');
    console.log('\n📋 URLs GERADAS:');
    urlsGeradas.forEach(item => {
      console.log(`\n🏢 ${item.nome}:`);
      console.log(`   ID: ${item.id}`);
      console.log(`   URL: ${item.url}`);
    });

    console.log('\n📝 PRÓXIMOS PASSOS:');
    console.log('1. As URLs acima estão funcionando no Cloudinary');
    console.log('2. Agora você pode atualizar o banco de dados com essas URLs');
    console.log('3. Ou fazer upload de imagens reais via interface do app');
    console.log('4. As logos aparecerão no mobile!');

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

gerarURLs();
