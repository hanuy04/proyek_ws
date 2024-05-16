const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

class Users extends Model {}
Users.init(
  {
    email: {
      type: DataTypes.STRING,
    },
    name: { type: DataTypes.STRING },
    nickname: { type: DataTypes.STRING, primaryKey: true },
    date_of_birth: { type: DataTypes.DATE },
    saldo: { type: DataTypes.STRING },
    join_at: { type: DataTypes.DATE },
  },
  {
    sequelize,
    timestamps: false,
    modelName: "Users",
    tableName: "users",
  }
);

module.exports = Users;
