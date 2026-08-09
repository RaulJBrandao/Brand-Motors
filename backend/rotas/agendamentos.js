const express = require('express');
const router = express.Router();
const { Agendamento, Servico } = require('../models');

// POST - Criar agendamento
router.post('/', async (req, res) => {
  try {
    const { servicoId, funcionarioId } = req.body;

    if (!servicoId || !funcionarioId) {
      return res.status(400).json({
        erro: "servicoId e funcionarioId são obrigatórios"
      });
    }

    const agendamento = await Agendamento.create({
      servicoId,
      funcionarioId
    });

    res.status(201).json({
      mensagem: "Agendamento realizado com sucesso!",
      agendamento
    });

  } catch (err) {
    console.error('Erro ao cadastrar agendamento:', err);
    res.status(500).json({ erro: 'Erro ao cadastrar agendamento' });
  }
});


// GET - Listar todos
router.get('/', async (req, res) => {
  try {
    const agendamentos = await Agendamento.findAll();
    res.json(agendamentos);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar agendamentos' });
  }
});

// GET por ID
router.get('/:id', async (req, res) => {
  try {
    const agendamento = await Agendamento.findByPk(req.params.id);
    if (agendamento) res.json(agendamento);
    else res.status(404).json({ erro: 'Agendamento não encontrado' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar agendamento' });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const agendamento = await Agendamento.findByPk(req.params.id);
    if (agendamento) {
      await agendamento.destroy();
      res.json({ mensagem: 'Agendamento removido com sucesso' });
    } else res.status(404).json({ erro: 'Agendamento não encontrado' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao deletar agendamento' });
  }
});
router.get('/funcionario/:id', async (req, res) => {
  try {
    const agendamentos = await Agendamento.findAll({
      where: { funcionarioId: req.params.id },
      include: [{ model: Servico }]   // ← este include é o ponto que precisava das novas associações
    });
    res.json(agendamentos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao buscar agendamentos do funcionário' });
  }
});
module.exports = router;