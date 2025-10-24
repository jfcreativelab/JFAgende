import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const cloudinaryService = {
  /**
   * Upload de imagem para o Cloudinary
   */
  uploadImage: async (filePath, folder = 'jfagende') => {
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: folder,
        resource_type: 'image',
        transformation: [
          { width: 512, height: 512, crop: 'fill', quality: 'auto' },
          { format: 'webp' }
        ]
      });
      
      return {
        success: true,
        url: result.secure_url,
        publicId: result.public_id
      };
    } catch (error) {
      console.error('Erro ao fazer upload para Cloudinary:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * Upload de imagem a partir de buffer
   */
  uploadImageFromBuffer: async (buffer, folder = 'jfagende') => {
    try {
      const result = await cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: 'image',
          transformation: [
            { width: 512, height: 512, crop: 'fill', quality: 'auto' },
            { format: 'webp' }
          ]
        },
        (error, result) => {
          if (error) {
            console.error('Erro no upload stream:', error);
            return { success: false, error: error.message };
          }
          return { success: true, url: result.secure_url, publicId: result.public_id };
        }
      );
      
      result.end(buffer);
      return result;
    } catch (error) {
      console.error('Erro ao fazer upload para Cloudinary:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * Deletar imagem do Cloudinary
   */
  deleteImage: async (publicId) => {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return {
        success: result.result === 'ok',
        result: result.result
      };
    } catch (error) {
      console.error('Erro ao deletar imagem do Cloudinary:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
};

export default cloudinaryService;
