const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const {
  sequelize,
  Carrinho,
  Conversa,
  Cliente,
  Carro,
  Funcionario
} = require("../models");

const { enviarEmailCompra } = require("../services/emailService");

// transporter
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS }
});

router.post("/enviar-compra", async (req, res) => {
  try {
    const {
      clienteId,
      nomeCliente,
      emailCliente,
      telefoneCliente,
      carroId,
      nomeCarro,
      preco,
      formaPagamento,
      parcelas,
      valorParcela,
      idCarr
    } = req.body;

    // validação básica
    if (!clienteId || !carroId || !formaPagamento) {
      return res.status(400).json({ erro: "Dados incompletos enviados para a compra." });
    }

    // encontrar secretário
    const secretario = await Funcionario.findOne({
      where: { cargo: "Secretário" }
    });

    if (!secretario) {
      return res.status(500).json({ erro: "Nenhum Secretário encontrado." });
    }

    // parcelamento
    let textoParcelas = "Pagamento à vista";
    if (formaPagamento === "cartao" || formaPagamento === "financiamento") {
      textoParcelas = `${parcelas}x de R$ ${valorParcela}`;
    }

    // HTML
    const html = `
      <h2>Nova solicitação de compra</h2>

      <h3>Cliente</h3>
      <p><strong>Nome:</strong> ${nomeCliente}</p>
      <p><strong>Email:</strong> ${emailCliente}</p>
      <p><strong>Telefone:</strong> ${telefoneCliente || "Não informado"}</p>

      <hr />

      <h3>Veículo</h3>
      <p><strong>Modelo:</strong> ${nomeCarro}</p>
      <p><strong>ID:</strong> ${carroId}</p>
      <p><strong>Preço:</strong> R$ ${parseFloat(preco).toLocaleString("pt-BR")}</p>

      <hr />

      <h3>Pagamento</h3>
      <p><strong>Forma:</strong> ${formaPagamento.toUpperCase()}</p>
      <p><strong>Parcelamento:</strong> ${textoParcelas}</p>
    `;

    // enviar email
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: secretario.email,
      subject: `Nova solicitação de compra - Cliente ${nomeCliente}`,
      html
    });

    // registrar conversa
    await Conversa.create({
      clienteId,
      funcionarioId: secretario.idFuncionario
    });

    // atualizar carrinho
    await Carrinho.update(
      { statusCarrinho: "solicitacao_enviada" },
      { where: { idCarr } }
    );

    return res.json({ mensagem: "Solicitação enviada ao Secretário com sucesso!" });

  } catch (err) {
    console.error("ERRO ao enviar compra:", err);
    res.status(500).json({ erro: "Erro interno ao enviar solicitação de compra." });
  }
});



/* ============================================================
   ROTA 2 — FINALIZAR COMPRA (SECRETÁRIO → CLIENTE)
   ============================================================ */
router.post("/finalizar-compra", async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { conversaId, formaPagamento, parcelas = null, valorParcela = null } = req.body;

    if (!conversaId || !formaPagamento) {
      return res.status(400).json({ erro: "Dados faltando." });
    }

    // ================================
    // 1) BUSCAR CONVERSA
    // ================================
    const conversa = await Conversa.findByPk(conversaId, { transaction: t });
    if (!conversa) {
      await t.rollback();
      return res.status(404).json({ erro: "Conversa não encontrada." });
    }

    const clienteId = conversa.clienteId;
    const funcionarioId = conversa.funcionarioId;

    // ================================
    // 2) BUSCAR CLIENTE
    // ================================
    const cliente = await Cliente.findByPk(clienteId, { transaction: t });
    if (!cliente) {
      await t.rollback();
      return res.status(404).json({ erro: "Cliente não encontrado." });
    }

    const idCarr = cliente.fk_Carrinho_idCarr;
    if (!idCarr) {
      await t.rollback();
      return res.status(400).json({ erro: "Cliente não possui carrinho." });
    }

    // ================================
    // 3) BUSCAR CARRINHO
    // ================================
    const carrinho = await Carrinho.findByPk(idCarr, { transaction: t });
    if (!carrinho) {
      await t.rollback();
      return res.status(404).json({ erro: "Carrinho não encontrado." });
    }

    // ================================
    // 4) BUSCAR CARRO
    // ================================
    const carro = await Carro.findByPk(carrinho.fk_Carros_idCar, { transaction: t });
    if (!carro) {
      await t.rollback();
      return res.status(404).json({ erro: "Carro não encontrado." });
    }

    // ================================
    // 5) PEGAR IMAGEM PRINCIPAL DO JSON
    // ================================
    const jsonPath = path.join(__dirname, "..", "uploads", "cars", `${carro.id}.json`);
    let imagemPrincipal = null;

    if (fs.existsSync(jsonPath)) {
      const jsonData = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
      imagemPrincipal = jsonData.principal || null;
    }

    // ================================
    // 6) ATUALIZAR CARRINHO
    // ================================
    await Carrinho.update(
      { statusCarrinho: "aprovado", formaPagamento, parcelas, valorParcela },
      { where: { idCarr }, transaction: t }
    );

    // ================================
    // 7) DESVINCULAR CLIENTE
    // ================================
    await Cliente.update(
      { fk_Carrinho_idCarr: null },
      { where: { id: clienteId }, transaction: t }
    );

    // ================================
    // 8) MARCAR CARRO COMO VENDIDO
    // ================================
    await Carro.update(
      { status: "vendido" },
      { where: { id: carro.id }, transaction: t }
    );

    // ================================
// 8.1) MARCAR CARRINHO COMO CONCLUÍDO
// ================================
await Carrinho.update(
  { statusCarr: "concluído" },
  { where: { idCarr }, transaction: t }
);

    // ================================
    // 9) CRIAR HISTÓRICO JSON
    // ================================
    const historyFolder = path.join(__dirname, "..", "history");
    if (!fs.existsSync(historyFolder)) fs.mkdirSync(historyFolder);

    const fileName = `cliente-${clienteId}-compra-${Date.now()}.json`;

    const historyData = {
      clienteId,
      nomeCliente: cliente.nome,
      funcionarioId,
      carroId: carro.id,
      modelo: `${carro.marca} ${carro.modelo}`,
      preco: carrinho.valorTotalCarr,
      formaPagamento,
      parcelas,
      valorParcela,
      imagemPrincipal,
      status: "aprovado",
      dataFinalizacao: new Date().toISOString()
    };

    fs.writeFileSync(
      path.join(historyFolder, fileName),
      JSON.stringify(historyData, null, 2)
    );

    // ================================
    // 10) ENVIAR EMAIL PARA O CLIENTE
    // ================================
    await enviarEmailCompra(cliente.email, {
  nomeCliente: cliente.nome,
  modelo: `${carro.marca} ${carro.modelo}`,
  preco: carrinho.valorTotalCarr,
  formaPagamento,
  parcelas,
  valorParcela,
  imagemPrincipal
});


    await t.commit();
    return res.json({ mensagem: "Compra finalizada, carro vendido e email enviado!" });

  } catch (err) {
    console.error("🔥 ERRO DETALHADO NO /finalizar-compra:");
    console.error(err);

    try { await t.rollback(); } catch {}

    return res.status(500).json({ erro: "Erro interno ao finalizar compra." });
  }
});

module.exports = router;
