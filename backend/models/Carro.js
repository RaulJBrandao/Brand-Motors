module.exports = (sequelize, DataTypes) => {
  const Carro = sequelize.define('Carro', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    modelo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    marca: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ano: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    cor: {
      type: DataTypes.STRING,
      allowNull: false
    },
    numeroChassiCar: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    numeroPlacaCar: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    preco: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
        validate: {
    minValue(value) {
      const num = parseFloat(value);
      if (isNaN(num) || num < 5000) {
        throw new Error('O preco do veículo deve ser no mínimo R$5.000,00');
      }
    }
  }
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false
    },

    descricaoCar: {
  type: DataTypes.TEXT,   // permite JSON longo
  allowNull: true
},


quilometragemCar: {
  type: DataTypes.INTEGER,
  allowNull: true
},

   proprietario: {
      type: DataTypes.STRING,
      allowNull: false
    }
    

  }, {
    tableName: 'carros',
    timestamps: false
  });

  return Carro;
};