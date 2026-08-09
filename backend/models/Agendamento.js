module.exports = (sequelize, DataTypes) => {
  const Agendamento = sequelize.define('Agendamento', {
    idAgendamento: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    servicoId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'servicos',
        key: 'idSer'
      }
    },
    funcionarioId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'funcionarios',
        key: 'idFuncionario'
      }
    }
  }, {
    tableName: 'agendamentos',
    timestamps: false
  });

  return Agendamento;
};