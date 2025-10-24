import cloudinaryService from './src/services/cloudinaryService.js';
import fetch from 'node-fetch';
import sharp from 'sharp';

async function migrarImagens() {
  try {
    console.log('🔄 Iniciando migração de imagens para Cloudinary...');
    
    // Buscar estabelecimentos via API
    const response = await fetch('https://jfagende-production.up.railway.app/api/estabelecimentos');
    const data = await response.json();
    
    console.log('📡 Resposta da API:', data);
    
    if (!Array.isArray(data)) {
      console.log('❌ Erro: API não retornou array de estabelecimentos');
      return;
    }

    const estabelecimentos = data.filter(e => e.fotoPerfilUrl);
    console.log(`📊 Encontrados ${estabelecimentos.length} estabelecimentos com fotos`);

    for (const estabelecimento of estabelecimentos) {
      try {
        console.log(`\n🖼️ Processando: ${estabelecimento.nome}`);
        console.log(`   URL atual: ${estabelecimento.fotoPerfilUrl}`);

        // Se já é uma URL do Cloudinary, pular
        if (estabelecimento.fotoPerfilUrl.includes('cloudinary.com')) {
          console.log('   ✅ Já é uma URL do Cloudinary, pulando...');
          continue;
        }

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
        const uploadResult = await cloudinaryService.uploadImageFromBuffer(
          placeholderBuffer,
          'jfagende/estabelecimentos'
        );

        if (uploadResult.success) {
          console.log(`   ✅ Migrado para: ${uploadResult.url}`);
          
          // Aqui você precisaria atualizar no banco de dados
          // Por enquanto, vamos apenas mostrar a URL
          console.log(`   📝 Nova URL para ${estabelecimento.nome}: ${uploadResult.url}`);
        } else {
          console.log(`   ❌ Erro no upload: ${uploadResult.error}`);
        }

      } catch (error) {
        console.log(`   ❌ Erro ao processar ${estabelecimento.nome}:`, error.message);
      }
    }

    console.log('\n🎉 Migração concluída!');
    console.log('\n📝 PRÓXIMOS PASSOS:');
    console.log('1. As URLs foram geradas acima');
    console.log('2. Você precisa atualizar o banco de dados com essas URLs');
    console.log('3. Ou fazer upload de imagens reais via interface do app');

  } catch (error) {
    console.error('❌ Erro na migração:', error);
  }
}

migrarImagens();
