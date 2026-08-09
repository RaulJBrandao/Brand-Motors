const express = require('express');
const app = express();
const PORT = 3001;


//const cors = require("cors");
require('dotenv').config();
const path = require("path");

//app.use(cors({
 // origin: "http://localhost:3000",
  //methods: "GET,POST,PUT,DELETE",
  //credentials: true
//}));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));


require('./models');
app.use(express.json());

// Importar rota de clientes
const clientesRoute = require('./rotas/clientes');
app.use('/clientes', clientesRoute);
// Importar rota de carros
const carrosRoute = require('./rotas/carros');
app.use('/carros', carrosRoute);

//Importar rota funcionarios
const funcionariosRoute = require('./rotas/funcionarios');
app.use('/funcionarios', funcionariosRoute);

//Importar serviços
const servicosRoute = require('./rotas/servicos');
app.use('/servicos', servicosRoute);

//Importar carrinho
const carrinhosRoute = require('./rotas/carrinhos');
app.use('/carrinhos', carrinhosRoute);

//Importar possui
const possuiRoutes = require('./rotas/possui');
app.use('/possui', possuiRoutes);

//Importar conversa
const conversasRoute = require('./rotas/conversas');
app.use('/conversas', conversasRoute);

//Importar agendamento
const agendamentosRoute = require('./rotas/agendamentos');
app.use('/agendamentos', agendamentosRoute);

// importar processos
const processosRoute = require('./rotas/processos');
app.use('/processos', processosRoute);

// importar relatorios
const relatoriosRoute = require('./rotas/relatorios');
app.use('/relatorios', relatoriosRoute);

//importar financiamento
const financiamentoRoute = require('./rotas/financiamento');
app.use('/financiamento', financiamentoRoute);

//importar comissão
const comissaoRoute = require('./rotas/comissao');
app.use('/comissao', comissaoRoute);

//importar rota de Venda da aba de "Vender" do front

const venderRouter = require("./rotas/venderRouter");
app.use("/vender", venderRouter);

const comprasRoutes = require("./rotas/compras");
app.use("/compras", comprasRoutes);

// no seu arquivo principal do express (ex: app.js / index.js)
const historyRoutes = require('./rotas/history');
app.use('/history', historyRoutes);




app.get('/', (req, res) => {
  res.send('Servidor Node está funcionando!');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});


