const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

async function enviarEmailVerificacao(email, token) {
  const link = `http://localhost:3001/clientes/verificar/${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Confirme seu email - Brand Motors",
    html: `
      <h2>Bem vindo à Brand Motors 🚗🔥</h2>
      <p>Para ativar sua conta clique no link abaixo:</p>
      <a href="${link}" style="font-size:18px">Confirmar meu email</a>
      <br/><br/>
      <p>Se você não criou essa conta, apenas ignore este email.</p>
    `
  });

  console.log("Email enviado com sucesso!");
}

async function enviarTicketServico(email, ticket) {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Ticket de Conserto - Brand Motors",
    html: `
      <h2>Seu veículo foi consertado!</h2>
      <p><b>Serviço:</b> ${ticket.servico}</p>
      <p><b>Carro:</b> ${ticket.carro}</p>
      <p><b>Status:</b> Concluído</p>
      <p><b>Data de Conclusão:</b> ${ticket.dataConclusao}</p>
      <br/>
      <p>Obrigado por escolher a Brand Motors 🚗🔥</p>
    `
  });

  console.log("Ticket de conserto enviado!");
}

async function enviarEmailCompra(email, dados = {}) {

  if (!dados || !dados.nomeCliente) {
    console.error("❌ ERRO: dados ausentes ao enviarEmailCompra:", dados);
    return;
  }

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Compra concluída - Brand Motors 🚗✨",
    html: `
      <h2>Compra aprovada! 🎉</h2>
      <p>Obrigado por comprar conosco, <strong>${dados.nomeCliente}</strong>!</p>

      <h3>Veículo</h3>
      <p><strong>Modelo:</strong> ${dados.modelo}</p>
      <p><strong>Preço:</strong> R$ ${dados.preco}</p>

      ${dados.imagemPrincipal ? `
        <img src="http://localhost:3000/uploads/cars/${dados.imagemPrincipal}" 
             style="width:320px;border-radius:10px;margin-top:10px;">
      ` : ""}

      <h3>Pagamento</h3>
      <p><strong>Forma:</strong> ${dados.formaPagamento}</p>
      ${dados.parcelas ? `<p><strong>Parcelas:</strong> ${dados.parcelas}x de R$ ${dados.valorParcela}</p>` : ""}

      <br/>
      <p>Em breve entraremos em contato para finalizar a entrega.</p>
      <p><strong>Brand Motors 🚗🔥</strong></p>
    `
  });
}




module.exports = { enviarEmailVerificacao, enviarTicketServico, enviarEmailCompra };
