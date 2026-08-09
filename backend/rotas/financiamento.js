const express = require("express");
const router = express.Router();
const { Carro } = require("../models");

// Financiamento sem juros
router.get("/carro/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const parcelas = parseInt(req.query.parcelas) || 72;

    const carro = await Carro.findByPk(id);

    if (!carro) {
      return res.status(404).json({ error: "Carro não encontrado" });
    }

    const valor = carro.preco;
    const valorParcela = valor / parcelas;

    return res.json({
      valorTotal: valor,
      parcelas: parcelas,
      valorParcela: Number(valorParcela.toFixed(2)),
    });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao calcular financiamento" });
  }
});

module.exports = router;
