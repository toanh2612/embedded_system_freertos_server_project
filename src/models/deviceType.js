import { DataTypes } from "sequelize";
import sequelize from "../db/sequelizeMySql";
import CONFIG from "../config";

const deviceType =  sequelize.define('deviceType', {
  id: {
    primaryKey: true,
    type: DataTypes.STRING(500)
  },
  name: {
    type: DataTypes.STRING(500),
    allowNull: true,
  }
},{
  tableName: 'device_type',
  timestamps: false,
})
export default deviceType;
