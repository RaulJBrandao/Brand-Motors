const express = require('express');
const router = express.Router();
const { Conversa, Cliente, Funcionario } = require('../models');

// POST - Criar conversa
router.post('/', async (req, res) => {
  try {
    const conversa = await Conversa.create(req.body);
    res.status(201).json(conversa);
  } catch (err) {
    console.error('Erro ao criar conversa:', err);
    res.status(500).json({ erro: 'Erro ao criar conversa' });
  }
});

// GET - Listar todas as conversas
router.get("/", async (req, res) => {


  try {
    const conversas = await Conversa.findAll({
      include: [
        { model: Cliente, attributes: ['id', 'nome'] },
        { model: Funcionario, attributes: ['idFuncionario', 'nome', 'cargo'] }
      ]
    });


    res.json(conversas);

  } catch (err) {
    console.error("❌ Erro ao carregar conversas:", err);
    res.status(500).json({ erro: "Erro ao buscar conversas" });
  }
});

// GET por ID
router.get('/:id', async (req, res) => {
  try {
    const conversa = await Conversa.findByPk(req.params.id);
    if (conversa) res.json(conversa);
    else res.status(404).json({ erro: 'Conversa não encontrada' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar conversa' });
  }
});

// DELETE - Remover
router.delete('/:id', async (req, res) => {
  try {
    const conversa = await Conversa.findByPk(req.params.id);
    if (conversa) {
      await conversa.destroy();
      res.json({ mensagem: 'Conversa removida com sucesso' });
    } else res.status(404).json({ erro: 'Conversa não encontrada' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao deletar conversa' });
  }
});

module.exports = router;