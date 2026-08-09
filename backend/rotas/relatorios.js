// backend/rotas/relatorios.js
const express = require('express');
const router = express.Router();
const { Op, fn, col, literal } = require('sequelize');
const db = require('../models');
const { Carrinho, Carro } = db;

// 1) Relatório de vendas por período
// GET /relatorios/vendas?from=2025-10-01&to=2025-10-31
router.get('/vendas', async (req, res) => {
  try {
    const { from, to } = req.query;
    const where = { statusCarr: 'concluído' };

    if (from || to) {
      where.dataCarr = {};
      if (from) where.dataCarr[Op.gte] = new Date(from);
      if (to) where.dataCarr[Op.lte] = new Date(to);
    }

    // retorna lista de vendas e total geral
    const vendas = await Carrinho.findAll({
      where,
      include: [{ model: Carro, attributes: ['id', 'modelo', 'marca', 'preco'] }],
      order: [['dataCarr', 'DESC']]
    });

    const total = vendas.reduce((s, v) => s + parseFloat(v.valorTotalCarr || 0), 0);

    res.json({ totalVendas: vendas.length, receitaTotal: total.toFixed(2), vendas });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao gerar relatório de vendas' });
  }
});

// 2) Relatório de estoque
// GET /relatorios/estoque
router.get('/estoque', async (req, res) => {
  try {
    // contar por status (disponível, vendido, etc)
    const estoque = await Carro.findAll({
      attributes: ['status', [fn('COUNT', col('status')), 'quantidade']],
      group: ['status']
    });

    res.json(estoque);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao gerar relatório de estoque' });
  }
});

// 3) Receita por carro (top N) e total
// GET /relatorios/receita?top=10&from=2025-01-01&to=2025-12-31
router.get('/receita', async (req, res) => {
  try {
    const { top } = req.query;
    const { from, to } = req.query;
    const where = { statusCarr: 'concluído' };
    if (from || to) {
      where.dataCarr = {};
      if (from) where.dataCarr[Op.gte] = new Date(from);
      if (to) where.dataCarr[Op.lte] = new Date(to);
    }

    // Soma valorTotalCarr por fk_Carros_idCar
    const receita = await Carrinho.findAll({
      attributes: [
        'fk_Carros_idCar',
        [fn('SUM', literal('valorTotalCarr')), 'receitaTotal'],
        [fn('COUNT', literal('*')), 'vendas']
      ],
      where,
      group: ['fk_Carros_idCar'],
      order: [[literal('receitaTotal'), 'DESC']],
      limit: top ? parseInt(top, 10) : null,
      include: [{ model: Carro, attributes: ['modelo', 'marca'] }]
    });

    // total geral
    const totais = receita.reduce((s, r) => s + parseFloat(r.get('receitaTotal') || 0), 0);

    res.json({ top: top || 'todos', totalReceita: totais.toFixed(2), receitaPorCarro: receita });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao gerar relatório de receita' });
  }
});

module.exports = router;
