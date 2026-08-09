module.exports = (sequelize, DataTypes) => {
  const Possui = sequelize.define('Possui', {
    idPossui: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    clienteId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'clientes',
        key: 'id'
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
    tableName: 'possui',
    timestamps: false
  });

  return Possui;
};
