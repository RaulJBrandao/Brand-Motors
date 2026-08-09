const express = require('express');
const router = express.Router();
const { Funcionario, Servico } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const auth = require("../middleware/auth");
const permissao = require("../middleware/permissao");

/* --------------------------------
   Helpers
----------------------------------- */

// aceita múltiplos nomes de campo (email ou emailFun etc.)
function getField(body, ...options) {
  for (const op of options) {
    if (body[op] !== undefined) return body[op];
  }
  return undefined;
}

// remove senha antes de retornar ao cliente
function sanitize(func) {
  if (!func) return func;
  const obj = func.toJSON ? func.toJSON() : { ...func };
  delete obj.senhaFun;
  delete obj.senha;
  return obj;
};

//POST de Cadastro de funcionario

router.post('/', async (req, res) => {
  try {
    const body = req.body;

    // identificar o campo de senha independente do nome
    const senha = body.senhaFun || body.senha;

    if (!senha) {
      return res.status(400).json({ erro: "Campo 'senha' é obrigatório." });
    }

    // gerar hash
    const senhaHash = await bcrypt.hash(senha, 10);

    // sobrescreve a senha enviada com a hash
    body.senhaFun = senhaHash;
    delete body.senha; // caso venha assim

    // cria funcionário com TODOS os campos enviados
    const novoFuncionario = await Funcionario.create(body);

    res.status(201).json(sanitize(novoFuncionario));

  } catch (err) {
    console.error("Erro ao cadastrar funcionário:", err);
    res.status(500).json({ erro: "Erro ao cadastrar funcionário." });
  }
});

// POST - login funcionário
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ erro: "Email e senha são obrigatórios." });
    }

    // procura funcionário pelo email
    const funcionario = await Funcionario.findOne({ where: { email } });

    if (!funcionario) {
      return res.status(404).json({ erro: "Funcionário não encontrado." });
    }

    // compara senha fornecida com o hash no banco
    const senhaValida = await bcrypt.compare(senha, funcionario.senhaFun);

    if (!senhaValida) {
      return res.status(401).json({ erro: "Senha incorreta." });
    }

    // gera token JWT
    const token = jwt.sign(
      { id: funcionario.id, cargo: funcionario.cargo },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    // remove senha antes de responder
    const funcionarioSanitizado = funcionario.toJSON();
    delete funcionarioSanitizado.senhaFun;

    return res.json({
      mensagem: "Login realizado com sucesso",
      funcionario: funcionarioSanitizado,
      token
    });

  } catch (err) {
    console.error("Erro no login:", err);
    return res.status(500).json({ erro: "Erro ao realizar login." });
  }
});


// GET - listar todos
router.get('/', async (req, res) => {
  try {
    const funcionarios = await Funcionario.findAll();
    res.json(funcionarios);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar funcionários' });
  }
});

// GET - buscar por id
router.get('/:id', async (req, res) => {
  try {
    const funcionario = await Funcionario.findByPk(req.params.id);
    if (funcionario) {
      res.json(funcionario);
    } else {
      res.status(404).json({ erro: 'Funcionário não encontrado' });
    }
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar funcionário' });
  }
});

// PUT - atualizar
router.put('/:id', async (req, res) => {
  try {
    const funcionario = await Funcionario.findByPk(req.params.id);
    if (funcionario) {
      await funcionario.update(req.body);
      res.json(funcionario);
    } else {
      res.status(404).json({ erro: 'Funcionário não encontrado' });
    }
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar funcionário' });
  }
});

// DELETE - excluir
router.delete('/:id', async (req, res) => {
  try {
    const funcionario = await Funcionario.findByPk(req.params.id);
    if (funcionario) {
      await funcionario.destroy();
      res.json({ mensagem: 'Funcionário removido com sucesso' });
    } else {
      res.status(404).json({ erro: 'Funcionário não encontrado' });
    }
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao excluir funcionário' });
  }
});

router.get('/:id/servicos', async (req, res) => {
  try {
    const funcionario = await Funcionario.findByPk(req.params.id, {
      include: [{ model: Servico }]
    });
    if (!funcionario) {
      return res.status(404).json({ erro: 'Funcionário não encontrado' });
    }
    res.json(funcionario.Servicos || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao buscar serviços do funcionário' });
  }
});

module.exports = router;