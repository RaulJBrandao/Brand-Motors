const express = require('express');
const router = express.Router();
const { Servico, Processo, Carro, Cliente, Possui } = require('../models');

// POST - cadastrar novo serviço
router.post('/', async (req, res) => {
  try {
    const novoServico = await Servico.create(req.body);
    res.status(201).json(novoServico);
  } catch (err) {
    console.error('Erro ao cadastrar serviço:', err);
    res.status(500).json({ erro: 'Erro ao cadastrar serviço' });
  }
});

// GET - listar todos os serviços
router.get('/', async (req, res) => {
  try {
    const servicos = await Servico.findAll();
    res.json(servicos);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar serviços' });
  }
});

// GET por ID
router.get('/:idSer', async (req, res) => {
  try {
    const servico = await Servico.findByPk(req.params.idSer);
    if (servico) res.json(servico);
    else res.status(404).json({ erro: 'Serviço não encontrado' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar serviço' });
  }
});

// PUT - atualizar serviço
router.put('/:idSer', async (req, res) => {
  try {
    const [atualizado] = await Servico.update(req.body, {
      where: { idSer: req.params.idSer }
    });
    if (atualizado) res.json({ mensagem: 'Serviço atualizado com sucesso' });
    else res.status(404).json({ erro: 'Serviço não encontrado' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar serviço' });
  }
});

// DELETE - remover serviço
router.delete('/:idSer', async (req, res) => {
  try {
    const deletado = await Servico.destroy({
      where: { idSer: req.params.idSer }
    });
    if (deletado) res.json({ mensagem: 'Serviço deletado com sucesso' });
    else res.status(404).json({ erro: 'Serviço não encontrado' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao deletar serviço' });
  }
});

// ======= ROTA PARA ENVIAR O TICKET DO SERVIÇO =======
const { enviarTicketServico } = require('../services/emailService');

router.post('/:id/enviar-ticket', async (req, res) => {
  try {
    const idServico = req.params.id;

    // 1 — Buscar o serviço
    const servico = await Servico.findByPk(idServico);

    if (!servico) {
      return res.status(404).json({ erro: "Serviço não encontrado." });
    }

    // 2 — Verificar se o serviço está concluído
    if (servico.statusSer !== "concluido") {
      return res.status(400).json({ erro: "O serviço ainda não está concluído." });
    }

    // 3 — Buscar processo que liga Serviço → Carro
    const processo = await Processo.findOne({
      where: { servicoId: idServico }
    });

    if (!processo) {
      return res.status(404).json({ erro: "Nenhum processo encontrado para este serviço." });
    }

    // 4 — Descobrir o carro
    const carro = await Carro.findByPk(processo.carroId);

    if (!carro) {
      return res.status(404).json({ erro: "Carro relacionado ao processo não encontrado." });
    }

    // 5 — Descobrir quem é o cliente dono do carro
    const relacao = await Possui.findOne({
      where: { carroId: carro.id }
    });

    if (!relacao) {
      return res.status(404).json({ erro: "Nenhum cliente é dono deste carro." });
    }

    const cliente = await Cliente.findByPk(relacao.clienteId);

    if (!cliente) {
      return res.status(404).json({ erro: "Cliente não encontrado." });
    }

    // 6 — ENVIAR O TICKET POR EMAIL
    await enviarTicketServico(cliente.email, {
      nomeCliente: cliente.nome,
      nomeServico: servico.nome,
      descricao: servico.descricao,
      valor: servico.valor,
      carroModelo: carro.modelo,
      carroMarca: carro.marca,
      carroAno: carro.ano
    });

    res.status(200).json({
      mensagem: "Ticket enviado com sucesso!",
      cliente: cliente.email
    });

  } catch (erro) {
    console.error("Erro ao enviar ticket:", erro);
    res.status(500).json({ erro: "Erro interno ao enviar o ticket." });
  }
});


module.exports = router;