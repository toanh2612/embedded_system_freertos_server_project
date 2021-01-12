import {  DataTypes } from "sequelize";
import sequelize from "../db/sequelizeMySql";
import CONFIG from "../config";

export default sequelize.define('room', {
  id: {
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.BIGINT
  },
  name: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  homeId: {
    type: DataTypes.STRING(500),
    field: 'home_id',
    allowNull: false,

  }
},{
  tableName: 'room',
  timestamps: false
})
