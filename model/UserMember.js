const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

class UserMember extends Model {}
UserMember.init(
  {
    id_user_membership: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    nickname: {
      type: DataTypes.STRING,
    },
    id_membership: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize,
    timestamps: false,
    modelName: "UserMember",
    tableName: "user_membership",
  }
);

module.exports = UserMember;
