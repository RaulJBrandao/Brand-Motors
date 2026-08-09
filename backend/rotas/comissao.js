const express = require("express");
const router = express.Router();
const { Carro } = require("../models");

// Comissão fixa de 7%
const COMISSAO = 0.07;

// Calcular comissão por carro
router.get("/carro/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const carro = await Carro.findByPk(id);

    if (!carro) {
      return res.status(404).json({ error: "Carro não encontrado" });
    }

    const valorVenda = carro.preco;
    const valorComissao = valorVenda * COMISSAO;

    return res.json({
      valorVenda: valorVenda,
      percentualComissao: "7%",
      valorComissao: Number(valorComissao.toFixed(2)),
    });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao calcular comissão" });
  }
});

module.exports = router;
