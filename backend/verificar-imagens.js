import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carregar variáveis de ambiente
dotenv.config();

// Usar URL de produção para verificar
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL_PRODUCTION || 'postgresql://postgres:password@localhost:5432/jfagende'
    }
  }
});

async function verificarImagens() {
  try {
    console.log('🔍 Verificando estabelecimentos com fotos...');
    
    // Buscar estabelecimentos com fotoPerfilUrl
    const estabelecimentos = await prisma.estabelecimento.findMany({
      select: {
        id: true,
        nome: true,
        fotoPerfilUrl: true
      }
    });

    console.log(`📊 Total de estabelecimentos: ${estabelecimentos.length}`);
    
    const comFoto = estabelecimentos.filter(e => e.fotoPerfilUrl);
    console.log(`🖼️ Com fotoPerfilUrl: ${comFoto.length}`);
    
    if (comFoto.length > 0) {
      console.log('\n📋 Estabelecimentos com fotos:');
      comFoto.forEach(estabelecimento => {
        console.log(`- ${estabelecimento.nome}: ${estabelecimento.fotoPerfilUrl}`);
      });
    }

    // Verificar se o diretório de uploads existe
    const uploadsDir = path.join(__dirname, 'uploads');
    const estabelecimentosDir = path.join(uploadsDir, 'estabelecimentos');
    
    console.log(`\n📁 Diretório uploads existe: ${fs.existsSync(uploadsDir)}`);
    console.log(`📁 Diretório estabelecimentos existe: ${fs.existsSync(estabelecimentosDir)}`);
    
    if (fs.existsSync(estabelecimentosDir)) {
      const arquivos = fs.readdirSync(estabelecimentosDir);
      console.log(`📄 Arquivos em estabelecimentos: ${arquivos.length}`);
      if (arquivos.length > 0) {
        console.log('Arquivos encontrados:', arquivos);
      }
    }

    // Verificar URLs das imagens
    console.log('\n🔗 Testando URLs das imagens...');
    for (const estabelecimento of comFoto) {
      if (estabelecimento.fotoPerfilUrl) {
        const baseUrl = process.env.BASE_URL || 'https://jfagende-production.up.railway.app';
        const fullUrl = `${baseUrl}${estabelecimento.fotoPerfilUrl}`;
        console.log(`- ${estabelecimento.nome}: ${fullUrl}`);
      }
    }

  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verificarImagens();
