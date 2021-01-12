import { DataTypes } from "sequelize";
import sequelize from "../db/sequelizeMySql";
import CONFIG from "../config";

const device =  sequelize.define('device', {
  id: {
    primaryKey: true,
    type: DataTypes.STRING(500)
  },
  name: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  roomId: {
    type: DataTypes.STRING(500),
    field: 'room_id',
    allowNull: false
  },
  deviceTypeId: {
    type: DataTypes.STRING(500),
    field: 'device_type_id',
    allowNull: false
  }
},{
  tableName: 'device',
  timestamps: false,
});
export default device;
