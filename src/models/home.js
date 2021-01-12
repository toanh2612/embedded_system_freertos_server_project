const {  DataTypes } = require('sequelize')
import sequelize from "../db/sequelizeMySql";
import CONFIG from "../config";
import bcrypt from 'bcrypt';
const home = sequelize.define('home', {
  id: {
    primaryKey: true,
    allowNull: false,
    type: DataTypes.STRING
  },
  name: {
    allowNull: false,
    type: DataTypes.STRING(500),
  },
  username: {
    unique: true,
    allowNull: false,
    type: DataTypes.STRING(500)
  },
  password: {
    allowNull: false,
    type: DataTypes.STRING(500)
  },
},{
  tableName: 'home',
  timestamps: false,
  hooks: {
    beforeSave: async (home) => {
      return bcrypt.hash(home["password"], bcrypt.genSaltSync(Number(CONFIG['SALT_ROUNDS']))).then(function (hash) {
        home.password = hash;
      }).catch(error => {
        throw new Error(error);
      });
    }
  }
});

export default home;
