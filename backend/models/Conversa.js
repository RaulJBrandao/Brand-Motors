module.exports = (sequelize, DataTypes) => {
  const Conversa = sequelize.define('Conversa', {
    idConversa: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    clienteId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    funcionarioId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'conversas',
    timestamps: false
  });

  Conversa.associate = (models) => {
    Conversa.belongsTo(models.Cliente, { foreignKey: "clienteId" });
    Conversa.belongsTo(models.Funcionario, { foreignKey: "funcionarioId" });
  };

  return Conversa;
};