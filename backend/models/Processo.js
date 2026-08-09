module.exports = (sequelize, DataTypes) => {
  const Processo = sequelize.define('Processo', {
    idProcesso: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    servicoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'servicos',
        key: 'idSer'
      }
    },
    carroId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'carros',
        key: 'idCar'
      }
    }
  }, {
    tableName: 'processos', //
    timestamps: false
  });

  return Processo;
};