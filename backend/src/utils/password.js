import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

/**
 * Cria um hash da senha
 * @param {String} senha - Senha em texto plano
 * @returns {Promise<String>} Hash da senha
 */
export const hashPassword = async (senha) => {
  return await bcrypt.hash(senha, SALT_ROUNDS);
};

/**
 * Compara uma senha com seu hash
 * @param {String} senha - Senha em texto plano
 * @param {String} hash - Hash da senha
 * @returns {Promise<Boolean>} True se a senha corresponder
 */
export const comparePassword = async (senha, hash) => {
  return await bcrypt.compare(senha, hash);
};

