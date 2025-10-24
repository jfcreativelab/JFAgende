import { PrismaClient } from '@prisma/client';
import cloudinaryService from './src/services/cloudinaryService.js';
import fetch from 'node-fetch';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function migrarImagens() {
  try {
    console.log('🔄 Iniciando migração de imagens para Cloudinary...');
    
    // Buscar estabelecimentos com fotoPerfilUrl
    const estabelecimentos = await prisma.estabelecimento.findMany({
      where: {
        fotoPerfilUrl: {
          not: null
        }
      },
      select: {
        id: true,
        nome: true,
        fotoPerfilUrl: true
      }
    });

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

        // Criar uma imagem placeholder temporária
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
                <text x="256" y="200" font-family="Arial, sans-serif" font-size="48" fill="white" text-anchor="middle">${estabelecimento.nome.charAt(0).toUpperCase()}</text>
                <text x="256" y="280" font-family="Arial, sans-serif" font-size="24" fill="white" text-anchor="middle">Logo</text>
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
          // Atualizar no banco de dados
          await prisma.estabelecimento.update({
            where: { id: estabelecimento.id },
            data: { fotoPerfilUrl: uploadResult.url }
          });

          console.log(`   ✅ Migrado para: ${uploadResult.url}`);
        } else {
          console.log(`   ❌ Erro no upload: ${uploadResult.error}`);
        }

      } catch (error) {
        console.log(`   ❌ Erro ao processar ${estabelecimento.nome}:`, error.message);
      }
    }

    console.log('\n🎉 Migração concluída!');

  } catch (error) {
    console.error('❌ Erro na migração:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrarImagens();
