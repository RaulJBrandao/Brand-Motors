const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const { Conversa, Funcionario } = require("../models");

// Mailtrap
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

router.post("/enviar", async (req, res) => {
  try {
    const { veiculo, nome, celular, whatsapp, email, clienteId } = req.body;

    // pegar secretário (funcionario com cargo = 'secretario')
    const secretario = await Funcionario.findOne({ where: { cargo: "Secretário" } });

    if (!secretario) {
      return res.status(500).json({ erro: "Nenhum secretário encontrado" });
    }

    // enviar e-mail
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: secretario.email,
      subject: "Nova solicitação de venda de veículo",
      html: `
        <h2>Nova solicitação de venda</h2>
        <p><strong>Veículo:</strong> ${veiculo}</p>
        <p><strong>Nome:</strong> ${nome}</p>
        <p><strong>Celular:</strong> ${celular} ${whatsapp ? "(WhatsApp)" : ""}</p>
        <p><strong>E-mail:</strong> ${email}</p>
      `,
    });

    // criar registro na tabela conversas
    await Conversa.create({
      clienteId,
      funcionarioId: secretario.idFuncionario,
    });

    res.json({ mensagem: "Enviado com sucesso" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao enviar solicitação" });
  }
});

module.exports = router;
