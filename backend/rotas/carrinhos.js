const express = require('express');
const router = express.Router();
const { Carrinho } = require('../models');

// POST - Criar carrinho
router.post('/', async (req, res) => {
  try {
    const novoCarrinho = await Carrinho.create(req.body);
    res.status(201).json(novoCarrinho);
  } catch (err) {
    console.error('Erro ao cadastrar carrinho:', err);
    res.status(500).json({ erro: 'Erro ao cadastrar carrinho' });
  }
});

// GET - Listar todos
router.get('/', async (req, res) => {
  try {
    const carrinhos = await Carrinho.findAll();
    res.json(carrinhos);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar carrinhos' });
  }
});

// GET por ID
router.get('/:id', async (req, res) => {
  try {
    const carrinho = await Carrinho.findByPk(req.params.id);
    if (carrinho) res.json(carrinho);
    else res.status(404).json({ erro: 'Carrinho não encontrado' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar carrinho' });
  }
});

// PUT - Atualizar
router.put('/:id', async (req, res) => {
  try {
    const carrinho = await Carrinho.findByPk(req.params.id);
    if (carrinho) {
      await carrinho.update(req.body);
      res.json(carrinho);
    } else res.status(404).json({ erro: 'Carrinho não encontrado' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar carrinho' });
  }
});

// DELETE - Remover
router.delete('/:id', async (req, res) => {
  try {
    const carrinho = await Carrinho.findByPk(req.params.id);
    if (carrinho) {
      await carrinho.destroy();
      res.json({ mensagem: 'Carrinho removido com sucesso' });
    } else res.status(404).json({ erro: 'Carrinho não encontrado' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao deletar carrinho' });
  }
});

module.exports = router;