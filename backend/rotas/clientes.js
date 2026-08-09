const express = require('express');
const router = express.Router();
const { Cliente, Carro, Funcionario, Carrinho, Possui } = require('../models');

const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require('jsonwebtoken');
const { enviarEmailVerificacao } = require('../services/emailService');


// ✅ Rota POST para cadastrar um novo cliente (nome, email, senha)
router.post('/', async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ erro: "Preencha nome, e-mail e senha." });
    }

    // Verifica se o email já está cadastrado
    const existente = await Cliente.findOne({ where: { email } });
    if (existente) {
      return res.status(409).json({ erro: "E-mail já cadastrado." });
    }

    // Criptografa a senha
    const hash = await bcrypt.hash(senha, 10);

    // Gera token para verificação de e-mail
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1d" });

    // Cria o cliente
    const novoCliente = await Cliente.create({
      nome,
      email,
      senha: hash,
      emailVerificado: false,
      verificacaoToken: token
    });

    // Envia o e-mail de verificação
    await enviarEmailVerificacao(email, token);

    return res.status(201).json({
      mensagem: "Cadastro realizado! Verifique seu e-mail para confirmar sua conta.",
      cliente: {
        id: novoCliente.id,
        nome: novoCliente.nome,
        email: novoCliente.email
      }
    });

  } catch (err) {
    console.error('Erro ao cadastrar cliente:', err);
    res.status(500).json({ erro: 'Erro ao cadastrar cliente' });
  }
});

// GET /clientes/verificar/:token → confirmação de email
router.get('/verificar/:token', async (req, res) => {
  try {
    const { token } = req.params;

    const cliente = await Cliente.findOne({ where: { verificacaoToken: token } });

    if (!cliente) {
      return res.status(400).json({ erro: "Token inválido ou expirado" });
    }

    // marca como verificado
    cliente.emailVerificado = true;
    cliente.verificacaoToken = null; // limpa token para não reutilizar
    await cliente.save();

    return res.json({ mensagem: "Email verificado com sucesso! Agora você pode fazer login." });

  } catch (err) {
    console.error("Erro ao verificar email:", err);
    return res.status(500).json({ erro: "Erro interno ao verificar email" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;

    const cliente = await Cliente.findOne({ where: { email } });

    if (!cliente) {
      return res.status(404).json({ erro: "Email não encontrado" });
    }

    if (!cliente.emailVerificado) {
      return res.status(403).json({ erro: "Email ainda não verificado" });
    }

    const senhaCorreta = await bcrypt.compare(senha, cliente.senha);

    if (!senhaCorreta) {
      return res.status(401).json({ erro: "Senha incorreta" });
    }

    const token = jwt.sign(
      { id: cliente.id, email: cliente.email },
      process.env.JWT_SECRET,
      { expiresIn: "2d" }
    );

    return res.json({
      mensagem: "Login realizado com sucesso!",
      token,
      cliente: {
        id: cliente.id,
        nome: cliente.nome,
        email: cliente.email
      }
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ erro: "Erro interno ao realizar login" });
  }
});


// Rota GET para listar todos os clientes
router.get('/', async (req, res) => {
  try {
    const clientes = await Cliente.findAll();
    res.json(clientes);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar clientes' });
  }
});

// GET /clientes/:id - Buscar cliente por ID
router.get('/:id', async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id);
    if (cliente) {
      res.json(cliente);
    } else {
      res.status(404).json({ error: 'Cliente não encontrado' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar cliente' });
  }
});

// PUT /clientes/:id - Atualizar cliente por ID
router.put('/:id', async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id);
    if (cliente) {
      await cliente.update(req.body);
      res.json({ mensagem: 'Cliente atualizado com sucesso', cliente });
    } else {
      res.status(404).json({ error: 'Cliente não encontrado' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar cliente' });
  }

});

// DELETE /clientes/:id - Deletar cliente por ID
router.delete('/:id', async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id);
    if (cliente) {
      await cliente.destroy();
      res.json({ mensagem: 'Cliente deletado com sucesso' });
    } else {
      res.status(404).json({ error: 'Cliente não encontrado' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Erro ao deletar cliente' });
  }

  

});

router.get('/:id/carros', async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id, {
      include: [{ model: Carro }]
    });
    if (!cliente) return res.status(404).json({ erro: 'Cliente não encontrado' });
    // dependendo da associação pode ser cliente.Carros ou cliente.Carro
    return res.json(cliente.Carros || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao buscar carros do cliente' });
  }
});

// GET /clientes/:id/conversas
router.get('/:id/conversas', async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id, {
      include: [{ model: Funcionario }]
    });
    if (!cliente) {
      return res.status(404).json({ erro: 'Cliente não encontrado' });
    }
    res.json(cliente.Funcionarios || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao buscar conversas do cliente' });
  }
});

// GET /clientes/:id/carrinho
router.get('/:id/carrinho', async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id, {
      include: [{
        model: Carrinho,
        include: [{ model: Carro }]  
      }]
    });

    if (!cliente) {
      return res.status(404).json({ erro: 'Cliente não encontrado' });
    }

    res.json(cliente.Carrinho || null);

  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao buscar carrinho do cliente' });
  }
});

// POST /clientes/:clienteId/favoritos/:carroId → adicionar favorito
router.post('/:clienteId/favoritos/:carroId', async (req, res) => {
  try {
    const { clienteId, carroId } = req.params;

    // Verifica se cliente e carro existem
    const cliente = await Cliente.findByPk(clienteId);
    const carro = await Carro.findByPk(carroId);
    if (!cliente || !carro) {
      return res.status(404).json({ erro: 'Cliente ou carro não encontrado' });
    }

    // Verifica se já existe o favorito antes de tentar criar
    const favoritoExistente = await Possui.findOne({
      where: { clienteId, carroId }
    });

    if (favoritoExistente) {
      return res.status(400).json({ mensagem: 'Este carro já foi favoritado por este cliente.' });
    }

    // Cria o favorito apenas se ainda não existir
    await Possui.create({ clienteId, carroId });
    return res.status(201).json({ mensagem: 'Carro favoritado com sucesso!' });
  } catch (err) {
    console.error('Erro ao favoritar carro:', err);
    res.status(500).json({ erro: 'Erro ao favoritar carro' });
  }
});

// GET /clientes/:clienteId/favoritos → lista todos os carros favoritados por aquele cliente
router.get('/:clienteId/favoritos', async (req, res) => {
  try {
    const { clienteId } = req.params;

    const cliente = await Cliente.findByPk(clienteId, {
      include: [{ model: Carro }]
    });

    if (!cliente) {
      return res.status(404).json({ erro: 'Cliente não encontrado' });
    }

    res.json({ favoritos: cliente.Carros || [] });
  } catch (err) {
    console.error('Erro ao listar favoritos:', err);
    res.status(500).json({ erro: 'Erro ao listar favoritos' });
  }
});

//DELETE para remover um item dos favoritos

router.delete('/:clienteId/favoritos/:carroId', async (req, res) => {
  try {
    const { clienteId, carroId } = req.params;

    const favorito = await Possui.findOne({ where: { clienteId, carroId } });

    if (!favorito) {
      return res.status(404).json({ erro: "Favorito não encontrado" });
    }

    await favorito.destroy();

    res.json({ mensagem: "Carro removido dos favoritos" });

  } catch (err) {
    res.status(500).json({ erro: "Erro ao remover favorito" });
  }
});





module.exports = router;
