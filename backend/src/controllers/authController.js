import { PrismaClient } from '@prisma/client';
import { hashPassword, comparePassword } from '../utils/password.js';
import { generateToken } from '../utils/jwt.js';

const prisma = new PrismaClient();

/**
 * Registra um novo cliente
 */
export const registerCliente = async (req, res) => {
  try {
    const { nome, email, telefone, senha, fotoPerfil } = req.body;

    // Validações básicas
    if (!nome || !email || !telefone || !senha) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    // Verifica se o email já existe
    const clienteExistente = await prisma.cliente.findUnique({
      where: { email }
    });

    if (clienteExistente) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    // Cria o hash da senha
    const senhaHash = await hashPassword(senha);

    // Cria o cliente
    const cliente = await prisma.cliente.create({
      data: {
        nome,
        email,
        telefone,
        senhaHash,
        fotoPerfil
      },
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        fotoPerfil: true,
        criadoEm: true
      }
    });

    // Gera o token
    const token = generateToken({ id: cliente.id, tipo: 'cliente' });

    res.status(201).json({
      message: 'Cliente registrado com sucesso',
      token,
      usuario: cliente
    });
  } catch (error) {
    console.error('Erro ao registrar cliente:', error);
    res.status(500).json({ error: 'Erro ao registrar cliente' });
  }
};

/**
 * Registra um novo estabelecimento
 */
export const registerEstabelecimento = async (req, res) => {
  try {
    const { nome, email, telefone, senha, categoria, descricao, endereco, imagemCapa } = req.body;

    // Validações básicas
    if (!nome || !email || !telefone || !senha || !categoria || !endereco) {
      return res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos' });
    }

    // Verifica se o email já existe
    const estabelecimentoExistente = await prisma.estabelecimento.findUnique({
      where: { email }
    });

    if (estabelecimentoExistente) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    // Cria o hash da senha
    const senhaHash = await hashPassword(senha);

    // Buscar plano FREE
    const planoFree = await prisma.plano.findFirst({
      where: { nome: 'FREE' }
    });

    if (!planoFree) {
      return res.status(500).json({ 
        error: 'Sistema não configurado. Plano FREE não encontrado. Execute: npm run seed' 
      });
    }

    // Cria o estabelecimento COM assinatura FREE
    const estabelecimento = await prisma.estabelecimento.create({
      data: {
        nome,
        email,
        telefone,
        senhaHash,
        categoria,
        descricao,
        endereco,
        imagemCapa,
        assinatura: {
          create: {
            planoId: planoFree.id,
            ativo: true,
            status: 'ATIVA',
            dataInicio: new Date(),
            dataFim: null, // FREE não expira
          }
        }
      },
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        categoria: true,
        descricao: true,
        endereco: true,
        imagemCapa: true,
        criadoEm: true,
        assinatura: {
          include: {
            plano: true
          }
        }
      }
    });

    console.log(`✅ Estabelecimento criado com assinatura FREE: ${estabelecimento.nome}`)

    // Gera o token
    const token = generateToken({ id: estabelecimento.id, tipo: 'estabelecimento' });

    res.status(201).json({
      message: 'Estabelecimento registrado com sucesso',
      token,
      usuario: estabelecimento
    });
  } catch (error) {
    console.error('Erro ao registrar estabelecimento:', error);
    res.status(500).json({ error: 'Erro ao registrar estabelecimento' });
  }
};

/**
 * Login de cliente
 */
export const loginCliente = async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Validações básicas
    if (!email || !senha) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    // Busca apenas clientes
    const usuario = await prisma.cliente.findUnique({ where: { email } });

    if (!usuario) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    // Verifica a senha
    const senhaValida = await comparePassword(senha, usuario.senhaHash);

    if (!senhaValida) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    // Remove o hash da senha antes de retornar
    delete usuario.senhaHash;

    // Gera o token
    const token = generateToken({ id: usuario.id, tipo: 'cliente' });

    res.json({
      message: 'Login realizado com sucesso',
      token,
      usuario,
      tipo: 'cliente'
    });
  } catch (error) {
    console.error('Erro no login do cliente:', error);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
};

/**
 * Login de estabelecimento
 */
export const loginEstabelecimento = async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Validações básicas
    if (!email || !senha) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    // Busca apenas estabelecimentos
    const usuario = await prisma.estabelecimento.findUnique({ 
      where: { email },
      select: {
        id: true,
        nome: true,
        email: true,
        senhaHash: true,
        chavePix: true,
        fotoPerfilUrl: true,
        categoria: true,
        endereco: true,
        telefone: true,
        criadoEm: true
      }
    });

    if (!usuario) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    // Verifica a senha
    const senhaValida = await comparePassword(senha, usuario.senhaHash);

    if (!senhaValida) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    // Remove o hash da senha antes de retornar
    delete usuario.senhaHash;

    // Gera o token
    const token = generateToken({ id: usuario.id, tipo: 'estabelecimento' });

    res.json({
      message: 'Login realizado com sucesso',
      token,
      usuario,
      tipo: 'estabelecimento'
    });
  } catch (error) {
    console.error('Erro no login do estabelecimento:', error);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
};

