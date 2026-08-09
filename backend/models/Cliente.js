module.exports = (sequelize, DataTypes) => {
  const Cliente = sequelize.define('Cliente', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    rg: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isEmail: true }
    },
    telefone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    endereco: {
      type: DataTypes.STRING,
      allowNull: true
    },
    dataNascimento: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },

    senha: {
  type: DataTypes.STRING(255),
  allowNull: false


},




// *** NOVO CAMPO ***
    emailVerificado: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },

verificacaoToken: {
  type: DataTypes.STRING,
  allowNull: true
}

  }, {
    tableName: 'clientes',
    timestamps: false
  });

  return Cliente;
};
