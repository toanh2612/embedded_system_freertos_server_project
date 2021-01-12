const { Sequelize } = require('sequelize');
import CONFIG from '../config';
const sequelize = new Sequelize(String(CONFIG["MYSQL_DATABASE"] || ''), String(CONFIG["MYSQL_USERNAME"]),String(CONFIG["MYSQL_PASSWORD"]),{
  host: String(CONFIG["MYSQL_HOST"] || ''),
  port: Number(CONFIG["MYSQL_PORT"] || 3306),
  dialect: "mysql",
})

export default sequelize;
