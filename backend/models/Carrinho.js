module.exports = (sequelize, DataTypes) => {
  const Carrinho = sequelize.define('Carrinho', {
    idCarr: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    quantProdutoCarr: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    valorTotalCarr: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },

    dataCarr: {
  type: DataTypes.DATE,
  allowNull: true
},
statusCarr: {
  type: DataTypes.STRING(30),
  allowNull: false,
  defaultValue: 'em andamento'
},
fk_Carros_idCar: {
  type: DataTypes.INTEGER,
  allowNull: false,
  references: {
    model: 'carros',
    key: 'id'
  }
},


formaPagamento: {
  type: DataTypes.STRING(30),
  allowNull: false,
  defaultValue: 'cartão de crédito'
}

  }, {
    tableName: 'carrinhos',
    timestamps: false
  });

  return Carrinho;
};