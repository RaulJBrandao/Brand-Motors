const express = require('express');
const router = express.Router();
const { Processo } = require('../models');

// POST - Criar relação Serviço-Carro
router.post('/', async (req, res) => {
  try {
    const processo = await Processo.create(req.body);
    res.status(201).json(processo);
  } catch (err) {
    console.error('Erro ao cadastrar processo:', err);
    res.status(500).json({ erro: 'Erro ao cadastrar processo' });
  }
});

// GET - Listar todos os processos
router.get('/', async (req, res) => {
  try {
    const processos = await Processo.findAll();
    res.json(processos);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar processos' });
  }
});

// GET por ID
router.get('/:id', async (req, res) => {
  try {
    const processo = await Processo.findByPk(req.params.id);
    if (processo) res.json(processo);
    else res.status(404).json({ erro: 'Processo não encontrado' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar processo' });
  }
});

// DELETE - Remover
router.delete('/:id', async (req, res) => {
  try {
    const processo = await Processo.findByPk(req.params.id);
    if (processo) {
      await processo.destroy();
      res.json({ mensagem: 'Processo removido com sucesso' });
    } else res.status(404).json({ erro: 'Processo não encontrado' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao deletar processo' });
  }
});

module.exports = router;