const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');





// Importar modelos
const Cliente = require('./Cliente')(sequelize, DataTypes);
const Carro = require('./Carro')(sequelize, DataTypes);
const Funcionario = require('./Funcionario')(sequelize, DataTypes);
const Servico = require('./Servico')(sequelize, DataTypes);
const Carrinho = require('./Carrinho')(sequelize, DataTypes);
const Possui = require('./Possui')(sequelize, Sequelize.DataTypes);
const Conversa = require('./Conversa')(sequelize, DataTypes);
const Agendamento = require('./Agendamento')(sequelize, DataTypes);
const Processo = require('./Processo')(sequelize, DataTypes);




 
// Criando o objeto db
const db = {
  sequelize,
  Cliente,
  Carro,
  Funcionario,
  Servico,
  Carrinho,
  Possui,
  Conversa,
  Agendamento,
  Processo
};

// Definindo as relações
db.Cliente.belongsToMany(db.Carro, {
  through: db.Possui,
  foreignKey: 'clienteId'
});

db.Carro.belongsToMany(db.Cliente, {
  through: db.Possui,
  foreignKey: 'carroId'
});

Conversa.belongsTo(Cliente, { foreignKey: "clienteId" });
Cliente.hasMany(Conversa, { foreignKey: "clienteId" });

Conversa.belongsTo(Funcionario, { foreignKey: "funcionarioId" });
Funcionario.hasMany(Conversa, { foreignKey: "funcionarioId" });

db.Cliente.belongsTo(db.Carrinho, {
  foreignKey: 'fk_Carrinho_idCarr'
});

db.Carrinho.hasOne(db.Cliente, {
  foreignKey: 'fk_Carrinho_idCarr'
});

// Serviço e Funcionário se relacionam através de Agendamento
db.Servico.belongsToMany(db.Funcionario, {
  through: db.Agendamento,
  foreignKey: 'servicoId'
});

db.Funcionario.belongsToMany(db.Servico, {
  through: db.Agendamento,
  foreignKey: 'funcionarioId'
});

db.Servico.belongsToMany(db.Carro, {
  through: db.Processo,
  foreignKey: 'servicoId'
});

db.Carro.belongsToMany(db.Servico, {
  through: db.Processo,
  foreignKey: 'carroId'
});

db.Agendamento.belongsTo(db.Servico, { foreignKey: 'servicoId' });
db.Agendamento.belongsTo(db.Funcionario, { foreignKey: 'funcionarioId' });

db.Carro.hasMany(db.Carrinho, { foreignKey: 'fk_Carros_idCar' });
db.Carrinho.belongsTo(db.Carro, { foreignKey: 'fk_Carros_idCar' });


// Sincronizar com o banco de dados
sequelize.sync({})
  .then(() => {
    console.log('Banco sincronizado com sucesso');
  })
  .catch((err) => {
    console.error('Erro ao sincronizar o banco:', err);
  });

module.exports = db;
