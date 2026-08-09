module.exports = (sequelize, DataTypes) => {
  const Servico = sequelize.define('Servico', {
    idSer: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nomeSer: {
      type: DataTypes.STRING,
      allowNull: false
    },
    horarioSer: {
      type: DataTypes.DATE,
      allowNull: false
    },
    statusSer: {
      type: DataTypes.STRING,
      allowNull: false
    },
    tipoSer: {
      type: DataTypes.STRING,
      allowNull: false
    },
    precoSer: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    }
  }, {
    tableName: 'servicos',
    timestamps: false
  });

  return Servico;
};