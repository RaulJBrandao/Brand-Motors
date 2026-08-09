// backend/rotas/possui.js
const express = require('express');
const router = express.Router();
const { Possui } = require('../models');

// POST - Criar relação Cliente-Carro
router.post('/', async (req, res) => {
  try {
    const relacao = await Possui.create(req.body);
    res.status(201).json(relacao);
  } catch (err) {
    console.error('Erro ao cadastrar relação:', err);
    res.status(500).json({ erro: 'Erro ao cadastrar relação' });
  }
});

// GET - Listar todas as relações
router.get('/', async (req, res) => {
  try {
    const relacoes = await Possui.findAll();
    res.json(relacoes);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar relações' });
  }
});

// GET por ID
router.get('/:id', async (req, res) => {
  try {
    const relacao = await Possui.findByPk(req.params.id);
    if (relacao) res.json(relacao);
    else res.status(404).json({ erro: 'Relação não encontrada' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar relação' });
  }
});

// DELETE - Remover
router.delete('/:id', async (req, res) => {
  try {
    const relacao = await Possui.findByPk(req.params.id);
    if (relacao) {
      await relacao.destroy();
      res.json({ mensagem: 'Relação removida com sucesso' });
    } else res.status(404).json({ erro: 'Relação não encontrada' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao deletar relação' });
  }
});

module.exports = router;