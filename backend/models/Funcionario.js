module.exports = (sequelize, DataTypes) => {
  const Funcionario = sequelize.define('Funcionario', {
    idFuncionario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    cpf: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isEmail: true }
    },
    telefone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    endereco: {
      type: DataTypes.STRING,
      allowNull: false
    },
    cargo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    salario: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },

    senhaFun: {
  type: DataTypes.STRING(255),
  allowNull: false
}


  }, {
    tableName: 'funcionarios',
    timestamps: false
  });

  return Funcionario;
};