import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuração do multer para armazenamento temporário
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/temp');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Filtro para aceitar apenas imagens
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Apenas imagens são permitidas (jpeg, jpg, png, webp)'));
  }
};

// Configuração do multer
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: fileFilter
});

/**
 * Processa e comprime uma imagem
 * @param {string} inputPath - Caminho da imagem original
 * @param {string} outputDir - Diretório de saída
 * @param {string} filename - Nome do arquivo
 * @returns {Promise<{imagemUrl: string, thumbUrl: string}>}
 */
export const processImage = async (inputPath, outputDir, filename) => {
  try {
    // Criar diretório se não existir
    await fs.mkdir(outputDir, { recursive: true });

    const baseName = path.parse(filename).name;
    const imagemPath = path.join(outputDir, `${baseName}.webp`);
    const thumbPath = path.join(outputDir, `${baseName}-thumb.webp`);

    // Processar imagem principal (max 1920x1080, qualidade 80%)
    await sharp(inputPath)
      .resize(1920, 1080, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ quality: 80 })
      .toFile(imagemPath);

    // Criar thumbnail (max 400x400, qualidade 70%)
    await sharp(inputPath)
      .resize(400, 400, {
        fit: 'cover'
      })
      .webp({ quality: 70 })
      .toFile(thumbPath);

    // Deletar arquivo temporário
    await fs.unlink(inputPath);

    // Retornar URLs relativas
    return {
      imagemUrl: `/uploads/portfolio/${baseName}.webp`,
      thumbUrl: `/uploads/portfolio/${baseName}-thumb.webp`
    };
  } catch (error) {
    console.error('Erro ao processar imagem:', error);
    throw error;
  }
};

/**
 * Deleta uma imagem e seu thumbnail
 * @param {string} imagemUrl - URL da imagem
 * @param {string} thumbUrl - URL do thumbnail
 */
export const deleteImage = async (imagemUrl, thumbUrl) => {
  try {
    const uploadDir = path.join(__dirname, '../../uploads');
    
    if (imagemUrl) {
      const imagemPath = path.join(uploadDir, imagemUrl.replace('/uploads/', ''));
      try {
        await fs.unlink(imagemPath);
      } catch (err) {
        console.warn('Erro ao deletar imagem:', err.message);
      }
    }

    if (thumbUrl) {
      const thumbPath = path.join(uploadDir, thumbUrl.replace('/uploads/', ''));
      try {
        await fs.unlink(thumbPath);
      } catch (err) {
        console.warn('Erro ao deletar thumbnail:', err.message);
      }
    }
  } catch (error) {
    console.error('Erro ao deletar imagens:', error);
  }
};

/**
 * Valida se o arquivo é uma imagem válida
 * @param {string} filePath - Caminho do arquivo
 * @returns {Promise<boolean>}
 */
export const validateImage = async (filePath) => {
  try {
    const metadata = await sharp(filePath).metadata();
    return metadata.width > 0 && metadata.height > 0;
  } catch (error) {
    return false;
  }
};


