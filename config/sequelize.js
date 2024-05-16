const Sequelize = require("sequelize");
const sequelize = new Sequelize("proyek_ws", "root", "", {
  host: "localhost",
  port: 3306,
  dialect: "mysql",
  logging: false,
});

module.exports = sequelize;
